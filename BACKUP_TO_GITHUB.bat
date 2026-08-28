@echo off
title Sahil Traders - 1-Click GitHub Cloud Backup
color 0A
cls
echo ================================================================
echo         SAHIL TRADERS - 1-CLICK GITHUB CLOUD BACKUP
echo ================================================================
echo.
echo  [1/3] Gathering all files, images, and code changes...
set PATH=%PATH%;C:\Program Files\Git\cmd
cd /d "%~dp0"

git add -A
echo.
echo  [2/3] Creating secure backup checkpoint...
git commit -m "Auto Backup: %date% %time%"

echo.
echo  [3/3] Uploading safely to GitHub (qureshi-code999/Item-web)...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ================================================================
    echo    SUCCESS! 100%% Files Are Safely Backed Up on GitHub!
    echo    Repository: https://github.com/qureshi-code999/Item-web
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo    NOTICE: Check if there was anything new to backup or check login.
    echo ================================================================
)

echo.
echo Press any key to close this window...
pause >nul
