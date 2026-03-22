# iRacing Corner Name Overlay — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a SimHub overlay that displays the current corner number, direction, and name on the Nürburgring Nordschleife VLN layout, with a mini track map showing your position and highlighting the active section.

**Architecture:** SimHub Dash Studio dashboard (`.djson`) with JavaScript extensions for corner lookup logic. The JS extension reads `LapDistPct` from iRacing telemetry, does a binary search on pre-sorted corner boundaries, and exposes computed properties (`cornerName`, `cornerNumber`, etc.) that drive text elements and section visibility in the dashboard. A static track map image shows the track outline with a position dot and per-section highlight overlays.

**Tech Stack:** SimHub Dash Studio (.djson), JavaScript (ECMAScript 5.1 / Jint), SVG→PNG track assets, JSON corner data embedded in JS

---

### Task 1: Project Setup & Asset Acquisition

**Files:**
- Create: `README.md`
- Create: `assets/` directory

**Step 1: Initialize git repo**

```bash
cd "/c/Users/wompie/Documents/iRacing Track Map"
git init
```

**Step 2: Create .gitignore**

Create `.gitignore`:
```
*.simhubdash
.firecrawl/
```

**Step 3: Download the Nordschleife+GP SVG from Wikimedia Commons**

Download the 24h combined layout SVG (CC BY-SA 3.0):
```bash
curl -L -o assets/nurburgring-24h-source.svg "https://upload.wikimedia.org/wikipedia/commons/5/55/Circuit_N%C3%BCrburgring-2002-24h.svg"
```

Also download the Nordschleife-only SVG for reference:
```bash
curl -L -o assets/nurburgring-nordschleife-source.svg "https://upload.wikimedia.org/wikipedia/commons/2/21/N%C3%BCrburgring_-_Nordschleife.svg"
```

**Step 4: Examine the SVGs**

Open both SVGs and examine their structure — identify path elements, groups, and how sections might be separated. Note the viewBox dimensions. This will inform how we create the track map image and section highlights.

**Step 5: Commit**

```bash
git add .gitignore README.md assets/
git commit -m "feat: initial project setup with source SVG track maps"
```

---

### Task 2: Create the Track Map Base Image

**Files:**
- Create: `assets/track-map-base.png`
- Create: `assets/track-map-base.svg` (cleaned up version)

**Step 1: Clean up the source SVG for VLN layout**

The Wikimedia 24h SVG includes the full GP circuit. The VLN layout bypasses the Mercedes Arena (GP Turns 2-5). Edit the SVG to:
- Remove or grey out the Mercedes Arena section
- Keep the Nordschleife + the VLN GP routing (Yokohama-S → bypass → Ford-Kurve → Dunlop-Kehre → Schumacher-S → etc.)
- Style: thin white/light grey stroke on transparent background
- Target size: ~400x300px (small overlay)
- Save as `assets/track-map-base.svg`

**Step 2: Segment the SVG by section**

Add `id` attributes to path segments in the SVG corresponding to each named section. Each section gets an `id` matching the section name in lowercase-kebab-case (e.g., `id="hatzenbach"`, `id="flugplatz"`, `id="karussell"`). Group multi-corner sections under a single `<g>` element.

Sections to tag (in lap order):

**GP Section:**
1. `yokohama-s` — Turn 1
2. `ford-kurve` — Turn 7
3. `dunlop-kehre` — Turn 8 hairpin
4. `schumacher-s` — Turns 9-10
5. `kumho-kurve` — Turn 11
6. `advan-bogen` — Turn 12
7. `ngk-schikane` — Turns 13-14
8. `coca-cola-kurve` — Turn 15

