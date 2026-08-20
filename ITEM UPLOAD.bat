@echo off
title Sahil Traders - Item Upload Portal
color 0A
cls
echo.
echo  ==========================================
echo   SAHIL TRADERS - ITEM UPLOAD PORTAL
echo  ==========================================
echo.
echo  Server start ho raha hai...
echo  Browser khul raha hai: http://localhost:8888/upload
echo.
echo  [IS WINDOW KO BAND MAT KAREIN]
echo  [Band karna = server band ho jaega]
echo.
echo  ==========================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0upload_server.ps1"
echo.
echo Server band ho gaya.
pause
