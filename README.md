# iRacing Corner Names Overlay

A lightweight SimHub overlay that displays the current corner name, direction, and upcoming corner for iRacing tracks. Shows a mini track map with your position.

## Supported Tracks

- Nurburgring Combined (Gesamtstrecke 24h)
- Nurburgring Nordschleife (standalone)
- Nurburgring Combined VLN (uses 24h data — may need calibration)

## Requirements

- [SimHub](https://www.simhub.com/) installed
- iRacing
- Game running in **borderless windowed** mode (overlays don't work in exclusive fullscreen)

## Installation

### Option 1: Deploy script
1. Clone/download this repository
2. Run `deploy.bat` (right-click → Run as Administrator if needed)
3. Open SimHub → Dash Studio → find "iRacing Corner Names"
4. Enable as overlay, position on screen

### Option 2: Manual
1. Copy these files to `<SimHub install dir>\DashTemplates\iRacing Corner Names\`:
   - `iRacing Corner Names.djson`
   - `TrackMapBase.png`
   - `JavascriptExtensions\CornerData.js`
   - `JavascriptExtensions\CornerLookup.js`
2. Restart SimHub
3. Enable the overlay in Dash Studio

## What It Shows

- **Current corner**: Direction (L/R) and name (e.g., "L - Flugplatz")
- **Next corner**: Shown when you're in a corner, previews what's coming
- **Between corners**: Shows the upcoming corner dimmed (e.g., "> Schwedenkreuz")
- **Track map**: Mini outline of the circuit

## Calibration

Corner positions use pre-calibrated data from the [lovely-track-data](https://github.com/Lovely-Sim-Racing/lovely-track-data) project. If corner names appear early/late:

1. Open the dashboard in Dash Studio
2. Find the "CalibrationPct" text element and make it visible
3. Drive a lap and note the `LapDistPct` values at each corner
4. Update the `start`/`end` values in `JavascriptExtensions/CornerData.js`
5. Hide the calibration element again

## Adding New Tracks

1. Open `JavascriptExtensions/CornerData.js`
2. Add a new entry to `TRACK_DATA` using the SimHub `TrackId` (lowercase) as the key
3. Define corners with `name`, `direction` ("L"/"R"/null), `start`, `end`, and `section`
4. The `start`/`end` values are `LapDistPct` percentages (0.0 to 1.0)

## Architecture

- **One JS call per refresh**: Dashboard Variable `cornerInfo` calls `lookupCorner()` with JSExt=1
- **Binary search**: O(log n) corner lookup from sorted percentage boundaries
- **Update-on-change**: DOM updates only when the active corner changes
- **Pipe-delimited result**: Single string parsed by downstream variables — no cross-engine root[] issues

## Credits

- Corner percentage data: [Lovely-Sim-Racing/lovely-track-data](https://github.com/Lovely-Sim-Racing/lovely-track-data) (calibrated in-sim values)
- Track map: Custom SVG approximation of Nurburgring Nordschleife VLN layout
- Built with [SimHub](https://www.simhub.com/) Dash Studio
