"""
Extract track coordinates (Lat, Lon, LapDistPct) from an iRacing .ibt telemetry file.

Parses the binary .ibt format directly:
  - Header at offset 0 (144 bytes)
  - Variable definitions at var_header_offset (each 144 bytes)
  - Disk sub-header at offset 112 (session metadata)
  - Data samples starting at buf_offset (each buf_len bytes)

Outputs a JSON file with ~500 evenly spaced {pct, x, y} points for one clean lap.
"""

import struct
import json
import math
import os
import sys

# .ibt variable type codes -> struct format characters
VAR_TYPE_FMT = {0: 'c', 1: '?', 2: 'i', 3: 'I', 4: 'f', 5: 'd'}
VAR_TYPE_SIZE = {0: 1, 1: 1, 2: 4, 3: 4, 4: 4, 5: 8}


def parse_ibt(filepath):
    """Parse an .ibt file and return header info, variable definitions, and raw file handle."""
    with open(filepath, 'rb') as f:
        # ---- Main header (first 48 bytes) ----
        header_data = f.read(48)
        (version, status, tick_rate, session_info_update,
         session_info_len, session_info_offset,
         num_vars, var_header_offset,
         num_buf, buf_len) = struct.unpack_from('10i', header_data, 0)
        # Remaining 2 ints (40,44) are padding

        # ---- Variable buffer info (at offset 48) ----
        var_buf_data = f.read(16)  # only need first buffer
        tick_count, buf_offset = struct.unpack_from('2i', var_buf_data, 0)

        # ---- Disk sub-header (at offset 112) ----
        f.seek(112)
        disk_header = f.read(32)
        start_date = struct.unpack_from('q', disk_header, 0)[0]
        start_time = struct.unpack_from('d', disk_header, 8)[0]
        end_time = struct.unpack_from('d', disk_header, 16)[0]
        lap_count = struct.unpack_from('i', disk_header, 24)[0]
        record_count = struct.unpack_from('i', disk_header, 28)[0]

        print(f"File: {os.path.basename(filepath)}")
        print(f"  Version: {version}, Tick rate: {tick_rate} Hz")
        print(f"  Variables: {num_vars}, Record count: {record_count}")
        print(f"  Buf len: {buf_len}, Buf offset: {buf_offset}")
        print(f"  Lap count: {lap_count}")
        print()

        # ---- Variable definitions ----
        f.seek(var_header_offset)
        var_defs = []
        for i in range(num_vars):
            vdata = f.read(144)
            var_type = struct.unpack_from('i', vdata, 0)[0]
            var_offset = struct.unpack_from('i', vdata, 4)[0]
            var_count = struct.unpack_from('i', vdata, 8)[0]
            name = vdata[16:48].split(b'\x00')[0].decode('ascii')
            desc = vdata[48:112].split(b'\x00')[0].decode('ascii')
            unit = vdata[112:144].split(b'\x00')[0].decode('ascii')
            var_defs.append({
                'name': name,
                'type': var_type,
                'offset': var_offset,
                'count': var_count,
                'desc': desc,
                'unit': unit,
            })

        return {
            'num_vars': num_vars,
            'buf_len': buf_len,
            'buf_offset': buf_offset,
            'record_count': record_count,
            'var_defs': {v['name']: v for v in var_defs},
            'filepath': filepath,
        }


def read_channel(header, channel_name):
    """Read all samples for a given channel from the .ibt file."""
    vdef = header['var_defs'].get(channel_name)
    if vdef is None:
        raise KeyError(f"Channel '{channel_name}' not found in .ibt file")

    fmt = VAR_TYPE_FMT[vdef['type']]
    size = VAR_TYPE_SIZE[vdef['type']]
    buf_len = header['buf_len']
    buf_offset = header['buf_offset']
    record_count = header['record_count']
    var_offset = vdef['offset']

    values = []
    with open(header['filepath'], 'rb') as f:
        for i in range(record_count):
            pos = buf_offset + i * buf_len + var_offset
            f.seek(pos)
            raw = f.read(size)
            if len(raw) < size:
                break
            val = struct.unpack(fmt, raw)[0]
            values.append(val)

    return values


