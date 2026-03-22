"""
Generate SimHub .djson with corner shape diagram + text info.
Compact layout: corner shape on left, text on right.
"""

import json
import os

OUTPUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "generated")
SIMHUB_DIR = r"C:\Program Files (x86)\SimHub\DashTemplates\iRacing Corner Names"

with open(os.path.join(OUTPUT_DIR, "image_metadata.json")) as f:
    img_data = json.load(f)

# Build JS section-to-image map
section_map = img_data["section_to_image"]
pairs = sorted(set((k, v) for k, v in section_map.items()))
js_map = "var m={" + ",".join(f"'{k}':'{v}'" for k, v in pairs) + "};"

corner_img_expr = (
    "var info = lookupCorner();\n"
    "var section = info.split('|')[2] || '';\n"
    + js_map + "\n"
    "return m[section] || 'CornerBlank';"
)

corner_name_expr = (
    "var info = lookupCorner();\n"
    "var parts = info.split('|');\n"
    "var name = parts[0] || '';\n"
    "var dir = parts[1] || '';\n"
    "if (!name) {\n"
    "  var next = parts[3] || '';\n"
    "  return next ? '> ' + next : '';\n"
    "}\n"
    "if (dir) return dir + '  ' + name;\n"
    "return name;"
)

corner_color_expr = (
    "var info = lookupCorner();\n"
    "return info.split('|')[0] ? '#FFFFFFFF' : '#88AAAAAA';"
)

next_corner_expr = (
    "var info = lookupCorner();\n"
    "var parts = info.split('|');\n"
    "var name = parts[0] || '';\n"
    "var next = parts[3] || '';\n"
    "if (name && next && name !== next) return 'Next: ' + next;\n"
    "return '';"
)

debug_expr = (
    "var pct = $prop('GameRawData.Telemetry.LapDistPct');\n"
    "var tid = $prop('DataCorePlugin.GameData.TrackId') || '';\n"
    "if (pct === null || pct === undefined) return tid || 'no game';\n"
    "return (Math.round(pct * 10000) / 10000) + ' | ' + tid;"
)

# Layout: compact horizontal bar
# [Corner Shape 80x80] [Corner Name + Next Corner]
IMG_SIZE = 80
TEXT_W = 220
W = IMG_SIZE + TEXT_W + 10  # 310
H = IMG_SIZE + 8  # 88

