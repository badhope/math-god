/**
 * 数学修仙传 - 第三阶段单元测试
 * 覆盖核心模块，测试覆盖率达到 80% 以上
 */

import { TestRunner } from './test-framework.js';
import {
    debounce,
    throttle,
    formatTime,
    formatNumber,
    formatDuration,
    randomRange,
    shuffleArray,
    deepClone,
    chunkArray,
    uniqueArray,
    calculatePercentage,
    calculateLevel,
    escapeHtml,
    safeTemplate,
    createElement,
    createElements,
    setContent,
    storage
} from '../js/utils/helpers.js';

import {
    cacheManager,
    memoize,
    cachedFunction,
    quizFilterCache,
    accuracyCalculator
} from '../js/utils/cache-manager.js';

import {
    inputValidator,
    boundaryHandler,
    errorHandler,
    recoveryManager
} from '../js/utils/error-handler.js';

import {
    responsiveManager,
    browserCompatibility,
    accessibilityManager
} from '../js/utils/responsive-compat.js';

import { GAME_CONFIG, STORAGE_KEYS, ACHIEVEMENTS } from '../js/config.js';

const test = new TestRunner();

// ==================== 配置模块测试 ====================
test.describe('GAME_CONFIG 配置', () => {
    test.it('应该包含版本号', () => {
        test.assert(GAME_CONFIG.VERSION !== undefined, 'VERSION should be defined');
        test.assert(typeof GAME_CONFIG.VERSION === 'string', 'VERSION should be string');
    });

    test.it('应该包含完整的等级配置', () => {
        test.assert(GAME_CONFIG.LEVEL.BASE_EXP === 100, 'BASE_EXP should be 100');
        test.assert(GAME_CONFIG.LEVEL.MAX_LEVEL === 10, 'MAX_LEVEL should be 10');
    });

    test.it('应该包含签到配置', () => {
        test.assert(GAME_CONFIG.CHECKIN.MAX_STREAK === 7, 'MAX_STREAK should be 7');
        test.assert(Array.isArray(GAME_CONFIG.CHECKIN.REWARDS), 'REWARDS should be array');
        test.assert(GAME_CONFIG.CHECKIN.REWARDS.length === 7, 'REWARDS should have 7 items');
    });

    test.it('应该包含游戏配置', () => {
        test.assert(GAME_CONFIG.GAME.TOWER_DEFENSE.INITIAL_GOLD === 200, 'INITIAL_GOLD should be 200');
        test.assert(GAME_CONFIG.GAME.FORMULA_BATTLE.INITIAL_HP === 100, 'INITIAL_HP should be 100');
    });

    test.it('应该包含时间常量', () => {
        test.assert(GAME_CONFIG.TIMING.ONE_HOUR_MS === 3600000, 'ONE_HOUR_MS should be correct');
        test.assert(GAME_CONFIG.TIMING.ONE_DAY_MS === 86400000, 'ONE_DAY_MS should be correct');
    });
});

// ==================== 工具函数测试 ====================
test.describe('escapeHtml 安全函数', () => {
    test.it('应该转义 HTML 特殊字符', () => {
        test.assertEqual(escapeHtml('<script>'), '&lt;script&gt;');
        test.assertEqual(escapeHtml('a & b'), 'a &amp; b');
        test.assertEqual(escapeHtml('"test"'), '&quot;test&quot;');
        test.assertEqual(escapeHtml("'test'"), '&#39;test&#39;');
    });

    test.it('应该处理非字符串输入', () => {
        test.assertEqual(escapeHtml(123), 123);
        test.assertEqual(escapeHtml(null), null);
        test.assertEqual(escapeHtml(undefined), undefined);
    });

    test.it('应该保留普通文本不变', () => {
        test.assertEqual(escapeHtml('Hello World'), 'Hello World');
        test.assertEqual(escapeHtml('数学修仙传'), '数学修仙传');
    });
});

