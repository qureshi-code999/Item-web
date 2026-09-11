@echo off
title ZS Mart - Daily Sales (DSR) & Profit Manager
color 0B
cls
echo.
echo  ======================================================
echo     ZS MART - DAILY SALES (DSR) ^& PROFIT MANAGER
echo  ======================================================
echo.
echo  Daily Sales Server start ho raha hai...
echo  Browser khul raha hai: http://localhost:8889/
echo.
echo  [IS WINDOW KO BAND MAT KAREIN]
echo  [Jab tak ye window khuli hai, portal chalta rahega]
echo.
echo  ======================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0dsr_server.ps1"
echo.
echo Server band ho gaya.
pause
