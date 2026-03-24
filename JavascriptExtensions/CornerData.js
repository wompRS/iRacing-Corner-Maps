// CornerData.js
// Corner data for Nuerburgring Combined layouts (VLN / 24h / etc.)
// Names match iRacing's official track map labeling.
// Percentage values are estimates - need calibration lap for precision.
// Turn numbers (turn field) are sequential per layout.

var TRACK_DATA = {};

// --------------------------------------------------------------------------
// Nuerburgring Gesamtstrecke 24h (Combined 24h layout)
// iRacing trackId: "nurburgring combined" / "nurburgring combinedshortb"
// Total length: ~25,378m
// --------------------------------------------------------------------------
TRACK_DATA["nurburgring combined"] = {
  trackName: "Nuerburgring Combined",
  corners: [
    // === GP SECTION ===
    { turn: 1,  name: "Yokohama-S",           direction: "R",  start: 0.005, end: 0.018, section: "yokohama-s" },
    { turn: 2,  name: "Yokohama-S",           direction: "L",  start: 0.018, end: 0.030, section: "yokohama-s" },
    { turn: 3,  name: "Ford-Kurve",           direction: "R",  start: 0.050, end: 0.058, section: "ford-kurve" },
    { turn: 4,  name: "Dunlop-Kehre",         direction: "R",  start: 0.068, end: 0.082, section: "dunlop-kehre" },
    { turn: 5,  name: "Schumacher-S",         direction: "L",  start: 0.087, end: 0.095, section: "schumacher-s" },
    { turn: 6,  name: "Schumacher-S",         direction: "R",  start: 0.095, end: 0.102, section: "schumacher-s" },
    { turn: 7,  name: "Ravenol-Kurve",        direction: "L",  start: 0.108, end: 0.117, section: "ravenol-kurve" },
    { turn: 8,  name: "Bilstein-Kurve",       direction: "R",  start: 0.118, end: 0.128, section: "bilstein-kurve" },
    { turn: 9,  name: "ADVAN-Bogen",          direction: "R",  start: 0.135, end: 0.145, section: "advan-bogen" },
    { turn: 10, name: "Veedol-Schikane",      direction: "L",  start: 0.150, end: 0.157, section: "veedol-schikane" },
    { turn: 11, name: "Veedol-Schikane",      direction: "R",  start: 0.157, end: 0.164, section: "veedol-schikane" },

    // === NORDSCHLEIFE ENTRY ===
    { turn: 12, name: "Einfahrt Nordschleife", direction: null, start: 0.164, end: 0.170, section: "einfahrt-nordschleife" },

    // === NORDSCHLEIFE (wrap-around: these are near end of lap but come after GP entry) ===
    { turn: 13, name: "T13",                  direction: "R",  start: 0.165, end: 0.174, section: "t13" },
    { turn: 14, name: "Nordkehre",            direction: "L",  start: 0.174, end: 0.183, section: "nordkehre" },
    { turn: 15, name: "Hatzenbach",           direction: "R",  start: 0.186, end: 0.195, section: "hatzenbach" },
    { turn: 16, name: "Hatzenbach",           direction: "L",  start: 0.195, end: 0.203, section: "hatzenbach" },
    { turn: 17, name: "Hatzenbach",           direction: "R",  start: 0.203, end: 0.210, section: "hatzenbach" },
    { turn: 18, name: "Hatzenbach",           direction: "L",  start: 0.210, end: 0.218, section: "hatzenbach" },
    { turn: 19, name: "Hatzenbach",           direction: "R",  start: 0.218, end: 0.224, section: "hatzenbach" },
    { turn: 20, name: "Hocheichen",           direction: "R",  start: 0.226, end: 0.238, section: "hocheichen" },
    { turn: 21, name: "Hocheichen",           direction: "L",  start: 0.238, end: 0.248, section: "hocheichen" },
    { turn: 22, name: "Quiddelbacher Hoehe",  direction: "R",  start: 0.250, end: 0.264, section: "quiddelbacher-hohe" },
    { turn: 23, name: "Flugplatz",            direction: "L",  start: 0.268, end: 0.285, section: "flugplatz" },
    { turn: 24, name: "Kottenborn",           direction: "L",  start: 0.288, end: 0.300, section: "kottenborn" },
    { turn: 25, name: "Schwedenkreuz",        direction: "L",  start: 0.304, end: 0.316, section: "schwedenkreuz" },
    { turn: 26, name: "Aremberg",             direction: "R",  start: 0.318, end: 0.335, section: "aremberg" },
    { turn: 27, name: "Postbruecke",          direction: null,  start: 0.335, end: 0.342, section: "postbruecke" },
    { turn: 28, name: "Fuchsroehre",          direction: "R",  start: 0.342, end: 0.352, section: "fuchsroehre" },
    { turn: 29, name: "Kompression",          direction: null,  start: 0.352, end: 0.358, section: "kompression" },
    { turn: 30, name: "Fuchsroehre",          direction: "L",  start: 0.358, end: 0.365, section: "fuchsroehre" },
    { turn: 31, name: "Adenauer Forst",       direction: "R",  start: 0.368, end: 0.378, section: "adenauer-forst" },
    { turn: 32, name: "Adenauer Forst",       direction: "L",  start: 0.378, end: 0.386, section: "adenauer-forst" },
    { turn: 33, name: "Adenauer Forst",       direction: "L",  start: 0.386, end: 0.392, section: "adenauer-forst" },
    { turn: 34, name: "Adenauer Forst",       direction: "R",  start: 0.392, end: 0.397, section: "adenauer-forst" },
    { turn: 35, name: "Metzgesfeld",          direction: "L",  start: 0.398, end: 0.407, section: "metzgesfeld" },
    { turn: 36, name: "Metzgesfeld",          direction: "L",  start: 0.407, end: 0.415, section: "metzgesfeld" },
    { turn: 37, name: "Kallenhard",           direction: "R",  start: 0.417, end: 0.429, section: "kallenhard" },
    { turn: 38, name: "Spiegelkurve",         direction: "L",  start: 0.430, end: 0.435, section: "spiegelkurve" },
    { turn: 39, name: "Spiegelkurve",         direction: "R",  start: 0.435, end: 0.440, section: "spiegelkurve" },
    { turn: 40, name: "Dreifach-Rechts",      direction: "R",  start: 0.441, end: 0.447, section: "dreifach-rechts" },
    { turn: 41, name: "Dreifach-Rechts",      direction: "R",  start: 0.447, end: 0.451, section: "dreifach-rechts" },
    { turn: 42, name: "Dreifach-Rechts",      direction: "R",  start: 0.451, end: 0.455, section: "dreifach-rechts" },
    { turn: 43, name: "Wehrseifen",           direction: "R",  start: 0.457, end: 0.464, section: "wehrseifen" },
    { turn: 44, name: "Wehrseifen",           direction: "L",  start: 0.464, end: 0.470, section: "wehrseifen" },
    { turn: 45, name: "Wehrseifen",           direction: "R",  start: 0.470, end: 0.476, section: "wehrseifen" },
    { turn: 46, name: "Breidscheid",          direction: "R",  start: 0.478, end: 0.484, section: "breidscheid" },
    { turn: 47, name: "Breidscheid",          direction: "L",  start: 0.484, end: 0.490, section: "breidscheid" },
    { turn: 48, name: "Ex-Muehle",            direction: "R",  start: 0.492, end: 0.505, section: "ex-muhle" },
    { turn: 49, name: "Lauda Links",          direction: "L",  start: 0.506, end: 0.514, section: "lauda-links" },
    { turn: 50, name: "Bergwerk",             direction: "R",  start: 0.516, end: 0.535, section: "bergwerk" },
    { turn: 51, name: "Kesselchen",           direction: "L",  start: 0.545, end: 0.575, section: "kesselchen" },
    { turn: 52, name: "Mutkurve",             direction: "L",  start: 0.578, end: 0.590, section: "mutkurve" },
    { turn: 53, name: "Klostertal",           direction: "R",  start: 0.592, end: 0.602, section: "klostertal" },
    { turn: 54, name: "Steilstrecke",         direction: "R",  start: 0.604, end: 0.620, section: "steilstrecke" },
    { turn: 55, name: "Caracciola-Karussell", direction: "L",  start: 0.632, end: 0.650, section: "karussell" },
    { turn: 56, name: "Posten 147",           direction: null,  start: 0.652, end: 0.662, section: "posten-147" },
    { turn: 57, name: "Hohe Acht",            direction: "R",  start: 0.670, end: 0.685, section: "hohe-acht" },
    { turn: 58, name: "Hedwigshoehe",         direction: "R",  start: 0.686, end: 0.700, section: "hedwigshoehe" },
    { turn: 59, name: "Wippermann",           direction: "L",  start: 0.702, end: 0.710, section: "wippermann" },
    { turn: 60, name: "Wippermann",           direction: "R",  start: 0.710, end: 0.718, section: "wippermann" },
    { turn: 61, name: "Eschbach",             direction: "R",  start: 0.719, end: 0.727, section: "eschbach" },
    { turn: 62, name: "Eschbach",             direction: "L",  start: 0.727, end: 0.733, section: "eschbach" },
    { turn: 63, name: "Bruennchen",           direction: "R",  start: 0.734, end: 0.745, section: "bruennchen" },
    { turn: 64, name: "Bruennchen",           direction: "R",  start: 0.745, end: 0.758, section: "bruennchen" },
    { turn: 65, name: "Eiskurve",             direction: "L",  start: 0.760, end: 0.768, section: "eiskurve" },
    { turn: 66, name: "Eiskurve",             direction: "R",  start: 0.768, end: 0.775, section: "eiskurve" },
    { turn: 67, name: "Pflanzgarten I",       direction: "R",  start: 0.776, end: 0.790, section: "pflanzgarten" },
    { turn: 68, name: "Sprunghugel",          direction: null,  start: 0.790, end: 0.796, section: "pflanzgarten" },
    { turn: 69, name: "Pflanzgarten II",      direction: "L",  start: 0.796, end: 0.808, section: "pflanzgarten" },
    { turn: 70, name: "Stefan-Bellof-S",      direction: "R",  start: 0.810, end: 0.818, section: "stefan-bellof-s" },
    { turn: 71, name: "Stefan-Bellof-S",      direction: "L",  start: 0.818, end: 0.825, section: "stefan-bellof-s" },
    { turn: 72, name: "Stefan-Bellof-S",      direction: "R",  start: 0.825, end: 0.832, section: "stefan-bellof-s" },
    { turn: 73, name: "Schwalbenschwanz",     direction: "R",  start: 0.834, end: 0.842, section: "schwalbenschwanz" },
    { turn: 74, name: "Schwalbenschwanz",     direction: "L",  start: 0.842, end: 0.850, section: "schwalbenschwanz" },
    { turn: 75, name: "Kleines Karussell",    direction: "L",  start: 0.852, end: 0.864, section: "kleines-karussell" },
    { turn: 76, name: "Galgenkopf",           direction: "R",  start: 0.866, end: 0.882, section: "galgenkopf" },
    { turn: 77, name: "Doettinger Hoehe",     direction: null,  start: 0.884, end: 0.938, section: "dottinger-hohe" },
    { turn: 78, name: "Antoniusbuche",        direction: "L",  start: 0.940, end: 0.952, section: "antoniusbuche" },
    { turn: 79, name: "Tiergarten",           direction: "L",  start: 0.955, end: 0.961, section: "tiergarten" },
    { turn: 80, name: "Tiergarten",           direction: "R",  start: 0.961, end: 0.966, section: "tiergarten" },
    { turn: 81, name: "Hohenrain",            direction: "L",  start: 0.968, end: 0.974, section: "hohenrain" },
    { turn: 82, name: "Hohenrain",            direction: "R",  start: 0.974, end: 0.980, section: "hohenrain" },
    { turn: 83, name: "Hohenrain",            direction: "L",  start: 0.980, end: 0.989, section: "hohenrain" }
  ]
};

