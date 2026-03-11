/**
 * 异常处理与边界情况模块
 * 提供全局错误捕获、输入验证、边界条件处理等功能
 */

class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this._setupGlobalHandlers();
    }

    _setupGlobalHandlers() {
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack,
                timestamp: new Date().toISOString()
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason?.message || 'Unhandled Promise Rejection',
                stack: event.reason?.stack,
                timestamp: new Date().toISOString()
            });
        });

        window.addEventListener('error', (event) => {
            if (event.target && (event.target.tagName === 'IMG' || event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
                this.handleError({
                    type: 'resource',
                    tagName: event.target.tagName,
                    src: event.target.src || event.target.href,
                    timestamp: new Date().toISOString()
                });
            }
        }, true);
    }

    handleError(error) {
        console.error('[ErrorHandler]', error);
        
        this.errorLog.push(error);
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog.shift();
        }
        
        this._saveErrorLog();
        
        this._notifyUser(error);
    }

    _notifyUser(error) {
        const severity = this._getSeverity(error);
        
        if (severity === 'critical') {
            this._showErrorDialog(error);
        } else if (severity === 'warning') {
            this._showToast(error.message, 'warning');
        }
    }

    _getSeverity(error) {
        if (error.type === 'javascript' && error.message?.includes('script error')) {
            return 'critical';
        }
        if (error.type === 'resource') {
            return 'warning';
        }
        return 'info';
    }

    _showErrorDialog(error) {
        const existing = document.getElementById('error-dialog');
        if (existing) existing.remove();

        const dialog = document.createElement('div');
        dialog.id = 'error-dialog';
        dialog.innerHTML = `
            <div class="error-backdrop"></div>
            <div class="error-content">
                <h3>⚠️ 发生错误</h3>
                <p>${this._sanitizeMessage(error.message)}</p>
                <div class="error-actions">
                    <button onclick="location.reload()">刷新页面</button>
                    <button onclick="this.closest('#error-dialog').remove()">关闭</button>
                </div>
            </div>
        `;
        dialog.style.cssText = `
            position: fixed;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
        `;
        document.body.appendChild(dialog);
    }

    _showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = this._sanitizeMessage(message);
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            background: ${type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            z-index: 99998;
            animation: slideIn 0.3s ease;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    _sanitizeMessage(message) {
        if (typeof message !== 'string') return '未知错误';
        return message.replace(/</g, '&lt;').replace(/>/g, '&gt;').substring(0, 200);
    }

    _saveErrorLog() {
        try {
            sessionStorage.setItem('math_error_log', JSON.stringify(this.errorLog.slice(-20)));
        } catch (e) {
            // Ignore storage errors
        }
    }

    getErrorLog() {
        return [...this.errorLog];
    }

    clearErrorLog() {
        this.errorLog = [];
        sessionStorage.removeItem('math_error_log');
    }
}

class InputValidator {
    constructor() {
        this.rules = new Map();
        this._setupDefaultRules();
    }

    _setupDefaultRules() {
        this.addRule('required', (value) => ({
            valid: value !== null && value !== undefined && value !== '',
            message: '此字段为必填项'
        }));

        this.addRule('number', (value) => ({
            valid: !isNaN(parseFloat(value)) && isFinite(value),
            message: '请输入有效的数字'
        }));

        this.addRule('positiveNumber', (value) => ({
            valid: this.rules.get('number').fn(value).valid && parseFloat(value) > 0,
            message: '请输入正数'
        }));

        this.addRule('integer', (value) => ({
            valid: Number.isInteger(Number(value)),
            message: '请输入整数'
        }));

        this.addRule('range', (value, min, max) => ({
            valid: !isNaN(value) && value >= min && value <= max,
            message: `请输入 ${min} 到 ${max} 之间的值`
        }));

        this.addRule('maxLength', (value, max) => ({
            valid: String(value).length <= max,
            message: `长度不能超过 ${max} 个字符`
        }));

        this.addRule('minLength', (value, min) => ({
            valid: String(value).length >= min,
            message: `长度不能少于 ${min} 个字符`
        }));

        this.addRule('pattern', (value, pattern) => ({
            valid: pattern.test(value),
            message: '格式不正确'
        }));

        this.addRule('answer', (value, correctAnswer, tolerance = 0.001) => {
            if (typeof correctAnswer === 'number') {
                const numValue = parseFloat(value);
                return {
                    valid: !isNaN(numValue) && Math.abs(numValue - correctAnswer) < tolerance,
                    message: '答案不正确'
                };
            }
            return {
                valid: String(value).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase(),
                message: '答案不正确'
            };
        });
    }

    addRule(name, fn) {
        this.rules.set(name, { name, fn });
    }

    validate(value, rules) {
        const results = [];
        
        for (const rule of rules) {
            const ruleName = typeof rule === 'string' ? rule : rule.name;
            const ruleParams = typeof rule === 'object' ? rule.params : [];
            const ruleDef = this.rules.get(ruleName);
            
            if (ruleDef) {
                const result = ruleDef.fn(value, ...ruleParams);
                results.push({
                    rule: ruleName,
                    valid: result.valid,
                    message: result.message
                });
            }
        }
        
        return {
            valid: results.every(r => r.valid),
            results
        };
    }

