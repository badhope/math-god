/**
 * 数学修仙传 - 通用工具函数库
 * 提供高性能、可复用的工具函数
 */

/**
 * 防抖函数 - 限制函数执行频率
 * @param {Function} func - 需要防抖的函数
 * @param {number} wait - 等待时间 (毫秒)
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数 - 限制函数执行频率
 * @param {Function} func - 需要节流的函数
 * @param {number} limit - 时间限制 (毫秒)
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 本地存储封装 - 带错误处理
 */
export const storage = {
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Storage get error for key "${key}":`, error);
            return defaultValue;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Storage set error for key "${key}":`, error);
            if (error.name === 'QuotaExceededError') {
                this.handleQuotaExceeded();
            }
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Storage remove error for key "${key}":`, error);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },

    handleQuotaExceeded() {
        console.warn('LocalStorage 配额已满，自动清理旧数据');
        const oldKeys = ['tempData', 'cacheData', 'oldUserState'];
        oldKeys.forEach(key => this.remove(key));
    }
};

/**
 * 格式化时间
 * @param {Date|string|number} date - 日期对象、字符串或时间戳
 * @param {string} format - 格式化模板
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '无效日期';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 格式化数字 - 添加千分位分隔符
 * @param {number} num - 数字
 * @returns {string} 格式化后的字符串
 */
export function formatNumber(num) {
    if (typeof num !== 'number') return num;
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 格式化时长 - 将毫秒转换为可读格式
 * @param {number} milliseconds - 毫秒数
 * @returns {string} 格式化后的时长字符串
 */
export function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}天${hours % 24}小时`;
    } else if (hours > 0) {
        return `${hours}小时${minutes % 60}分钟`;
    } else if (minutes > 0) {
        return `${minutes}分钟${seconds % 60}秒`;
    } else {
        return `${seconds}秒`;
    }
}

/**
 * 随机数生成 - 指定范围
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 范围内的随机整数
 */
export function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 随机打乱数组 - Fisher-Yates 洗牌算法
 * @param {Array} array - 需要打乱的数组
 * @returns {Array} 打乱后的新数组
 */
export function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * 深拷贝对象
 * @param {Object} obj - 需要拷贝的对象
 * @returns {Object} 拷贝后的对象
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
    return obj;
}

/**
 * 数组分块
 * @param {Array} array - 原数组
 * @param {number} size - 每块大小
 * @returns {Array} 分块后的二维数组
 */
export function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

/**
 * 数组去重
 * @param {Array} array - 原数组
 * @param {string} key - 去重键名 (用于对象数组)
 * @returns {Array} 去重后的数组
 */
export function uniqueArray(array, key = null) {
    if (!key) {
        return [...new Set(array)];
    }
    const seen = new Set();
    return array.filter(item => {
        const value = item[key];
        if (seen.has(value)) return false;
        seen.add(value);
        return true;
    });
}

/**
 * 数组转对象 - 通过键名
 * @param {Array} array - 对象数组
 * @param {string} key - 作为对象键的属性名
 * @returns {Object} 转换后的对象
 */
export function arrayToObject(array, key) {
    return array.reduce((obj, item) => {
        obj[item[key]] = item;
        return obj;
    }, {});
}

/**
 * 计算百分比
 * @param {number} part - 部分值
 * @param {number} total - 总值
 * @param {number} decimals - 小数位数
 * @returns {string} 百分比字符串
 */
export function calculatePercentage(part, total, decimals = 1) {
    if (total === 0) return '0%';
    return ((part / total) * 100).toFixed(decimals) + '%';
}

/**
 * 等级计算 - 基于经验值
 * @param {number} exp - 经验值
 * @returns {number} 等级
 */
export function calculateLevel(exp) {
    const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
    for (let i = levels.length - 1; i >= 0; i--) {
        if (exp >= levels[i]) return i + 1;
    }
    return 1;
}

/**
 * 计算升级所需经验
 * @param {number} currentExp - 当前经验
 * @param {number} currentLevel - 当前等级
 * @returns {number} 升级所需经验
 */
export function calculateExpToNextLevel(currentExp, currentLevel) {
    const levels = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500];
    if (currentLevel >= levels.length) return 0;
    return levels[currentLevel] - currentExp;
}

/**
 * 颜色工具 - 生成渐变色
 * @param {string} color1 - 起始颜色
 * @param {string} color2 - 结束颜色
 * @param {string} direction - 渐变方向
 * @returns {string} CSS 渐变字符串
 */
export function createGradient(color1, color2, direction = 'to right') {
    return `linear-gradient(${direction}, ${color1}, ${color2})`;
}

