@echo off
REM Deploy iRacing Corner Names overlay to SimHub DashTemplates folder
REM Run this script after building/modifying the overlay

set "SIMHUB_DIR=C:\Program Files (x86)\SimHub"
set "DASH_NAME=iRacing Corner Names"
set "DEST=%SIMHUB_DIR%\DashTemplates\%DASH_NAME%"

echo Deploying "%DASH_NAME%" to SimHub...

REM Check SimHub exists
if not exist "%SIMHUB_DIR%" (
    echo ERROR: SimHub not found at %SIMHUB_DIR%
    echo Please edit this script and set SIMHUB_DIR to your SimHub installation path.
    pause
    exit /b 1
)

REM Create destination directory
if not exist "%DEST%" mkdir "%DEST%"
if not exist "%DEST%\JavascriptExtensions" mkdir "%DEST%\JavascriptExtensions"

REM Copy dashboard files
copy /Y "%~dp0iRacing Corner Names.djson" "%DEST%\"
copy /Y "%~dp0TrackMapBase.png" "%DEST%\"

REM Copy JavaScript extensions
copy /Y "%~dp0JavascriptExtensions\CornerData.js" "%DEST%\JavascriptExtensions\"
copy /Y "%~dp0JavascriptExtensions\CornerLookup.js" "%DEST%\JavascriptExtensions\"

echo.
echo Deployment complete!
echo Dashboard installed to: %DEST%
echo.
echo Next steps:
echo 1. Open SimHub
echo 2. Go to Dash Studio
echo 3. Find "iRacing Corner Names" in your dashboards
echo 4. Enable it as an overlay
echo 5. Run iRacing in borderless windowed mode
echo.
pause
