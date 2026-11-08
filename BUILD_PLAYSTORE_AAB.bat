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
del /f /q /s "%~dp0android\app\src\main\assets\public\*.bak" 2>nul

echo.
echo  [2/4] Syncing Capacitor to Android...
call "C:\Program Files\nodejs\npx.cmd" cap sync android

del /f /q /s "%~dp0www\*.bak" 2>nul
del /f /q /s "%~dp0android\app\src\main\assets\public\*.bak" 2>nul
del /f /q /s "%~dp0android\app\build\intermediates\assets\release\*.bak" 2>nul

echo.
echo  [3/4] Compiling Signed Android App Bundle (AAB) and Release APK with Gradle...
cd /d "%~dp0android"
call gradlew.bat bundleRelease assembleRelease

echo.
echo  [4/4] Copying Play Store Bundle and Release APK to Desktop...
if exist "%~dp0android\app\build\outputs\bundle\release\app-release.aab" (
    if not exist "%USERPROFILE%\Desktop\new apk complete" mkdir "%USERPROFILE%\Desktop\new apk complete"
    if not exist "%~dp0complete" mkdir "%~dp0complete"
    if not exist "%~dp0apk" mkdir "%~dp0apk"
    copy /y "%~dp0android\app\build\outputs\bundle\release\app-release.aab" "%~dp0ZS_Mart_PlayStore_Release.aab" >nul
    copy /y "%~dp0android\app\build\outputs\bundle\release\app-release.aab" "%~dp0complete\ZS_Mart_PlayStore_Release.aab" >nul
    copy /y "%~dp0android\app\build\outputs\bundle\release\app-release.aab" "%~dp0apk\ZS_Mart_PlayStore_Release.aab" >nul
    copy /y "%~dp0android\app\build\outputs\bundle\release\app-release.aab" "%USERPROFILE%\Desktop\ZS_Mart_PlayStore_Release.aab" >nul
    copy /y "%~dp0android\app\build\outputs\bundle\release\app-release.aab" "%USERPROFILE%\Desktop\new apk complete\ZS_Mart_PlayStore_Release.aab" >nul
    if exist "%~dp0android\app\build\outputs\apk\release\app-release.apk" (
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%~dp0ZS_Mart_Release.apk" >nul
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%~dp0ZS_Mart_Release_Signed.apk" >nul
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%~dp0ZS_Mart_App.apk" >nul
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%~dp0complete\ZS_Mart_Release.apk" >nul
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%~dp0complete\ZS_Mart_Release_Signed.apk" >nul
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%~dp0complete\ZS_Mart_App.apk" >nul
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%~dp0apk\ZS_Mart_Release.apk" >nul
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%~dp0apk\ZS_Mart_Release_Signed.apk" >nul
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%~dp0apk\ZS_Mart_App.apk" >nul
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%USERPROFILE%\Desktop\new apk complete\ZS_Mart_Release.apk" >nul
        copy /y "%~dp0android\app\build\outputs\apk\release\app-release.apk" "%USERPROFILE%\Desktop\ZS_Mart_Release_Signed.apk" >nul
    )
    copy /y "%~dp0products.json" "%USERPROFILE%\Desktop\new apk complete\products.json" >nul
    copy /y "%~dp0products.json" "%~dp0complete\products.json" >nul
    copy /y "%~dp0privacy-policy.html" "%~dp0complete\privacy-policy.html" >nul
    echo.
    echo ================================================================
    echo    SUCCESS! SIGNED RELEASE AAB AND APK GENERATED!
    echo    Play Store: Desktop\new apk complete\ZS_Mart_PlayStore_Release.aab
    echo    Phone APK:  Desktop\new apk complete\ZS_Mart_Release.apk
    echo    Keystore:   android\app\release-key.keystore [Alias: zsmart]
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo    ERROR: Bundle build failed. Check Gradle log output above.
    echo ================================================================
)

if not "%NONINTERACTIVE%"=="1" if not "%CI%"=="1" (
    echo.
    echo Press any key to close this window...
    pause >nul
)
