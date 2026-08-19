// ==UserScript==
// @name         ADB (adbs.uab.gov.tr) Otomatik Eğitim İzleyici
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Ulaştırma ve Altyapı Bakanlığı ADB online eğitimlerini otomatik izler, süre tamamlanınca sonraki derse geçer.
// @author       Antigravity
// @match        https://adbs.uab.gov.tr/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// ==UserScript==

(function () {
    'use strict';

    // --- Durum Yönetimi ---
    const state = {
        active: GM_getValue('adb_active', true),
        speed: GM_getValue('adb_speed', 2.0),
        autoNext: GM_getValue('adb_autoNext', true),
        antiBlur: GM_getValue('adb_antiBlur', true),
        mute: GM_getValue('adb_mute', true),
        logs: [],
        lessonCount: 0,
        currentLesson: '-'
    };

    function saveState() {
        GM_setValue('adb_active', state.active);
        GM_setValue('adb_speed', state.speed);
        GM_setValue('adb_autoNext', state.autoNext);
        GM_setValue('adb_antiBlur', state.antiBlur);
        GM_setValue('adb_mute', state.mute);
    }

    function addLog(msg) {
        const time = new Date().toLocaleTimeString('tr-TR');
        const entry = `[${time}] ${msg}`;
        state.logs.unshift(entry);
        if (state.logs.length > 20) state.logs.pop();
        updateUI();
        console.log(`[ADB Otomasyon] ${msg}`);
    }

    // --- Anti-Blur & Tab Focus Override ---
    function applyAntiBlur() {
        if (!state.antiBlur) return;
        try {
            Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
            
            const originalAddEventListener = window.addEventListener;
            window.addEventListener = function (type, listener, options) {
                if (type === 'visibilitychange' || type === 'blur') {
                    return; // Engelle
                }
                return originalAddEventListener.call(this, type, listener, options);
            };

            window.onblur = null;
            document.onvisibilitychange = null;
        } catch (e) {
            console.warn('[ADB Otomasyon] Anti-blur hatası:', e);
        }
    }

    // --- UI Oluşturma (Glassmorphism Floating Widget) ---
    let uiContainer = null;

    function createUI() {
        if (document.getElementById('adb-auto-widget')) return;

        const css = `
            #adb-auto-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 320px;
                background: rgba(15, 23, 42, 0.92);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(59, 130, 246, 0.2);
                color: #f8fafc;
                font-family: system-ui, -apple-system, sans-serif;
                z-index: 999999;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            .adb-header {
                background: linear-gradient(135deg, #1e3a8a, #0284c7);
                padding: 12px 16px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 700;
                font-size: 14px;
                letter-spacing: 0.5px;
            }
            .adb-header-title {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .adb-status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #22c55e;
                box-shadow: 0 0 10px #22c55e;
                transition: background 0.3s;
            }
            .adb-status-dot.inactive {
                background: #ef4444;
                box-shadow: 0 0 10px #ef4444;
            }
            .adb-minimize-btn {
                background: none;
                border: none;
                color: #fff;
                font-size: 16px;
                cursor: pointer;
                opacity: 0.8;
            }
            .adb-minimize-btn:hover { opacity: 1; }
            .adb-body {
                padding: 14px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                font-size: 13px;
            }
            .adb-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .adb-toggle-btn {
                width: 100%;
                padding: 10px;
                border: none;
                border-radius: 10px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
                background: linear-gradient(135deg, #22c55e, #16a34a);
                color: #fff;
                font-size: 14px;
                box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
            }
            .adb-toggle-btn.stop {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            }
            .adb-select {
                background: #1e293b;
                color: #38bdf8;
                border: 1px solid #334155;
                padding: 4px 8px;
                border-radius: 6px;
                font-weight: 600;
                outline: none;
            }
            .adb-checkbox {
                accent-color: #0284c7;
                width: 16px;
                height: 16px;
                cursor: pointer;
            }
            .adb-logs {
                background: #090d16;
                border: 1px solid #1e293b;
                border-radius: 8px;
                padding: 8px;
                height: 90px;
                overflow-y: auto;
                font-family: monospace;
                font-size: 11px;
                color: #94a3b8;
                display: flex;
                flex-direction: column;
                gap: 4px;
            }
            .adb-log-entry {
                line-height: 1.3;
                word-break: break-word;
            }
            .adb-log-entry:first-child {
                color: #38bdf8;
                font-weight: bold;
            }
        `;

        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);

        uiContainer = document.createElement('div');
        uiContainer.id = 'adb-auto-widget';
        uiContainer.innerHTML = `
            <div class="adb-header">
                <div class="adb-header-title">
                    <div class="adb-status-dot ${state.active ? '' : 'inactive'}" id="adb-dot"></div>
                    <span>ADB Oto-İzleyici</span>
                </div>
                <button class="adb-minimize-btn" id="adb-min-btn">−</button>
            </div>
            <div class="adb-body" id="adb-body">
                <button class="adb-toggle-btn ${state.active ? 'stop' : ''}" id="adb-toggle-active">
                    ${state.active ? '⏸️ Otomasyonu Durdur' : '▶️ Otomasyonu Başlat'}
                </button>
                <div class="adb-row">
                    <span>Oynatma Hızı:</span>
                    <select class="adb-select" id="adb-speed-select">
                        <option value="1.0" ${state.speed == 1.0 ? 'selected' : ''}>1.0x (Normal)</option>
                        <option value="1.5" ${state.speed == 1.5 ? 'selected' : ''}>1.5x</option>
                        <option value="2.0" ${state.speed == 2.0 ? 'selected' : ''}>2.0x (Hızlı)</option>
                        <option value="4.0" ${state.speed == 4.0 ? 'selected' : ''}>4.0x (Çok Hızlı)</option>
                        <option value="8.0" ${state.speed == 8.0 ? 'selected' : ''}>8.0x (Maksimum)</option>
                        <option value="16.0" ${state.speed == 16.0 ? 'selected' : ''}>16.0x (Insta-Finish)</option>
                    </select>
                </div>
                <div class="adb-row">
                    <label for="adb-auto-next-cb">Otomatik Sonraki Ders:</label>
                    <input type="checkbox" class="adb-checkbox" id="adb-auto-next-cb" ${state.autoNext ? 'checked' : ''}>
                </div>
                <div class="adb-row">
                    <label for="adb-anti-blur-cb">Sekme Odak Koruması (Anti-Blur):</label>
                    <input type="checkbox" class="adb-checkbox" id="adb-anti-blur-cb" ${state.antiBlur ? 'checked' : ''}>
                </div>
                <div class="adb-row">
                    <label for="adb-mute-cb">Videoları Sessize Al (Mute):</label>
                    <input type="checkbox" class="adb-checkbox" id="adb-mute-cb" ${state.mute ? 'checked' : ''}>
                </div>
                <div class="adb-logs" id="adb-logs">
                    <div class="adb-log-entry">🤖 Otomasyon hazır. Sayfa taranıyor...</div>
                </div>
            </div>
        `;

        document.body.appendChild(uiContainer);

        // Etkinlik Bağlantıları
        document.getElementById('adb-toggle-active').onclick = () => {
            state.active = !state.active;
            saveState();
            addLog(state.active ? '▶️ Otomasyon başlatıldı.' : '⏸️ Otomasyon durduruldu.');
            updateUI();
        };

        document.getElementById('adb-speed-select').onchange = (e) => {
            state.speed = parseFloat(e.target.value);
            saveState();
            addLog(`⚡ Oynatma hızı ${state.speed}x olarak ayarlandı.`);
        };

        document.getElementById('adb-auto-next-cb').onchange = (e) => {
            state.autoNext = e.target.checked;
            saveState();
            addLog(`Otomatik ders geçişi: ${state.autoNext ? 'Açık' : 'Kapalı'}`);
        };

        document.getElementById('adb-anti-blur-cb').onchange = (e) => {
            state.antiBlur = e.target.checked;
            saveState();
            if (state.antiBlur) applyAntiBlur();
            addLog(`Sekme koruması: ${state.antiBlur ? 'Açık' : 'Kapalı'}`);
        };

        document.getElementById('adb-mute-cb').onchange = (e) => {
            state.mute = e.target.checked;
            saveState();
            addLog(`Sessiz mod: ${state.mute ? 'Açık' : 'Kapalı'}`);
        };

        let minimized = false;
        document.getElementById('adb-min-btn').onclick = () => {
            minimized = !minimized;
            document.getElementById('adb-body').style.display = minimized ? 'none' : 'flex';
            document.getElementById('adb-min-btn').textContent = minimized ? '+' : '−';
        };
    }

    function updateUI() {
        if (!uiContainer) return;
        const dot = document.getElementById('adb-dot');
        const btn = document.getElementById('adb-toggle-active');
        const logsContainer = document.getElementById('adb-logs');

        if (dot) dot.className = `adb-status-dot ${state.active ? '' : 'inactive'}`;
        if (btn) {
            btn.className = `adb-toggle-btn ${state.active ? 'stop' : ''}`;
            btn.textContent = state.active ? '⏸️ Otomasyonu Durdur' : '▶️ Otomasyonu Başlat';
        }

        if (logsContainer) {
            logsContainer.innerHTML = state.logs.map(l => `<div class="adb-log-entry">${l}</div>`).join('');
        }
    }

    // --- Otomasyon Mantığı ---

    // 1. Videoları Yönet
    function handleVideos() {
        if (!state.active) return;

        const videos = document.querySelectorAll('video');
        videos.forEach((video, index) => {
            try {
                if (state.mute) video.muted = true;
                if (video.playbackRate !== state.speed) {
                    video.playbackRate = state.speed;
                }

                if (video.paused && !video.ended) {
                    video.play().then(() => {
                        addLog(`▶️ Video ${index + 1} başlatıldı (${state.speed}x).`);
                    }).catch(err => {
                        // Kullanıcı etkileşimi gerekebilir
                    });
                }

                // Otomatik sonlandırma tetikleyicisi
                if (video.ended && state.autoNext) {
                    addLog(`✅ Video ${index + 1} tamamlandı. Sonraki adım aranıyor...`);
                    triggerNextStep();
                }
            } catch (e) {
                console.error(e);
            }
        });
    }

    // 2. "Devam Et / Sonraki Ders / Eğitimi Tamamla" Butonlarını Algıla ve Tıkla
    let lastClickTime = 0;
    function triggerNextStep() {
        if (!state.active || !state.autoNext) return;
        const now = Date.now();
        if (now - lastClickTime < 3000) return; // Çift tıklamayı engelle (3 sn bekle)

        // Buton Metin Desenleri
        const targetTexts = [
            'ileri', '> ileri', 'ileri >', '>ileri',
            'devam et', 'devam', 'sonraki ders', 'sonraki konu', 
            'sonraki', 'eğitimi tamamla', 'eğitime başla', 
            'tamam', 'ok', 'dersi bitir', 'eğitime devam et'
        ];

        const buttons = Array.from(document.querySelectorAll('button, a, input[type="button"], input[type="submit"], .btn'));

        for (const btn of buttons) {
            if (btn.offsetParent === null) continue; // Gizli öğeleri atla
            if (btn.disabled) continue;

            const text = (btn.innerText || btn.textContent || btn.value || '').trim().toLowerCase();
            
            const matches = targetTexts.some(t => text === t || text.includes(t));
            if (matches) {
                lastClickTime = now;
                addLog(`👉 Butona tıklandı: "${text.toUpperCase()}"`);
                btn.click();
                return true;
            }
        }

        // Angular / Ionic Modal Onay Butonları
        const modalButtons = document.querySelectorAll('.modal button, .swal2-confirm, .ngx-modal button');
        modalButtons.forEach(mBtn => {
            if (!mBtn.disabled && mBtn.offsetParent !== null) {
                lastClickTime = now;
                addLog(`👉 Modal onay butonuna tıklandı: "${mBtn.innerText}"`);
                mBtn.click();
            }
        });

        return false;
    }

    // 3. Kurs Listesi Sayfasında (`/users/my-educations`) Otomatik Kursa Girme
    function checkEducationListPage() {
        if (!state.active) return;
        if (!window.location.href.includes('/my-educations')) return;

        const startBtns = Array.from(document.querySelectorAll('button, a'))
            .filter(el => {
                const txt = (el.innerText || '').toLowerCase();
                return (txt.includes('eğitime başla') || txt.includes('eğitime devam et') || txt.includes('başla')) && el.offsetParent !== null;
            });

        if (startBtns.length > 0) {
            addLog(`📚 Toplam ${startBtns.length} tamamlanmamış eğitim bulundu. İlk eğitime giriliyor...`);
            setTimeout(() => {
                if (state.active) {
                    startBtns[0].click();
                }
            }, 2000);
        }
    }

    // --- Ana Döngü ---
    function init() {
        applyAntiBlur();
        createUI();
        addLog('🚀 ADB Otomasyonu başarıyla yüklendi.');

        // 1.5 saniyede bir tarama döngüsü
        setInterval(() => {
            if (!state.active) return;
            handleVideos();
            triggerNextStep();
            checkEducationListPage();
        }, 1500);
    }

    // Sayfa DOM hazır olduğunda çalıştır
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

})();