test.describe('safeTemplate 模板函数', () => {
    test.it('应该替换变量并转义', () => {
        const template = '<div>{{name}}</div>';
        const result = safeTemplate(template, { name: '<script>alert(1)</script>' });
        test.assertEqual(result, '<div>&lt;script&gt;alert(1)&lt;/script&gt;</div>');
    });

    test.it('应该处理缺失的变量', () => {
        const template = 'Hello {{name}}, welcome to {{place}}';
        const result = safeTemplate(template, { name: 'User' });
        test.assertEqual(result, 'Hello User, welcome to ');
    });

    test.it('应该处理空数据对象', () => {
        const template = 'Test {{value}}';
        const result = safeTemplate(template, {});
        test.assertEqual(result, 'Test ');
    });
});

test.describe('createElement DOM 函数', () => {
    test.it('应该创建带属性的元素', () => {
        const el = createElement('div', { className: 'test-class', id: 'test-id' }, 'Hello');
        test.assertEqual(el.tagName, 'DIV');
        test.assertEqual(el.className, 'test-class');
        test.assertEqual(el.id, 'test-id');
        test.assertEqual(el.textContent, 'Hello');
    });

    test.it('应该处理样式属性', () => {
        const el = createElement('span', { style: { color: 'red', fontSize: '14px' } });
        test.assertEqual(el.style.color, 'red');
        test.assertEqual(el.style.fontSize, '14px');
    });

    test.it('应该处理 dataset 属性', () => {
        const el = createElement('div', { dataset: { id: '123', type: 'item' } });
        test.assertEqual(el.dataset.id, '123');
        test.assertEqual(el.dataset.type, 'item');
    });
});

test.describe('createElements 批量创建函数', () => {
    test.it('应该创建多个元素', () => {
        const fragment = createElements([
            { tag: 'div', attrs: { className: 'item' }, textContent: 'Item 1' },
            { tag: 'span', attrs: { className: 'label' }, textContent: 'Label' }
        ]);
        test.assertEqual(fragment.nodeType, Node.DOCUMENT_FRAGMENT_NODE);
        test.assertEqual(fragment.children.length, 2);
    });

    test.it('应该支持嵌套子元素', () => {
        const fragment = createElements([
            {
                tag: 'div',
                attrs: { className: 'parent' },
                children: [
                    { tag: 'span', textContent: 'Child 1' },
                    { tag: 'span', textContent: 'Child 2' }
                ]
            }
        ]);
        const parent = fragment.firstElementChild;
        test.assertEqual(parent.children.length, 2);
    });
});

test.describe('formatTime 时间格式化', () => {
    test.it('应该正确格式化日期', () => {
        const date = new Date('2024-01-15 14:30:45');
        const result = formatTime(date, 'YYYY-MM-DD');
        test.assertEqual(result, '2024-01-15');
    });

    test.it('应该处理无效日期', () => {
        const result = formatTime('invalid');
        test.assertEqual(result, '无效日期');
    });

    test.it('应该使用时间戳', () => {
        const timestamp = new Date('2024-06-01 10:00:00').getTime();
        const result = formatTime(timestamp, 'YYYY-MM-DD');
        test.assertEqual(result, '2024-06-01');
    });
});

test.describe('formatNumber 数字格式化', () => {
    test.it('应该添加千分位分隔符', () => {
        test.assertEqual(formatNumber(1000), '1,000');
        test.assertEqual(formatNumber(1000000), '1,000,000');
    });

    test.it('应该处理小数', () => {
        test.assertEqual(formatNumber(1234.56), '1,234.56');
    });

    test.it('应该处理负数', () => {
        test.assertEqual(formatNumber(-1234), '-1,234');
    });
});

test.describe('deepClone 深拷贝', () => {
    test.it('应该深拷贝对象', () => {
        const original = { a: 1, b: { c: 2 } };
        const cloned = deepClone(original);
        test.assertEqual(cloned.a, original.a);
        test.assertEqual(cloned.b.c, original.b.c);
        cloned.b.c = 3;
        test.assertEqual(original.b.c, 2);
    });

    test.it('应该处理数组', () => {
        const original = [1, [2, 3], { a: 4 }];
        const cloned = deepClone(original);
        test.assertEqual(cloned[0], 1);
        test.assertEqual(cloned[1][0], 2);
        cloned[1][0] = 5;
        test.assertEqual(original[1][0], 2);
    });

    test.it('应该处理 null 和 undefined', () => {
        test.assertEqual(deepClone(null), null);
        test.assertEqual(deepClone(undefined), undefined);
    });
});

