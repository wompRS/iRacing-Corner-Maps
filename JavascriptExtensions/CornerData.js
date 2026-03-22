// CornerData.js
// Corner data for Nuerburgring Combined layouts (VLN / 24h / etc.)
// Names match iRacing's official track map labeling.
// Percentage values are estimates - need calibration lap for precision.

var TRACK_DATA = {};

// --------------------------------------------------------------------------
// Nuerburgring Gesamtstrecke 24h (Combined 24h layout)
// iRacing trackId: "nurburgring combined" (needs confirmation)
// Total length: ~25,378m
// --------------------------------------------------------------------------
TRACK_DATA["nurburgring combined"] = {
  trackName: "Nuerburgring Combined",
  corners: [
    // === GP SECTION ===
    { name: "Yokohama-S",           direction: "R",  start: 0.005, end: 0.018, section: "yokohama-s" },
    { name: "Yokohama-S",           direction: "L",  start: 0.018, end: 0.030, section: "yokohama-s" },
    { name: "Ford-Kurve",           direction: "R",  start: 0.050, end: 0.058, section: "ford-kurve" },
    { name: "Dunlop-Kehre",         direction: "R",  start: 0.068, end: 0.082, section: "dunlop-kehre" },
    { name: "Schumacher-S",         direction: "L",  start: 0.087, end: 0.095, section: "schumacher-s" },
    { name: "Schumacher-S",         direction: "R",  start: 0.095, end: 0.102, section: "schumacher-s" },
    { name: "Ravenol-Kurve",        direction: "L",  start: 0.108, end: 0.117, section: "ravenol-kurve" },
    { name: "Bilstein-Kurve",       direction: "R",  start: 0.118, end: 0.128, section: "bilstein-kurve" },
    { name: "ADVAN-Bogen",          direction: "R",  start: 0.135, end: 0.145, section: "advan-bogen" },
    { name: "Veedol-Schikane",      direction: "L",  start: 0.150, end: 0.157, section: "veedol-schikane" },
    { name: "Veedol-Schikane",      direction: "R",  start: 0.157, end: 0.164, section: "veedol-schikane" },

    // === NORDSCHLEIFE ENTRY ===
    { name: "Einfahrt Nordschleife", direction: null, start: 0.164, end: 0.170, section: "einfahrt-nordschleife" },

    // === NORDSCHLEIFE ===
    { name: "Antoniusbuche",        direction: "L",  start: 0.940, end: 0.952, section: "antoniusbuche" },
    { name: "Tiergarten",           direction: "L",  start: 0.955, end: 0.961, section: "tiergarten" },
    { name: "Tiergarten",           direction: "R",  start: 0.961, end: 0.966, section: "tiergarten" },
    { name: "Hohenrain",            direction: "L",  start: 0.968, end: 0.974, section: "hohenrain" },
    { name: "Hohenrain",            direction: "R",  start: 0.974, end: 0.980, section: "hohenrain" },
    { name: "Hohenrain",            direction: "L",  start: 0.980, end: 0.989, section: "hohenrain" },
    { name: "T13",                  direction: "R",  start: 0.165, end: 0.174, section: "t13" },
    { name: "Nordkehre",            direction: "L",  start: 0.174, end: 0.183, section: "nordkehre" },
    { name: "Hatzenbach",           direction: "R",  start: 0.186, end: 0.195, section: "hatzenbach" },
    { name: "Hatzenbach",           direction: "L",  start: 0.195, end: 0.203, section: "hatzenbach" },
    { name: "Hatzenbach",           direction: "R",  start: 0.203, end: 0.210, section: "hatzenbach" },
    { name: "Hatzenbach",           direction: "L",  start: 0.210, end: 0.218, section: "hatzenbach" },
    { name: "Hatzenbach",           direction: "R",  start: 0.218, end: 0.224, section: "hatzenbach" },
    { name: "Hocheichen",           direction: "R",  start: 0.226, end: 0.238, section: "hocheichen" },
    { name: "Hocheichen",           direction: "L",  start: 0.238, end: 0.248, section: "hocheichen" },
    { name: "Quiddelbacher Hoehe",  direction: "R",  start: 0.250, end: 0.264, section: "quiddelbacher-hohe" },
    { name: "Flugplatz",            direction: "L",  start: 0.268, end: 0.285, section: "flugplatz" },
    { name: "Kottenborn",           direction: "L",  start: 0.288, end: 0.300, section: "kottenborn" },
    { name: "Schwedenkreuz",        direction: "L",  start: 0.304, end: 0.316, section: "schwedenkreuz" },
    { name: "Aremberg",             direction: "R",  start: 0.318, end: 0.335, section: "aremberg" },
    { name: "Postbruecke",          direction: null,  start: 0.335, end: 0.342, section: "postbruecke" },
    { name: "Fuchsroehre",          direction: "R",  start: 0.342, end: 0.352, section: "fuchsroehre" },
    { name: "Kompression",          direction: null,  start: 0.352, end: 0.358, section: "kompression" },
    { name: "Fuchsroehre",          direction: "L",  start: 0.358, end: 0.365, section: "fuchsroehre" },
    { name: "Adenauer Forst",       direction: "R",  start: 0.368, end: 0.378, section: "adenauer-forst" },
    { name: "Adenauer Forst",       direction: "L",  start: 0.378, end: 0.386, section: "adenauer-forst" },
    { name: "Adenauer Forst",       direction: "L",  start: 0.386, end: 0.392, section: "adenauer-forst" },
    { name: "Adenauer Forst",       direction: "R",  start: 0.392, end: 0.397, section: "adenauer-forst" },
    { name: "Metzgesfeld",          direction: "L",  start: 0.398, end: 0.407, section: "metzgesfeld" },
    { name: "Metzgesfeld",          direction: "L",  start: 0.407, end: 0.415, section: "metzgesfeld" },
    { name: "Kallenhard",           direction: "R",  start: 0.417, end: 0.429, section: "kallenhard" },
    { name: "Spiegelkurve",         direction: "L",  start: 0.430, end: 0.435, section: "spiegelkurve" },
    { name: "Spiegelkurve",         direction: "R",  start: 0.435, end: 0.440, section: "spiegelkurve" },
    { name: "Dreifach-Rechts",      direction: "R",  start: 0.441, end: 0.447, section: "dreifach-rechts" },
    { name: "Dreifach-Rechts",      direction: "R",  start: 0.447, end: 0.451, section: "dreifach-rechts" },
    { name: "Dreifach-Rechts",      direction: "R",  start: 0.451, end: 0.455, section: "dreifach-rechts" },
    { name: "Wehrseifen",           direction: "R",  start: 0.457, end: 0.464, section: "wehrseifen" },
    { name: "Wehrseifen",           direction: "L",  start: 0.464, end: 0.470, section: "wehrseifen" },
    { name: "Wehrseifen",           direction: "R",  start: 0.470, end: 0.476, section: "wehrseifen" },
    { name: "Breidscheid",          direction: "R",  start: 0.478, end: 0.484, section: "breidscheid" },
    { name: "Breidscheid",          direction: "L",  start: 0.484, end: 0.490, section: "breidscheid" },
    { name: "Ex-Muehle",            direction: "R",  start: 0.492, end: 0.505, section: "ex-muhle" },
    { name: "Lauda Links",          direction: "L",  start: 0.506, end: 0.514, section: "lauda-links" },
    { name: "Bergwerk",             direction: "R",  start: 0.516, end: 0.535, section: "bergwerk" },
    { name: "Kesselchen",           direction: "L",  start: 0.545, end: 0.575, section: "kesselchen" },
    { name: "Mutkurve",             direction: "L",  start: 0.578, end: 0.590, section: "mutkurve" },
    { name: "Klostertal",           direction: "R",  start: 0.592, end: 0.602, section: "klostertal" },
    { name: "Steilstrecke",         direction: "R",  start: 0.604, end: 0.620, section: "steilstrecke" },
    { name: "Caracciola-Karussell", direction: "L",  start: 0.632, end: 0.650, section: "karussell" },
    { name: "Posten 147",           direction: null,  start: 0.652, end: 0.662, section: "posten-147" },
    { name: "Hohe Acht",            direction: "R",  start: 0.670, end: 0.685, section: "hohe-acht" },
    { name: "Hedwigshoehe",         direction: "R",  start: 0.686, end: 0.700, section: "hedwigshoehe" },
    { name: "Wippermann",           direction: "L",  start: 0.702, end: 0.710, section: "wippermann" },
    { name: "Wippermann",           direction: "R",  start: 0.710, end: 0.718, section: "wippermann" },
    { name: "Eschbach",             direction: "R",  start: 0.719, end: 0.727, section: "eschbach" },
    { name: "Eschbach",             direction: "L",  start: 0.727, end: 0.733, section: "eschbach" },
    { name: "Bruennchen",           direction: "R",  start: 0.734, end: 0.745, section: "bruennchen" },
    { name: "Bruennchen",           direction: "R",  start: 0.745, end: 0.758, section: "bruennchen" },
    { name: "Eiskurve",             direction: "L",  start: 0.760, end: 0.768, section: "eiskurve" },
    { name: "Eiskurve",             direction: "R",  start: 0.768, end: 0.775, section: "eiskurve" },
    { name: "Pflanzgarten I",       direction: "R",  start: 0.776, end: 0.790, section: "pflanzgarten" },
    { name: "Sprunghugel",          direction: null,  start: 0.790, end: 0.796, section: "pflanzgarten" },
    { name: "Pflanzgarten II",      direction: "L",  start: 0.796, end: 0.808, section: "pflanzgarten" },
    { name: "Stefan-Bellof-S",      direction: "R",  start: 0.810, end: 0.818, section: "stefan-bellof-s" },
    { name: "Stefan-Bellof-S",      direction: "L",  start: 0.818, end: 0.825, section: "stefan-bellof-s" },
    { name: "Stefan-Bellof-S",      direction: "R",  start: 0.825, end: 0.832, section: "stefan-bellof-s" },
    { name: "Schwalbenschwanz",     direction: "R",  start: 0.834, end: 0.842, section: "schwalbenschwanz" },
    { name: "Schwalbenschwanz",     direction: "L",  start: 0.842, end: 0.850, section: "schwalbenschwanz" },
    { name: "Kleines Karussell",    direction: "L",  start: 0.852, end: 0.864, section: "kleines-karussell" },
    { name: "Galgenkopf",           direction: "R",  start: 0.866, end: 0.882, section: "galgenkopf" },
    { name: "Doettinger Hoehe",     direction: null,  start: 0.884, end: 0.938, section: "dottinger-hohe" }
  ]
};

