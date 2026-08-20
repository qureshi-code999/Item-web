@echo off
title Setting up Sahil Traders Auto-Start Server...
echo ==================================================
echo   SAHIL TRADERS - SERVER SETUP
echo ==================================================
echo.
echo Server ko Windows startup mein register kar raha hai...
echo.
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0setup_autostart_server.ps1"
echo.
echo Done! Ab server automatically chal jata hai.
pause
