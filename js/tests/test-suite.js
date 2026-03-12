/**
 * 数学修仙传 - 单元测试套件
 * 运行方式：在浏览器控制台执行 testRunner.runAll()
 */

const testRunner = {
    passed: 0,
    failed: 0,
    errors: [],

    assert(condition, message) {
        if (condition) {
            this.passed++;
            console.log(`✅ ${message}`);
        } else {
            this.failed++;
            this.errors.push(message);
            console.error(`❌ ${message}`);
        }
    },

    assertEqual(actual, expected, message) {
        const condition = actual === expected;
        this.assert(condition, `${message} (期望: ${expected}, 实际: ${actual})`);
    },

    assertType(value, type, message) {
        const condition = typeof value === type;
        this.assert(condition, `${message} (期望类型: ${type}, 实际类型: ${typeof value})`);
    },

    assertExists(value, message) {
        const condition = value !== null && value !== undefined;
        this.assert(condition, `${message}`);
    },

    reset() {
        this.passed = 0;
        this.failed = 0;
        this.errors = [];
    },

    printSummary() {
        console.log('\n' + '='.repeat(50));
        console.log(`测试完成: ${this.passed} 通过, ${this.failed} 失败`);
        if (this.errors.length > 0) {
            console.log('\n失败的测试:');
            this.errors.forEach((err, i) => console.log(`  ${i + 1}. ${err}`));
        }
        console.log('='.repeat(50) + '\n');
    },

    runAll() {
        this.reset();
        console.log('🧪 开始运行测试套件...\n');
        
        this.testSecurity();
        this.testState();
        this.testHelpers();
        this.testGamification();
        this.testBoundaryHandler();
        
        this.printSummary();
        return { passed: this.passed, failed: this.failed };
    },

    testSecurity() {
        console.log('\n📦 测试安全模块...');
        
        if (typeof SecurityManager !== 'undefined') {
            const escaped = SecurityManager.escapeHtml('<script>alert("xss")</script>');
            this.assert(!escaped.includes('<script>'), 'escapeHtml 应该转义 script 标签');
            
            const sanitized = SecurityManager.sanitizeHtml('<b>safe</b><script>bad</script>');
            this.assert(!sanitized.includes('<script>'), 'sanitizeHtml 应该移除 script 标签');
            
            const url = SecurityManager.sanitizeUrl('javascript:alert(1)');
            this.assertEqual(url, '', 'sanitizeUrl 应该阻止 javascript 协议');
            
            const safeUrl = SecurityManager.sanitizeUrl('https://example.com');
            this.assertEqual(safeUrl, 'https://example.com', 'sanitizeUrl 应该允许 https 协议');
        } else {
            this.assert(false, 'SecurityManager 未定义');
        }
    },

    testState() {
        console.log('\n📦 测试状态管理模块...');
        
        if (typeof getUserState === 'function') {
            const state = getUserState();
            this.assertExists(state, 'getUserState 应该返回状态对象');
            this.assertType(state.exp, 'number', 'exp 应该是数字');
            this.assertType(state.level, 'number', 'level 应该是数字');
            this.assert(Array.isArray(state.unlockedLevels), 'unlockedLevels 应该是数组');
        } else {
            this.assert(false, 'getUserState 函数未定义');
        }
    },

    testHelpers() {
        console.log('\n📦 测试工具函数模块...');
        
        if (typeof escapeHtml === 'function') {
            this.assertEqual(escapeHtml('<'), '&lt;', 'escapeHtml 应该转义 <');
            this.assertEqual(escapeHtml('>'), '&gt;', 'escapeHtml 应该转义 >');
            this.assertEqual(escapeHtml('"'), '&quot;', 'escapeHtml 应该转义 "');
            this.assertEqual(escapeHtml(null), '', 'escapeHtml 应该处理 null');
            this.assertEqual(escapeHtml(undefined), '', 'escapeHtml 应该处理 undefined');
        } else {
            this.assert(false, 'escapeHtml 函数未定义');
        }
        
        if (typeof formatTime === 'function') {
            const time = formatTime('2024-01-01', 'YYYY-MM-DD');
            this.assertEqual(time, '2024-01-01', 'formatTime 应该正确格式化日期');
        }
        
        if (typeof calculateLevel === 'function') {
            this.assertEqual(calculateLevel(0), 1, '0 经验应该是 1 级');
            this.assertEqual(calculateLevel(100), 2, '100 经验应该是 2 级');
        }
    },

    testGamification() {
        console.log('\n📦 测试游戏化模块...');
        
        if (typeof gamificationManager !== 'undefined') {
            const tasks = gamificationManager.getDailyTasks();
            this.assert(Array.isArray(tasks), 'getDailyTasks 应该返回数组');
            this.assert(tasks.length > 0, 'getDailyTasks 应该返回任务列表');
            
            const status = gamificationManager.getCheckInStatus();
            this.assertExists(status.streak, '签到状态应该包含 streak');
            this.assertExists(status.isCheckedIn, '签到状态应该包含 isCheckedIn');
            
            const leaderboard = gamificationManager.getLeaderboard();
            this.assert(Array.isArray(leaderboard.top), '排行榜应该包含 top 数组');
            this.assert(leaderboard.top.length > 0, '排行榜应该有数据');
        } else {
            this.assert(false, 'gamificationManager 未定义');
        }
    },

    testBoundaryHandler() {
        console.log('\n📦 测试边界处理模块...');
        
        if (typeof boundaryHandler !== 'undefined') {
            const clampResult = boundaryHandler.clamp(150, 0, 100);
            this.assertEqual(clampResult, 100, 'clamp 应该限制最大值');
            
            const clampMin = boundaryHandler.clamp(-10, 0, 100);
            this.assertEqual(clampMin, 0, 'clamp 应该限制最小值');
            
            const safeDiv = boundaryHandler.safeDivide(10, 0, 0);
            this.assertEqual(safeDiv, 0, 'safeDivide 应该处理除零');
            
            const safePercent = boundaryHandler.safePercentage(50, 100);
            this.assertEqual(safePercent, '50.0', 'safePercentage 应该正确计算百分比');
            
            const arr = [1, 2, 3];
            this.assertEqual(boundaryHandler.safeArrayAccess(arr, 1), 2, 'safeArrayAccess 应该返回正确元素');
            this.assertEqual(boundaryHandler.safeArrayAccess(arr, 10, 'fallback'), 'fallback', 'safeArrayAccess 应该返回默认值');
        } else {
            this.assert(false, 'boundaryHandler 未定义');
        }
    }
};

window.testRunner = testRunner;

console.log('✅ 测试套件已加载');
console.log('💡 运行 testRunner.runAll() 开始测试');
