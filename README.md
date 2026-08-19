# ⚓ ADB (adbs.uab.gov.tr) Otomatik Eğitim İzleme Uygulaması

Bu proje, **T.C. Ulaştırma ve Altyapı Bakanlığı Amatör Denizci Eğitim ve Başvuru Sistemi** (`https://adbs.uab.gov.tr/users/my-educations`) üzerindeki online eğitimlerin videolarını sırasıyla izleyen, süreleri dolduğunda veya video bittiğinde otomatik olarak sonraki derse geçen otomasyon sistemidir.

> [!IMPORTANT]
> **Güvenlik & Gizlilik:** Giriş bilgilerinizi (e-Devlet şifresi, T.C. Kimlik vb.) **hiçbir şekilde kaydetmez veya saklamaz**. Giriş işlemi tamamen kullanıcının kendi kontrolünde gerçek tarayıcı penceresinde yapılır.

---

## 🌟 Öne Çıkan Özellikler

- 🚀 **Tam Otomatik İlerleme:** Videolar bitince veya sayaç sıfırlanınca *"Devam Et"*, *"Sonraki Ders"*, *"Eğitimi Tamamla"* butonlarına otomatik tıklar.
- ⚡ **Oynatma Hızı Ayarı:** Videoları `1.0x`, `1.5x`, `2.0x`, `4.0x`, `8.0x` veya `16.0x` hızlarında oynatabilme imkanı.
- 🛡️ **Sekme Odağı Koruması (Anti-Blur):** Başka bir sekmede çalışırken veya pencere küçültüldüğünde platformun videoyu durdurmasını engeller.
- 🔇 **Sessiz Mod:** Videoları arka planda sessiz çalıştırabilir.
- 📱 **Çift Çalışma Seçeneği:**
  1. **Python Masaüstü Uygulaması (Playwright)**
  2. **Tarayıcı Eklentisi / Tampermonkey Userscript**

---

## 🛠️ YÖNTEM 1: Masaüstü Python Uygulaması Kullanımı (Önerilen)

### Adım 1: Kurulum ve Başlatma
1. `run_app.bat` dosyasına çift tıklayın.
2. Gerekli kütüphaneler (`playwright`) ve tarayıcı bileşenleri otomatik yüklenecek ve grafik arayüz açılacaktır.

*(Alternatif olarak komut satırından:)*
```bash
pip install -r requirements.txt
playwright install chromium
python app.py
```

### Adım 2: Çalıştırma
1. Açılan uygulamada **`🚀 1. Tarayıcıyı Aç & Giriş Yap`** butonuna tıklayın.
2. Açılan Chrome penceresinde e-Devlet ile **hesabınıza giriş yapın** ve `/users/my-educations` sayfasına gelin.
3. Giriş yaptıktan sonra uygulamadaki **`▶️ 2. Otomasyonu Başlat`** butonuna tıklayın.
4. Otomasyon arka planda tüm videoları izleyecek ve eğitimleri sırayla tamamlayacaktır!

---

## 🌐 YÖNTEM 2: Chrome Eklentisi Olarak Kullanma

Eğer bilgisayarınıza Python kurmak istemiyorsanız doğrudan tarayıcınıza eklenti olarak yükleyebilirsiniz:

1. Google Chrome veya Microsoft Edge tarayıcınızda `chrome://extensions/` adresine gidin.
2. Sağ üstteki **"Geliştirici modu" (Developer mode)** anahtarını açın.
3. Sol üstteki **"Paketlenmemiş öge yükle" (Load unpacked)** butonuna tıklayın.
4. Bu klasörü (`c:\AI-Codes\ADB-egitim`) seçin.
5. `https://adbs.uab.gov.tr/users/my-educations` adresine gidin ve giriş yapın.
6. Ekranın sağ alt köşesinde beliren **canlı yüzen panelden** otomasyonu ve hızı yönetin.

---

## 📜 YÖNTEM 3: Tampermonkey Betiği (Userscript)

1. Tarayıcınıza [Tampermonkey](https://www.tampermonkey.net/) eklentisini kurun.
2. Klasör içindeki `adb_userscript.user.js` dosyasının içeriğini kopyalayıp Tampermonkey paneline yeni betik olarak ekleyin ve kaydedin.

---

## ❓ Sıkça Sorulan Sorular

- **Videolar donarsa veya durursa ne olur?**
  Otomasyon her 1.5 saniyede bir duraklatılmış videoları kontrol eder ve otomatik oynatmaya devam eder.
- **Başka bir iş yaparken arkada çalışır mı?**
  Evet, Anti-Blur / Sekme Odağı Koruması sayesinde siz başka sekmelerde veya programlarda çalışırken videolar akmaya devam eder.
