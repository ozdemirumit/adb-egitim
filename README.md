# ⚓ ADB (adbs.uab.gov.tr) Otomatik Eğitim İzleme Eklentisi

<p align="center">
  <img src="https://img.shields.io/badge/Chrome_Extension-Manifest_V3-orange.svg" alt="Manifest V3">
  <img src="https://img.shields.io/badge/Security-No_Credentials_Stored-brightgreen.svg" alt="Security">
</p>

T.C. Ulaştırma ve Altyapı Bakanlığı **Amatör Denizci Eğitim ve Başvuru Sistemi** (`https://adbs.uab.gov.tr/users/my-educations`) üzerindeki online eğitim ders videolarını sırasıyla izleyen, süreler dolduğunda ve video bittiğinde otomatik olarak sonraki derse geçen Chrome / Edge tarayıcı eklentisidir.

---

## 🛡️ Güvenlik & Gizlilik İlkesi

> [!IMPORTANT]
> **Kullanıcı Verileri Güvendedir:**
> - Eklenti e-Devlet şifrenizi, T.C. Kimlik numaranızı veya kişisel bilgilerinizi **hiçbir şekilde kaydetmez, saklamaz ve uzak sunuculara göndermez**.
> - Giriş işlemi kullanıcının kendi kontrolünde `adbs.uab.gov.tr` üzerinde manuel olarak yapılır.
> - Kod tamamen açık kaynaklıdır.

---

## ✨ Öne Çıkan Özellikler

- 🚀 **Tam Otomatik İlerleme:** Video bitişlerinde, sayaç sıfırlanmalarında *"Devam Et"*, *"Sonraki Ders"*, *"Eğitimi Tamamla"* ve onay butonlarını otomatik algılar ve tıklar. iframe/frame içindeki butonları da tarar.
- ⏱️ **Rastgele Gecikmeli Tetikleme:** Geri sayım sayacı 00:00'a ulaştığında butona hemen değil, 1-5 saniye arasında rastgele bir gecikmeyle bir kez basar.
- ⚡ **Ayarlanabilir Oynatma Hızı:** Videoları `1.0x`, `1.5x`, `2.0x`, `4.0x`, `8.0x` veya `16.0x` hızlarında oynatabilme.
- 🛡️ **Sekme Odağı Koruması (Anti-Blur):** Başka bir sekmede çalışırken veya pencere küçültüldüğünde platformun videoyu durdurmasını engeller.
- 🔇 **Sessiz Mod (Mute):** Arka planda videoları sessiz olarak çalıştırma imkanı.
- 🖥️ **Canlı Kontrol Paneli:** Sayfa üzerinde açılan yüzen panelden durum, ders, kalan süre ve video ilerlemesi takip edilir.
- 📄 **Word'e Aktarma:** Gezilen ders sayfaları (metin, tablo, görsel) arka planda kursa özel biriktirilir; panelden tek tıkla tüm kurs tek bir `.doc` dosyası olarak indirilebilir. Kursa daha sonra devam edilirse aynı dosyaya eklemeye devam eder.

---

## 📁 Proje Klasör Yapısı

```
ADB-egitim/
├── manifest.json    # Chrome Eklentisi Manifest V3 Yapılandırması
├── content.js       # Chrome Eklentisi Sayfa İçi Otomasyon Betiği
├── popup.html        # Eklenti Açılır Arayüzü
├── popup.js          # Eklenti Açılır Arayüz Betiği
├── .gitignore        # Git dışlama kuralları
└── README.md         # Proje Dökümantasyonu
```

---

## 🚀 Kurulum ve Kullanım

1. Google Chrome veya Microsoft Edge tarayıcınızda `chrome://extensions/` adresine gidin.
2. Sağ üst köşedeki **"Geliştirici modu" (Developer mode)** anahtarını açın.
3. Sol üstteki **"Paketlenmemiş öge yükle" (Load unpacked)** butonuna tıklayın.
4. `adb-egitim` klasörünü seçin.
5. `https://adbs.uab.gov.tr/users/my-educations` adresine gidin ve giriş yapın.
6. Ekranın sağ alt köşesinde beliren **canlı yüzen paneli (Floating UI)** kullanarak otomasyonu başlatın.

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
*C: Hayır. Eklentiye dahil edilen Anti-Blur (Sekme Odak Koruması) sayesinde tarayıcı arka planda olsa bile videolar izlenmeye devam eder.*

**S: Videolar bittiğinde ne olur?**
*C: Otomasyon "Devam Et" veya "Sonraki Ders" butonunu algılayarak bir sonraki modüle veya kursa otomatik geçiş yapar.*

**S: Geri sayım sayacı bitince buton hemen mi tıklanıyor?**
*C: Hayır. Doğal bir kullanım hissi vermesi için 1-5 saniye arasında rastgele bir gecikmeden sonra bir kez tıklanır.*
