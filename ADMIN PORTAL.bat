@echo off
title ZS Mart - Unified Master Admin Portal
color 0E
cls
echo ================================================================
echo           ZS MART - UNIFIED MASTER COMMAND CENTER
echo ================================================================
echo.
echo  Starting Master Node.js Server on port 8888...
echo.
echo  [OK] Products ^& Catalog Manager
echo  [OK] Category Ordering ^& Top 20 Priority Setup
echo  [OK] Daily Sales ^& Profit Manager (DSR)
echo  [OK] Purchasing ^& Wholesale Market Sheet (ZS Traders)
echo  [OK] 1-Click Live Publish to App ^& Web
echo  [OK] 1-Click Android APK Builder
echo.
echo  Opening Dashboard in browser: http://localhost:8888/
echo.
echo ================================================================
echo  DO NOT CLOSE THIS WINDOW WHILE USING THE ADMIN DASHBOARD!
echo ================================================================
echo.

:: Free port 8888 if an old process is hanging
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8888" ^| findstr "LISTENING"') do taskkill /f /pid %%a >nul 2>&1

:: Open Dashboard in default browser
start http://localhost:8888/

node "%~dp0admin_server.js"
pause

