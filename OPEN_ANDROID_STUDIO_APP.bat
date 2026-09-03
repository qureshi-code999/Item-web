@echo off
title Opening ZS Mart Android Project in Android Studio
color 0A
cls
echo ================================================================
echo    OPENING ZS MART APP PROJECT IN ANDROID STUDIO
echo ================================================================
echo.
echo Launching Android Studio with android project folder...
start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" "%~dp0android"
echo.
echo Android Studio is opening!
timeout /t 3 >nul