/**
 * 颜色工具 - 调整亮度
 * @param {string} color - 十六进制颜色
 * @param {number} percent - 亮度调整百分比 (-100 到 100)
 * @returns {string} 调整后的颜色
 */
export function adjustColorBrightness(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
}

/**
 * 性能监控 - 测量函数执行时间
 * @param {Function} func - 需要测量的函数
 * @param {string} label - 标签
 * @returns {Function} 包装后的函数
 */
export function measurePerformance(func, label = 'Function') {
    return function(...args) {
        const start = performance.now();
        const result = func.apply(this, args);
        const end = performance.now();
        console.log(`${label} 执行时间：${(end - start).toFixed(2)}ms`);
        return result;
    };
}

/**
 * 懒加载 - 图片懒加载
 * @param {HTMLElement} element - 图片元素
 * @param {string} dataSrc - data-src 属性
 */
export function lazyLoadImage(element, dataSrc = 'data-src') {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute(dataSrc);
                img.removeAttribute(dataSrc);
                observer.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    observer.observe(element);
}

/**
 * 创建防重复点击装饰器
 * @param {number} delay - 延迟时间 (毫秒)
 * @returns {Function} 装饰器函数
 */
export function preventDoubleClick(delay = 1000) {
    let lastClick = 0;
    return function(target, name, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args) {
            const now = Date.now();
            if (now - lastClick < delay) return;
            lastClick = now;
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}

/**
 * 批量处理 - 限制并发数
 * @param {Array} tasks - 任务数组
 * @param {number} concurrency - 并发数
 * @returns {Promise<Array>} 所有任务结果
 */
export async function batchProcess(tasks, concurrency = 5) {
    const results = [];
    const executing = new Set();

    for (const task of tasks) {
        const promise = Promise.resolve().then(() => task());
        executing.add(promise);

        promise.then(result => {
            results.push(result);
            executing.delete(promise);
        });

        if (executing.size >= concurrency) {
            await Promise.race(executing);
        }
    }

    await Promise.all(executing);
    return results;
}

/**
 * 重试机制 - 失败自动重试
 * @param {Function} fn - 需要重试的函数
 * @param {number} retries - 最大重试次数
 * @param {number} delay - 重试间隔 (毫秒)
 * @returns {Promise} 任务结果
 */
export async function withRetry(fn, retries = 3, delay = 1000) {
    try {
        return await fn();
    } catch (error) {
        if (retries <= 0) throw error;
        await new Promise(resolve => setTimeout(resolve, delay));
        return withRetry(fn, retries - 1, delay * 2);
    }
}

/**
 * 缓存装饰器 - 自动缓存函数结果
 * @param {number} ttl - 缓存有效期 (毫秒)
 * @returns {Function} 装饰器函数
 */
export function cache(ttl = 5000) {
    const cacheMap = new Map();
    return function(target, name, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(...args) {
            const key = JSON.stringify(args);
            const cached = cacheMap.get(key);
            if (cached && Date.now() - cached.timestamp < ttl) {
                return cached.value;
            }
            const result = originalMethod.apply(this, args);
            cacheMap.set(key, { value: result, timestamp: Date.now() });
            return result;
        };
        return descriptor;
    };
}

/**
 * HTML 转义函数 - 防止 XSS 攻击
 * @param {string} str - 需要转义的字符串
 * @returns {string} 转义后的安全字符串
 */
export function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, char => htmlEntities[char]);
}

/**
 * 安全设置 innerHTML - 自动转义用户输入
 * @param {HTMLElement} element - 目标元素
 * @param {string} html - HTML 内容
 * @param {Object} options - 选项
 * @param {boolean} options.escape - 是否转义 (默认 true)
 */
export function safeSetInnerHTML(element, html, options = { escape: true }) {
    if (!element) return;
    if (options.escape && typeof html === 'string') {
        element.innerHTML = escapeHtml(html);
    } else {
        element.innerHTML = html;
    }
}

/**
 * 创建安全 DOM 元素
 * @param {string} tag - 标签名
 * @param {Object} attrs - 属性对象
 * @param {string} textContent - 文本内容 (自动转义)
 * @returns {HTMLElement} 创建的元素
 */
export function createElement(tag, attrs = {}, textContent = '') {
    const element = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.slice(2).toLowerCase(), value);
        } else if (key === 'dataset' && typeof value === 'object') {
            Object.entries(value).forEach(([k, v]) => {
                element.dataset[k] = v;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

console.log('✅ 工具函数库已加载');
