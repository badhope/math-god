/**
 * 性能优化与功能扩展测试
 * 测试新增模块的功能正确性
 */

import { 
    PerformanceOptimizer, 
    VirtualScrollManager, 
    SmartCache,
    learningAnalyzer,
    adaptiveDifficulty,
    spacedRepetition,
    offlineSupport,
    dataPersistence,
    inputValidator,
    boundaryHandler,
    errorHandler,
    responsiveManager,
    browserCompatibility,
    accessibilityManager
} from '../js/utils/index.js';

const TestRunner = {
    passed: 0,
    failed: 0,
    tests: [],

    describe(name, fn) {
        console.log(`\n📦 ${name}`);
        fn();
    },

    it(name, fn) {
        try {
            fn();
            this.passed++;
            console.log(`  ✅ ${name}`);
        } catch (error) {
            this.failed++;
            console.log(`  ❌ ${name}`);
            console.error(`     Error: ${error.message}`);
        }
    },

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    },

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    },

    assertType(value, type, message) {
        if (typeof value !== type) {
            throw new Error(message || `Expected type ${type}, got ${typeof value}`);
        }
    },

    report() {
        console.log('\n' + '='.repeat(50));
        console.log(`📊 测试结果: ${this.passed} 通过, ${this.failed} 失败`);
        console.log('='.repeat(50));
        return this.failed === 0;
    }
};

// ==================== 性能优化模块测试 ====================
TestRunner.describe('PerformanceOptimizer', () => {
    TestRunner.it('should create instance', () => {
        const optimizer = new PerformanceOptimizer();
        TestRunner.assert(optimizer !== null, 'Optimizer should not be null');
        TestRunner.assertType(optimizer.getMetrics, 'function');
    });

    TestRunner.it('should have metrics object', () => {
        const optimizer = new PerformanceOptimizer();
        const metrics = optimizer.getMetrics();
        TestRunner.assertType(metrics, 'object');
        TestRunner.assert('fps' in metrics, 'Should have fps property');
        TestRunner.assert('loadTime' in metrics, 'Should have loadTime property');
    });

    TestRunner.it('should measure performance', () => {
        const optimizer = new PerformanceOptimizer();
        const result = optimizer.measurePerformance('test', () => 42);
        TestRunner.assertEqual(result, 42, 'Should return function result');
    });
});

// ==================== 智能缓存测试 ====================
TestRunner.describe('SmartCache', () => {
    TestRunner.it('should set and get values', () => {
        const cache = new SmartCache();
        cache.set('key1', 'value1');
        TestRunner.assertEqual(cache.get('key1'), 'value1');
    });

    TestRunner.it('should return null for missing keys', () => {
        const cache = new SmartCache();
        TestRunner.assertEqual(cache.get('nonexistent'), null);
    });

    TestRunner.it('should check if key exists', () => {
        const cache = new SmartCache();
        cache.set('key1', 'value1');
        TestRunner.assert(cache.has('key1'), 'Should have key1');
        TestRunner.assert(!cache.has('key2'), 'Should not have key2');
    });

    TestRunner.it('should delete keys', () => {
        const cache = new SmartCache();
        cache.set('key1', 'value1');
        cache.delete('key1');
        TestRunner.assertEqual(cache.get('key1'), null);
    });

    TestRunner.it('should clear all keys', () => {
        const cache = new SmartCache();
        cache.set('key1', 'value1');
        cache.set('key2', 'value2');
        cache.clear();
        TestRunner.assertEqual(cache.get('key1'), null);
        TestRunner.assertEqual(cache.get('key2'), null);
    });

    TestRunner.it('should provide stats', () => {
        const cache = new SmartCache();
        cache.set('key1', 'value1');
        const stats = cache.getStats();
        TestRunner.assertType(stats, 'object');
        TestRunner.assert('total' in stats, 'Should have total property');
    });
});