// Sort corners by start percentage for binary search
// (handles the wrap-around at Antoniusbuche/Tiergarten/Hohenrain which are at 0.94-0.99)
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
    { name: "Hatzenbach",           direction: "R",  start: 0.020, end: 0.035, section: "hatzenbach" },
    { name: "Hatzenbach",           direction: "L",  start: 0.035, end: 0.048, section: "hatzenbach" },
    { name: "Hatzenbach",           direction: "R",  start: 0.048, end: 0.058, section: "hatzenbach" },
    { name: "Hatzenbach",           direction: "L",  start: 0.058, end: 0.071, section: "hatzenbach" },
    { name: "Hocheichen",           direction: "R",  start: 0.072, end: 0.082, section: "hocheichen" },
    { name: "Hocheichen",           direction: "L",  start: 0.082, end: 0.090, section: "hocheichen" },
    { name: "Quiddelbacher Hoehe",  direction: "R",  start: 0.092, end: 0.110, section: "quiddelbacher-hohe" },
    { name: "Flugplatz",            direction: "L",  start: 0.112, end: 0.135, section: "flugplatz" },
    { name: "Kottenborn",           direction: "L",  start: 0.138, end: 0.155, section: "kottenborn" },
    { name: "Schwedenkreuz",        direction: "L",  start: 0.167, end: 0.180, section: "schwedenkreuz" },
    { name: "Aremberg",             direction: "R",  start: 0.182, end: 0.196, section: "aremberg" },
    { name: "Fuchsroehre",          direction: "R",  start: 0.200, end: 0.215, section: "fuchsroehre" },
    { name: "Kompression",          direction: null,  start: 0.215, end: 0.222, section: "kompression" },
    { name: "Fuchsroehre",          direction: "L",  start: 0.222, end: 0.234, section: "fuchsroehre" },
    { name: "Adenauer Forst",       direction: "R",  start: 0.236, end: 0.245, section: "adenauer-forst" },
    { name: "Adenauer Forst",       direction: "L",  start: 0.245, end: 0.255, section: "adenauer-forst" },
    { name: "Adenauer Forst",       direction: "R",  start: 0.255, end: 0.262, section: "adenauer-forst" },
    { name: "Metzgesfeld",          direction: "L",  start: 0.269, end: 0.285, section: "metzgesfeld" },
    { name: "Metzgesfeld",          direction: "L",  start: 0.285, end: 0.302, section: "metzgesfeld" },
    { name: "Kallenhard",           direction: "R",  start: 0.302, end: 0.320, section: "kallenhard" },
    { name: "Spiegelkurve",         direction: "L",  start: 0.321, end: 0.326, section: "spiegelkurve" },
    { name: "Spiegelkurve",         direction: "R",  start: 0.326, end: 0.332, section: "spiegelkurve" },
    { name: "Dreifach-Rechts",      direction: "R",  start: 0.333, end: 0.345, section: "dreifach-rechts" },
    { name: "Dreifach-Rechts",      direction: "R",  start: 0.345, end: 0.355, section: "dreifach-rechts" },
    { name: "Wehrseifen",           direction: "R",  start: 0.356, end: 0.363, section: "wehrseifen" },
    { name: "Wehrseifen",           direction: "L",  start: 0.363, end: 0.370, section: "wehrseifen" },
    { name: "Breidscheid",          direction: "R",  start: 0.372, end: 0.380, section: "breidscheid" },
    { name: "Breidscheid",          direction: "L",  start: 0.380, end: 0.388, section: "breidscheid" },
    { name: "Ex-Muehle",            direction: "R",  start: 0.390, end: 0.408, section: "ex-muhle" },
    { name: "Lauda Links",          direction: "L",  start: 0.410, end: 0.420, section: "lauda-links" },
    { name: "Bergwerk",             direction: "R",  start: 0.424, end: 0.450, section: "bergwerk" },
    { name: "Kesselchen",           direction: "L",  start: 0.455, end: 0.514, section: "kesselchen" },
    { name: "Mutkurve",             direction: "L",  start: 0.515, end: 0.527, section: "mutkurve" },
    { name: "Klostertal",           direction: "R",  start: 0.530, end: 0.545, section: "klostertal" },
    { name: "Steilstrecke",         direction: "R",  start: 0.548, end: 0.572, section: "steilstrecke" },
    { name: "Caracciola-Karussell", direction: "L",  start: 0.576, end: 0.592, section: "karussell" },
    { name: "Posten 147",           direction: null,  start: 0.594, end: 0.608, section: "posten-147" },
    { name: "Hohe Acht",            direction: "R",  start: 0.616, end: 0.632, section: "hohe-acht" },
    { name: "Hedwigshoehe",         direction: "R",  start: 0.633, end: 0.650, section: "hedwigshoehe" },
    { name: "Wippermann",           direction: "L",  start: 0.653, end: 0.662, section: "wippermann" },
    { name: "Wippermann",           direction: "R",  start: 0.662, end: 0.670, section: "wippermann" },
    { name: "Eschbach",             direction: "R",  start: 0.672, end: 0.680, section: "eschbach" },
    { name: "Eschbach",             direction: "L",  start: 0.680, end: 0.688, section: "eschbach" },
    { name: "Bruennchen",           direction: "R",  start: 0.690, end: 0.705, section: "bruennchen" },
    { name: "Bruennchen",           direction: "R",  start: 0.705, end: 0.720, section: "bruennchen" },
    { name: "Eiskurve",             direction: "L",  start: 0.722, end: 0.730, section: "eiskurve" },
    { name: "Eiskurve",             direction: "R",  start: 0.730, end: 0.738, section: "eiskurve" },
    { name: "Pflanzgarten I",       direction: "R",  start: 0.740, end: 0.755, section: "pflanzgarten" },
    { name: "Sprunghugel",          direction: null,  start: 0.755, end: 0.762, section: "pflanzgarten" },
    { name: "Pflanzgarten II",      direction: "L",  start: 0.762, end: 0.775, section: "pflanzgarten" },
    { name: "Stefan-Bellof-S",      direction: "R",  start: 0.778, end: 0.786, section: "stefan-bellof-s" },
    { name: "Stefan-Bellof-S",      direction: "L",  start: 0.786, end: 0.793, section: "stefan-bellof-s" },
    { name: "Schwalbenschwanz",     direction: "R",  start: 0.796, end: 0.808, section: "schwalbenschwanz" },
    { name: "Schwalbenschwanz",     direction: "L",  start: 0.808, end: 0.820, section: "schwalbenschwanz" },
    { name: "Kleines Karussell",    direction: "L",  start: 0.824, end: 0.838, section: "kleines-karussell" },
    { name: "Galgenkopf",           direction: "R",  start: 0.842, end: 0.858, section: "galgenkopf" },
    { name: "Doettinger Hoehe",     direction: null,  start: 0.862, end: 0.940, section: "dottinger-hohe" },
    { name: "Antoniusbuche",        direction: "L",  start: 0.945, end: 0.958, section: "antoniusbuche" },
    { name: "Tiergarten",           direction: "L",  start: 0.960, end: 0.968, section: "tiergarten" },
    { name: "Tiergarten",           direction: "R",  start: 0.968, end: 0.975, section: "tiergarten" },
    { name: "Hohenrain",            direction: "L",  start: 0.977, end: 0.984, section: "hohenrain" },
    { name: "Hohenrain",            direction: "R",  start: 0.984, end: 0.990, section: "hohenrain" },
    { name: "Hohenrain",            direction: "L",  start: 0.990, end: 1.000, section: "hohenrain" }
  ]
};

// Alias: VLN layout uses combined data as baseline
TRACK_DATA["nurburgring combined gesamtstrecke vln"] = TRACK_DATA["nurburgring combined"];
TRACK_DATA["nurburgring combined vln"] = TRACK_DATA["nurburgring combined"];