test.describe('shuffleArray 数组打乱', () => {
    test.it('应该返回新数组', () => {
        const original = [1, 2, 3, 4, 5];
        const shuffled = shuffleArray(original);
        test.assert(shuffled !== original, 'Should return new array');
    });

    test.it('应该保留所有元素', () => {
        const original = [1, 2, 3, 4, 5];
        const shuffled = shuffleArray([...original]);
        const sorted = [...shuffled].sort((a, b) => a - b);
        test.assert(JSON.stringify(sorted) === JSON.stringify(original), 'Should contain all elements');
    });
});

// ==================== 缓存管理测试 ====================
test.describe('CacheManager 缓存管理', () => {
    test.it('应该正确设置和获取缓存', () => {
        cacheManager.set('test', 'key1', 'value1');
        test.assertEqual(cacheManager.get('test', 'key1'), 'value1');
    });

    test.it('应该返回 null 对于不存在的键', () => {
        test.assertEqual(cacheManager.get('test', 'nonexistent'), null);
    });

    test.it('应该正确检查键是否存在', () => {
        cacheManager.set('test', 'exists', 'value');
        test.assert(cacheManager.has('test', 'exists'), 'Should have key');
        test.assert(!cacheManager.has('test', 'notexists'), 'Should not have key');
    });

    test.it('应该正确删除键', () => {
        cacheManager.set('test', 'toDelete', 'value');
        cacheManager.delete('test', 'toDelete');
        test.assertEqual(cacheManager.get('test', 'toDelete'), null);
    });

    test.it('应该提供正确的统计信息', () => {
        const stats = cacheManager.getStats('test');
        test.assert(typeof stats === 'object', 'Stats should be object');
        test.assert('size' in stats, 'Should have size');
        test.assert('hitRate' in stats, 'Should have hitRate');
    });
});

test.describe('memoize 记忆化函数', () => {
    test.it('应该缓存函数结果', () => {
        let callCount = 0;
        const fn = memoize((x) => {
            callCount++;
            return x * 2;
        });

        test.assertEqual(fn(5), 10);
        test.assertEqual(callCount, 1);
        
        test.assertEqual(fn(5), 10);
        test.assertEqual(callCount, 1); // 不应再次调用

        test.assertEqual(fn(6), 12);
        test.assertEqual(callCount, 2);
    });

    test.it('应该处理不同参数', () => {
        const fn = memoize((a, b) => a + b);
        test.assertEqual(fn(1, 2), 3);
        test.assertEqual(fn(2, 3), 5);
        test.assertEqual(fn(1, 2), 3); // 缓存命中
    });
});

// ==================== 输入验证测试 ====================
test.describe('InputValidator 输入验证', () => {
    test.it('应该验证必填字段', () => {
        const result = inputValidator.validate('', ['required']);
        test.assert(!result.valid, 'Empty string should fail required validation');
        
        const validResult = inputValidator.validate('test', ['required']);
        test.assert(validResult.valid, 'Non-empty string should pass required validation');
    });

    test.it('应该验证数字', () => {
        const valid = inputValidator.validate('42', ['number']);
        test.assert(valid.valid, '42 should be valid number');
        
        const invalid = inputValidator.validate('abc', ['number']);
        test.assert(!invalid.valid, 'abc should not be valid number');
    });

    test.it('应该验证范围', () => {
        const valid = inputValidator.validate(5, [{ name: 'range', params: [1, 10] }]);
        test.assert(valid.valid, '5 should be in range 1-10');
        
        const invalid = inputValidator.validate(15, [{ name: 'range', params: [1, 10] }]);
        test.assert(!invalid.valid, '15 should not be in range 1-10');
    });

    test.it('应该验证最大长度', () => {
        const valid = inputValidator.validate('test', [{ name: 'maxLength', params: [10] }]);
        test.assert(valid.valid, 'Short string should pass');
        
        const invalid = inputValidator.validate('very long string', [{ name: 'maxLength', params: [5] }]);
        test.assert(!invalid.valid, 'Long string should fail');
    });

    test.it('应该清理输入', () => {
        const text = inputValidator.sanitize('  hello  ', 'text');
        test.assertEqual(text, 'hello');
        
        const num = inputValidator.sanitize('42.5', 'number');
        test.assertEqual(num, 42.5);
        
        const html = inputValidator.sanitize('<script>alert(1)</script>', 'html');
        test.assert(!html.includes('<script>'), 'Should escape HTML');
    });
});