**Nordschleife Section:**
9. `antoniusbuche`
10. `tiergarten`
11. `hohenrain`
12. `t13`
13. `sabine-schmitz-kurve`
14. `hatzenbach`
15. `hocheichen`
16. `quiddelbacher-hohe`
17. `flugplatz`
18. `kottenborn`
19. `schwedenkreuz`
20. `aremberg`
21. `fuchsrohre`
22. `adenauer-forst`
23. `metzgesfeld`
24. `kallenhard`
25. `wehrseifen`
26. `breidscheid`
27. `ex-muhle`
28. `bergwerk`
29. `kesselchen`
30. `klostertal`
31. `karussell`
32. `hohe-acht`
33. `hedwigshohe`
34. `wippermann`
35. `eschbach`
36. `brunnchen`
37. `eiskurve`
38. `pflanzgarten-1`
39. `pflanzgarten-2`
40. `stefan-bellof-s`
41. `schwalbenschwanz`
42. `kleines-karussell`
43. `galgenkopf`
44. `dottinger-hohe`

**Step 3: Export base track map as PNG**

Export the cleaned SVG as a transparent PNG at 400x300 (or appropriate aspect ratio for the track shape). Use a thin white stroke for the track outline. This will be the base layer in the dashboard.

**Step 4: Create section highlight images**

For each section, create a transparent PNG that shows ONLY that section's path in a bright highlight color (yellow/orange glow). These will be layered over the base map and shown/hidden based on the active section.

To keep the image count manageable, group nearby small sections:
- Group Pflanzgarten 1 + Sprünghügel + Pflanzgarten 2 as `pflanzgarten`
- Group Metzgesfeld + Kallenhard as `metzgesfeld-kallenhard`
- Other tiny sections can be grouped with neighbors

Target: ~30 section highlight PNGs.

Each PNG must be exactly the same dimensions as the base map so they align when stacked.

**Step 5: Create position coordinate mapping**

Create a lookup table mapping track percentage (0-1) to x,y pixel coordinates on the track map image. Sample ~100 points evenly around the track. This will position the dot on the map.

Save as `assets/position-coords.json`:
```json
[
  { "pct": 0.000, "x": 350, "y": 50 },
  { "pct": 0.010, "x": 345, "y": 55 },
  ...
]
```

The dot position will be interpolated between the two nearest points.

**Step 6: Commit**

```bash
git add assets/
git commit -m "feat: track map assets — base image, section highlights, position coords"
```

---

### Task 3: Create the JavaScript Extension — Corner Data & Lookup

**Files:**
- Create: `JavascriptExtensions/CornerData.js`
- Create: `JavascriptExtensions/CornerLookup.js`

**Step 1: Create CornerData.js**

This file defines all corner data for the Nordschleife VLN layout. Each corner has: id, number, name, direction, startPct, endPct, svgSegmentId.