def find_clean_lap(lap_dist_pct, lap_numbers, on_pit_road, lats):
    """Find the start and end indices of a clean lap (not on pit road).

    Filters out invalid samples (lat=0) and stationary samples, then
    finds a complete lap where LapDistPct goes from near 0 to near 1.
    """
    n = len(lap_dist_pct)

    # Step 1: Find valid sample ranges (lat != 0 and pct is actually changing)
    # Build list of valid indices where the car is actually moving
    valid = []
    for i in range(n):
        if lats[i] == 0.0:
            continue
        valid.append(i)

    if not valid:
        raise ValueError("No valid samples found (all lat=0)")

    print(f"  Valid samples (lat!=0): {len(valid)} out of {n}")

    # Step 2: Among valid samples, find where pct is actually increasing
    # (filter out stationary periods where pct doesn't change)
    moving = []
    for idx in range(len(valid)):
        i = valid[idx]
        if idx > 0:
            prev_i = valid[idx - 1]
            if abs(lap_dist_pct[i] - lap_dist_pct[prev_i]) > 1e-6:
                moving.append(i)
            elif len(moving) > 0 and i - moving[-1] < 10:
                # Allow brief stationary moments (e.g. slow corners)
                moving.append(i)
        else:
            moving.append(i)

    print(f"  Moving samples: {len(moving)}")

    # Step 3: Find lap boundaries in moving samples (where pct drops significantly)
    lap_boundaries = []
    for idx in range(1, len(moving)):
        i = moving[idx]
        prev_i = moving[idx - 1]
        if lap_dist_pct[i] < lap_dist_pct[prev_i] - 0.5:
            lap_boundaries.append(idx)  # index into 'moving' array

    print(f"  Found {len(lap_boundaries)} lap boundary resets in moving data")

    # Step 4: Build segments from moving indices
    segments = []
    if not lap_boundaries:
        segments.append((0, len(moving) - 1))
    else:
        segments.append((0, lap_boundaries[0] - 1))
        for j in range(len(lap_boundaries) - 1):
            segments.append((lap_boundaries[j], lap_boundaries[j + 1] - 1))
        segments.append((lap_boundaries[-1], len(moving) - 1))

    # Step 5: Pick best segment - one that covers most of the lap
    for seg_start, seg_end in segments:
        if seg_end - seg_start < 100:
            continue

        indices = moving[seg_start:seg_end + 1]
        pcts = [lap_dist_pct[i] for i in indices]
        min_pct = min(pcts)
        max_pct = max(pcts)

        if max_pct - min_pct < 0.9:
            continue

        # Check pit road
        pit_count = sum(1 for i in indices if on_pit_road[i])
        if pit_count / len(indices) > 0.1:
            continue

        # Return the actual file indices
        start_idx = indices[0]
        end_idx = indices[-1]
        print(f"  Selected lap: indices {start_idx}-{end_idx} ({len(indices)} samples), "
              f"pct range {min_pct:.4f}-{max_pct:.4f}")
        return start_idx, end_idx

    # Fallback: longest segment
    best_seg = max(segments, key=lambda s: s[1] - s[0])
    indices = moving[best_seg[0]:best_seg[1] + 1]
    print(f"  Fallback lap: indices {indices[0]}-{indices[-1]} ({len(indices)} samples)")
    return indices[0], indices[-1]


def lat_lon_to_xy(lats, lons):
    """Convert lat/lon arrays to local XY coordinates in meters using equirectangular projection."""
    if not lats or not lons:
        return [], []

    # Reference point: center of the track
    ref_lat = sum(lats) / len(lats)
    ref_lon = sum(lons) / len(lons)

    R = 6371000  # Earth radius in meters
    ref_lat_rad = math.radians(ref_lat)

    xs = []
    ys = []
    for lat, lon in zip(lats, lons):
        x = R * math.radians(lon - ref_lon) * math.cos(ref_lat_rad)
        y = R * math.radians(lat - ref_lat)
        xs.append(x)
        ys.append(y)

    return xs, ys


