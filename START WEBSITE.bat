@echo off
title Sahil Traders - Website Server (PORT 8000)
echo ==================================================
echo   SAHIL TRADERS WEBSITE SERVER - PORT 8000
echo ==================================================
echo.
echo   Website: http://localhost:8000
echo.
echo   [YE WINDOW BAND NA KAREIN - SERVER CHAL RAHA HAI]
echo ==================================================
echo.
powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0admin_server.ps1"
pause