```javascript
// JavascriptExtensions/CornerData.js
// Corner data for Nürburgring Nordschleife VLN (Gesamtstrecke)
// startPct/endPct are iRacing LapDistPct values — ESTIMATED, need calibration lap

var TRACK_DATA = {
  "nurburgring nordschleife - vln": {
    trackName: "Nürburgring Nordschleife VLN",
    corners: [
      // GP Section
      { number: 1, name: "Yokohama-S", direction: "R", startPct: 0.000, endPct: 0.012, section: "yokohama-s" },
      { number: 2, name: "Yokohama-S", direction: "L", startPct: 0.012, endPct: 0.020, section: "yokohama-s" },
      { number: 3, name: "Ford-Kurve", direction: "R", startPct: 0.025, endPct: 0.033, section: "ford-kurve" },
      { number: 4, name: "Dunlop-Kehre", direction: "R", startPct: 0.033, endPct: 0.042, section: "dunlop-kehre" },
      { number: 5, name: "Schumacher-S", direction: "L", startPct: 0.042, endPct: 0.048, section: "schumacher-s" },
      { number: 6, name: "Schumacher-S", direction: "R", startPct: 0.048, endPct: 0.054, section: "schumacher-s" },
      { number: 7, name: "Kumho-Kurve", direction: "L", startPct: 0.054, endPct: 0.060, section: "kumho-kurve" },
      { number: 8, name: "ADVAN-Bogen", direction: "R", startPct: 0.062, endPct: 0.070, section: "advan-bogen" },
      { number: 9, name: "NGK-Schikane", direction: "L", startPct: 0.072, endPct: 0.078, section: "ngk-schikane" },
      { number: 10, name: "NGK-Schikane", direction: "R", startPct: 0.078, endPct: 0.084, section: "ngk-schikane" },
      { number: 11, name: "Coca-Cola-Kurve", direction: "R", startPct: 0.084, endPct: 0.092, section: "coca-cola-kurve" },

      // Nordschleife Section
      { number: 12, name: "Antoniusbuche", direction: null, startPct: 0.095, endPct: 0.105, section: "antoniusbuche" },
      { number: 13, name: "Tiergarten", direction: null, startPct: 0.105, endPct: 0.118, section: "tiergarten" },
      { number: 14, name: "Hohenrain", direction: null, startPct: 0.118, endPct: 0.130, section: "hohenrain" },
      { number: 15, name: "T13", direction: "R", startPct: 0.130, endPct: 0.140, section: "t13" },
      { number: 16, name: "Sabine-Schmitz-Kurve", direction: "L", startPct: 0.140, endPct: 0.150, section: "sabine-schmitz-kurve" },
      { number: 17, name: "Hatzenbach", direction: "R", startPct: 0.150, endPct: 0.162, section: "hatzenbach" },
      { number: 18, name: "Hatzenbach", direction: "L", startPct: 0.162, endPct: 0.170, section: "hatzenbach" },
      { number: 19, name: "Hatzenbach", direction: "R", startPct: 0.170, endPct: 0.180, section: "hatzenbach" },
      { number: 20, name: "Hocheichen", direction: "R", startPct: 0.180, endPct: 0.192, section: "hocheichen" },
      { number: 21, name: "Quiddelbacher Höhe", direction: null, startPct: 0.192, endPct: 0.205, section: "quiddelbacher-hohe" },
      { number: 22, name: "Flugplatz", direction: "L", startPct: 0.205, endPct: 0.218, section: "flugplatz" },
      { number: 23, name: "Kottenborn", direction: null, startPct: 0.218, endPct: 0.230, section: "kottenborn" },
      { number: 24, name: "Schwedenkreuz", direction: "L", startPct: 0.230, endPct: 0.245, section: "schwedenkreuz" },
      { number: 25, name: "Aremberg", direction: "L", startPct: 0.245, endPct: 0.262, section: "aremberg" },
      { number: 26, name: "Fuchsröhre", direction: null, startPct: 0.262, endPct: 0.295, section: "fuchsrohre" },
      { number: 27, name: "Adenauer Forst", direction: "R", startPct: 0.295, endPct: 0.310, section: "adenauer-forst" },
      { number: 28, name: "Adenauer Forst", direction: "L", startPct: 0.310, endPct: 0.322, section: "adenauer-forst" },
      { number: 29, name: "Metzgesfeld", direction: null, startPct: 0.322, endPct: 0.340, section: "metzgesfeld" },
      { number: 30, name: "Kallenhard", direction: "R", startPct: 0.340, endPct: 0.358, section: "kallenhard" },
      { number: 31, name: "Wehrseifen", direction: "R", startPct: 0.358, endPct: 0.378, section: "wehrseifen" },
      { number: 32, name: "Breidscheid", direction: null, startPct: 0.378, endPct: 0.395, section: "breidscheid" },
      { number: 33, name: "Ex-Mühle", direction: null, startPct: 0.395, endPct: 0.415, section: "ex-muhle" },
      { number: 34, name: "Bergwerk", direction: "L", startPct: 0.415, endPct: 0.435, section: "bergwerk" },
      { number: 35, name: "Kesselchen", direction: null, startPct: 0.435, endPct: 0.470, section: "kesselchen" },
      { number: 36, name: "Klostertal", direction: null, startPct: 0.470, endPct: 0.510, section: "klostertal" },
      { number: 37, name: "Karussell", direction: "L", startPct: 0.510, endPct: 0.535, section: "karussell" },
      { number: 38, name: "Hohe Acht", direction: "R", startPct: 0.535, endPct: 0.555, section: "hohe-acht" },
      { number: 39, name: "Hedwigshöhe", direction: null, startPct: 0.555, endPct: 0.570, section: "hedwigshohe" },
      { number: 40, name: "Wippermann", direction: "L", startPct: 0.570, endPct: 0.590, section: "wippermann" },
      { number: 41, name: "Eschbach", direction: null, startPct: 0.590, endPct: 0.610, section: "eschbach" },
      { number: 42, name: "Brünnchen", direction: "R", startPct: 0.610, endPct: 0.635, section: "brunnchen" },
      { number: 43, name: "Eiskurve", direction: null, startPct: 0.635, endPct: 0.650, section: "eiskurve" },
      { number: 44, name: "Pflanzgarten I", direction: "L", startPct: 0.650, endPct: 0.672, section: "pflanzgarten-1" },
      { number: 45, name: "Pflanzgarten II", direction: "R", startPct: 0.672, endPct: 0.695, section: "pflanzgarten-2" },
      { number: 46, name: "Stefan-Bellof-S", direction: null, startPct: 0.695, endPct: 0.720, section: "stefan-bellof-s" },
      { number: 47, name: "Schwalbenschwanz", direction: "R", startPct: 0.720, endPct: 0.745, section: "schwalbenschwanz" },
      { number: 48, name: "Kleines Karussell", direction: "R", startPct: 0.745, endPct: 0.762, section: "kleines-karussell" },
      { number: 49, name: "Galgenkopf", direction: "L", startPct: 0.762, endPct: 0.780, section: "galgenkopf" },
      { number: 50, name: "Döttinger Höhe", direction: null, startPct: 0.780, endPct: 0.920, section: "dottinger-hohe" },
      // Döttinger Höhe is the long straight back to the GP section
      // Remaining ~8% is the transition back to start/finish
    ]
  }
};
```

