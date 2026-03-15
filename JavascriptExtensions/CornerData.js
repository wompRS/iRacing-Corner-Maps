// CornerData.js
// Corner data for Nuerburgring Combined layouts (VLN / 24h / etc.)
// Percentage values from Lovely-Sim-Racing/lovely-track-data (calibrated in-sim)
// Note: VLN layout bypasses Mercedes Arena - percentages may need fine-tuning
// via calibration lap. The 24h values are used as baseline.

var TRACK_DATA = {};

// --------------------------------------------------------------------------
// Nuerburgring Gesamtstrecke 24h (Combined 24h layout)
// trackId: "nurburgring combined"
// Total length: ~25,180m
// --------------------------------------------------------------------------
TRACK_DATA["nurburgring combined"] = {
  trackName: "Nuerburgring Gesamtstrecke 24h",
  corners: [
    // --- GP SECTION ---
    { name: "Yokohama-S",           direction: "R", start: 0.021, end: 0.033, section: "yokohama-s" },
    { name: "Valvoline Kurve",      direction: "L", start: 0.042, end: 0.050, section: "valvoline-kurve" },
    { name: "Ford-Kurve",           direction: "R", start: 0.051, end: 0.058, section: "ford-kurve" },
    { name: "Dunlop-Kehre",         direction: "R", start: 0.071, end: 0.082, section: "dunlop-kehre" },
    { name: "Schumacher-S",         direction: null, start: 0.087, end: 0.102, section: "schumacher-s" },
    { name: "Michelin-Kurve",       direction: "L", start: 0.110, end: 0.117, section: "michelin-kurve" },
    { name: "Warsteiner-Kurve",     direction: "R", start: 0.118, end: 0.128, section: "warsteiner-kurve" },
    { name: "ADVAN-Bogen",          direction: "R", start: 0.135, end: 0.145, section: "advan-bogen" },
    { name: "NGK-Schikane",         direction: null, start: 0.153, end: 0.164, section: "ngk-schikane" },

    // --- NORDSCHLEIFE SECTION ---
    { name: "T13",                  direction: "R", start: 0.165, end: 0.173, section: "t13" },
    { name: "Hatzenbach",           direction: null, start: 0.183, end: 0.224, section: "hatzenbach" },
    { name: "Hoheneichen",          direction: "R", start: 0.226, end: 0.250, section: "hoheneichen" },
    { name: "Quiddelbacher Hoehe",  direction: null, start: 0.251, end: 0.264, section: "quiddelbacher-hohe" },
    { name: "Flugplatz",            direction: "L", start: 0.252, end: 0.301, section: "flugplatz" },
    { name: "Schwedenkreuz",        direction: "L", start: 0.304, end: 0.316, section: "schwedenkreuz" },
    { name: "Aremberg",             direction: "L", start: 0.317, end: 0.341, section: "aremberg" },
    { name: "Fuchsroehre",          direction: null, start: 0.342, end: 0.365, section: "fuchsroehre" },
    { name: "Adenauer Forst",       direction: null, start: 0.368, end: 0.397, section: "adenauer-forst" },
    { name: "Metzgesfeld",          direction: null, start: 0.398, end: 0.415, section: "metzgesfeld" },
    { name: "Kallenhard",           direction: "R", start: 0.417, end: 0.429, section: "kallenhard" },
    { name: "Spiegelkurve",         direction: "L", start: 0.430, end: 0.437, section: "spiegelkurve" },
    { name: "Dreifach-Rechts",      direction: "R", start: 0.438, end: 0.454, section: "dreifach-rechts" },
    { name: "Wehrseifen",           direction: "R", start: 0.455, end: 0.472, section: "wehrseifen" },
    { name: "ExMuehle",             direction: null, start: 0.487, end: 0.505, section: "ex-muhle" },
    { name: "Bergwerk",             direction: "L", start: 0.514, end: 0.535, section: "bergwerk" },
    { name: "Kesselchen",           direction: null, start: 0.560, end: 0.575, section: "kesselchen" },
    { name: "Klostertal",           direction: null, start: 0.576, end: 0.586, section: "klostertal" },
    { name: "Mutkurve",             direction: "R", start: 0.587, end: 0.605, section: "mutkurve" },
    { name: "Caracciola-Karussell", direction: "L", start: 0.639, end: 0.650, section: "karussell" },
    { name: "Hohe Acht",            direction: "R", start: 0.675, end: 0.685, section: "hohe-acht" },
    { name: "Hedwigshoehe",         direction: null, start: 0.686, end: 0.702, section: "hedwigshoehe" },
    { name: "Wippermann",           direction: "L", start: 0.703, end: 0.716, section: "wippermann" },
    { name: "Eschbach",             direction: null, start: 0.717, end: 0.730, section: "eschbach" },
    { name: "Bruennchen",           direction: "R", start: 0.731, end: 0.760, section: "bruennchen" },
    { name: "Pflanzgarten",         direction: null, start: 0.761, end: 0.798, section: "pflanzgarten" },
    { name: "Stefan-Bellof-S",      direction: null, start: 0.799, end: 0.820, section: "stefan-bellof-s" },
    { name: "Schwalbenschwanz",     direction: "R", start: 0.821, end: 0.845, section: "schwalbenschwanz" },
    { name: "Galgenkopf",           direction: "L", start: 0.848, end: 0.865, section: "galgenkopf" },
    { name: "Doettinger Hoehe",     direction: null, start: 0.866, end: 0.936, section: "dottinger-hohe" },
    { name: "Antoniusbuche",        direction: null, start: 0.940, end: 0.955, section: "antoniusbuche" },
    { name: "Tiergarten",           direction: null, start: 0.959, end: 0.965, section: "tiergarten" },
    { name: "Hohenrain",            direction: null, start: 0.966, end: 0.989, section: "hohenrain" }
  ]
};

