"""
Render the track map SVG to PNG using PIL.
Parses the SVG bezier paths and draws them with anti-aliased lines.
Outputs TrackMapBase.png in the project root (alongside the .djson).
"""

import re
import os
from PIL import Image, ImageDraw

# SVG viewBox dimensions
SVG_W, SVG_H = 380, 280
# Output PNG dimensions (2x for quality, SimHub will scale)
SCALE = 2
OUT_W, OUT_H = SVG_W * SCALE, SVG_H * SCALE

def parse_svg_path(d):
    """Parse SVG path d attribute into a list of (command, points) tuples."""
    # Tokenize
    tokens = re.findall(r'[MmCcLlZz]|[-+]?(?:\d+\.?\d*|\.\d+)', d)
    segments = []
    i = 0
    current_cmd = None
    while i < len(tokens):
        if tokens[i] in 'MmCcLlZz':
            current_cmd = tokens[i]
            i += 1
        if current_cmd in ('M', 'm'):
            x, y = float(tokens[i]), float(tokens[i+1])
            segments.append(('M', [(x, y)]))
            i += 2
        elif current_cmd in ('C', 'c'):
            points = []
            for _ in range(3):
                points.append((float(tokens[i]), float(tokens[i+1])))
                i += 2
            segments.append(('C', points))
        elif current_cmd in ('L', 'l'):
            x, y = float(tokens[i]), float(tokens[i+1])
            segments.append(('L', [(x, y)]))
            i += 2
        elif current_cmd in ('Z', 'z'):
            segments.append(('Z', []))
        else:
            i += 1  # skip unknown
    return segments


def bezier_point(t, p0, p1, p2, p3):
    """Cubic bezier interpolation."""
    u = 1 - t
    return (
        u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
        u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1]
    )


def path_to_points(segments, steps_per_curve=20):
    """Convert parsed SVG path to a list of (x, y) points."""
    points = []
    current = (0, 0)

    for cmd, pts in segments:
        if cmd == 'M':
            current = pts[0]
            points.append(current)
        elif cmd == 'C':
            p0 = current
            p1, p2, p3 = pts
            for i in range(1, steps_per_curve + 1):
                t = i / steps_per_curve
                pt = bezier_point(t, p0, p1, p2, p3)
                points.append(pt)
            current = p3
        elif cmd == 'L':
            current = pts[0]
            points.append(current)

    return points


def main():
    project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    svg_path = os.path.join(project_dir, 'assets', 'track-map-base.svg')
    out_path = os.path.join(project_dir, 'TrackMapBase.png')

    # Read SVG and extract all path d attributes
    with open(svg_path, 'r', encoding='utf-8') as f:
        svg_content = f.read()

    # Find all path elements with their d attributes
    path_pattern = r'<path[^>]*\bd="([^"]*)"[^>]*/>'
    paths = re.findall(path_pattern, svg_content)

    # Create image with transparent background
    img = Image.new('RGBA', (OUT_W, OUT_H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Draw each path
    line_color = (204, 204, 204, 255)  # #CCCCCC
    line_width = 3 * SCALE

    for d in paths:
        segments = parse_svg_path(d)
        points = path_to_points(segments)

        if len(points) < 2:
            continue

        # Scale points
        scaled = [(x * SCALE, y * SCALE) for x, y in points]

        # Draw as connected lines
        for i in range(len(scaled) - 1):
            draw.line([scaled[i], scaled[i+1]], fill=line_color, width=line_width)

    # Also draw small circles at path junctions for smoother joins
    for d in paths:
        segments = parse_svg_path(d)
        if segments:
            # Get start point
            for cmd, pts in segments:
                if cmd == 'M' and pts:
                    x, y = pts[0][0] * SCALE, pts[0][1] * SCALE
                    r = line_width // 2
                    draw.ellipse([x-r, y-r, x+r, y+r], fill=line_color)
                    break

    img.save(out_path, 'PNG')
    print(f"Track map PNG saved to: {out_path}")
    print(f"Dimensions: {OUT_W}x{OUT_H}")
    print(f"File size: {os.path.getsize(out_path)} bytes")


if __name__ == '__main__':
    main()
