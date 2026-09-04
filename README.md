# ⚓ ADB Otomatik Eğitim İzleme Eklentisi

Amatör Denizci Eğitim ve Başvuru Sistemi (`adbs.uab.gov.tr`) üzerindeki eğitim videolarını oynatmak, ders geçişlerini otomatikleştirmek ve gezilen ders içeriklerini Word belgesine aktarmak için Chrome / Microsoft Edge eklentisi.

## Kullanım koşulları ve sorumluluk bildirimi

Bu proje bağımsız olarak geliştirilmiştir.

**Eklenti, eğitimleri izleme, metinleri okuma, içerikleri inceleme ve öğrenme sorumluluğunuzu ortadan kaldırmaz.** Otomatik oynatma veya ders geçişi, konunun öğrenildiği ya da gerekli yeterliliğin kazanıldığı anlamına gelmez. Denizcilik ve güvenlikle ilgili bilgilerin anlaşılması ve doğru uygulanması kullanıcının sorumluluğundadır.

Kullanıcı, eklentiyi kullanmadan önce eğitim platformunun güncel kullanım koşullarını ve ilgili kuralları kontrol etmelidir. Kullanıma izin verilmiyorsa eklenti kullanılmamalıdır.

Yazılım mevcut hâliyle sunulur. Kesintisiz veya hatasız çalışma ve eğitim ilerlemesinin doğru kaydedilmesi konusunda garanti verilmez.

Kullanıcı, eklentiyi kendi tercihiyle ve kullanım risklerini değerlendirerek kullanır. Hatalı ders geçişi, ilerleme veya veri kaybı, hesap kısıtlaması ve platform kurallarına aykırılık gibi olası sonuçları dikkate almalı; işlemleri ve eğitim kayıtlarını kendisi kontrol etmelidir.

**Yürürlükteki hukukun izin verdiği ölçüde**, geliştiriciler ve katkıda bulunanlar, yazılımın kullanımından veya kullanılamamasından doğan zararlardan sorumlu tutulamaz. Bu bildirim, hukuken sınırlandırılması veya kaldırılması mümkün olmayan sorumlulukları ortadan kaldırmaz.

