/**
 * 响应式设计与浏览器兼容性模块
 * 提供设备检测、响应式布局、浏览器特性检测、兼容性处理等功能
 */

class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536
        };
        this.currentBreakpoint = 'md';
        this.deviceInfo = this._detectDevice();
        this._init();
    }

    _init() {
        this._updateBreakpoint();
        this._setupResizeListener();
        this._setupOrientationListener();
    }

    _detectDevice() {
        const ua = navigator.userAgent;
        
        return {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            isTablet: /iPad|Android(?!.*Mobile)/i.test(ua),
            isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            isTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            isIOS: /iPad|iPhone|iPod/.test(ua),
            isAndroid: /Android/.test(ua),
            isMac: /Mac/.test(ua),
            isWindows: /Windows/.test(ua),
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            pixelRatio: window.devicePixelRatio || 1,
            colorScheme: this._getColorScheme()
        };
    }

    _getColorScheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    _updateBreakpoint() {
        const width = window.innerWidth;
        
        for (const [name, minWidth] of Object.entries(this.breakpoints)) {
            if (width >= minWidth) {
                this.currentBreakpoint = name;
            }
        }
        
        document.documentElement.setAttribute('data-breakpoint', this.currentBreakpoint);
    }

    _setupResizeListener() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this._updateBreakpoint();
                this._dispatchBreakpointChange();
            }, 150);
        });
    }

    _setupOrientationListener() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.deviceInfo = this._detectDevice();
                this._dispatchOrientationChange();
            }, 100);
        });
    }

    _dispatchBreakpointChange() {
        window.dispatchEvent(new CustomEvent('breakpoint-change', {
            detail: {
                breakpoint: this.currentBreakpoint,
                width: window.innerWidth,
                height: window.innerHeight
            }
        }));
    }

    _dispatchOrientationChange() {
        window.dispatchEvent(new CustomEvent('orientation-change', {
            detail: {
                orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
                deviceInfo: this.deviceInfo
            }
        }));
    }

    isBreakpoint(breakpoint) {
        const order = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
        const currentIndex = order.indexOf(this.currentBreakpoint);
        const targetIndex = order.indexOf(breakpoint);
        return currentIndex >= targetIndex;
    }

    isMobile() {
        return this.deviceInfo.isMobile || this.currentBreakpoint === 'xs' || this.currentBreakpoint === 'sm';
    }

    isTablet() {
        return this.deviceInfo.isTablet || (this.currentBreakpoint === 'md' && this.deviceInfo.isTouch);
    }

    isDesktop() {
        return !this.isMobile() && !this.isTablet();
    }

    getOptimalFontSize() {
        const baseSizes = {
            xs: 14,
            sm: 14,
            md: 16,
            lg: 16,
            xl: 18,
            '2xl': 18
        };
        return baseSizes[this.currentBreakpoint] || 16;
    }

    getOptimalTouchTarget() {
        return this.deviceInfo.isTouch ? 44 : 32;
    }

    applyResponsiveClasses(element, classes) {
        Object.entries(classes).forEach(([breakpoint, className]) => {
            if (this.isBreakpoint(breakpoint)) {
                element.classList.add(className);
            } else {
                element.classList.remove(className);
            }
        });
    }
}

class BrowserCompatibility {
    constructor() {
        this.features = this._detectFeatures();
        this.browser = this._detectBrowser();
        this.polyfills = new Set();
        this._applyPolyfills();
    }