NOTE: All `startPct`/`endPct` values are ESTIMATES. They must be calibrated by driving a lap in iRacing and noting the `LapDistPct` at each corner entry/exit. The user has agreed to do a calibration lap.

**Step 2: Create CornerLookup.js**

This runs every SimHub refresh cycle. It reads the current track and lap position, does a binary search to find the active corner, and stores results on `root` for dashboard bindings.

```javascript
// JavascriptExtensions/CornerLookup.js

// Initialize on first run
if (!root["initialized"]) {
  root["initialized"] = true;
  root["cornerName"] = "";
  root["cornerNumber"] = "";
  root["cornerDirection"] = "";
  root["cornerSection"] = "";
  root["nextCornerName"] = "";
  root["nextCornerNumber"] = "";
  root["posX"] = 0;
  root["posY"] = 0;
  root["lastCornerIdx"] = -1;

  // Pre-sort corners by startPct and cache boundary arrays for binary search
  root["sortedCorners"] = null;
  root["boundaries"] = null;
}

var trackName = $prop('TrackName');

// Only process if on a supported track
if (trackName && TRACK_DATA[trackName.toLowerCase()]) {
  var track = TRACK_DATA[trackName.toLowerCase()];

  // Build sorted arrays once
  if (!root["sortedCorners"]) {
    root["sortedCorners"] = track.corners;
    root["boundaries"] = [];
    for (var i = 0; i < track.corners.length; i++) {
      root["boundaries"].push(track.corners[i].startPct);
    }
  }

  var pct = $prop('GameRawData.Telemetry.LapDistPct');
  if (pct === null || pct === undefined) pct = 0;

  // Binary search for active corner
  var corners = root["sortedCorners"];
  var idx = -1;
  var lo = 0;
  var hi = corners.length - 1;
  while (lo <= hi) {
    var mid = Math.floor((lo + hi) / 2);
    if (pct >= corners[mid].startPct && pct < corners[mid].endPct) {
      idx = mid;
      break;
    } else if (pct < corners[mid].startPct) {
      hi = mid - 1;
    } else {
      lo = mid + 1;
    }
  }

  // Update only if corner changed
  if (idx !== root["lastCornerIdx"]) {
    root["lastCornerIdx"] = idx;
    if (idx >= 0) {
      var c = corners[idx];
      root["cornerName"] = c.name;
      root["cornerNumber"] = "T" + c.number;
      root["cornerDirection"] = c.direction ? c.direction : "";
      root["cornerSection"] = c.section;
      // Next corner
      if (idx + 1 < corners.length) {
        root["nextCornerName"] = corners[idx + 1].name;
        root["nextCornerNumber"] = "T" + corners[idx + 1].number;
      } else {
        root["nextCornerName"] = corners[0].name;
        root["nextCornerNumber"] = "T" + corners[0].number;
      }
    } else {
      // Between corners — find next upcoming corner
      root["cornerName"] = "";
      root["cornerNumber"] = "";
      root["cornerDirection"] = "";
      root["cornerSection"] = "";
      for (var j = 0; j < corners.length; j++) {
        if (corners[j].startPct > pct) {
          root["nextCornerName"] = corners[j].name;
          root["nextCornerNumber"] = "T" + corners[j].number;
          break;
        }
      }
    }
  }

  // Position dot — linear interpolation on coordinate table
  if (root["posCoords"]) {
    var coords = root["posCoords"];
    // Find bracketing coordinates
    var cLo = coords[0];
    var cHi = coords[coords.length - 1];
    for (var k = 0; k < coords.length - 1; k++) {
      if (pct >= coords[k].pct && pct < coords[k + 1].pct) {
        cLo = coords[k];
        cHi = coords[k + 1];
        break;
      }
    }
    var range = cHi.pct - cLo.pct;
    var t = range > 0 ? (pct - cLo.pct) / range : 0;
    root["posX"] = Math.round(cLo.x + t * (cHi.x - cLo.x));
    root["posY"] = Math.round(cLo.y + t * (cHi.y - cLo.y));
  }

  root["trackSupported"] = true;
} else {
  root["trackSupported"] = false;
  root["cornerName"] = "";
  root["cornerNumber"] = "";
  root["cornerDirection"] = "";
  root["cornerSection"] = "";
}
```

