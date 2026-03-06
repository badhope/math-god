/**
 * 数学修仙传 - 工具函数测试
 */

import { describe, it, assert } from './test-framework.js';
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
    calculateLevel
} from '../js/utils/helpers.js';

// 测试 formatTime
describe('formatTime 函数', () => {
    it('应该正确格式化日期', () => {
        const date = new Date('2024-01-15 14:30:45');
        const result = formatTime(date, 'YYYY-MM-DD');
        assert.equal(result, '2024-01-15');
    });

    it('应该处理无效日期', () => {
        const result = formatTime('invalid');
        assert.equal(result, '无效日期');
    });

    it('应该使用时间戳', () => {
        const timestamp = new Date('2024-06-01 10:00:00').getTime();
        const result = formatTime(timestamp, 'YYYY-MM-DD');
        assert.equal(result, '2024-06-01');
    });
});

// 测试 formatNumber
describe('formatNumber 函数', () => {
    it('应该添加千分位分隔符', () => {
        assert.equal(formatNumber(1000), '1,000');
        assert.equal(formatNumber(1000000), '1,000,000');
    });

    it('应该处理小数', () => {
        assert.equal(formatNumber(1234.56), '1,234.56');
    });

    it('应该处理负数', () => {
        assert.equal(formatNumber(-1000), '-1,000');
    });

    it('应该返回非数字原值', () => {
        assert.equal(formatNumber('abc'), 'abc');
    });
});

// 测试 formatDuration
describe('formatDuration 函数', () => {
    it('应该格式化秒', () => {
        const result = formatDuration(5000);
        assert.equal(result, '5 秒');
    });

    it('应该格式化分钟', () => {
        const result = formatDuration(125000);
        assert.equal(result, '2 分钟 5 秒');
    });

    it('应该格式化小时', () => {
        const result = formatDuration(3661000);
        assert.equal(result, '1 小时 1 分钟');
    });

    it('应该格式化天数', () => {
        const result = formatDuration(90000000);
        assert.equal(result, '1 天 1 小时');
    });
});

// 测试 randomRange
describe('randomRange 函数', () => {
    it('应该生成指定范围内的随机数', () => {
        for (let i = 0; i < 100; i++) {
            const result = randomRange(1, 10);
            assert.ok(result >= 1 && result <= 10);
        }
    });

    it('应该处理相同的最小最大值', () => {
        const result = randomRange(5, 5);
        assert.equal(result, 5);
    });
});

// 测试 shuffleArray
describe('shuffleArray 函数', () => {
    it('应该打乱数组', () => {
        const original = [1, 2, 3, 4, 5];
        const shuffled = shuffleArray([...original]);
        assert.notEqual(JSON.stringify(original), JSON.stringify(shuffled));
    });

    it('应该保持元素不变', () => {
        const original = [1, 2, 3, 4, 5];
        const shuffled = shuffleArray([...original]);
        assert.equal(original.length, shuffled.length);
        original.forEach(item => {
            assert.ok(shuffled.includes(item));
        });
    });

    it('不应该修改原数组', () => {
        const original = [1, 2, 3, 4, 5];
        const originalCopy = [...original];
        shuffleArray(original);
        assert.arrayEqual(original, originalCopy);
    });
});

// 测试 deepClone
describe('deepClone 函数', () => {
    it('应该深拷贝对象', () => {
        const obj = { a: 1, b: { c: 2 } };
        const cloned = deepClone(obj);
        cloned.b.c = 3;
        assert.equal(obj.b.c, 2);
        assert.equal(cloned.b.c, 3);
    });

    it('应该深拷贝数组', () => {
        const arr = [1, [2, 3], { a: 4 }];
        const cloned = deepClone(arr);
        cloned[1][0] = 5;
        assert.equal(arr[1][0], 2);
        assert.equal(cloned[1][0], 5);
    });

    it('应该处理 Date 对象', () => {
        const date = new Date('2024-01-01');
        const cloned = deepClone(date);
        assert.equal(cloned.getTime(), date.getTime());
        assert.notEqual(cloned, date);
    });

    it('应该处理 null', () => {
        assert.equal(deepClone(null), null);
    });

    it('应该处理基本类型', () => {
        assert.equal(deepClone(42), 42);
        assert.equal(deepClone('test'), 'test');
        assert.equal(deepClone(true), true);
    });
});

// 测试 chunkArray
describe('chunkArray 函数', () => {
    it('应该正确分块数组', () => {
        const result = chunkArray([1, 2, 3, 4, 5], 2);
        assert.arrayEqual(result, [[1, 2], [3, 4], [5]]);
    });

    it('应该处理空数组', () => {
        const result = chunkArray([], 3);
        assert.arrayEqual(result, []);
    });

    it('应该处理块大小大于数组长度的情况', () => {
        const result = chunkArray([1, 2], 5);
        assert.arrayEqual(result, [[1, 2]]);
    });
});

// 测试 uniqueArray
describe('uniqueArray 函数', () => {
    it('应该去除重复元素', () => {
        const result = uniqueArray([1, 2, 2, 3, 3, 3]);
        assert.arrayEqual(result, [1, 2, 3]);
    });

    it('应该根据键名去重对象数组', () => {
        const arr = [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
            { id: 1, name: 'C' }
        ];
        const result = uniqueArray(arr, 'id');
        assert.equal(result.length, 2);
        assert.equal(result[0].id, 1);
        assert.equal(result[1].id, 2);
    });
});

// 测试 calculatePercentage
describe('calculatePercentage 函数', () => {
    it('应该计算百分比', () => {
        assert.equal(calculatePercentage(25, 100), '25.0%');
        assert.equal(calculatePercentage(50, 200), '25.0%');
    });

    it('应该处理小数位数', () => {
        assert.equal(calculatePercentage(1, 3, 2), '33.33%');
    });

    it('应该处理除零情况', () => {
        assert.equal(calculatePercentage(50, 0), '0%');
    });
});

// 测试 calculateLevel
describe('calculateLevel 函数', () => {
    it('应该根据经验值计算等级', () => {
        assert.equal(calculateLevel(0), 1);
        assert.equal(calculateLevel(50), 1);
        assert.equal(calculateLevel(100), 2);
        assert.equal(calculateLevel(500), 4);
        assert.equal(calculateLevel(5000), 10);
    });
});

// 测试 debounce
describe('debounce 函数', () => {
    it('应该延迟执行函数', (done) => {
        let callCount = 0;
        const debounced = debounce(() => callCount++, 100);
        
        debounced();
        debounced();
        debounced();
        
        assert.equal(callCount, 0);
        
        setTimeout(() => {
            assert.equal(callCount, 1);
            done();
        }, 150);
    });
});

// 测试 throttle
describe('throttle 函数', () => {
    it('应该限制函数执行频率', () => {
        let callCount = 0;
        const throttled = throttle(() => callCount++, 100);
        
        throttled();
        throttled();
        throttled();
        
        assert.equal(callCount, 1);
    });
});

console.log('✅ 所有测试已加载');
