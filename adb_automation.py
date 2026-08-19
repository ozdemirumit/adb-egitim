import time
import threading
import logging
from typing import Callable, Optional
from playwright.sync_api import sync_playwright, Page, BrowserContext, Browser

# Anti-blur JS payload to override visibilityState and blur events
ANTI_BLUR_SCRIPT = """
Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);
window.addEventListener('blur', (e) => e.stopImmediatePropagation(), true);
window.onblur = null;
document.onvisibilitychange = null;
"""

class ADBAutomationEngine:
    """ADB Online Eğitim Otomasyon Motoru (Playwright Tabanlı)"""

    def __init__(self, log_callback: Optional[Callable[[str], None]] = None, status_callback: Optional[Callable[[str], None]] = None):
        self.log_callback = log_callback or print
        self.status_callback = status_callback or (lambda s: None)
        
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None
        self.page: Optional[Page] = None
        
        self.is_running = False
        self.is_paused = False
        self.playback_speed = 2.0
        self.auto_next = True
        self.mute_audio = True
        self.thread: Optional[threading.Thread] = None

    def log(self, message: str):
        self.log_callback(message)

    def set_status(self, status: str):
        self.status_callback(status)

    def launch_browser(self):
        """Kullanıcının giriş yapabilmesi için gerçek tarayıcı penceresini açar."""
        try:
            self.log("🚀 Tarayıcı başlatılıyor (Chromium)...")
            self.playwright = sync_playwright().start()
            self.browser = self.playwright.chromium.launch(
                headless=False,
                args=[
                    "--start-maximized",
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox"
                ]
            )
            self.context = self.browser.new_context(no_viewport=True)
            self.page = self.context.new_page()

            # Anti-blur injection
            self.page.add_init_script(ANTI_BLUR_SCRIPT)

            self.log("🌐 https://adbs.uab.gov.tr/ adresine gidiliyor...")
            self.page.goto("https://adbs.uab.gov.tr/users/my-educations", wait_until="domcontentloaded")
            self.set_status("Giriş Bekleniyor")
            self.log("🔑 Lütfen açılan pencerede e-Devlet ile giriş yapınız. Giriş yaptıktan sonra 'Otomasyonu Başlat' butonuna tıklayınız.")
        except Exception as e:
            self.log(f"❌ Tarayıcı başlatma hatası: {str(e)}")
            self.stop()

    def start_automation_loop(self):
        """Otomasyon döngüsünü arka planda başlatır."""
        if not self.page:
            self.log("⚠️ Önce tarayıcıyı başlatmalısınız!")
            return
        
        self.is_running = True
        self.is_paused = False
        self.thread = threading.Thread(target=self._run_loop, daemon=True)
        self.thread.start()
        self.log("▶️ Otomasyon döngüsü başlatıldı.")
        self.set_status("Çalışıyor")

    def pause(self):
        self.is_paused = True
        self.log("⏸️ Otomasyon duraklatıldı.")
        self.set_status("Duraklatıldı")

    def resume(self):
        self.is_paused = False
        self.log("▶️ Otomasyon devam ettiriliyor.")
        self.set_status("Çalışıyor")

    def stop(self):
        self.is_running = False
        self.log("🛑 Otomasyon durduruluyor...")
        try:
            if self.browser:
                self.browser.close()
            if self.playwright:
                self.playwright.stop()
        except Exception as e:
            pass
        self.set_status("Durduruldu")
        self.log("✅ Tarayıcı kapatıldı.")

    def _run_loop(self):
        """Ana otomasyon döngüsü."""
        last_click_time = 0

        while self.is_running:
            try:
                if self.is_paused or not self.page:
                    time.sleep(1)
                    continue

                # 1. Anti-blur kontrolü yap
                try:
                    self.page.evaluate(ANTI_BLUR_SCRIPT)
                except Exception:
                    pass

                # 2. Videoları denetle ve oynat
                try:
                    video_count = self.page.locator("video").count()
                    if video_count > 0:
                        for i in range(video_count):
                            video = self.page.locator("video").nth(i)
                            
                            # Mute & speed set
                            if self.mute_audio:
                                self.page.evaluate("(v) => { v.muted = true; }", video.element_handle())
                            
                            self.page.evaluate(f"(v) => {{ v.playbackRate = {self.playback_speed}; }}", video.element_handle())

                            # Play if paused
                            is_paused = self.page.evaluate("(v) => v.paused && !v.ended", video.element_handle())
                            if is_paused:
                                self.page.evaluate("(v) => v.play()", video.element_handle())
                                self.log(f"▶️ Video {i+1} oynatılıyor ({self.playback_speed}x hızında).")

                            # Check if ended
                            is_ended = self.page.evaluate("(v) => v.ended", video.element_handle())
                            if is_ended and self.auto_next:
                                self.log(f"✅ Video {i+1} tamamlandı. Sonraki adıma geçiliyor...")
                                self._trigger_next_button()
                except Exception as e:
                    pass

                # 3. Devam Et / Sonraki Ders / Eğitimi Tamamla Butonlarını Tara
                now = time.time()
                if self.auto_next and (now - last_click_time > 3.0):
                    clicked = self._trigger_next_button()
                    if clicked:
                        last_click_time = now

                # 4. Kurs listesi sayfasında ise otomatik derse gir
                if "my-educations" in self.page.url:
                    self._check_education_list()

            except Exception as e:
                # Sayfa kapanmış olabilir veya gezinme durumunda
                time.sleep(1)

            time.sleep(1.5)

    def _trigger_next_button() -> bool:
        """Ekranda aktif olan devam/sonraki ders butonlarını bulur ve tıklar."""
        if not self.page:
            return False

        target_texts = [
            'devam et', 'devam', 'sonraki ders', 'sonraki konu', 
            'sonraki', 'eğitimi tamamla', 'eğitime başla', 
            'tamam', 'ok', 'ileri', 'dersi bitir', 'eğitime devam et'
        ]

        try:
            buttons = self.page.locator("button, a, input[type='button'], input[type='submit'], .btn").all()
            for btn in buttons:
                if not btn.is_visible() or not btn.is_enabled():
                    continue

                text = (btn.inner_text() or btn.get_attribute("value") or "").strip().lower()
                if any(t == text or t in text for t in target_texts):
                    self.log(f"👉 Otomatik tıklama yapılıyor: '{text.upper()}'")
                    btn.click()
                    return True

            # Modal dialog button check
            modals = self.page.locator(".modal button, .swal2-confirm, .ngx-modal button").all()
            for mbtn in modals:
                if mbtn.is_visible() and mbtn.is_enabled():
                    self.log(f"👉 Modal onay butonuna tıklandı: '{mbtn.inner_text()}'")
                    mbtn.click()
                    return True
        except Exception:
            pass

        return False

    def _check_education_list(self):
        """Kayıtlı eğitimler listesinde başlanmamış/tamamlanmamış eğitime tıklar."""
        try:
            btns = self.page.locator("button, a").all()
            for btn in btns:
                if not btn.is_visible():
                    continue
                txt = (btn.inner_text() or "").strip().lower()
                if "eğitime başla" in txt or "eğitime devam et" in txt:
                    self.log(f"📚 Bulunan eğitime başlanıyor: '{txt}'")
                    btn.click()
                    time.sleep(2)
                    break
        except Exception:
            pass
