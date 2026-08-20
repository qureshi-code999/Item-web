@echo off
title Sahil Traders - Backup System
color 0B
echo.
echo  ==========================================
echo    SAHIL TRADERS - BACKUP SYSTEM
echo  ==========================================
echo.
echo  Project ka backup ban raha hai...
echo  Kripya intezaar karein...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0backup_project.ps1"
