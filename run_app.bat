@echo off
title ADB Otomatik Egitim Izleme Uygulamasi
echo ========================================================
echo   ADB (adbs.uab.gov.tr) OTOMATIK EGITIM IZLEYICI
echo ========================================================
echo.

echo [1/3] Gerekli Python paketleri kontrol ediliyor...
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [HATA] Paket kurulumu basarisiz oldu.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Playwright Chromium tarayici bilesenleri kuruluyor...
python -m playwright install chromium
if %errorlevel% neq 0 (
    echo [HATA] Playwright Chromium kurulumu basarisiz oldu.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Uygulama baslatiliyor...
python app.py
if %errorlevel% neq 0 (
    echo [HATA] Uygulama calisirken bir hata olustu.
    pause
)

pause
