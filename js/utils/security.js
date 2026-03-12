/**
 * 安全工具模块
 * 提供 XSS 防护、输入验证、安全渲染等功能
 */

const HTML_ENTITIES = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};

const DANGEROUS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:\s*text\/html/gi,
    /vbscript:/gi,
    /expression\s*\(/gi
];

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    if (typeof str !== 'string') {
        str = String(str);
    }
    return str.replace(/[&<>"'`=\/]/g, char => HTML_ENTITIES[char] || char);
}

function escapeAttribute(str) {
    if (str === null || str === undefined) return '';
    str = String(str);
    return str
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function sanitizeHtml(html, options = {}) {
    if (typeof html !== 'string') return '';
    
    const allowedTags = options.allowedTags || ['b', 'i', 'u', 'strong', 'em', 'span', 'br', 'p'];
    const allowedAttrs = options.allowedAttrs || ['class', 'style'];
    
    let sanitized = html;
    
    DANGEROUS_PATTERNS.forEach(pattern => {
        sanitized = sanitized.replace(pattern, '');
    });
    
    sanitized = sanitized.replace(/<(\w+)([^>]*)>/g, (match, tagName, attrs) => {
        if (!allowedTags.includes(tagName.toLowerCase())) {
            return '';
        }
        
        const safeAttrs = attrs.replace(/(\w+)\s*=\s*["']([^"']*)["']/g, (m, attrName, attrValue) => {
            if (!allowedAttrs.includes(attrName.toLowerCase())) {
                return '';
            }
            if (DANGEROUS_PATTERNS.some(p => p.test(attrValue))) {
                return '';
            }
            return `${attrName}="${escapeAttribute(attrValue)}"`;
        });
        
        return `<${tagName}${safeAttrs}>`;
    });
    
    return sanitized;
}

function safeTemplate(template, data = {}) {
    return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (match, path) => {
        const value = getNestedValue(data, path);
        if (value === undefined || value === null) return '';
        return escapeHtml(String(value));
    });
}

function getNestedValue(obj, path) {
    const keys = path.split('.');
    let current = obj;
    for (const key of keys) {
        if (current === null || current === undefined || typeof current !== 'object') {
            return undefined;
        }
        current = current[key];
    }
    return current;
}

function safeSetInnerHTML(element, content, options = {}) {
    if (!element) return false;
    
    try {
        if (options.trusted === true) {
            element.innerHTML = content;
        } else if (options.sanitize === true) {
            element.innerHTML = sanitizeHtml(content, options);
        } else {
            element.textContent = content;
        }
        return true;
    } catch (error) {
        console.error('safeSetInnerHTML error:', error);
        return false;
    }
}

function safeSetTextContent(element, content) {
    if (!element) return false;
    
    try {
        element.textContent = content === null || content === undefined ? '' : String(content);
        return true;
    } catch (error) {
        console.error('safeSetTextContent error:', error);
        return false;
    }
}

function createElement(tag, attrs = {}, children = null) {
    const element = document.createElement(tag);
    
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset' && typeof value === 'object') {
            Object.entries(value).forEach(([k, v]) => {
                element.dataset[k] = String(v);
            });
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else if (key === 'innerHTML') {
            console.warn('Use safeSetInnerHTML instead of innerHTML in createElement');
        } else {
            element.setAttribute(key, escapeAttribute(String(value)));
        }
    });
    
    if (children !== null) {
        if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Node) {
                    element.appendChild(child);
                }
            });
        } else if (typeof children === 'string') {
            element.textContent = children;
        } else if (children instanceof Node) {
            element.appendChild(children);
        }
    }
    
    return element;
}

function validateInput(value, rules = {}) {
    const result = { valid: true, errors: [] };
    
    if (rules.required && (value === null || value === undefined || value === '')) {
        result.valid = false;
        result.errors.push('此字段为必填项');
        return result;
    }
    
    if (value === null || value === undefined) return result;
    
    const strValue = String(value);
    
    if (rules.minLength !== undefined && strValue.length < rules.minLength) {
        result.valid = false;
        result.errors.push(`长度不能少于 ${rules.minLength} 个字符`);
    }
    
    if (rules.maxLength !== undefined && strValue.length > rules.maxLength) {
        result.valid = false;
        result.errors.push(`长度不能超过 ${rules.maxLength} 个字符`);
    }
    
    if (rules.pattern && !rules.pattern.test(strValue)) {
        result.valid = false;
        result.errors.push(rules.patternMessage || '格式不正确');
    }
    
    if (rules.type === 'number' || rules.type === 'integer') {
        const num = Number(strValue);
        if (isNaN(num)) {
            result.valid = false;
            result.errors.push('请输入有效的数字');
        } else {
            if (rules.min !== undefined && num < rules.min) {
                result.valid = false;
                result.errors.push(`值不能小于 ${rules.min}`);
            }
            if (rules.max !== undefined && num > rules.max) {
                result.valid = false;
                result.errors.push(`值不能大于 ${rules.max}`);
            }
            if (rules.type === 'integer' && !Number.isInteger(num)) {
                result.valid = false;
                result.errors.push('请输入整数');
            }
        }
    }
    
    return result;
}

function sanitizeUrl(url) {
    if (typeof url !== 'string') return '';
    
    const trimmed = url.trim();
    
    const safeProtocols = ['http://', 'https://', 'mailto:', 'tel:', 'ftp://'];
    const isSafeProtocol = safeProtocols.some(p => trimmed.toLowerCase().startsWith(p));
    
    if (!isSafeProtocol && !trimmed.startsWith('/') && !trimmed.startsWith('#') && !trimmed.startsWith('?')) {
        return '';
    }
    
    return trimmed.replace(/[\s<>"]/g, '');
}

function generateNonce() {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

function isTrustedOrigin(origin) {
    const trustedOrigins = [
        window.location.origin,
        'https://cdn.tailwindcss.com',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];
    return trustedOrigins.includes(origin);
}

const SecurityManager = {
    escapeHtml,
    escapeAttribute,
    sanitizeHtml,
    safeTemplate,
    safeSetInnerHTML,
    safeSetTextContent,
    createElement,
    validateInput,
    sanitizeUrl,
    generateNonce,
    isTrustedOrigin
};

export {
    escapeHtml,
    escapeAttribute,
    sanitizeHtml,
    safeTemplate,
    safeSetInnerHTML,
    safeSetTextContent,
    createElement,
    validateInput,
    sanitizeUrl,
    generateNonce,
    isTrustedOrigin,
    SecurityManager
};

export default SecurityManager;
