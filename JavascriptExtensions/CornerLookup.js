// CornerLookup.js
// Runs every SimHub refresh cycle.
// Reads current track + lap position, binary searches for active corner,
// stores results on root[] for dashboard bindings.
//
// Dashboard binding references:
//   root["cornerName"]       - e.g. "Flugplatz"
//   root["cornerDirection"]  - "L", "R", or ""
//   root["cornerSection"]    - e.g. "flugplatz" (matches SVG segment id)
//   root["nextCornerName"]   - upcoming corner name
//   root["trackSupported"]   - true/false
//   root["calibrationPct"]   - current LapDistPct (for calibration)

// --- INITIALIZATION (runs once) ---
if (!root["_init"]) {
  root["_init"] = true;
  root["cornerName"] = "";
  root["cornerDirection"] = "";
  root["cornerSection"] = "";
  root["nextCornerName"] = "";
  root["trackSupported"] = false;
  root["calibrationPct"] = 0;
  root["_lastIdx"] = -2;       // -2 = unset, -1 = between corners
  root["_corners"] = null;     // cached corner array for current track
  root["_trackId"] = "";       // cached track id
}

// --- GET TRACK AND POSITION ---
var rawTrackId = $prop('DataCorePlugin.GameData.TrackId');
var trackId = rawTrackId ? rawTrackId.toLowerCase() : "";

// Also try TrackName as fallback
if (!trackId || trackId === "") {
  var rawTrackName = $prop('DataCorePlugin.GameData.TrackName');
  trackId = rawTrackName ? rawTrackName.toLowerCase() : "";
}

var pct = $prop('GameRawData.Telemetry.LapDistPct');
if (pct === null || pct === undefined) { pct = 0; }

// Always expose calibration value
root["calibrationPct"] = Math.round(pct * 10000) / 10000;

// --- CHECK TRACK SUPPORT ---
// Try exact match first, then partial matches
var track = null;
if (typeof TRACK_DATA !== "undefined") {
  if (TRACK_DATA[trackId]) {
    track = TRACK_DATA[trackId];
  } else {
    // Try partial match: iterate keys and check if trackId contains the key
    var keys = Object.keys(TRACK_DATA);
    for (var k = 0; k < keys.length; k++) {
      if (trackId.indexOf(keys[k]) >= 0) {
        track = TRACK_DATA[keys[k]];
        break;
      }
    }
  }
}

if (!track) {
  root["trackSupported"] = false;
  root["cornerName"] = "";
  root["cornerDirection"] = "";
  root["cornerSection"] = "";
  root["nextCornerName"] = "";
  return;
}

root["trackSupported"] = true;

// --- CACHE CORNERS ON TRACK CHANGE ---
if (root["_trackId"] !== trackId) {
  root["_trackId"] = trackId;
  root["_corners"] = track.corners;
  root["_lastIdx"] = -2; // force update
}

var corners = root["_corners"];

// --- BINARY SEARCH FOR ACTIVE CORNER ---
var idx = -1;
var lo = 0;
var hi = corners.length - 1;

while (lo <= hi) {
  var mid = Math.floor((lo + hi) / 2);
  if (pct >= corners[mid].start && pct < corners[mid].end) {
    idx = mid;
    break;
  } else if (pct < corners[mid].start) {
    hi = mid - 1;
  } else {
    lo = mid + 1;
  }
}

// --- UPDATE ONLY ON CHANGE ---
if (idx !== root["_lastIdx"]) {
  root["_lastIdx"] = idx;

  if (idx >= 0) {
    // In a corner
    var c = corners[idx];
    root["cornerName"] = c.name;
    root["cornerDirection"] = c.direction ? c.direction : "";
    root["cornerSection"] = c.section;

    // Next corner
    if (idx + 1 < corners.length) {
      root["nextCornerName"] = corners[idx + 1].name;
    } else {
      root["nextCornerName"] = corners[0].name;
    }
  } else {
    // Between corners - find next upcoming
    root["cornerName"] = "";
    root["cornerDirection"] = "";
    root["cornerSection"] = "";

    var foundNext = false;
    for (var j = 0; j < corners.length; j++) {
      if (corners[j].start > pct) {
        root["nextCornerName"] = corners[j].name;
        foundNext = true;
        break;
      }
    }
    if (!foundNext) {
      // Past all corners, next is first corner
      root["nextCornerName"] = corners[0].name;
    }
  }
}