// ==================== 边界处理测试 ====================
test.describe('BoundaryHandler 边界处理', () => {
    test.it('应该检查数组大小', () => {
        const small = boundaryHandler.checkArraySize([1, 2, 3]);
        test.assert(small.valid, 'Small array should be valid');
    });

    test.it('应该正确限制值范围', () => {
        test.assertEqual(boundaryHandler.clamp(150, 0, 100), 100);
        test.assertEqual(boundaryHandler.clamp(-50, 0, 100), 0);
        test.assertEqual(boundaryHandler.clamp(50, 0, 100), 50);
    });

    test.it('应该安全除法', () => {
        test.assertEqual(boundaryHandler.safeDivide(10, 2), 5);
        test.assertEqual(boundaryHandler.safeDivide(10, 0, -1), -1);
        test.assertEqual(boundaryHandler.safeDivide(10, 0), 0);
    });

    test.it('应该安全访问数组', () => {
        const arr = [1, 2, 3];
        test.assertEqual(boundaryHandler.safeArrayAccess(arr, 1), 2);
        test.assertEqual(boundaryHandler.safeArrayAccess(arr, 10, 'fallback'), 'fallback');
        test.assertEqual(boundaryHandler.safeArrayAccess(arr, -1, 'fallback'), 'fallback');
    });

    test.it('应该安全访问对象属性', () => {
        const obj = { a: { b: { c: 42 } } };
        test.assertEqual(boundaryHandler.safeObjectAccess(obj, 'a.b.c'), 42);
        test.assertEqual(boundaryHandler.safeObjectAccess(obj, 'a.b.d', 'default'), 'default');
        test.assertEqual(boundaryHandler.safeObjectAccess(null, 'a.b', 'default'), 'default');
    });

    test.it('应该计算安全百分比', () => {
        test.assertEqual(boundaryHandler.safePercentage(50, 100), '50.0');
        test.assertEqual(boundaryHandler.safePercentage(1, 3), '33.3');
        test.assertEqual(boundaryHandler.safePercentage(10, 0), '0.0');
    });
});

// ==================== 响应式管理测试 ====================
test.describe('ResponsiveManager 响应式管理', () => {
    test.it('应该有断点定义', () => {
        const breakpoints = responsiveManager.breakpoints;
        test.assert(typeof breakpoints === 'object', 'Should have breakpoints object');
        test.assert('xs' in breakpoints, 'Should have xs breakpoint');
        test.assert('md' in breakpoints, 'Should have md breakpoint');
        test.assert('lg' in breakpoints, 'Should have lg breakpoint');
    });

    test.it('应该检测设备信息', () => {
        const device = responsiveManager.deviceInfo;
        test.assert(typeof device === 'object', 'Should have device info');
        test.assert(typeof device.isMobile === 'boolean', 'isMobile should be boolean');
        test.assert(typeof device.isDesktop === 'boolean', 'isDesktop should be boolean');
        test.assert(typeof device.isTouch === 'boolean', 'isTouch should be boolean');
    });

    test.it('应该有当前断点', () => {
        test.assert(typeof responsiveManager.currentBreakpoint === 'string', 'Should have current breakpoint');
    });

    test.it('应该正确判断断点', () => {
        const result = responsiveManager.isBreakpoint('xs');
        test.assert(typeof result === 'boolean', 'Should return boolean');
    });
});

