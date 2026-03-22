"""
Generate per-section corner shape PNGs from REAL iRacing telemetry data.
Each image shows the actual track shape for that corner section,
cropped and scaled to fill a fixed-size image.
"""

import os
import json
import hashlib
import zipfile
import math
from PIL import Image, ImageDraw

COORDS_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "generated", "track_coords.json")
CORNER_DATA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "JavascriptExtensions", "CornerData.js")
OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "generated")
SIMHUB_DIR = r"C:\Program Files (x86)\SimHub\DashTemplates\iRacing Corner Names"

OUT_SIZE = 400
PADDING = 30
STROKE_COLOR = (255, 140, 0, 255)
STROKE_WIDTH = 14
ENTRY_DOT_COLOR = (255, 255, 255, 220)
ENTRY_DOT_R = 12
EXIT_ARROW_COLOR = (255, 255, 255, 100)
BG_COLOR = (0, 0, 0, 0)


def load_track_coords():
    with open(COORDS_PATH) as f:
        return json.load(f)


def extract_sections_from_js():
    """Parse CornerData.js to extract unique section IDs and their pct ranges.
    Only parses the 'nurburgring combined' block to avoid mixing with standalone layout.
    """
    import re
    with open(CORNER_DATA_PATH) as f:
        content = f.read()

    # Extract only the nurburgring combined block (between first TRACK_DATA assignment and the sort call)
    combined_match = re.search(
        r'TRACK_DATA\["nurburgring combined"\]\s*=\s*\{.*?corners:\s*\[(.*?)\]\s*\}',
        content, re.DOTALL
    )
    if not combined_match:
        print("ERROR: Could not find 'nurburgring combined' block in CornerData.js")
        return {}

    combined_block = combined_match.group(1)

    sections = {}
    pattern = r'\{\s*name:\s*"[^"]*"\s*,\s*direction:\s*(?:"[^"]*"|null)\s*,\s*start:\s*([\d.]+)\s*,\s*end:\s*([\d.]+)\s*,\s*section:\s*"([^"]*)"\s*\}'
    matches = re.findall(pattern, combined_block)

    for start_str, end_str, section_id in matches:
        start = float(start_str)
        end = float(end_str)
        if section_id not in sections:
            sections[section_id] = {"min_start": start, "max_end": end}
        else:
            sections[section_id]["min_start"] = min(sections[section_id]["min_start"], start)
            sections[section_id]["max_end"] = max(sections[section_id]["max_end"], end)

    return sections


def get_section_with_neighbors(coords, section_id, all_sections):
    """Get track points covering prev corner + current corner + next corner.
    Returns (points, start_pct, end_pct) where start/end are the current section bounds.
    """
    # Sort all sections by start pct
    sorted_sections = sorted(all_sections.items(), key=lambda x: x[1]["min_start"])
    idx = next((i for i, (sid, _) in enumerate(sorted_sections) if sid == section_id), None)
    if idx is None:
        return [], 0, 0

    cur = sorted_sections[idx][1]
    start_pct = cur["min_start"]
    end_pct = cur["max_end"]

    # Previous section (or small extend)
    if idx > 0:
        prev = sorted_sections[idx - 1][1]
        range_start = prev["min_start"]
    else:
        range_start = max(0, start_pct - 0.015)

    # Next section (or small extend)
    if idx < len(sorted_sections) - 1:
        nxt = sorted_sections[idx + 1][1]
        range_end = nxt["max_end"]
    else:
        range_end = min(1.0, end_pct + 0.015)

    points = []
    for c in coords:
        if range_start <= c["pct"] <= range_end:
            points.append((c["x"], c["y"], c["pct"]))

    return points, start_pct, end_pct


def smooth_points(points, window=7):
    """Gaussian-like smoothing of x,y coordinates to remove GPS jitter.
    Preserves pct values. Uses a simple moving average."""
    if len(points) < window:
        return points
    half = window // 2
    smoothed = []
    for i in range(len(points)):
        lo = max(0, i - half)
        hi = min(len(points), i + half + 1)
        sx = sum(p[0] for p in points[lo:hi]) / (hi - lo)
        sy = sum(p[1] for p in points[lo:hi]) / (hi - lo)
        smoothed.append((sx, sy, points[i][2]))
    return smoothed