**Step 3: Commit**

```bash
git add JavascriptExtensions/
git commit -m "feat: corner data and lookup logic for Nordschleife VLN"
```

---

### Task 4: Create the SimHub Dashboard (.djson)

**Files:**
- Create: `iRacing Corner Names.djson`
- Create: `iRacing Corner Names.djson.metadata`

**Step 1: Create the .djson dashboard definition**

The .djson is a JSON file defining the dashboard layout. Key elements:
- `IsOverlay: true` — renders as transparent overlay on top of the game
- `EnableClickThroughOverlay: true` — clicks pass through to the game
- `BackgroundColor: "#00FFFFFF"` — transparent background
- Dashboard dimensions: 450w x 350h (fits a small corner of the screen)

The dashboard contains one screen with these layers (bottom to top):
1. **Track map base image** — the white/grey track outline PNG
2. **Section highlight images** — one Image element per section, each with visibility bound to `root["cornerSection"] == "section-id"`. All same size, stacked on top of the base.
3. **Position dot** — a small (6x6px) circle/ellipse element, positioned using `root["posX"]` and `root["posY"]` bindings, white or bright green fill
4. **Info box background** — dark semi-transparent rectangle at the top of the widget
5. **Corner number + direction text** — e.g. "T7 R", large bold font, bound to `root["cornerNumber"] + " " + root["cornerDirection"]`
6. **Corner name text** — e.g. "Flugplatz", smaller font below, bound to `root["cornerName"]`
7. **Next corner text** (dimmed) — shown when between corners: "Next: T8 Schwedenkreuz"