def resample(pcts, xs, ys, num_points=500):
    """Resample track data to evenly spaced points by LapDistPct."""
    # Sort by pct
    combined = sorted(zip(pcts, xs, ys), key=lambda t: t[0])
    pcts_s = [c[0] for c in combined]
    xs_s = [c[1] for c in combined]
    ys_s = [c[2] for c in combined]

    result = []
    j = 0
    for i in range(num_points):
        target_pct = i / num_points
        # Find surrounding indices
        while j < len(pcts_s) - 1 and pcts_s[j + 1] < target_pct:
            j += 1

        if j >= len(pcts_s) - 1:
            result.append({
                'pct': round(target_pct, 6),
                'x': round(xs_s[-1], 2),
                'y': round(ys_s[-1], 2),
            })
            continue

        # Linear interpolation
        p0, p1 = pcts_s[j], pcts_s[j + 1]
        if abs(p1 - p0) < 1e-10:
            t = 0
        else:
            t = (target_pct - p0) / (p1 - p0)
            t = max(0, min(1, t))

        x = xs_s[j] + t * (xs_s[j + 1] - xs_s[j])
        y = ys_s[j] + t * (ys_s[j + 1] - ys_s[j])

        result.append({
            'pct': round(target_pct, 6),
            'x': round(x, 2),
            'y': round(y, 2),
        })

    return result


def main():
    if len(sys.argv) > 1:
        ibt_path = sys.argv[1]
    else:
        ibt_path = r"C:\Users\wompie\Documents\iRacing\telemetry\bmwm4gt3_nurburgring combinedshortb 2026-03-22 05-37-08.ibt"

    if len(sys.argv) > 2:
        output_path = sys.argv[2]
    else:
        output_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "generated", "track_coords.json"
        )

    if not os.path.exists(ibt_path):
        print(f"Error: File not found: {ibt_path}")
        sys.exit(1)

    print("Parsing .ibt file...")
    header = parse_ibt(ibt_path)

    # List available channels for debugging
    target_channels = ['Lat', 'Lon', 'LapDistPct', 'Lap', 'OnPitRoad']
    for ch in target_channels:
        if ch in header['var_defs']:
            v = header['var_defs'][ch]
            print(f"  Channel '{ch}': type={v['type']}, offset={v['offset']}, unit={v['unit']}")
        else:
            print(f"  Channel '{ch}': NOT FOUND")

    print()
    print("Reading telemetry channels...")
    lap_dist_pct = read_channel(header, 'LapDistPct')
    lat = read_channel(header, 'Lat')
    lon = read_channel(header, 'Lon')
    lap = read_channel(header, 'Lap')
    on_pit = read_channel(header, 'OnPitRoad')

    print(f"  Read {len(lap_dist_pct)} samples")
    print(f"  Lat range: {min(lat):.6f} to {max(lat):.6f}")
    print(f"  Lon range: {min(lon):.6f} to {max(lon):.6f}")
    print(f"  LapDistPct range: {min(lap_dist_pct):.6f} to {max(lap_dist_pct):.6f}")
    print()

    print("Finding clean lap...")
    start, end = find_clean_lap(lap_dist_pct, lap, on_pit, lat)

    # Extract lap data, filtering out any remaining zero-lat samples
    lap_pcts = []
    lap_lats = []
    lap_lons = []
    for i in range(start, end + 1):
        if lat[i] != 0.0 and lon[i] != 0.0:
            lap_pcts.append(lap_dist_pct[i])
            lap_lats.append(lat[i])
            lap_lons.append(lon[i])

    print(f"  Lap samples: {len(lap_pcts)}")
    print()

    print("Converting to XY coordinates...")
    xs, ys = lat_lon_to_xy(lap_lats, lap_lons)
    x_range = max(xs) - min(xs)
    y_range = max(ys) - min(ys)
    print(f"  Track dimensions: {x_range:.0f}m x {y_range:.0f}m")
    print()

    print("Resampling to 5000 points...")
    points = resample(lap_pcts, xs, ys, num_points=5000)

    # Write output
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(points, f, indent=2)

    print(f"  Wrote {len(points)} points to {output_path}")
    print("Done!")


if __name__ == '__main__':
    main()