def create_corner_image(points, start_pct, end_pct):
    """Create a corner shape image from real track points.
    Rotated so the entry direction points from bottom to top (driver's perspective).
    Uses 3x supersampling for smooth anti-aliased lines.
    """
    import math

    if len(points) < 2:
        return Image.new("RGBA", (OUT_SIZE, OUT_SIZE), BG_COLOR)

    SS = 3  # supersample factor
    render_size = OUT_SIZE * SS
    render_pad = PADDING * SS

    # Find entry direction: average over first few points for stability
    entry_pts = [(x, y) for x, y, pct in points if pct >= start_pct]
    if len(entry_pts) < 2:
        entry_pts = [(p[0], p[1]) for p in points[:2]]

    # Average direction over several points for smoother rotation
    n_avg = min(10, len(entry_pts) - 1)
    dx = entry_pts[n_avg][0] - entry_pts[0][0]
    dy = entry_pts[n_avg][1] - entry_pts[0][1]
    current_angle = math.atan2(dy, dx)

    target_angle = -math.pi / 2
    rotation = target_angle - current_angle

    cx, cy = entry_pts[0]
    rotated = []
    for x, y, pct in points:
        rx = (x - cx) * math.cos(rotation) - (y - cy) * math.sin(rotation) + cx
        ry = (x - cx) * math.sin(rotation) + (y - cy) * math.cos(rotation) + cy
        rotated.append((rx, ry, pct))

    # Smooth GPS jitter (multiple passes for extra smoothness)
    rotated = smooth_points(rotated, window=9)
    rotated = smooth_points(rotated, window=5)

    xs = [p[0] for p in rotated]
    ys = [p[1] for p in rotated]
    min_x, max_x = min(xs), max(xs)
    min_y, max_y = min(ys), max(ys)

    w = max_x - min_x
    h = max_y - min_y
    if w < 1: w = 1
    if h < 1: h = 1

    draw_area = render_size - 2 * render_pad
    scale = min(draw_area / w, draw_area / h)

    scaled_w = w * scale
    scaled_h = h * scale
    off_x = (render_size - scaled_w) / 2
    off_y = (render_size - scaled_h) / 2

    def transform(p):
        return (
            (p[0] - min_x) * scale + off_x,
            (p[1] - min_y) * scale + off_y
        )

    pts = rotated
    transformed = [transform(p) for p in pts]

    img = Image.new("RGBA", (render_size, render_size), BG_COLOR)
    draw = ImageDraw.Draw(img)

    dim_r = (8 * SS) // 2
    hl_r = (STROKE_WIDTH * SS) // 2
    dim_color = (100, 100, 100, 150)

    # Draw using circle stamps at every point — no joint artifacts
    # First pass: dim context (before and after the active section)
    for j in range(len(transformed)):
        pct = pts[j][2]
        if not (start_pct <= pct <= end_pct):
            tx, ty = transformed[j]
            draw.ellipse([tx - dim_r, ty - dim_r, tx + dim_r, ty + dim_r], fill=dim_color)
            # Also draw a line to next point for continuity
            if j + 1 < len(transformed):
                draw.line([transformed[j], transformed[j + 1]], fill=dim_color, width=dim_r * 2)

    # Second pass: highlighted section on top
    for j in range(len(transformed)):
        pct = pts[j][2]
        if start_pct <= pct <= end_pct:
            tx, ty = transformed[j]
            draw.ellipse([tx - hl_r, ty - hl_r, tx + hl_r, ty + hl_r], fill=STROKE_COLOR)
            if j + 1 < len(transformed) and start_pct <= pts[j + 1][2] <= end_pct:
                draw.line([transformed[j], transformed[j + 1]], fill=STROKE_COLOR, width=hl_r * 2)

    # Entry dot
    for j, p in enumerate(pts):
        if p[2] >= start_pct:
            tx, ty = transformed[j]
            r = ENTRY_DOT_R * SS
            draw.ellipse([tx - r, ty - r, tx + r, ty + r], fill=ENTRY_DOT_COLOR)
            break

    # Downsample with high-quality filter
    img = img.resize((OUT_SIZE, OUT_SIZE), Image.LANCZOS)
    return img


def get_image_metadata(png_path, name):
    img = Image.open(png_path)
    size = os.path.getsize(png_path)
    with open(png_path, "rb") as f:
        md5 = hashlib.md5(f.read()).hexdigest()
    return {
        "Name": name, "Extension": ".png", "Modified": False,
        "Optimized": False, "Width": img.width, "Height": img.height,
        "Length": size, "MD5": md5
    }


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    coords = load_track_coords()
    sections = extract_sections_from_js()
    print(f"Loaded {len(coords)} track points, {len(sections)} sections")

    image_metadata = []

    # Blank image for straights
    blank = Image.new("RGBA", (OUT_SIZE, OUT_SIZE), BG_COLOR)
    blank_path = os.path.join(OUTPUT_DIR, "CornerBlank.png")
    blank.save(blank_path)
    image_metadata.append(get_image_metadata(blank_path, "CornerBlank"))

    section_to_image = {}

    for section_id, pct_range in sorted(sections.items()):
        points, start, end = get_section_with_neighbors(coords, section_id, sections)

        if len(points) < 3:
            print(f"  {section_id}: SKIP (only {len(points)} points)")
            section_to_image[section_id] = "CornerBlank"
            continue

        img_name = f"C_{section_id.replace('-', '_')}"
        img_path = os.path.join(OUTPUT_DIR, f"{img_name}.png")

        img = create_corner_image(points, start, end)
        img.save(img_path)

        image_metadata.append(get_image_metadata(img_path, img_name))
        section_to_image[section_id] = img_name
        print(f"  {section_id}: OK ({len(points)} pts, {start:.3f}-{end:.3f})")

    # Create .ressources zip
    ressources_path = os.path.join(SIMHUB_DIR, "iRacing Corner Names.djson.ressources")
    with zipfile.ZipFile(ressources_path, "w", zipfile.ZIP_DEFLATED) as zf:
        for meta in image_metadata:
            png_path = os.path.join(OUTPUT_DIR, meta["Name"] + ".png")
            zf.write(png_path, meta["Name"] + ".png")
    print(f"\n.ressources: {len(image_metadata)} images")

    mapping_path = os.path.join(OUTPUT_DIR, "image_metadata.json")
    with open(mapping_path, "w") as f:
        json.dump({
            "images": image_metadata,
            "section_to_image": section_to_image
        }, f, indent=2)
    print("Done!")


if __name__ == "__main__":
    main()