The full .djson structure will follow the format used by existing SimHub dashboards (typed model definitions, bindings with JavaScript expressions, etc.).

**Step 2: Create the metadata file**

`iRacing Corner Names.djson.metadata`:
```json
{
  "IsOverlay": true,
  "Width": 450,
  "Height": 350,
  "Author": "Custom",
  "Description": "Shows corner number, direction, and name for iRacing tracks with a mini track map",
  "EnableClickThroughOverlay": true
}
```

**Step 3: Test in SimHub**

- Copy the entire `iRacing Corner Names` folder to `<SimHub install dir>\DashTemplates\`
- Open SimHub → Dash Studio → select the overlay
- Enable it as an overlay
- Launch iRacing on Nürburgring Nordschleife VLN
- Verify text updates and map position

**Step 4: Commit**

```bash
git add "iRacing Corner Names.djson" "iRacing Corner Names.djson.metadata"
git commit -m "feat: SimHub dashboard overlay definition"
```

---

### Task 5: Calibrate Corner Positions

**Files:**
- Modify: `JavascriptExtensions/CornerData.js`

**Step 1: Create a calibration helper**

Add a temporary JavaScript extension that logs the current `LapDistPct` value to a SimHub property so it's visible on screen. The user drives a slow lap noting the percentage at each corner entry/exit.

```javascript
// JavascriptExtensions/Calibration.js (temporary)
root["calibrationPct"] = Math.round($prop('GameRawData.Telemetry.LapDistPct') * 10000) / 10000;
```

Add a text element to the dashboard that displays `root["calibrationPct"]` in large text.

**Step 2: User drives calibration lap**

The user drives one slow lap on Nordschleife VLN in iRacing, noting the `LapDistPct` value at each corner entry and exit. Record these values.

**Step 3: Update CornerData.js with calibrated values**

Replace all estimated `startPct`/`endPct` values with the recorded values.

**Step 4: Update position coordinate mapping**

If the position dot is misaligned, adjust the coordinate table in `assets/position-coords.json`.

**Step 5: Remove calibration helper**

Delete `JavascriptExtensions/Calibration.js` and the calibration text element from the dashboard.

**Step 6: Commit**

```bash
git add JavascriptExtensions/CornerData.js assets/position-coords.json
git commit -m "fix: calibrated corner positions from in-game data"
```

---

### Task 6: Polish & Package

**Files:**
- Create: `iRacing Corner Names.simhubdash` (distribution archive)
- Update: `README.md`

**Step 1: Visual polish**

- Adjust font sizes, colors, opacity for readability at speed
- Ensure the position dot is subtle (small, semi-transparent)
- Verify section highlights are visible but not overpowering
- Test at different overlay positions on screen

**Step 2: Write README**

Include:
- What the overlay does
- Installation instructions (copy to DashTemplates or double-click .simhubdash)
- Requirements (SimHub, iRacing, borderless windowed mode)
- Screenshot
- How to add support for additional tracks
- License (note CC BY-SA 3.0 for track map from Wikimedia)

**Step 3: Package as .simhubdash**

A `.simhubdash` file is a ZIP archive containing the dashboard folder. Create it:
```bash
cd "/c/Users/wompie/Documents/iRacing Track Map"
zip -r "iRacing Corner Names.simhubdash" "iRacing Corner Names.djson" "iRacing Corner Names.djson.metadata" JavascriptExtensions/ assets/
```

Users can double-click this file to install in SimHub.

**Step 4: Final commit**

```bash
git add .
git commit -m "feat: polish, README, and distribution package"
```
