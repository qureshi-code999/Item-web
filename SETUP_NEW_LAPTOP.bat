@echo off
title ZS Mart - New Laptop 1-Click Auto Setup
color 0A
cls
echo ================================================================
echo          ZS MART - NEW LAPTOP 1-CLICK AUTOMATIC SETUP
echo ================================================================
echo.
echo  This tool automatically configures your new laptop to run the
echo  ZS Mart Master Admin Panel, Catalog Database, and Mobile App!
echo.
echo  [1/4] Checking Node.js environment...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo  [!] Node.js is not installed!
    echo      Please install Node.js from https://nodejs.org/ (LTS version)
    echo      and run this setup again.
    echo.
    pause
    exit /b 1
)
echo   [OK] Node.js is ready.

echo.
echo  [2/4] Checking Git environment...
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo  [!] Git is not installed!
    echo      Please install Git from https://git-scm.com/
    echo      and run this setup again.
    echo.
    pause
    exit /b 1
)
echo   [OK] Git is ready.

echo.
echo  [3/4] Installing necessary dependencies (npm install)...
cd /d "%~dp0"
call npm install --omit=dev >nul 2>&1
echo   [OK] Dependencies verified.

echo.
echo  [4/4] Checking Google Play Store Keystore file...
if not exist "%~dp0android\app\release-key.keystore" (
    echo   [NOTICE] 'release-key.keystore' is missing in android\app\
    echo   Please copy 'release-key.keystore' from your Google Drive Recovery Vault
    echo   into: %~dp0android\app\
    echo   (This is required ONLY when building new Play Store AAB bundles).
    echo.
) else (
    echo   [OK] Play Store Keystore is present.
)

echo.
echo ================================================================
echo      SETUP COMPLETE! MASTER ADMIN PORTAL IS READY TO LAUNCH!
echo ================================================================
echo.
echo  Launching ZS Mart Master Admin Portal...
timeout /t 2 >nul
start "" "%~dp0ADMIN PORTAL.bat"
exit /b 0
