// ADB Otomatik Eğitim İzleyici - Chrome Extension Content Script

(function () {
    'use strict';

    const state = {
        active: true,
        speed: 1.0,
        autoNext: true,
        antiBlur: true,
        mute: true,
        logs: []
    };

    // Load initial settings
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['adb_active', 'adb_speed', 'adb_autoNext', 'adb_antiBlur', 'adb_mute'], (res) => {
            if (res.adb_active !== undefined) state.active = res.adb_active;
            if (res.adb_speed !== undefined) state.speed = res.adb_speed;
            if (res.adb_autoNext !== undefined) state.autoNext = res.adb_autoNext;
            if (res.adb_antiBlur !== undefined) state.antiBlur = res.adb_antiBlur;
            if (res.adb_mute !== undefined) state.mute = res.adb_mute;
            updateUI();
        });
    }

    function saveState() {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({
                adb_active: state.active,
                adb_speed: state.speed,
                adb_autoNext: state.autoNext,
                adb_antiBlur: state.antiBlur,
                adb_mute: state.mute
            });
        }
    }

    function addLog(msg) {
        const time = new Date().toLocaleTimeString('tr-TR');
        const entry = `[${time}] ${msg}`;
        state.logs.unshift(entry);
        if (state.logs.length > 20) state.logs.pop();
        updateUI();
        console.log(`[ADB Extension] ${msg}`);
    }

    // Anti-blur override artık antiblur.js (MAIN world content script, bkz. manifest.json) tarafından
    // sayfa CSP'sinden etkilenmeden uygulanıyor.

    let uiContainer = null;

    function createUI() {
        if (document.getElementById('adb-auto-widget')) return;

        const css = `
            #adb-auto-widget {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 320px;
                background: rgba(15, 23, 42, 0.94);
                backdrop-filter: blur(14px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(59, 130, 246, 0.25);
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
            }
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
            .adb-log-entry { line-height: 1.3; }
            .adb-log-entry:first-child { color: #38bdf8; font-weight: bold; }
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
                    <span>ADB Oto-İzleyici (Eklenti)</span>
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
                        <option value="1.0" ${state.speed == 1.0 ? 'selected' : ''}>1.0x</option>
                        <option value="1.5" ${state.speed == 1.5 ? 'selected' : ''}>1.5x</option>
                        <option value="2.0" ${state.speed == 2.0 ? 'selected' : ''}>2.0x</option>
                        <option value="4.0" ${state.speed == 4.0 ? 'selected' : ''}>4.0x</option>
                        <option value="8.0" ${state.speed == 8.0 ? 'selected' : ''}>8.0x</option>
                        <option value="16.0" ${state.speed == 16.0 ? 'selected' : ''}>16.0x</option>
                    </select>
                </div>
                <div class="adb-row">
                    <label for="adb-auto-next-cb">Otomatik Sonraki Ders:</label>
                    <input type="checkbox" class="adb-checkbox" id="adb-auto-next-cb" ${state.autoNext ? 'checked' : ''}>
                </div>
                <div class="adb-row">
                    <label for="adb-anti-blur-cb">Sekme Odak Koruması:</label>
                    <input type="checkbox" class="adb-checkbox" id="adb-anti-blur-cb" ${state.antiBlur ? 'checked' : ''}>
                </div>
                <div class="adb-row">
                    <label for="adb-mute-cb">Videoları Sessize Al:</label>
                    <input type="checkbox" class="adb-checkbox" id="adb-mute-cb" ${state.mute ? 'checked' : ''}>
                </div>
                <div class="adb-logs" id="adb-logs">
                    <div class="adb-log-entry">🤖 Eklenti hazır. Sayfa taranıyor...</div>
                </div>
            </div>
        `;

        document.body.appendChild(uiContainer);

        document.getElementById('adb-toggle-active').onclick = () => {
            state.active = !state.active;
            saveState();
            addLog(state.active ? '▶️ Otomasyon başlatıldı.' : '⏸️ Otomasyon durduruldu.');
            updateUI();
        };

        document.getElementById('adb-speed-select').onchange = (e) => {
            state.speed = parseFloat(e.target.value);
            saveState();
            addLog(`⚡ Oynatma hızı ${state.speed}x yapıldı.`);
        };

        document.getElementById('adb-auto-next-cb').onchange = (e) => {
            state.autoNext = e.target.checked;
            saveState();
        };

        document.getElementById('adb-anti-blur-cb').onchange = (e) => {
            state.antiBlur = e.target.checked;
            saveState();
        };

        document.getElementById('adb-mute-cb').onchange = (e) => {
            state.mute = e.target.checked;
            saveState();
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
                        addLog(`▶️ Video ${index + 1} oynatılıyor (${state.speed}x).`);
                    }).catch(() => {});
                }

                if (video.ended && state.autoNext) {
                    addLog(`✅ Video ${index + 1} bitti.`);
                    triggerNextStep();
                }
            } catch (e) {}
        });
    }

    function normalizeText(str) {
        if (!str) return '';
        return str
            .replace(/İ/g, 'i')
            .replace(/I/g, 'ı')
            .replace(/Ğ/g, 'g')
            .replace(/Ü/g, 'u')
            .replace(/Ş/g, 's')
            .replace(/Ö/g, 'o')
            .replace(/Ç/g, 'c')
            .toLowerCase()
            .replace(/[>><«»]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function isElementVisible(el) {
        if (!el) return false;
        try {
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
            const rect = el.getBoundingClientRect();
            return rect.width > 0 || rect.height > 0 || el.getClientRects().length > 0;
        } catch (e) {
            return false;
        }
    }

    function isElementDisabled(el) {
        if (!el) return true;
        try {
            if (el.disabled || el.getAttribute('disabled') !== null) return true;
            if (el.getAttribute('aria-disabled') === 'true') return true;
            if (el.classList.contains('disabled') || el.classList.contains('is-disabled')) return true;
            const style = window.getComputedStyle(el);
            if (style.pointerEvents === 'none') return true;
        } catch (e) {}
        return false;
    }

    function clickElement(el, force = false) {
        if (!el) return;
        if (force) {
            try {
                el.removeAttribute('disabled');
                el.classList.remove('disabled', 'is-disabled', 'btn-disabled');
                el.setAttribute('aria-disabled', 'false');
                el.style.pointerEvents = 'auto';
            } catch (e) {}
        }

        if (el.tagName === 'A' && el.href && el.href.startsWith('javascript:')) {
            try {
                eval(el.href.replace('javascript:', ''));
            } catch(e) {}
        }

        const events = ['pointerdown', 'mousedown', 'mouseup', 'click'];
        events.forEach(evtName => {
            try {
                const event = new MouseEvent(evtName, {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                el.dispatchEvent(event);
            } catch (e) {}
        });

        if (typeof el.click === 'function') {
            try { el.click(); } catch (e) {}
        }
    }

    let lastClickTime = 0;
    let zeroTriggerScheduled = false;
    let activeCountdownUntil = 0; // trackLiveStatus() tarafından güncellenir: sayaç 00:00 değilken dolu olan zaman damgası

    function triggerNextStep(force = false) {
        if (!state.active || !state.autoNext) return false;
        const now = Date.now();
        if (!force && now < activeCountdownUntil) return false; // Sayfada aktif geri sayım varken deneme yapma
        const minDelay = force ? 300 : 1500;
        if (now - lastClickTime < minDelay) return false;

        const targetKeywords = [
            'ileri', '> ileri', 'ileri >', '>ileri', 'ileri>',
            'devam et', 'devam', 'sonraki ders', 'sonraki konu', 
            'sonraki', 'eğitimi tamamla', 'eğitime başla', 
            'tamam', 'ok', 'dersi bitir', 'eğitime devam et',
            'next', 'forward', 'continue', 'finish'
        ];

        const primarySelectors = 'button, a, input[type="button"], input[type="submit"], input[type="image"], [role="button"], [onclick], .btn, .button, .next, .btn-next, .next-btn, [class*="next"], [class*="forward"], [class*="ileri"], [id*="next"], [id*="ileri"], ion-button, mat-button, [data-action="next"], .paginate_next, .step-next';

        const docs = [document];
        try {
            document.querySelectorAll('iframe, frame').forEach(iframe => {
                try {
                    const iDoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
                    if (iDoc) docs.push(iDoc);
                } catch (e) {}
            });
        } catch (e) {}

        for (const doc of docs) {
            let primaryElements = [];
            try {
                primaryElements = Array.from(doc.querySelectorAll(primarySelectors));
            } catch (e) {}

            let secondaryElements = [];
            try {
                secondaryElements = Array.from(doc.querySelectorAll('span, div, p, li, td, a, button'));
            } catch (e) {}

            const allElements = Array.from(new Set([...primaryElements, ...secondaryElements]));

            for (const el of allElements) {
                if (!isElementVisible(el)) continue;

                const rawText = (el.innerText || el.textContent || el.value || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim();
                if (!rawText || rawText.length > 60) continue; // Container skip

                const normText = normalizeText(rawText);
                const rawLower = rawText.toLowerCase().replace(/\s+/g, ' ');

                const classOrId = ((el.className || '') + ' ' + (el.id || '')).toLowerCase();
                const textMatch = targetKeywords.some(kw => normText === kw || normText.includes(kw) || rawLower.includes(kw));
                const classMatch = (classOrId.includes('next') || classOrId.includes('ileri') || classOrId.includes('forward')) && !classOrId.includes('previous') && !classOrId.includes('prev') && !classOrId.includes('geri');

                if (textMatch || classMatch) {
                    const clickableEl = el.closest('button, a, [role="button"], [onclick], .btn') || el;
                    if (isElementDisabled(clickableEl) && !force) continue; // Süre dolmadan kilitli butonu atla

                    lastClickTime = now;
                    addLog(`👉 Butona tıklandı: "${rawText.toUpperCase() || 'İLERİ'}"`);
                    clickElement(clickableEl, force);
                    return true;
                }
            }

            // Modal onay butonları
            const modalButtons = doc.querySelectorAll('.modal button, .swal2-confirm, .ngx-modal button, [class*="swal2-confirm"]');
            for (const mBtn of modalButtons) {
                if (isElementVisible(mBtn) && (force || !isElementDisabled(mBtn))) {
                    lastClickTime = now;
                    addLog(`👉 Modal onay butonuna tıklandı: "${mBtn.innerText || 'ONAY'}"`);
                    clickElement(mBtn, force);
                    return true;
                }
            }
        }

        return false;
    }

    function scheduleZeroTrigger() {
        if (zeroTriggerScheduled) return;
        zeroTriggerScheduled = true;
        const delay = 1000 + Math.floor(Math.random() * 4000); // 1-5 sn arası rastgele gecikme
        addLog(`⏱️ Süre doldu. ${(delay / 1000).toFixed(1)} sn sonra İleri butonuna basılacak...`);
        setTimeout(() => {
            if (state.active && state.autoNext) triggerNextStep(true);
            zeroTriggerScheduled = false;
        }, delay);
    }

    function checkZeroTimer() {
        if (!state.active || !state.autoNext) return false;
        if (zeroTriggerScheduled) return false;
        try {
            const docs = [document];
            document.querySelectorAll('iframe, frame').forEach(iframe => {
                try {
                    const iDoc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
                    if (iDoc) docs.push(iDoc);
                } catch (e) {}
            });

            for (const doc of docs) {
                const txt = (doc.body ? doc.body.innerText : '').toLowerCase();
                if (/00\s*:\s*00|0\s*:\s*00|00\s*:\s*00\s*:\s*00|0\s*sn|0\s*saniye|süre\s*bitti|süreniz\s*doldu/i.test(txt)) {
                    scheduleZeroTrigger();
                    return true;
                }
            }
        } catch (e) {}
        return false;
    }

    function checkEducationListPage() {
        if (!state.active || !window.location.href.includes('/my-educations')) return;

        const startBtns = Array.from(document.querySelectorAll('button, a, [role="button"], .btn'))
            .filter(el => {
                if (!isElementVisible(el)) return false;
                const txt = normalizeText(el.innerText || el.textContent || '');
                return txt.includes('basla') || txt.includes('başla') || txt.includes('devam');
            });

        if (startBtns.length > 0) {
            addLog(`📚 ${startBtns.length} ders bulundu. Eğitime başlanıyor...`);
            setTimeout(() => {
                if (state.active) clickElement(startBtns[0]);
            }, 2000);
        }
    }

    let lastTimerLoggedStr = '';
    let lastTimerLoggedTime = 0;

    function trackLiveStatus() {
        if (!state.active) return;
        const now = Date.now();

        // 1. Ders Başlığı Tespiti
        try {
            const headingEl = document.querySelector('h1, h2, h3, .card-header, .lesson-title, header, .breadcrumb');
            if (headingEl && headingEl.innerText) {
                const title = headingEl.innerText.trim().replace(/\s+/g, ' ');
                if (title && title.length < 80 && state.currentLesson !== title) {
                    state.currentLesson = title;
                    addLog(`📖 Ders: "${title}"`);
                    zeroTriggerScheduled = false;
                }
            }
        } catch(e) {}

        // 2. Kalan Zaman / Sayaç Tespiti
        try {
            const pageText = document.body ? document.body.innerText : '';
            const matches = pageText.match(/(?:kalan zaman|kalan süre|süre|sayaç)?\s*:?\s*(\d{1,2}:\d{2})/i);
            if (matches && matches[1]) {
                const timerStr = matches[1];
                if (timerStr !== '00:00') {
                    activeCountdownUntil = now + 2000; // Sayaç görülmeye devam ettikçe pencereyi tazele
                    if (timerStr !== lastTimerLoggedStr || (now - lastTimerLoggedTime > 4000)) {
                        lastTimerLoggedStr = timerStr;
                        lastTimerLoggedTime = now;
                        addLog(`⏳ Kalan Zaman: ${timerStr}`);
                    }
                }
            }
        } catch(e) {}

        // 3. Video Oynatma İlerleme Tespiti
        try {
            const videos = document.querySelectorAll('video');
            videos.forEach((v, idx) => {
                if (v.duration > 0 && !v.paused && !v.ended) {
                    if (!v._lastLoggedTime || (now - v._lastLoggedTime > 5000)) {
                        v._lastLoggedTime = now;
                        const cur = formatSec(v.currentTime);
                        const dur = formatSec(v.duration);
                        const pct = Math.floor((v.currentTime / v.duration) * 100);
                        addLog(`▶️ Video ${idx + 1}: ${cur} / ${dur} (%${pct}) [${state.speed}x]`);
                    }
                }
            });
        } catch(e) {}
    }

    function formatSec(seconds) {
        if (!seconds || isNaN(seconds)) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }

    function init() {
        createUI();
        setInterval(() => {
            if (!state.active) return;
            handleVideos();
            trackLiveStatus();
            checkZeroTimer();
            triggerNextStep();
            checkEducationListPage();
        }, 800);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
