/**
 * 数学修仙传 - 简易测试框架
 * 提供单元测试、断言、测试报告等功能
 */

class TestRunner {
    constructor() {
        this.tests = [];
        this.results = [];
        this.currentSuite = null;
    }

    /**
     * 定义测试套件
     */
    describe(name, fn) {
        this.currentSuite = { name, tests: [] };
        fn();
        this.tests.push(this.currentSuite);
        this.currentSuite = null;
    }

    /**
     * 定义测试用例
     */
    it(name, fn) {
        if (!this.currentSuite) {
            throw new Error('it() 必须在 describe() 内使用');
        }
        this.currentSuite.tests.push({ name, fn });
    }

    /**
     * 运行所有测试
     */
    async run() {
        console.clear();
        console.log('🧪 开始运行测试...\n');

        let totalTests = 0;
        let passedTests = 0;
        let failedTests = 0;

        for (const suite of this.tests) {
            console.log(`📋 测试套件：${suite.name}`);
            console.log('─'.repeat(50));

            for (const test of suite.tests) {
                totalTests++;
                const startTime = performance.now();

                try {
                    await test.fn();
                    const endTime = performance.now();
                    passedTests++;
                    console.log(`  ✅ ${test.name} (${(endTime - startTime).toFixed(2)}ms)`);
                    this.results.push({
                        suite: suite.name,
                        name: test.name,
                        status: 'passed',
                        duration: endTime - startTime
                    });
                } catch (error) {
                    const endTime = performance.now();
                    failedTests++;
                    console.log(`  ❌ ${test.name}`);
                    console.log(`     错误：${error.message}`);
                    this.results.push({
                        suite: suite.name,
                        name: test.name,
                        status: 'failed',
                        duration: endTime - startTime,
                        error: error.message
                    });
                }
            }
            console.log('');
        }

        // 打印总结
        console.log('═'.repeat(50));
        console.log('📊 测试总结:');
        console.log(`   总计：${totalTests} 个测试`);
        console.log(`   通过：${passedTests} ✅`);
        console.log(`   失败：${failedTests} ❌`);
        console.log(`   通过率：${((passedTests / totalTests) * 100).toFixed(1)}%`);
        console.log('═'.repeat(50));

        return {
            total: totalTests,
            passed: passedTests,
            failed: failedTests,
            successRate: ((passedTests / totalTests) * 100).toFixed(1)
        };
    }

    /**
     * 获取测试报告
     */
    getReport() {
        return {
            results: this.results,
            summary: {
                total: this.results.length,
                passed: this.results.filter(r => r.status === 'passed').length,
                failed: this.results.filter(r => r.status === 'failed').length
            }
        };
    }
}

/**
 * 断言函数
 */
export const assert = {
    equal(actual, expected, message = '值不相等') {
        if (actual !== expected) {
            throw new Error(`${message}\n  期望：${expected}\n  实际：${actual}`);
        }
    },

    deepEqual(actual, expected, message = '对象不相等') {
        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(expected);
        if (actualStr !== expectedStr) {
            throw new Error(`${message}\n  期望：${expectedStr}\n  实际：${actualStr}`);
        }
    },

    ok(value, message = '值为 falsy') {
        if (!value) {
            throw new Error(message);
        }
    },

    notOk(value, message = '值为 truthy') {
        if (value) {
            throw new Error(message);
        }
    },

    throws(fn, message = '函数未抛出错误') {
        let thrown = false;
        try {
            fn();
        } catch (e) {
            thrown = true;
        }
        if (!thrown) {
            throw new Error(message);
        }
    },

    notThrows(fn, message = '函数抛出了错误') {
        try {
            fn();
        } catch (e) {
            throw new Error(message);
        }
    },

    arrayEqual(actual, expected, message = '数组不相等') {
        if (actual.length !== expected.length) {
            throw new Error(`${message}\n  长度不同\n  期望长度：${expected.length}\n  实际长度：${actual.length}`);
        }
        for (let i = 0; i < actual.length; i++) {
            if (actual[i] !== expected[i]) {
                throw new Error(`${message}\n  索引 ${i} 处的值不同\n  期望：${expected[i]}\n  实际：${actual[i]}`);
            }
        }
    },

    closeTo(actual, expected, delta, message = '值不在允许范围内') {
        if (Math.abs(actual - expected) > delta) {
            throw new Error(`${message}\n  期望：${expected} ± ${delta}\n  实际：${actual}`);
        }
    }
};

// 创建全局测试实例
export const testRunner = new TestRunner();
export const { describe, it, run } = testRunner;

console.log('✅ 测试框架已加载');