    _detectFeatures() {
        return {
            es6Modules: 'noModule' in document.createElement('script'),
            customElements: 'customElements' in window,
            shadowDom: 'attachShadow' in Element.prototype,
            intersectionObserver: 'IntersectionObserver' in window,
            resizeObserver: 'ResizeObserver' in window,
            mutationObserver: 'MutationObserver' in window,
            serviceWorker: 'serviceWorker' in navigator,
            webWorkers: 'Worker' in window,
            indexedDB: 'indexedDB' in window,
            localStorage: this._testLocalStorage(),
            sessionStorage: this._testSessionStorage(),
            fetch: 'fetch' in window,
            promises: 'Promise' in window,
            asyncAwait: this._testAsyncAwait(),
            cssGrid: this._testCSSGrid(),
            cssFlexbox: this._testCSSFlexbox(),
            cssVariables: this._testCSSVariables(),
            webAnimations: 'animate' in document.createElement('div'),
            requestAnimationFrame: 'requestAnimationFrame' in window,
            cancelAnimationFrame: 'cancelAnimationFrame' in window,
            performanceObserver: 'PerformanceObserver' in window,
            webGL: this._testWebGL(),
            webGL2: this._testWebGL2(),
            canvas: !!document.createElement('canvas').getContext,
            audioContext: 'AudioContext' in window || 'webkitAudioContext' in window,
            webRTC: 'RTCPeerConnection' in window,
            geolocation: 'geolocation' in navigator,
            notifications: 'Notification' in window,
            vibration: 'vibrate' in navigator,
            battery: 'getBattery' in navigator,
            clipboard: 'clipboard' in navigator,
            share: 'share' in navigator,
            webShare: 'share' in navigator,
            fullscreen: 'fullscreenEnabled' in document || 'webkitFullscreenEnabled' in document,
            pictureInPicture: 'pictureInPictureEnabled' in document
        };
    }

    _detectBrowser() {
        const ua = navigator.userAgent;
        let browser = 'unknown';
        let version = 0;
        
        if (ua.includes('Firefox/')) {
            browser = 'firefox';
            version = parseInt(ua.split('Firefox/')[1]);
        } else if (ua.includes('Edg/')) {
            browser = 'edge';
            version = parseInt(ua.split('Edg/')[1]);
        } else if (ua.includes('Chrome/')) {
            browser = 'chrome';
            version = parseInt(ua.split('Chrome/')[1]);
        } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
            browser = 'safari';
            version = parseInt(ua.split('Version/')[1]?.split(' ')[0] || 0);
        } else if (ua.includes('MSIE') || ua.includes('Trident/')) {
            browser = 'ie';
            version = parseInt(ua.split('MSIE ')[1] || ua.split('rv:')[1]);
        }
        
