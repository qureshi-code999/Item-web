@echo off
title Opening Sahil Traders Android Project in Android Studio
color 0A
cls
echo ================================================================
echo    OPENING SAHIL TRADERS APP PROJECT IN ANDROID STUDIO
echo ================================================================
echo.
echo Launching Android Studio with android project folder...
start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" "%~dp0android"
echo.
echo Android Studio is opening!
timeout /t 3 >nul
