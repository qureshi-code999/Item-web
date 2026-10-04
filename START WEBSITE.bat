@echo off
title ZS Mart - Store & Master Admin Server (PORT 8888)
echo ==================================================
echo   ZS MART WEB & MASTER ADMIN SERVER - PORT 8888
echo ==================================================
echo.
echo   Store Web:    http://localhost:8888/index.html
echo   Admin Portal: http://localhost:8888/admin_dashboard.html
echo.
echo   [YE WINDOW BAND NA KAREIN - SERVER CHAL RAHA HAI]
echo ==================================================
echo.
start "" "http://localhost:8888/index.html"
node "%~dp0admin_server.js"
pause
