// CornerLookup.js
// Defines lookupCorner() function for use in Dashboard Variable expressions.
// Uses root[] for caching within the same JS engine instance.
//
// Returns pipe-delimited string: "name|direction|section|nextName|supported|pct|turn|nextTurn"
// Empty fields use empty string. 'supported' is "1" or "0".
//
// Usage in Dashboard Variable (JSExt=1):
//   return lookupCorner();

function lookupCorner() {
  // --- GET TRACK AND POSITION ---
  var rawTrackId = $prop('DataCorePlugin.GameData.TrackId');
  var trackId = rawTrackId ? rawTrackId.toLowerCase() : "";

  // Fallback to TrackName
  if (!trackId || trackId === "") {
    var rawTrackName = $prop('DataCorePlugin.GameData.TrackName');
    trackId = rawTrackName ? rawTrackName.toLowerCase() : "";
  }

  var pct = $prop('GameRawData.Telemetry.LapDistPct');
  if (pct === null || pct === undefined) { pct = 0; }
  var pctStr = String(Math.round(pct * 10000) / 10000);

  // --- FIND TRACK DATA ---
  if (typeof TRACK_DATA === "undefined") {
    return "||||0|" + pctStr + "||";
  }

  var track = null;
  if (TRACK_DATA[trackId]) {
    track = TRACK_DATA[trackId];
  } else {
    // Partial match
    var keys = Object.keys(TRACK_DATA);
    for (var k = 0; k < keys.length; k++) {
      if (trackId.indexOf(keys[k]) >= 0) {
        track = TRACK_DATA[keys[k]];
        break;
      }
    }
  }

  if (!track) {
    return "||||0|" + pctStr + "||";
  }

  // --- CACHE CORNERS ON TRACK CHANGE ---
  if (root["_trackId"] !== trackId) {
    root["_trackId"] = trackId;
    root["_corners"] = track.corners;
    root["_lastIdx"] = -2;
    root["_lastResult"] = "||||1|0||";
  }

  var corners = root["_corners"];

  // --- BINARY SEARCH ---
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
      var c = corners[idx];
      var dir = c.direction ? c.direction : "";
      var nextName = "";
      var nextTurn = "";
      if (idx + 1 < corners.length) {
        nextName = corners[idx + 1].name;
        nextTurn = corners[idx + 1].turn ? String(corners[idx + 1].turn) : "";
      } else {
        nextName = corners[0].name;
        nextTurn = corners[0].turn ? String(corners[0].turn) : "";
      }
      var turnStr = c.turn ? String(c.turn) : "";
      root["_lastResult"] = c.name + "|" + dir + "|" + c.section + "|" + nextName + "|1|" + pctStr + "|" + turnStr + "|" + nextTurn;
    } else {
      // Between corners
      var nextName2 = "";
      var nextTurn2 = "";
      for (var j = 0; j < corners.length; j++) {
        if (corners[j].start > pct) {
          nextName2 = corners[j].name;
          nextTurn2 = corners[j].turn ? String(corners[j].turn) : "";
          break;
        }
      }
      if (!nextName2 && corners.length > 0) {
        nextName2 = corners[0].name;
        nextTurn2 = corners[0].turn ? String(corners[0].turn) : "";
      }
      root["_lastResult"] = "|||" + nextName2 + "|1|" + pctStr + "||" + nextTurn2;
    }
  } else {
    // Same corner, just update pct
    var parts = root["_lastResult"].split("|");
    parts[5] = pctStr;
    root["_lastResult"] = parts.join("|");
  }

  return root["_lastResult"];
}