[**⬇️ ZIP olarak indir**](https://github.com/ozdemirumit/adb-egitim/archive/refs/heads/main.zip) · [Kurulum](#kurulum) · [Kullanım](#kullanım) · [Sorun giderme](#sorun-giderme)

## Gerekenler

- Bilgisayarınızda Google Chrome veya Microsoft Edge.
- Eğitimlere erişmek için ADB sistemine kendi hesabınızla giriş yapabilmeniz.
- İndirilen dosyaları saklayacağınız bir klasör.

**Kodlama bilgisi, Node.js, Python, terminal komutu veya derleme gerekmez.** Dosyalar doğrudan tarayıcıya yüklenir. Git yalnızca aşağıdaki alternatif indirme yöntemi için gereklidir.

## Kurulum

### 1. Dosyaları indirin ve ZIP'ten çıkarın

1. [**Eklentiyi ZIP olarak indirmek için tıklayın**](https://github.com/ozdemirumit/adb-egitim/archive/refs/heads/main.zip). Bu bağlantı `main` dalının güncel dosyalarını indirir.
2. İnen `adb-egitim-main.zip` dosyasına Windows'ta sağ tıklayıp **Tümünü ayıkla…** seçeneğini kullanın. macOS'ta ZIP dosyasına çift tıklayın.
3. Çıkan klasörü kalıcı bir konuma taşıyın; örneğin Belgeler klasörünüzün içine.
4. Klasörü açın ve içinde **`manifest.json`** dosyasını gördüğünüzden emin olun. İç içe iki `adb-egitim-main` klasörü oluştuysa `manifest.json` bulunan iç klasörü kullanın.

İndirme bağlantısına alternatif olarak [GitHub depo sayfasında](https://github.com/ozdemirumit/adb-egitim) **Code → Download ZIP** seçeneğini kullanabilirsiniz.

> Tarayıcıya ZIP dosyasını değil, ZIP'ten çıkardığınız ve doğrudan `manifest.json` içeren klasörü yükleyeceksiniz. Kurulumdan sonra bu klasörü silmeyin veya taşımayın; tarayıcı dosyaları buradan okur.

### 2. Eklentiyi tarayıcıya yükleyin

1. Kullandığınız tarayıcının adres çubuğuna aşağıdaki adresi kopyalayın ve Enter'a basın:

   | Tarayıcı | Adres |
   | --- | --- |
   | Google Chrome | `chrome://extensions/` |
   | Microsoft Edge | `edge://extensions/` |

2. **Geliştirici modu** (Developer mode) anahtarını açın ve açık bırakın.
3. **Paketlenmemiş öğe yükle** (Load unpacked) düğmesine tıklayın. Düğmenin Türkçe adı tarayıcıya göre biraz değişebilir.
4. Bir önceki adımda hazırladığınız, **`manifest.json` dosyasını içeren klasörü** seçin.
5. Eklentiler listesinde **ADB (adbs.uab.gov.tr) Otomatik Eğitim İzleyici** kartının göründüğünü ve etkin olduğunu kontrol edin.

Tarayıcıdaki yerel eklenti yükleme adımları için: [Chrome rehberi](https://support.google.com/chrome/a/answer/2714278?hl=en), [Edge rehberi](https://learn.microsoft.com/en-us/microsoft-edge/extensions/getting-started/extension-sideloading).

### Alternatif: Git ile indirme

Git bilgisayarınızda zaten kuruluysa, terminalde dosyaları saklamak istediğiniz konumda çalıştırın:

```bash
git clone https://github.com/ozdemirumit/adb-egitim.git
```

Ardından yukarıdaki **Eklentiyi tarayıcıya yükleyin** adımlarını uygulayın ve oluşan `adb-egitim` klasörünü seçin. Ek paket kurulumu veya çalıştırma komutu yoktur.

## Kullanım

1. [ADB eğitimlerim sayfasını açın](https://adbs.uab.gov.tr/users/my-educations) ve kendi hesabınızla giriş yapın. Eklenti simgesindeki **ADB Portalını Aç** düğmesi de bu adresi açar.
2. İzlemek istediğiniz eğitimi ve ders sayfasını açın. Sayfa kurulumdan önce açıksa yenileyin.
   İlk kullanımda paneldeki sorumluluk bilgilendirmesini okuyun. **Bilgilendirmeyi okudum** düğmesi bildirimi kapatır; bu tercih aynı tarayıcı profilinde hatırlanır. Tam metne eklenti simgesinin açılır penceresinden her zaman ulaşabilirsiniz.
3. Sayfadaki yüzen panelde **Otomasyonu Başlat** düğmesine basın. İlk kurulumda otomasyon kapalıdır; sonraki açılışlarda önceki durum hatırlanır.
4. Panelden oynatma hızını, sessiz modu ve otomatik geçiş ayarını değiştirebilirsiniz. Ses duymak istiyorsanız ilk kullanımda açık olan sessiz modu kapatın.
5. Ara vermek için **Otomasyonu Durdur** düğmesine basın. Paneli başlığından sürükleyebilirsiniz; konumu hatırlanır.
6. Gezilen dersler biriktikçe **Word'e Aktar** düğmesiyle o kursun kaydedilmiş sayfalarını `.doc` olarak indirin. Henüz ziyaret edilmeyen dersler belgeye eklenmez; videolar oynatılabilir video yerine yakalanabilen bir kare ve kaynak bağlantısıyla temsil edilir.

Ders geçişleri sitenin butonlarına ve sayaçlarına bağlıdır. Site değişiklikleri, oturumun sona ermesi veya tarayıcının arka plan kısıtlamaları otomasyonu etkileyebilir; ilerlemeyi panelden kontrol edin.

## Özellikler

- Video bitişi ve sayaç durumuna göre devam / sonraki ders butonlarını algılama; çerçeve içindeki butonları da tarama.
- Sayaç sıfırlandığında tıklamadan önce 1–5 saniye rastgele bekleme.
- `1.0x`, `1.5x`, `2.0x`, `4.0x`, `8.0x`, `16.0x` oynatma hızı seçenekleri.
- Sekme odağı nedeniyle duraklatmayı önlemeye yönelik Anti-Blur desteği ve sessiz mod.
- Sürüklenebilir durum paneli ve tamamlanan kurs algılandığında otomatik durma.
- Gezilen ders metinlerini, tablolarını ve görsellerini kurs bazında saklayıp Word'e aktarma.

## Güncelleme

**ZIP ile kurduysanız:** Otomasyonu durdurun, güncel ZIP'i tekrar indirip ayıklayın. Yeni dosyaları mevcut eklenti klasörünüzde aynı adlı dosyaların üzerine kopyalayın. `manifest.json` aynı klasörde kalmalı; yeni klasörü eskisinin içine eklemeyin.

**Git ile kurduysanız:** Terminalde klonladığınız `adb-egitim` klasöründe çalıştırın:

```bash
git pull --ff-only
```

Git yerel değişiklik veya dal ayrışması nedeniyle durursa dosyalarınızı silmeden uyarıyı inceleyin.

**Her iki yöntemde de:** Tarayıcının eklentiler sayfasında ADB kartındaki **Yeniden yükle** (dairesel ok) düğmesine basın, ardından açık ADB ders sayfalarını yenileyin. ZIP ve Git ile kurulan bu kopyayı güncellemek için bu adımları tekrarlayın.

## Sorun giderme

| Sorun | Ne yapmalıyım? |
| --- | --- |
| “Manifest dosyası bulunamadı” / yükleme hatası | ZIP'i ayıklayın ve doğrudan `manifest.json` içeren klasörü seçin. Üst klasörü veya tek bir dosyayı seçmeyin. |
| “Paketlenmemiş öğe yükle” görünmüyor | Doğru eklentiler adresini açtığınızı ve Geliştirici modunun açık olduğunu kontrol edin. |
| Panel görünmüyor | Eklentinin etkin olduğunu ve `https://adbs.uab.gov.tr/` üzerinde olduğunuzu kontrol edin; sayfayı yenileyin. |
| Güncellemeden sonra eklenti çalışmıyor | Önce eklenti kartındaki yeniden yükleme düğmesine basın, sonra ders sekmesini yenileyin. |
| Video sessiz / ders ilerlemiyor | Panelde sessiz mod, otomasyon ve otomatik geçiş ayarlarını kontrol edin. Girişinizin açık olduğundan emin olun; gerekirse videoyu elle başlatın. |
| Word'e aktarma düğmesi pasif | Bir ders açıp içeriğin yüklenmesini bekleyin. Panelde kaydedilen sayfa sayısını ve hata mesajlarını kontrol edin. |
| Yönetilen tarayıcıda yükleme engelleniyor | Eklenti yükleme izni için tarayıcı yöneticinize başvurun. |

Sorun sürerse [GitHub Issues](https://github.com/ozdemirumit/adb-egitim/issues) üzerinden tarayıcı adını, yaptığınız adımı ve hata metnini paylaşabilirsiniz. Ekran görüntülerindeki kişisel bilgileri gizleyin.

## Gizlilik ve yerel kayıtlar

- Giriş işlemini eğitim platformunda kendiniz yaparsınız; eklentide şifre isteyen ayrı bir giriş ekranı yoktur.
- Ayarlar, panel konumu ve Word'e aktarmak için yakalanan ders içerikleri tarayıcınızın `chrome.storage.local` alanında saklanır. Bu nedenle eklenti “hiç veri saklamaz” şeklinde değerlendirilmemelidir.
- Kodda ayrı bir veri toplama sunucusuna gönderim bulunmaz. Belgeye görsel eklemek için sayfadaki görsellerin adreslerine indirme istekleri yapılabilir.
- Eklentiyi kaldırmadan önce saklamak istediğiniz dersleri Word'e aktarın; kaldırma işlemi eklentinin yerel kayıtlarını da temizler.

## Proje dosyaları

```text
adb-egitim/
├── manifest.json   # Eklenti tanımı, izinler ve çalışacağı site
├── antiblur.js     # Sayfa odağı davranışına müdahale
├── content.js      # Otomasyon, yüzen panel ve Word'e aktarma
├── popup.html      # Eklenti simgesinin açılır penceresi
├── popup.js        # ADB portalını açan düğme
├── .gitignore
└── README.md       # Bu rehber
```