// ==================== 学习分析模块测试 ====================
TestRunner.describe('LearningAnalyzer', () => {
    TestRunner.it('should record study session', () => {
        const session = learningAnalyzer.recordStudySession({
            duration: 300,
            levelId: 1,
            questionsAnswered: 10,
            correctAnswers: 8
        });
        TestRunner.assert(session.id !== undefined, 'Should have session id');
        TestRunner.assertEqual(session.duration, 300);
    });

    TestRunner.it('should record question result', () => {
        const result = learningAnalyzer.recordQuestionResult({
            questionId: 'test-q1',
            levelId: 1,
            isCorrect: true,
            timeSpent: 5000
        });
        TestRunner.assert(result.timestamp !== undefined, 'Should have timestamp');
    });

    TestRunner.it('should get study trend', () => {
        const trend = learningAnalyzer.getStudyTrend(7);
        TestRunner.assert(Array.isArray(trend), 'Should return array');
        TestRunner.assertEqual(trend.length, 7, 'Should have 7 days');
    });

    TestRunner.it('should get recommendations', () => {
        const recommendations = learningAnalyzer.getRecommendations();
        TestRunner.assert(Array.isArray(recommendations), 'Should return array');
    });

    TestRunner.it('should get learning report', () => {
        const report = learningAnalyzer.getLearningReport();
        TestRunner.assertType(report, 'object');
        TestRunner.assert('summary' in report, 'Should have summary');
        TestRunner.assert('weekly' in report, 'Should have weekly');
        TestRunner.assert('areas' in report, 'Should have areas');
    });
});

// ==================== 自适应难度测试 ====================
TestRunner.describe('AdaptiveDifficulty', () => {
    TestRunner.it('should calculate optimal difficulty', () => {
        const difficulty = adaptiveDifficulty.calculateOptimalDifficulty(1);
        TestRunner.assertType(difficulty, 'number');
        TestRunner.assert(difficulty >= 1 && difficulty <= 10, 'Should be between 1 and 10');
    });

    TestRunner.it('should record performance', () => {
        adaptiveDifficulty.recordPerformance(true);
        adaptiveDifficulty.recordPerformance(true);
        const insights = adaptiveDifficulty.getDifficultyInsights();
        TestRunner.assertType(insights, 'object');
        TestRunner.assert('recentAccuracy' in insights, 'Should have recentAccuracy');
        TestRunner.assert('currentStreak' in insights, 'Should have currentStreak');
    });
});

// ==================== 间隔重复测试 ====================
TestRunner.describe('SpacedRepetition', () => {
    TestRunner.it('should schedule review', () => {
        const result = spacedRepetition.scheduleReview('q1', true);
        TestRunner.assertType(result, 'object');
        TestRunner.assert('level' in result, 'Should have level');
        TestRunner.assert('nextReview' in result, 'Should have nextReview');
    });

    TestRunner.it('should get due reviews', () => {
        const due = spacedRepetition.getDueReviews();
        TestRunner.assert(Array.isArray(due), 'Should return array');
    });
});

// ==================== 输入验证测试 ====================
TestRunner.describe('InputValidator', () => {
    TestRunner.it('should validate required field', () => {
        const result = inputValidator.validate('', ['required']);
        TestRunner.assert(!result.valid, 'Empty string should fail required validation');
    });

    TestRunner.it('should validate number', () => {
        const valid = inputValidator.validate('42', ['number']);
        TestRunner.assert(valid.valid, '42 should be valid number');
        
        const invalid = inputValidator.validate('abc', ['number']);
        TestRunner.assert(!invalid.valid, 'abc should not be valid number');
    });

    TestRunner.it('should validate range', () => {
        const valid = inputValidator.validate(5, [{ name: 'range', params: [1, 10] }]);
        TestRunner.assert(valid.valid, '5 should be in range 1-10');
        
        const invalid = inputValidator.validate(15, [{ name: 'range', params: [1, 10] }]);
        TestRunner.assert(!invalid.valid, '15 should not be in range 1-10');
    });

    TestRunner.it('should sanitize input', () => {
        const text = inputValidator.sanitize('  hello  ', 'text');
        TestRunner.assertEqual(text, 'hello');
        
        const num = inputValidator.sanitize('42.5', 'number');
        TestRunner.assertEqual(num, 42.5);
        
        const html = inputValidator.sanitize('<script>alert(1)</script>', 'html');
        TestRunner.assert(!html.includes('<script>'), 'Should escape HTML');
    });
});