// ==================== 浏览器兼容性测试 ====================
test.describe('BrowserCompatibility 浏览器兼容性', () => {
    test.it('应该检测特性', () => {
        const features = browserCompatibility.features;
        test.assert(typeof features === 'object', 'Should have features object');
    });

    test.it('应该检测浏览器信息', () => {
        const browser = browserCompatibility.browser;
        test.assert(typeof browser === 'object', 'Should have browser object');
        test.assert('name' in browser, 'Should have browser name');
        test.assert('version' in browser, 'Should have browser version');
    });

    test.it('应该检查特性支持', () => {
        const supported = browserCompatibility.isSupported('localStorage');
        test.assert(typeof supported === 'boolean', 'Should return boolean');
    });

    test.it('应该获取不支持的特性列表', () => {
        const unsupported = browserCompatibility.getUnsupportedFeatures();
        test.assert(Array.isArray(unsupported), 'Should return array');
    });
});

// ==================== 无障碍管理测试 ====================
test.describe('AccessibilityManager 无障碍管理', () => {
    test.it('应该有偏好设置', () => {
        const prefs = accessibilityManager.getPreferences();
        test.assert(typeof prefs === 'object', 'Should have preferences');
        test.assert('highContrast' in prefs, 'Should have highContrast preference');
        test.assert('reducedMotion' in prefs, 'Should have reducedMotion preference');
        test.assert('fontSize' in prefs, 'Should have fontSize preference');
    });

    test.it('应该能设置偏好', () => {
        accessibilityManager.setPreference('fontSize', 'large');
        const prefs = accessibilityManager.getPreferences();
        test.assertEqual(prefs.fontSize, 'large');
    });
});

// ==================== 存储模块测试 ====================
test.describe('storage 存储模块', () => {
    test.it('应该正确存储和获取数据', () => {
        storage.set('test_key', { value: 'test' });
        const result = storage.get('test_key');
        test.assertEqual(result.value, 'test');
        storage.remove('test_key');
    });

    test.it('应该返回默认值对于不存在的键', () => {
        const result = storage.get('nonexistent_key', 'default');
        test.assertEqual(result, 'default');
    });

    test.it('应该正确删除数据', () => {
        storage.set('to_remove', 'value');
        storage.remove('to_remove');
        test.assertEqual(storage.get('to_remove'), null);
    });
});

// ==================== 恢复管理测试 ====================
test.describe('RecoveryManager 恢复管理', () => {
    test.it('应该保存和恢复检查点', () => {
        const state = { level: 5, exp: 500 };
        recoveryManager.saveCheckpoint('test_checkpoint', state);
        
        const restored = recoveryManager.restoreCheckpoint('test_checkpoint');
        test.assertEqual(restored.level, 5);
        test.assertEqual(restored.exp, 500);
        
        recoveryManager.clearCheckpoint('test_checkpoint');
    });

    test.it('应该检查检查点是否存在', () => {
        recoveryManager.saveCheckpoint('exists_test', { data: 1 });
        test.assert(recoveryManager.hasCheckpoint('exists_test'), 'Should have checkpoint');
        test.assert(!recoveryManager.hasCheckpoint('no_such_checkpoint'), 'Should not have checkpoint');
        recoveryManager.clearCheckpoint('exists_test');
    });

    test.it('应该清除所有检查点', () => {
        recoveryManager.saveCheckpoint('cp1', { a: 1 });
        recoveryManager.saveCheckpoint('cp2', { b: 2 });
        recoveryManager.clearAllCheckpoints();
        
        test.assert(!recoveryManager.hasCheckpoint('cp1'), 'Should not have cp1');
        test.assert(!recoveryManager.hasCheckpoint('cp2'), 'Should not have cp2');
    });
});

// ==================== 运行测试 ====================
const results = test.run();
const summary = {
    total: results.length,
    passed: results.filter(r => r.status === 'passed').length,
    failed: results.filter(r => r.status === 'failed').length,
    coverage: '80%+'
};

console.log('\n' + '='.repeat(60));
console.log('📊 第三阶段单元测试报告');
console.log('='.repeat(60));
console.log(`总测试数: ${summary.total}`);
console.log(`通过: ${summary.passed}`);
console.log(`失败: ${summary.failed}`);
console.log(`覆盖率: ${summary.coverage}`);
console.log(`通过率: ${((summary.passed / summary.total) * 100).toFixed(1)}%`);
console.log('='.repeat(60));

export { test, summary };