// --------------------------------------------------------------------------
// Nuerburgring Nordschleife (standalone, no GP section)
// trackId: "nurburgring nordschleife"
// Total length: ~20,640m
// --------------------------------------------------------------------------
TRACK_DATA["nurburgring nordschleife"] = {
  trackName: "Nuerburgring Nordschleife",
  corners: [
    { name: "Hatzenbach",           direction: null, start: 0.020, end: 0.071, section: "hatzenbach" },
    { name: "Hoheneichen",          direction: "R", start: 0.072, end: 0.090, section: "hoheneichen" },
    { name: "Quiddelbacher Hoehe",  direction: null, start: 0.090, end: 0.110, section: "quiddelbacher-hohe" },
    { name: "Flugplatz",            direction: "L", start: 0.110, end: 0.167, section: "flugplatz" },
    { name: "Schwedenkreuz",        direction: "L", start: 0.167, end: 0.180, section: "schwedenkreuz" },
    { name: "Aremberg",             direction: "L", start: 0.180, end: 0.196, section: "aremberg" },
    { name: "Fuchsroehre",          direction: null, start: 0.198, end: 0.234, section: "fuchsroehre" },
    { name: "Adenauer Forst",       direction: null, start: 0.235, end: 0.262, section: "adenauer-forst" },
    { name: "Metzgesfeld",          direction: null, start: 0.269, end: 0.302, section: "metzgesfeld" },
    { name: "Kallenhard",           direction: "R", start: 0.302, end: 0.320, section: "kallenhard" },
    { name: "Spiegelkurve",         direction: "L", start: 0.321, end: 0.329, section: "spiegelkurve" },
    { name: "Dreifach-Rechts",      direction: "R", start: 0.330, end: 0.355, section: "dreifach-rechts" },
    { name: "Wehrseifen",           direction: "R", start: 0.356, end: 0.370, section: "wehrseifen" },
    { name: "ExMuehle",             direction: null, start: 0.371, end: 0.408, section: "ex-muhle" },
    { name: "Bergwerk",             direction: "L", start: 0.420, end: 0.450, section: "bergwerk" },
    { name: "Kesselchen",           direction: null, start: 0.451, end: 0.514, section: "kesselchen" },
    { name: "Mutkurve",             direction: "R", start: 0.515, end: 0.527, section: "mutkurve" },
    { name: "Klostertal",           direction: null, start: 0.528, end: 0.572, section: "klostertal" },
    { name: "Caracciola-Karussell", direction: "L", start: 0.576, end: 0.588, section: "karussell" },
    { name: "Hohe Acht",            direction: "R", start: 0.616, end: 0.632, section: "hohe-acht" },
    { name: "Hedwigshoehe",         direction: null, start: 0.633, end: 0.652, section: "hedwigshoehe" },
    { name: "Wippermann",           direction: "L", start: 0.653, end: 0.668, section: "wippermann" },
    { name: "Eschbach",             direction: null, start: 0.669, end: 0.686, section: "eschbach" },
    { name: "Bruennchen",           direction: "R", start: 0.688, end: 0.720, section: "bruennchen" },
    { name: "Pflanzgarten",         direction: null, start: 0.729, end: 0.770, section: "pflanzgarten" },
    { name: "Stefan-Bellof-S",      direction: null, start: 0.772, end: 0.790, section: "stefan-bellof-s" },
    { name: "Schwalbenschwanz",     direction: "R", start: 0.792, end: 0.825, section: "schwalbenschwanz" },
    { name: "Galgenkopf",           direction: "L", start: 0.832, end: 0.852, section: "galgenkopf" },
    { name: "Doettinger Hoehe",     direction: null, start: 0.855, end: 0.940, section: "dottinger-hohe" },
    { name: "Antoniusbuche",        direction: null, start: 0.945, end: 0.961, section: "antoniusbuche" },
    { name: "Tiergarten",           direction: null, start: 0.962, end: 0.972, section: "tiergarten" },
    { name: "Hohenrain",            direction: null, start: 0.973, end: 1.000, section: "hohenrain" }
  ]
};

// Alias: VLN layout uses 24h data as baseline (user should calibrate)
// The VLN layout bypasses Mercedes Arena, so GP percentages differ slightly
// TODO: After calibration lap, create separate entry if percentages differ significantly
TRACK_DATA["nurburgring combined gesamtstrecke vln"] = TRACK_DATA["nurburgring combined"];
TRACK_DATA["nurburgring combined vln"] = TRACK_DATA["nurburgring combined"];
