# ⚓ ADB (adbs.uab.gov.tr) Otomatik Eğitim İzleme Uygulaması

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue.svg" alt="Python 3.10+">
  <img src="https://img.shields.io/badge/Playwright-Automated-green.svg" alt="Playwright">
  <img src="https://img.shields.io/badge/Chrome_Extension-Manifest_V3-orange.svg" alt="Manifest V3">
  <img src="https://img.shields.io/badge/Security-No_Credentials_Stored-brightgreen.svg" alt="Security">
</p>

T.C. Ulaştırma ve Altyapı Bakanlığı **Amatör Denizci Eğitim ve Başvuru Sistemi** (`https://adbs.uab.gov.tr/users/my-educations`) üzerindeki online eğitim ders videolarını sırasıyla izleyen, süreler dolduğunda ve video bittiğinde otomatik olarak sonraki derse geçen masaüstü otomasyon uygulaması ve tarayıcı eklentisidir.

---

## 🛡️ Güvenlik & Gizlilik İlkesi

> [!IMPORTANT]
> **Kullanıcı Verileri Güvendedir:**
> - Uygulama e-Devlet şifrenizi, T.C. Kimlik numaranızı veya kişisel bilgilerinizi **hiçbir şekilde kaydetmez, saklamaz ve uzak sunuculara göndermez**.
> - Giriş işlemi kullanıcının kendi kontrolünde açılan resmi tarayıcı penceresinde (`adbs.uab.gov.tr`) manuel olarak yapılır.
> - Otomasyon kodu tamamen açık kaynaklıdır.

---

## ✨ Öne Çıkan Özellikler

- 🚀 **Tam Otomatik İlerleme:** Video bitişlerinde, sayaç sıfırlanmalarında *"Devam Et"*, *"Sonraki Ders"*, *"Eğitimi Tamamla"* ve onay butonlarını otomatik algılar ve tıklar.
- ⚡ **Ayarlanabilir Oynatma Hızı:** Videoları `1.0x`, `1.5x`, `2.0x`, `4.0x`, `8.0x` veya `16.0x` hızlarında oynatabilme.
- 🛡️ **Sekme Odağı Koruması (Anti-Blur):** Başka bir sekmede çalışırken veya pencere küçültüldüğünde platformun videoyu durdurmasını engeller.
- 🔇 **Sessiz Mod (Mute):** Arka planda videoları sessiz olarak çalıştırma imkanı.
- 🖥️ **Çift Çalışma Seçeneği:**
  1. **Python Playwright Masaüstü Uygulaması (GUI)**
  2. **Chrome / Edge Tarayıcı Eklentisi (Unpacked Extension)**
  3. **Tampermonkey / Violentmonkey Kullanıcı Betiği**

---

## 📁 Proje Klasör Yapısı

```
ADB-egitim/
├── app.py                   # Custom Tkinter Masaüstü Grafik Arayüzü (GUI)
├── adb_automation.py        # Playwright Otomasyon ve Video Takip Motoru
├── run_app.bat              # Tek tıkla bağımlılıkları kurup başlatan Windows scripti
├── requirements.txt         # Python bağımlılık listesi
├── manifest.json            # Chrome Eklentisi Manifest V3 Yapılandırması
├── content.js               # Chrome Eklentisi Sayfa İçi Otomasyon Betiği
├── popup.html / popup.js    # Chrome Eklentisi Açılır Arayüzü
├── adb_userscript.user.js   # Tampermonkey / Violentmonkey Betiği
├── .gitignore               # Git dışlama kuralları
└── README.md                # Proje Dökümantasyonu
```

---

## 🚀 Kurulum ve Kullanım

### Yöntem 1: Masaüstü Python Uygulaması (Önerilen)

#### Hızlı Başlatma:
1. `run_app.bat` dosyasına **çift tıklayın**.
2. Gerekli kütüphaneler ve Playwright Chromium tarayıcısı otomatik kontrol edilip uygulama başlatılacaktır.

#### Komut Satırından Başlatma:
```bash
# 1. Depoyu klonlayın
git clone https://github.com/ozdemirumit/adb-egitim.git
cd adb-egitim

# 2. Paketleri ve tarayıcı bileşenini kurun
python -m pip install -r requirements.txt
python -m playwright install chromium

# 3. Uygulamayı başlatın
python app.py
```

#### Kullanım Adımları:
1. Açılan uygulamada **`🚀 1. Tarayıcıyı Aç & Giriş Yap`** butonuna tıklayın.
2. Açılan Chrome penceresinde e-Devlet ile **hesabınıza giriş yapın** ve `/users/my-educations` sayfasına gelin.
3. Giriş yaptıktan sonra uygulamadaki **`▶️ 2. Otomasyonu Başlat`** butonuna tıklayın.
4. Otomasyon arka planda tüm videoları izleyecek ve eğitimleri sırayla tamamlayacaktır.

---

### Yöntem 2: Chrome / Edge Eklentisi Olarak Kullanma

1. Google Chrome veya Microsoft Edge tarayıcınızda `chrome://extensions/` adresine gidin.
2. Sağ üst köşedeki **"Geliştirici modu" (Developer mode)** anahtarını açın.
3. Sol üstteki **"Paketlenmemiş öge yükle" (Load unpacked)** butonuna tıklayın.
4. `adb-egitim` klasörünü seçin.
5. `https://adbs.uab.gov.tr/users/my-educations` adresine gidin ve giriş yapın.
6. Ekranın sağ alt köşesinde beliren **canlı yüzen paneli (Floating UI)** kullanarak otomasyonu başlatın.

---

### Yöntem 3: Tampermonkey Betiği (Userscript)

1. Tarayıcınıza [Tampermonkey](https://www.tampermonkey.net/) eklentisini kurun.
2. Projedeki `adb_userscript.user.js` dosyasının içeriğini kopyalayıp Tampermonkey paneline yeni betik olarak yapıştırın ve kaydedin.

---

## 🔗 GitHub Depo Bilgileri

- **Repository URL:** [https://github.com/ozdemirumit/adb-egitim](https://github.com/ozdemirumit/adb-egitim)
- **Klonlama Komutu:**
  ```bash
  git clone https://github.com/ozdemirumit/adb-egitim.git
  ```

---

## ❓ Sıkça Sorulan Sorular (SSS)

**S: Şifrem veya T.C. Kimlik numaram kaydediliyor mu?**  
*C: Hayır. Giriş işlemleri resmi e-Devlet kapısı üzerinden tamamen kullanıcının kendi kontrolünde yapılır.*

**S: Sekmeyi değiştirdiğimde veya tarayıcıyı alta aldığımda videolar duruyor mu?**  
*C: Hayır. Uygulamaya dahil edilen Anti-Blur (Sekme Odak Koruması) sayesinde tarayıcı arka planda olsa bile videolar izlenmeye devam eder.*

**S: Videolar bittiğinde ne olur?**  
*C: Otomasyon "Devam Et" veya "Sonraki Ders" butonunu algılayarak bir sonraki modüle veya kursa otomatik geçiş yapar.*
