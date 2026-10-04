@echo off
title ZS Mart - Official Play Store AAB Bundle Builder
color 0A
cls
echo ================================================================
echo       ZS MART - OFFICIAL PLAY STORE RELEASE AAB BUILDER
echo ================================================================
echo.
echo  [1/4] Compiling React JSX and syncing assets...
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files\Git\cmd
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\ALICOM4\AppData\Local\Android\Sdk
set PATH=%JAVA_HOME%\bin;%PATH%

cd /d "%~dp0"
call "C:\Program Files\nodejs\node.exe" compile_jsx.js

del /f /q /s "%~dp0www\*.bak" 2>nul
del /f /q /s "%~dp0android\app\src\main\assets\public\*.bak" 2>nul

echo.
echo  [2/4] Syncing Capacitor to Android...
call "C:\Program Files\nodejs\npx.cmd" cap sync android

del /f /q /s "%~dp0www\*.bak" 2>nul
del /f /q /s "%~dp0android\app\src\main\assets\public\*.bak" 2>nul
del /f /q /s "%~dp0android\app\build\intermediates\assets\release\*.bak" 2>nul

echo.
echo  [3/4] Compiling Signed Android App Bundle (AAB) with Gradle...
cd /d "%~dp0android"
call gradlew.bat bundleRelease

echo.
echo  [4/4] Copying Play Store Bundle (.aab) to Desktop...
if exist "%~dp0android\app\build\outputs\bundle\release\app-release.aab" (
    copy /y "%~dp0android\app\build\outputs\bundle\release\app-release.aab" "%USERPROFILE%\Desktop\ZS_Mart_PlayStore_Release.aab" >nul
    echo.
    echo ================================================================
    echo    SUCCESS! SIGNED RELEASE AAB GENERATED AND READY FOR PLAY STORE!
    echo    File: Desktop\ZS_Mart_PlayStore_Release.aab
    echo    Keystore: android\app\release-key.keystore (Alias: zsmart)
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo    ERROR: Bundle build failed. Check Gradle log output above.
    echo ================================================================
)

echo.
echo Press any key to close this window...
pause >nul
