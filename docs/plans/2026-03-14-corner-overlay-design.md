# iRacing Corner Name Overlay — Design

## Overview
A SimHub HTML dashboard overlay that shows the current corner number, direction (L/R), and name for the track you're racing on, plus a mini track map with section highlighting and position indicator.

## Architecture
- **SimHub HTML dashboard** — Vanilla HTML/CSS/JS, no frameworks, no build step
- **SimHub data bindings** — Reads `TrackPositionPercent` and track name from iRacing via SimHub's plugin
- **JSON track data** — Corner definitions with start/end percentages, names, directions
- **SVG track maps** — Segmented outlines with tagged path elements for section highlighting

### Data Flow
1. SimHub connects to iRacing, exposes telemetry
2. Overlay JS reads current track name → loads matching JSON + SVG
3. Overlay JS reads `TrackPositionPercent` → binary search on sorted corner boundaries
4. Updates text box and highlights active SVG segment
5. DOM updates only when corner changes (not every frame)

## Corner Data Format
```json
{
  "trackName": "Nürburgring Nordschleife - VLN",
  "corners": [
    {
      "id": "t1",
      "number": 1,
      "name": "Hatzenbach",
      "direction": "R",
      "startPct": 0.023,
      "endPct": 0.031,
      "svgSegmentId": "hatzenbach"
    }
  ]
}
```
- `startPct`/`endPct` — track percentage window where corner is active
- Multiple corners can share an `svgSegmentId` (e.g. Hatzenbach has several turns)
- `direction` — `"L"`, `"R"`, or `null`
- Between corners: show upcoming corner dimmed or clear display

## Visual Design
- **Corner info box:** Dark semi-transparent HUD box. Top line: "T7 R". Bottom line: "Flugplatz".
- **Mini track map:** Small SVG outline, thin white/grey track line, active section highlights in bright color, small subtle dot for current position.
- Compact widget, positionable anywhere via SimHub.

## Performance
- No frameworks, vanilla JS only
- DOM updates only on corner change
- SVG highlighting via CSS class toggle (no redraw)
- Binary search on pre-sorted corner boundaries
- JSON files are tiny (~5KB per track)
- SVG loaded once per track, never redrawn

## File Structure
```
iRacing Track Map/
├── dashboard.djson
├── overlay.html
├── overlay.css
├── overlay.js
├── tracks/
│   └── nurburgring-nordschleife-vln/
│       ├── track.json
│       └── track.svg
└── README.md
```

## Scope
- **Initial release:** Nürburgring Nordschleife VLN (Gesamtstrecke) only
- **Unsupported tracks:** Overlay hides itself
- **Calibration:** startPct/endPct values will be estimated from track distance data, then fine-tuned with an in-game calibration lap

## Track: Nürburgring Nordschleife VLN
~170 turns across named sections including: Hatzenbach, Quiddelbacher Höhe, Flugplatz, Schwedenkreuz, Aremberg, Fuchsröhre, Adenauer Forst, Metzgesfeld, Kallenhard, Wehrseifen, Breidscheid, Ex-Mühle, Bergwerk, Kesselchen, Klostertal, Karussell, Hohe Acht, Wippermann, Eschbach, Brünnchen, Pflanzgarten, Schwalbenschwanz, Galgenkopf, Döttinger Höhe, and more.
