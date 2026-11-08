@echo off
title ZS Mart - 1-Click Android APK Builder
color 0A
cls
echo ================================================================
echo         ZS MART - 1-CLICK ANDROID APK BUILDER
echo ================================================================
echo.
echo  [1/4] Compiling React JSX and syncing assets...
set PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files\Git\cmd
if exist "%USERPROFILE%\.jdks\jbr-21.0.11\bin\java.exe" (
    set "JAVA_HOME=%USERPROFILE%\.jdks\jbr-21.0.11"
) else (
    set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
)
set ANDROID_HOME=C:\Users\ALICOM4\AppData\Local\Android\Sdk
set "PATH=%JAVA_HOME%\bin;%PATH%"

cd /d "%~dp0"
call "C:\Program Files\nodejs\node.exe" compile_jsx.js

del /f /q /s "%~dp0www\*.bak" 2>nul
del /f /q "%~dp0www\*.apk" 2>nul
del /f /q /s "%~dp0android\app\src\main\assets\public\*.bak" 2>nul
del /f /q "%~dp0android\app\src\main\assets\public\*.apk" 2>nul

echo.
echo  [2/4] Syncing Capacitor to Android...
call "C:\Program Files\nodejs\npx.cmd" cap sync android

del /f /q /s "%~dp0www\*.bak" 2>nul
del /f /q "%~dp0www\*.apk" 2>nul
del /f /q /s "%~dp0android\app\src\main\assets\public\*.bak" 2>nul
del /f /q "%~dp0android\app\src\main\assets\public\*.apk" 2>nul
del /f /q /s "%~dp0android\app\build\intermediates\assets\debug\*.bak" 2>nul

echo.
echo  [3/4] Compiling Android APK with Gradle...
cd /d "%~dp0android"
call gradlew.bat assembleDebug

echo.
echo  [4/4] Copying APK to Desktop...
if exist "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" (
    if not exist "%USERPROFILE%\Desktop\new apk complete" mkdir "%USERPROFILE%\Desktop\new apk complete"
    if not exist "%~dp0complete" mkdir "%~dp0complete"
    if not exist "%~dp0apk" mkdir "%~dp0apk"
    copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%~dp0ZS_Mart_App.apk" >nul
    copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%~dp0complete\ZS_Mart_Debug.apk" >nul
    copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%~dp0apk\ZS_Mart_Debug.apk" >nul
    copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%USERPROFILE%\Desktop\ZS_Mart_App.apk" >nul
    copy /y "%~dp0android\app\build\outputs\apk\debug\app-debug.apk" "%USERPROFILE%\Desktop\new apk complete\ZS_Mart_Debug.apk" >nul
    copy /y "%~dp0products.json" "%USERPROFILE%\Desktop\new apk complete\products.json" >nul
    echo.
    echo ================================================================
    echo    SUCCESS! FRESH APK GENERATED AND COPIED!
    echo    Desktop: Desktop\ZS_Mart_App.apk
    echo    Complete Folder: Desktop\new apk complete\ZS_Mart_Debug.apk
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo    ERROR: Build did not produce APK. Check log output above.
    echo ================================================================
)

if not "%NONINTERACTIVE%"=="1" if not "%CI%"=="1" (
    echo.
    echo Press any key to close this window...
    pause >nul
)