// ==================== 边界处理测试 ====================
TestRunner.describe('BoundaryHandler', () => {
    TestRunner.it('should check array size', () => {
        const small = boundaryHandler.checkArraySize([1, 2, 3]);
        TestRunner.assert(small.valid, 'Small array should be valid');
    });

    TestRunner.it('should clamp values', () => {
        const clamped = boundaryHandler.clamp(150, 0, 100);
        TestRunner.assertEqual(clamped, 100);
    });

    TestRunner.it('should safe divide', () => {
        const result = boundaryHandler.safeDivide(10, 2);
        TestRunner.assertEqual(result, 5);
        
        const fallback = boundaryHandler.safeDivide(10, 0, -1);
        TestRunner.assertEqual(fallback, -1);
    });

    TestRunner.it('should safe array access', () => {
        const arr = [1, 2, 3];
        TestRunner.assertEqual(boundaryHandler.safeArrayAccess(arr, 1), 2);
        TestRunner.assertEqual(boundaryHandler.safeArrayAccess(arr, 10, 'fallback'), 'fallback');
    });

    TestRunner.it('should safe object access', () => {
        const obj = { a: { b: { c: 42 } } };
        TestRunner.assertEqual(boundaryHandler.safeObjectAccess(obj, 'a.b.c'), 42);
        TestRunner.assertEqual(boundaryHandler.safeObjectAccess(obj, 'a.b.d', 'default'), 'default');
    });
});

// ==================== 响应式管理测试 ====================
TestRunner.describe('ResponsiveManager', () => {
    TestRunner.it('should have breakpoints', () => {
        const breakpoints = responsiveManager.breakpoints;
        TestRunner.assertType(breakpoints, 'object');
        TestRunner.assert('xs' in breakpoints, 'Should have xs breakpoint');
        TestRunner.assert('md' in breakpoints, 'Should have md breakpoint');
    });

    TestRunner.it('should detect device', () => {
        const device = responsiveManager.deviceInfo;
        TestRunner.assertType(device, 'object');
        TestRunner.assertType(device.isMobile, 'boolean');
        TestRunner.assertType(device.isDesktop, 'boolean');
    });

    TestRunner.it('should have current breakpoint', () => {
        TestRunner.assertType(responsiveManager.currentBreakpoint, 'string');
    });
});

// ==================== 浏览器兼容性测试 ====================
TestRunner.describe('BrowserCompatibility', () => {
    TestRunner.it('should detect features', () => {
        const features = browserCompatibility.features;
        TestRunner.assertType(features, 'object');
    });

    TestRunner.it('should detect browser', () => {
        const browser = browserCompatibility.browser;
        TestRunner.assertType(browser, 'object');
        TestRunner.assert('name' in browser, 'Should have browser name');
        TestRunner.assert('version' in browser, 'Should have browser version');
    });

    TestRunner.it('should check feature support', () => {
        const supported = browserCompatibility.isSupported('localStorage');
        TestRunner.assertType(supported, 'boolean');
    });
});

// ==================== 无障碍管理测试 ====================
TestRunner.describe('AccessibilityManager', () => {
    TestRunner.it('should have preferences', () => {
        const prefs = accessibilityManager.getPreferences();
        TestRunner.assertType(prefs, 'object');
        TestRunner.assert('highContrast' in prefs, 'Should have highContrast preference');
        TestRunner.assert('reducedMotion' in prefs, 'Should have reducedMotion preference');
    });

    TestRunner.it('should set preference', () => {
        accessibilityManager.setPreference('fontSize', 'large');
        const prefs = accessibilityManager.getPreferences();
        TestRunner.assertEqual(prefs.fontSize, 'large');
    });
});

// ==================== 离线支持测试 ====================
TestRunner.describe('OfflineSupport', () => {
    TestRunner.it('should have status', () => {
        const status = offlineSupport.getStatus();
        TestRunner.assertType(status, 'object');
        TestRunner.assertType(status.isOnline, 'boolean');
    });

    TestRunner.it('should have pending sync array', () => {
        TestRunner.assert(Array.isArray(offlineSupport.pendingSync), 'Should have pendingSync array');
    });
});

// 运行测试报告
const allPassed = TestRunner.report();

// 导出测试结果
export { TestRunner, allPassed };
