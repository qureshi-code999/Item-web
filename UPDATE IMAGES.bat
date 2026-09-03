@echo off
title ZS Mart - Image Map Scanner and Updater
echo ================================================
echo    ZS Mart - Image Map Scanner and Updater
echo ================================================
echo.
echo Images folder scan kar raha hai...
echo.

powershell -ExecutionPolicy Bypass -NoProfile -File "%~dp0update_images.ps1"

echo.
echo ================================================
echo  DONE! Website ki tamam product images sync ho gayi hain.
echo ================================================
echo.
pause
