@echo off
title ZS Mart - Admin Portal Server
echo ==================================================
echo   ZS MART ADMIN PORTAL SERVER
echo ==================================================
echo.
echo Server start ho raha hai...
echo Browser automatically open ho jayega.
echo.
echo [SERVER CHALTE REHNE DEIN, ISE CLOSE NA KAREIN]
echo ==================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0admin_server.ps1"
pause
