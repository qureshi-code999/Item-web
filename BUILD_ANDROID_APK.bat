@echo off
title Sahil Traders - 1-Click Android APK Builder
color 0A
cls
echo ================================================================
echo         SAHIL TRADERS - 1-CLICK ANDROID APK BUILDER
echo ================================================================
echo.
echo  [1/3] Syncing latest code and web assets...
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files\Git\cmd
set JAVA_HOME=C:\Users\ALICOM4\.jdks\jbr-21.0.11
set ANDROID_HOME=C:\Users\ALICOM4\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%PATH%

cd /d "%~dp0"
call "C:\Program Files\nodejs\npx.cmd" cap sync android

echo.
echo  [2/3] Compiling Android APK with Gradle...
cd /d "%~dp0android"
call gradlew.bat assembleDebug

echo.
echo  [3/3] Copying APK to Desktop...
if exist "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" (
    copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%USERPROFILE%\Desktop\Sahil_Traders_App.apk" >nul
    copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%~dp0Sahil_Traders_App.apk" >nul
    echo.
    echo ================================================================
    echo    SUCCESS! APK GENERATED AND COPIED TO DESKTOP!
    echo    File: Desktop\Sahil_Traders_App.apk
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo    ERROR: Build did not produce APK. Check log output above.
    echo ================================================================
)

echo.
echo Press any key to close this window...
pause >nul
