@echo off
chcp 65001 > nul
title ADB Otomatik Egitim Izleme Uygulamasi
echo ========================================================
echo   ADB (adbs.uab.gov.tr) OTOMATIK EGITIM IZLEYICI
echo ========================================================
echo.

:: Check python installation
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [HATA] Python bilgisayarınızda bulunamadı!
    echo Lütfen https://www.python.org/ adresinden Python 3.10+ indirin ve 'Add Python to PATH' seçeneğini işaretleyin.
    pause
    exit /b 1
)

echo [1/3] Gerekli Python paketleri kontrol ediliyor...
pip install -r requirements.txt

echo.
echo [2/3] Playwright Chromium tarayıcı bileşenleri kuruluyor...
playwright install chromium

echo.
echo [3/3] Uygulama başlatılıyor...
python app.py

pause