// Sort corners by start percentage for binary search
TRACK_DATA["nurburgring combined"].corners.sort(function(a, b) {
  return a.start - b.start;
});

// --------------------------------------------------------------------------
// Nuerburgring Nordschleife (standalone, no GP section)
// trackId: "nurburgring nordschleife"
// Total length: ~20,640m
// --------------------------------------------------------------------------
TRACK_DATA["nurburgring nordschleife"] = {
  trackName: "Nuerburgring Nordschleife",
  corners: [
    { turn: 1,  name: "Hatzenbach",           direction: "R",  start: 0.020, end: 0.035, section: "hatzenbach" },
    { turn: 2,  name: "Hatzenbach",           direction: "L",  start: 0.035, end: 0.048, section: "hatzenbach" },
    { turn: 3,  name: "Hatzenbach",           direction: "R",  start: 0.048, end: 0.058, section: "hatzenbach" },
    { turn: 4,  name: "Hatzenbach",           direction: "L",  start: 0.058, end: 0.071, section: "hatzenbach" },
    { turn: 5,  name: "Hocheichen",           direction: "R",  start: 0.072, end: 0.082, section: "hocheichen" },
    { turn: 6,  name: "Hocheichen",           direction: "L",  start: 0.082, end: 0.090, section: "hocheichen" },
    { turn: 7,  name: "Quiddelbacher Hoehe",  direction: "R",  start: 0.092, end: 0.110, section: "quiddelbacher-hohe" },
    { turn: 8,  name: "Flugplatz",            direction: "L",  start: 0.112, end: 0.135, section: "flugplatz" },
    { turn: 9,  name: "Kottenborn",           direction: "L",  start: 0.138, end: 0.155, section: "kottenborn" },
    { turn: 10, name: "Schwedenkreuz",        direction: "L",  start: 0.167, end: 0.180, section: "schwedenkreuz" },
    { turn: 11, name: "Aremberg",             direction: "R",  start: 0.182, end: 0.196, section: "aremberg" },
    { turn: 12, name: "Fuchsroehre",          direction: "R",  start: 0.200, end: 0.215, section: "fuchsroehre" },
    { turn: 13, name: "Kompression",          direction: null,  start: 0.215, end: 0.222, section: "kompression" },
    { turn: 14, name: "Fuchsroehre",          direction: "L",  start: 0.222, end: 0.234, section: "fuchsroehre" },
    { turn: 15, name: "Adenauer Forst",       direction: "R",  start: 0.236, end: 0.245, section: "adenauer-forst" },
    { turn: 16, name: "Adenauer Forst",       direction: "L",  start: 0.245, end: 0.255, section: "adenauer-forst" },
    { turn: 17, name: "Adenauer Forst",       direction: "R",  start: 0.255, end: 0.262, section: "adenauer-forst" },
    { turn: 18, name: "Metzgesfeld",          direction: "L",  start: 0.269, end: 0.285, section: "metzgesfeld" },
    { turn: 19, name: "Metzgesfeld",          direction: "L",  start: 0.285, end: 0.302, section: "metzgesfeld" },
    { turn: 20, name: "Kallenhard",           direction: "R",  start: 0.302, end: 0.320, section: "kallenhard" },
    { turn: 21, name: "Spiegelkurve",         direction: "L",  start: 0.321, end: 0.326, section: "spiegelkurve" },
    { turn: 22, name: "Spiegelkurve",         direction: "R",  start: 0.326, end: 0.332, section: "spiegelkurve" },
    { turn: 23, name: "Dreifach-Rechts",      direction: "R",  start: 0.333, end: 0.345, section: "dreifach-rechts" },
    { turn: 24, name: "Dreifach-Rechts",      direction: "R",  start: 0.345, end: 0.355, section: "dreifach-rechts" },
    { turn: 25, name: "Wehrseifen",           direction: "R",  start: 0.356, end: 0.363, section: "wehrseifen" },
    { turn: 26, name: "Wehrseifen",           direction: "L",  start: 0.363, end: 0.370, section: "wehrseifen" },
    { turn: 27, name: "Breidscheid",          direction: "R",  start: 0.372, end: 0.380, section: "breidscheid" },
    { turn: 28, name: "Breidscheid",          direction: "L",  start: 0.380, end: 0.388, section: "breidscheid" },
    { turn: 29, name: "Ex-Muehle",            direction: "R",  start: 0.390, end: 0.408, section: "ex-muhle" },
    { turn: 30, name: "Lauda Links",          direction: "L",  start: 0.410, end: 0.420, section: "lauda-links" },
    { turn: 31, name: "Bergwerk",             direction: "R",  start: 0.424, end: 0.450, section: "bergwerk" },
    { turn: 32, name: "Kesselchen",           direction: "L",  start: 0.455, end: 0.514, section: "kesselchen" },
    { turn: 33, name: "Mutkurve",             direction: "L",  start: 0.515, end: 0.527, section: "mutkurve" },
    { turn: 34, name: "Klostertal",           direction: "R",  start: 0.530, end: 0.545, section: "klostertal" },
    { turn: 35, name: "Steilstrecke",         direction: "R",  start: 0.548, end: 0.572, section: "steilstrecke" },
    { turn: 36, name: "Caracciola-Karussell", direction: "L",  start: 0.576, end: 0.592, section: "karussell" },
    { turn: 37, name: "Posten 147",           direction: null,  start: 0.594, end: 0.608, section: "posten-147" },
    { turn: 38, name: "Hohe Acht",            direction: "R",  start: 0.616, end: 0.632, section: "hohe-acht" },
    { turn: 39, name: "Hedwigshoehe",         direction: "R",  start: 0.633, end: 0.650, section: "hedwigshoehe" },
    { turn: 40, name: "Wippermann",           direction: "L",  start: 0.653, end: 0.662, section: "wippermann" },
    { turn: 41, name: "Wippermann",           direction: "R",  start: 0.662, end: 0.670, section: "wippermann" },
    { turn: 42, name: "Eschbach",             direction: "R",  start: 0.672, end: 0.680, section: "eschbach" },
    { turn: 43, name: "Eschbach",             direction: "L",  start: 0.680, end: 0.688, section: "eschbach" },
    { turn: 44, name: "Bruennchen",           direction: "R",  start: 0.690, end: 0.705, section: "bruennchen" },
    { turn: 45, name: "Bruennchen",           direction: "R",  start: 0.705, end: 0.720, section: "bruennchen" },
    { turn: 46, name: "Eiskurve",             direction: "L",  start: 0.722, end: 0.730, section: "eiskurve" },
    { turn: 47, name: "Eiskurve",             direction: "R",  start: 0.730, end: 0.738, section: "eiskurve" },
    { turn: 48, name: "Pflanzgarten I",       direction: "R",  start: 0.740, end: 0.755, section: "pflanzgarten" },
    { turn: 49, name: "Sprunghugel",          direction: null,  start: 0.755, end: 0.762, section: "pflanzgarten" },
    { turn: 50, name: "Pflanzgarten II",      direction: "L",  start: 0.762, end: 0.775, section: "pflanzgarten" },
    { turn: 51, name: "Stefan-Bellof-S",      direction: "R",  start: 0.778, end: 0.786, section: "stefan-bellof-s" },
    { turn: 52, name: "Stefan-Bellof-S",      direction: "L",  start: 0.786, end: 0.793, section: "stefan-bellof-s" },
    { turn: 53, name: "Schwalbenschwanz",     direction: "R",  start: 0.796, end: 0.808, section: "schwalbenschwanz" },
    { turn: 54, name: "Schwalbenschwanz",     direction: "L",  start: 0.808, end: 0.820, section: "schwalbenschwanz" },
    { turn: 55, name: "Kleines Karussell",    direction: "L",  start: 0.824, end: 0.838, section: "kleines-karussell" },
    { turn: 56, name: "Galgenkopf",           direction: "R",  start: 0.842, end: 0.858, section: "galgenkopf" },
    { turn: 57, name: "Doettinger Hoehe",     direction: null,  start: 0.862, end: 0.940, section: "dottinger-hohe" },
    { turn: 58, name: "Antoniusbuche",        direction: "L",  start: 0.945, end: 0.958, section: "antoniusbuche" },
    { turn: 59, name: "Tiergarten",           direction: "L",  start: 0.960, end: 0.968, section: "tiergarten" },
    { turn: 60, name: "Tiergarten",           direction: "R",  start: 0.968, end: 0.975, section: "tiergarten" },
    { turn: 61, name: "Hohenrain",            direction: "L",  start: 0.977, end: 0.984, section: "hohenrain" },
    { turn: 62, name: "Hohenrain",            direction: "R",  start: 0.984, end: 0.990, section: "hohenrain" },
    { turn: 63, name: "Hohenrain",            direction: "L",  start: 0.990, end: 1.000, section: "hohenrain" }
  ]
};

// Aliases for different iRacing track ID variants
// Combined layouts
TRACK_DATA["nurburgring combinedshortb"] = TRACK_DATA["nurburgring combined"];
TRACK_DATA["nurburgring combinedshort"] = TRACK_DATA["nurburgring combined"];
TRACK_DATA["nurburgring combinedlong"] = TRACK_DATA["nurburgring combined"];
TRACK_DATA["nurburgring combined gesamtstrecke vln"] = TRACK_DATA["nurburgring combined"];
TRACK_DATA["nurburgring combined vln"] = TRACK_DATA["nurburgring combined"];

// Nordschleife standalone aliases
TRACK_DATA["nurburgring nordschleife industriefahrten"] = TRACK_DATA["nurburgring nordschleife"];
TRACK_DATA["nurburgring nordschleife touristenfahrten"] = TRACK_DATA["nurburgring nordschleife"];