    sanitize(value, type = 'text') {
        if (value === null || value === undefined) return '';
        
        switch (type) {
            case 'text':
                return String(value).trim();
            case 'number':
                return parseFloat(value) || 0;
            case 'integer':
                return parseInt(value, 10) || 0;
            case 'html':
                return this._escapeHtml(String(value));
            case 'alphanumeric':
                return String(value).replace(/[^a-zA-Z0-9]/g, '');
            default:
                return String(value);
        }
    }

    _escapeHtml(str) {
        const htmlEntities = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        };
        return str.replace(/[&<>"']/g, char => htmlEntities[char]);
    }
}

class BoundaryHandler {
    constructor() {
        this.thresholds = {
            maxArraySize: 10000,
            maxStringLength: 1000000,
            maxObjectDepth: 10,
            maxIterations: 1000000,
            maxMemoryMB: 100
        };
    }

    checkArraySize(array) {
        if (!Array.isArray(array)) return { valid: true };
        return {
            valid: array.length <= this.thresholds.maxArraySize,
            size: array.length,
            maxSize: this.thresholds.maxArraySize
        };
    }

    checkStringLength(str) {
        if (typeof str !== 'string') return { valid: true };
        return {
            valid: str.length <= this.thresholds.maxStringLength,
            length: str.length,
            maxLength: this.thresholds.maxStringLength
        };
    }

    safeLoop(iterations, callback) {
        const maxIter = Math.min(iterations, this.thresholds.maxIterations);
        const results = [];
        
        for (let i = 0; i < maxIter; i++) {
            try {
                results.push(callback(i));
            } catch (e) {
                console.warn(`Iteration ${i} failed:`, e);
                break;
            }
        }
        
        return results;
    }

    safeRecursion(fn, maxDepth = this.thresholds.maxObjectDepth) {
        let currentDepth = 0;
        
        const wrapped = (...args) => {
            if (currentDepth >= maxDepth) {
                throw new Error(`Maximum recursion depth (${maxDepth}) exceeded`);
            }
            currentDepth++;
            try {
                return fn(...args);
            } finally {
                currentDepth--;
            }
        };
        
        return wrapped;
    }

    debounceWithBound(func, wait, options = {}) {
        let timeout;
        let lastCallTime = 0;
        const maxWait = options.maxWait || wait * 10;
        
        return function executedFunction(...args) {
            const now = Date.now();
            
            if (now - lastCallTime > maxWait) {
                lastCallTime = now;
                func.apply(this, args);
                return;
            }
            
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                lastCallTime = Date.now();
                func.apply(this, args);
            }, wait);
        };
    }

    throttleWithBound(func, limit, options = {}) {
        let inThrottle;
        let lastFunc;
        let lastRan;
        const maxBurst = options.maxBurst || 3;
        let burstCount = 0;
        
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                lastRan = Date.now();
                burstCount++;
                
                if (burstCount >= maxBurst) {
                    inThrottle = true;
                    burstCount = 0;
                    setTimeout(() => {
                        inThrottle = false;
                    }, limit);
                }
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if (Date.now() - lastRan >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }

    safeDivide(numerator, denominator, fallback = 0) {
        if (denominator === 0 || !isFinite(denominator) || !isFinite(numerator)) {
            return fallback;
        }
        return numerator / denominator;
    }

    safePercentage(value, total, decimals = 1) {
        if (total === 0) return '0.0';
        const percentage = this.safeDivide(value, total) * 100;
        return Math.min(100, Math.max(0, percentage)).toFixed(decimals);
    }

    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    safeArrayAccess(array, index, fallback = null) {
        if (!Array.isArray(array) || index < 0 || index >= array.length) {
            return fallback;
        }
        return array[index];
    }

    safeObjectAccess(obj, path, fallback = null) {
        if (!obj || typeof path !== 'string') return fallback;
        
        const keys = path.split('.');
        let current = obj;
        
        for (const key of keys) {
            if (current === null || current === undefined || typeof current !== 'object') {
                return fallback;
            }
            current = current[key];
        }
        
        return current !== undefined ? current : fallback;
    }
}

class RecoveryManager {
    constructor() {
        this.checkpoints = new Map();
        this.maxCheckpoints = 10;
    }

    saveCheckpoint(id, state) {
        this.checkpoints.set(id, {
            state: JSON.parse(JSON.stringify(state)),
            timestamp: Date.now()
        });
        
        if (this.checkpoints.size > this.maxCheckpoints) {
            const oldestKey = [...this.checkpoints.keys()][0];
            this.checkpoints.delete(oldestKey);
        }
    }

    restoreCheckpoint(id) {
        const checkpoint = this.checkpoints.get(id);
        if (checkpoint) {
            return JSON.parse(JSON.stringify(checkpoint.state));
        }
        return null;
    }

    hasCheckpoint(id) {
        return this.checkpoints.has(id);
    }

    clearCheckpoint(id) {
        this.checkpoints.delete(id);
    }

    clearAllCheckpoints() {
        this.checkpoints.clear();
    }

    getCheckpointInfo() {
        return [...this.checkpoints.entries()].map(([id, data]) => ({
            id,
            timestamp: data.timestamp,
            age: Date.now() - data.timestamp
        }));
    }
}

const errorHandler = new ErrorHandler();
const inputValidator = new InputValidator();
const boundaryHandler = new BoundaryHandler();
const recoveryManager = new RecoveryManager();

export {
    ErrorHandler,
    InputValidator,
    BoundaryHandler,
    RecoveryManager,
    errorHandler,
    inputValidator,
    boundaryHandler,
    recoveryManager
};