dashboard = {
    "DashboardDebugManager": {},
    "Version": 2,
    "Id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "BaseHeight": H,
    "BaseWidth": W,
    "BackgroundColor": "#00000000",
    "Screens": [
        {
            "Name": "Main",
            "ScreenId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
            "InGameScreen": True,
            "IdleScreen": True,
            "PitScreen": False,
            "BackgroundColor": "#00FFFFFF",
            "Items": [
                {
                    "$type": "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.Layer, SimHub.Plugins",
                    "Top": 0.0,
                    "Left": 0.0,
                    "Height": float(H),
                    "Width": float(W),
                    "BackgroundColor": "#00FFFFFF",
                    "Visible": True,
                    "Name": "MainLayer",
                    "Childrens": [
                        # Background
                        {
                            "$type": "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.RectangleItem, SimHub.Plugins",
                            "BackgroundColor": "#DD101020",
                            "Height": float(H),
                            "Left": 0.0,
                            "Top": 0.0,
                            "Visible": True,
                            "Width": float(W),
                            "Name": "Background",
                            "Sid": 1
                        },
                        # Corner shape image (left side)
                        {
                            "$type": "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.ImageItem, SimHub.Plugins",
                            "Image": "CornerBlank",
                            "AutoSize": False,
                            "BackgroundColor": "#00FFFFFF",
                            "Height": float(IMG_SIZE),
                            "Left": 4.0,
                            "Top": 4.0,
                            "Visible": True,
                            "Width": float(IMG_SIZE),
                            "Name": "CornerShape",
                            "Sid": 2,
                            "Bindings": {
                                "Image": {
                                    "Formula": {
                                        "JSExt": 1,
                                        "Interpreter": 1,
                                        "Expression": corner_img_expr
                                    },
                                    "Mode": 2
                                }
                            }
                        },
                        # Corner name (right of image, top)
                        {
                            "$type": "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.TextItem, SimHub.Plugins",
                            "IsTextItem": True,
                            "Font": "Segoe UI",
                            "FontWeight": "Bold",
                            "FontSize": 22.0,
                            "Text": "",
                            "TextColor": "#FFFFFFFF",
                            "HorizontalAlignment": 0,
                            "VerticalAlignment": 1,
                            "BackgroundColor": "#00FFFFFF",
                            "Height": 36.0,
                            "Left": float(IMG_SIZE + 10),
                            "Top": 6.0,
                            "Visible": True,
                            "Width": float(TEXT_W - 10),
                            "Name": "CornerName",
                            "Sid": 3,
                            "Bindings": {
                                "Text": {
                                    "Formula": {
                                        "JSExt": 1,
                                        "Interpreter": 1,
                                        "Expression": corner_name_expr
                                    },
                                    "Mode": 2
                                },
                                "TextColor": {
                                    "Formula": {
                                        "JSExt": 1,
                                        "Interpreter": 1,
                                        "Expression": corner_color_expr
                                    },
                                    "Mode": 2
                                }
                            }
                        },
                        # Next corner (right of image, bottom)
                        {
                            "$type": "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.TextItem, SimHub.Plugins",
                            "IsTextItem": True,
                            "Font": "Segoe UI",
                            "FontWeight": "Normal",
                            "FontSize": 12.0,
                            "Text": "",
                            "TextColor": "#88AAAAAA",
                            "HorizontalAlignment": 0,
                            "VerticalAlignment": 1,
                            "BackgroundColor": "#00FFFFFF",
                            "Height": 22.0,
                            "Left": float(IMG_SIZE + 10),
                            "Top": 44.0,
                            "Visible": True,
                            "Width": float(TEXT_W - 10),
                            "Name": "NextCorner",
                            "Sid": 4,
                            "Bindings": {
                                "Text": {
                                    "Formula": {
                                        "JSExt": 1,
                                        "Interpreter": 1,
                                        "Expression": next_corner_expr
                                    },
                                    "Mode": 2
                                }
                            }
                        },
                        # Debug info (bottom right, tiny)
                        {
                            "$type": "SimHub.Plugins.OutputPlugins.GraphicalDash.Models.TextItem, SimHub.Plugins",
                            "IsTextItem": True,
                            "Font": "Consolas",
                            "FontWeight": "Normal",
                            "FontSize": 8.0,
                            "Text": "",
                            "TextColor": "#3300FF00",
                            "HorizontalAlignment": 2,
                            "VerticalAlignment": 1,
                            "BackgroundColor": "#00FFFFFF",
                            "Height": 14.0,
                            "Left": float(W - 160),
                            "Top": float(H - 16),
                            "Visible": True,
                            "Width": 155.0,
                            "Name": "DebugInfo",
                            "Sid": 5,
                            "Bindings": {
                                "Text": {
                                    "Formula": {
                                        "JSExt": 0,
                                        "Interpreter": 1,
                                        "Expression": debug_expr
                                    },
                                    "Mode": 2
                                }
                            }
                        }
                    ]
                }
            ]
        }
    ],
    "Images": img_data["images"],
    "Metadata": {
        "ScreenCount": 1.0,
        "InGameScreensIndexs": [0],
        "IdleScreensIndexs": [0],
        "MainPreviewIndex": 0,
        "IsOverlay": True,
        "OverlaySizeWarning": False,
        "MetadataVersion": 2.0,
        "PitScreensIndexs": [],
        "Title": "iRacing Corner Names",
        "Author": "Custom",
        "Width": float(W),
        "Height": float(H)
    },
    "IsOverlay": True,
    "EnableClickThroughOverlay": True,
    "EnableOnDashboardMessaging": False,
    "SnapToGrid": False,
    "HideLabels": True,
    "ShowForeground": True,
    "ForegroundOpacity": 100.0,
    "ShowBackground": True,
    "BackgroundOpacity": 100.0,
    "ShowBoundingRectangles": False,
    "ShowOnScreenControls": False,
    "GridSize": 10
}

djson_path = os.path.join(SIMHUB_DIR, "iRacing Corner Names.djson")
with open(djson_path, "w") as f:
    json.dump(dashboard, f, indent=2)
print(f"Deployed: {djson_path}")

project_djson = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "iRacing Corner Names.djson")
with open(project_djson, "w") as f:
    json.dump(dashboard, f, indent=2)
print(f"Project copy saved")
print(f"\nLayout: {W}x{H}px")
print("  [Corner Shape 80x80] [Name + Next Corner]")
print("Restart SimHub to see changes.")