        return { name: browser, version, userAgent: ua };
    }

    _testLocalStorage() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    _testSessionStorage() {
        try {
            const test = '__storage_test__';
            sessionStorage.setItem(test, test);
            sessionStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    _testAsyncAwait() {
        try {
            new Function('(async () => {})()');
            return true;
        } catch (e) {
            return false;
        }
    }

    _testCSSGrid() {
        const el = document.createElement('div');
        return 'grid' in el.style;
    }

    _testCSSFlexbox() {
        const el = document.createElement('div');
        return 'flex' in el.style || '-webkit-flex' in el.style;
    }

    _testCSSVariables() {
        const el = document.createElement('div');
        el.style.setProperty('--test', '0');
        return el.style.getPropertyValue('--test') === '0';
    }

    _testWebGL() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }

    _testWebGL2() {
        try {
            const canvas = document.createElement('canvas');
            return !!canvas.getContext('webgl2');
        } catch (e) {
            return false;
        }
    }

    _applyPolyfills() {
        if (!this.features.requestAnimationFrame) {
            this._polyfillRAF();
        }
        
        if (!this.features.performanceObserver) {
            this._polyfillPerformance();
        }
        
        if (!this.features.fetch) {
            this._loadPolyfill('fetch');
        }
        
        if (!this.features.promises) {
            this._loadPolyfill('promise');
        }
    }

    _polyfillRAF() {
        let lastTime = 0;
        window.requestAnimationFrame = (callback) => {
            const currTime = Date.now();
            const timeToCall = Math.max(0, 16 - (currTime - lastTime));
            const id = setTimeout(() => callback(currTime + timeToCall), timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
        window.cancelAnimationFrame = (id) => clearTimeout(id);
        this.polyfills.add('raf');
    }

    _polyfillPerformance() {
        if (!window.performance) {
            window.performance = {
                now: () => Date.now(),
                mark: () => {},
                measure: () => {}
            };
        }
        this.polyfills.add('performance');
    }

    _loadPolyfill(name) {
        const script = document.createElement('script');
        script.src = `https://polyfill.io/v3/polyfill.min.js?features=${name}`;
        script.async = true;
        document.head.appendChild(script);
        this.polyfills.add(name);
    }

    isSupported(feature) {
        return this.features[feature] === true;
    }

    getUnsupportedFeatures() {
        return Object.entries(this.features)
            .filter(([_, supported]) => !supported)
            .map(([name]) => name);
    }

    getBrowserInfo() {
        return this.browser;
    }

    showCompatibilityWarning() {
        const unsupported = this.getUnsupportedFeatures();
        
        if (unsupported.length === 0) return;
        
        const critical = ['localStorage', 'fetch', 'promises'];
        const hasCritical = unsupported.some(f => critical.includes(f));
        
        if (hasCritical) {
            const warning = document.createElement('div');
            warning.className = 'compatibility-warning';
            warning.innerHTML = `
                <div class="warning-content">
                    <h3>⚠️ 浏览器兼容性警告</h3>
                    <p>您的浏览器可能无法正常运行此应用。建议使用最新版本的 Chrome、Firefox、Edge 或 Safari。</p>
                    <p>缺失功能：${unsupported.join(', ')}</p>
                    <button onclick="this.parentElement.parentElement.remove()">关闭</button>
                </div>
            `;
            warning.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #f59e0b;
                color: #000;
                padding: 16px;
                z-index: 99999;
                text-align: center;
            `;
            document.body.insertBefore(warning, document.body.firstChild);
        }
    }
}

class AccessibilityManager {
    constructor() {
        this.preferences = {
            highContrast: false,
            reducedMotion: false,
            fontSize: 'normal',
            screenReader: false
        };
        this._detectPreferences();
        this._setupKeyboardNavigation();
    }

    _detectPreferences() {
        if (window.matchMedia) {
            this.preferences.highContrast = window.matchMedia('(prefers-contrast: high)').matches;
            this.preferences.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }
        
        this._loadSavedPreferences();
        this._applyPreferences();
    }

    _loadSavedPreferences() {
        try {
            const saved = localStorage.getItem('math_accessibility');
            if (saved) {
                this.preferences = { ...this.preferences, ...JSON.parse(saved) };
            }
        } catch (e) {
            // Ignore
        }
    }

    _savePreferences() {
        try {
            localStorage.setItem('math_accessibility', JSON.stringify(this.preferences));
        } catch (e) {
            // Ignore
        }
    }

    _applyPreferences() {
        const root = document.documentElement;
        
        root.classList.toggle('high-contrast', this.preferences.highContrast);
        root.classList.toggle('reduced-motion', this.preferences.reducedMotion);
        
        if (this.preferences.fontSize === 'large') {
            root.style.fontSize = '18px';
        } else if (this.preferences.fontSize === 'xlarge') {
            root.style.fontSize = '20px';
        } else {
            root.style.fontSize = '';
        }
    }

    _setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    setPreference(key, value) {
        if (key in this.preferences) {
            this.preferences[key] = value;
            this._applyPreferences();
            this._savePreferences();
        }
    }

    getPreferences() {
        return { ...this.preferences };
    }

    announce(message) {
        const announcer = document.getElementById('sr-announcer') || this._createAnnouncer();
        announcer.textContent = message;
    }

    _createAnnouncer() {
        const announcer = document.createElement('div');
        announcer.id = 'sr-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(announcer);
        return announcer;
    }
}

const responsiveManager = new ResponsiveManager();
const browserCompatibility = new BrowserCompatibility();
const accessibilityManager = new AccessibilityManager();

export {
    ResponsiveManager,
    BrowserCompatibility,
    AccessibilityManager,
    responsiveManager,
    browserCompatibility,
    accessibilityManager
};
