// MAIN world içinde çalışır (bkz. manifest.json) - sayfanın CSP script-src kısıtlaması bu betiği etkilemez.
(function () {
    try {
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        window.onblur = null;
        document.onvisibilitychange = null;
    } catch (e) {
        console.warn('[ADB Extension] Anti-blur override error:', e);
    }
})();
