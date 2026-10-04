@echo off
title ZS Mart - Official Android Release Keystore Generator
color 0A
cls
echo ================================================================
echo      ZS MART - OFFICIAL ANDROID RELEASE KEYSTORE GENERATOR
echo ================================================================
echo.
echo  This tool creates a standard RSA 2048-bit release keystore
echo  required by Google Play Store to sign and upload your App Bundle/APK.
echo.
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=%JAVA_HOME%\bin;%PATH%

set KEYSTORE_PATH=%~dp0android\app\release-key.keystore

if exist "%KEYSTORE_PATH%" (
    echo  [!] Keystore already exists at:
    echo      %KEYSTORE_PATH%
    echo.
    echo  DO NOT OVERWRITE AN EXISTING KEYSTORE IF YOU HAVE ALREADY
    echo  PUBLISHED TO GOOGLE PLAY STORE!
    echo.
    set /p CONFIRM="Are you sure you want to regenerate it? (y/N): "
    if /i not "%CONFIRM%"=="y" (
        echo Cancelled. Keeping existing keystore.
        pause
        exit /b 0
    )
)

echo.
echo  Generating keystore... Please wait...
echo.

keytool -genkeypair -v ^
  -keystore "%KEYSTORE_PATH%" ^
  -alias zsmart ^
  -keyalg RSA ^
  -keysize 2048 ^
  -validity 10000 ^
  -storepass zsmart2026 ^
  -keypass zsmart2026 ^
  -dname "CN=ZS Mart, OU=Mobile, O=ZS Mart, L=Karachi, ST=Sindh, C=PK"

if %ERRORLEVEL% equ 0 (
    echo.
    echo ================================================================
    echo    SUCCESS! OFFICIAL RELEASE KEYSTORE GENERATED!
    echo    File: %KEYSTORE_PATH%
    echo    Alias: zsmart
    echo    Validity: 10,000 days (approx. 27 years)
    echo ================================================================
    echo.
    echo  Keep a safe backup of this keystore! If lost, you will not
    echo  be able to update your app on Google Play Store.
) else (
    echo.
    echo  [ERROR] Keystore generation failed. Ensure Android Studio JBR is installed.
)

echo.
pause
