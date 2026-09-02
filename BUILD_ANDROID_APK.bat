@echo off
title Sahil Traders - 1-Click Android APK Builder
color 0A
cls
echo ================================================================
echo         SAHIL TRADERS - 1-CLICK ANDROID APK BUILDER
echo ================================================================
echo.
echo  [1/4] Compiling React JSX and syncing assets...
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files\Git\cmd
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\ALICOM4\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%PATH%

cd /d "%~dp0"
call "C:\Program Files\nodejs\node.exe" compile_jsx.js

echo.
echo  [2/4] Syncing Capacitor to Android...
call "C:\Program Files\nodejs\npx.cmd" cap sync android

echo.
echo  [3/4] Compiling Android APK with Gradle...
cd /d "%~dp0android"
call gradlew.bat assembleDebug

echo.
echo  [4/4] Copying APK to Desktop...
if exist "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" (
    copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%USERPROFILE%\Desktop\ZS_Groceries_App.apk" >nul
    copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%USERPROFILE%\Desktop\ZS_Traders_App.apk" >nul
    copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%USERPROFILE%\Desktop\Sahil_Traders_App.apk" >nul
    echo.
    echo ================================================================
    echo    SUCCESS! FRESH APK GENERATED AND COPIED TO DESKTOP!
    echo    File: Desktop\ZS_Groceries_App.apk
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
