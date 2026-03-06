# 👨‍💻 数学修仙传 - 开发者指南

## 📖 目录

1. [开发环境配置](#开发环境配置)
2. [项目架构详解](#项目架构详解)
3. [工具函数 API](#工具函数-api)
4. [事件系统参考](#事件系统参考)
5. [性能优化指南](#性能优化指南)
6. [测试指南](#测试指南)
7. [常见问题](#常见问题)

---

## 开发环境配置

### 系统要求
- Node.js 16+ (可选，用于开发工具)
- Python 3.6+ (用于本地服务器)
- 现代浏览器 (Chrome 90+, Firefox 88+, Safari 14+)

### 快速开始

```bash
# 1. 克隆项目
git clone <repository-url>
cd math-god

# 2. 启动本地服务器
python -m http.server 8080

# 3. 访问应用
# http://localhost:8080/

# 4. 访问测试中心
# http://localhost:8080/tests/index.html
```

### 推荐工具
- **编辑器**: VS Code
- **扩展**: 
  - ESLint
  - Prettier
  - Live Server
- **调试**: Chrome DevTools

---

## 项目架构详解

### 模块化架构

```
┌─────────────────────────────────────────┐
│           应用层 (index.html)            │
│  - 页面结构                              │
│  - 全局函数导出                          │
│  - 模块导入                              │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│          工具层 (utils/)                 │
│  - helpers.js (工具函数)                 │
│  - event-bus.js (事件总线)               │
│  - performance.js (性能优化)             │
│  - notification.js (通知系统)            │
│  - progress.js (进度追踪)                │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│         功能层 (modules/)                │
│  - state.js (状态管理)                   │
│  - renderer.js (UI 渲染)                  │
│  - challenge.js (挑战系统)               │
│  - games.js (小游戏)                     │
│  - gamification.js (游戏化)              │
│  ...                                     │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│          数据层 (data/)                  │
│  - data.js (核心数据)                    │
│  - data-mathematicians-expansion.js      │
│  - quiz-expansion.js                     │
└─────────────────────────────────────────┘
```

### 模块依赖关系

```javascript
// index.html 中的导入顺序
import { storage, debounce, throttle } from './js/utils/helpers.js';
import { eventBus, SystemEvents } from './js/utils/event-bus.js';
import { perfMonitor, cacheManager } from './js/utils/performance.js';
import { notificationManager } from './js/utils/notification.js';
import { progressTracker } from './js/utils/progress.js';

import { initUserState, getUserState } from './js/modules/state.js';
import { renderRealms, updateProfileUI } from './js/modules/renderer.js';
import { challengeManager } from './js/modules/challenge.js';
// ... 其他模块
```

---

## 工具函数 API

### helpers.js

#### debounce(func, wait = 300)
防抖函数，延迟执行

```javascript
import { debounce } from './utils/helpers.js';

const saveToServer = debounce((data) => {
    console.log('保存:', data);
}, 500);

input.addEventListener('input', (e) => {
    saveToServer(e.target.value);
});
```

#### throttle(func, limit = 300)
节流函数，限制执行频率

```javascript
import { throttle } from './utils/helpers.js';

const handleScroll = throttle(() => {
    console.log('滚动位置:', window.scrollY);
}, 100);

window.addEventListener('scroll', handleScroll);
```

#### storage
本地存储封装

```javascript
import { storage } from './utils/helpers.js';

// 存储
storage.set('user', { name: '张三', age: 25 });

// 读取
const user = storage.get('user');

// 删除
storage.remove('user');

// 清空
storage.clear();
```

#### formatTime(date, format)
格式化时间

```javascript
import { formatTime } from './utils/helpers.js';

const now = new Date();
console.log(formatTime(now, 'YYYY-MM-DD')); // "2024-01-15"
console.log(formatTime(now, 'HH:mm:ss'));   // "14:30:45"
```

#### formatNumber(num)
格式化数字（千分位）

```javascript
import { formatNumber } from './utils/helpers.js';

console.log(formatNumber(1000000));  // "1,000,000"
console.log(formatNumber(1234.56));  // "1,234.56"
```

#### formatDuration(milliseconds)
格式化时长

```javascript
import { formatDuration } from './utils/helpers.js';

console.log(formatDuration(3661000));  // "1 小时 1 分钟"
console.log(formatDuration(125000));   // "2 分钟 5 秒"
```

#### shuffleArray(array)
随机打乱数组

```javascript
import { shuffleArray } from './utils/helpers.js';

const cards = [1, 2, 3, 4, 5];
const shuffled = shuffleArray(cards);
console.log(shuffled); // 随机顺序
```

#### deepClone(obj)
深拷贝对象

```javascript
import { deepClone } from './utils/helpers.js';

const obj = { a: 1, b: { c: 2 } };
const cloned = deepClone(obj);
cloned.b.c = 3;
console.log(obj.b.c);  // 2 (原对象未变)
```

#### chunkArray(array, size)
数组分块

```javascript
import { chunkArray } from './utils/helpers.js';

const arr = [1, 2, 3, 4, 5, 6, 7];
const chunks = chunkArray(arr, 3);
console.log(chunks);  // [[1,2,3], [4,5,6], [7]]
```

#### uniqueArray(array, key)
数组去重

```javascript
import { uniqueArray } from './utils/helpers.js';

// 基本类型去重
const nums = [1, 2, 2, 3, 3, 3];
const unique = uniqueArray(nums);  // [1, 2, 3]

// 对象数组去重
const users = [
    { id: 1, name: 'A' },
    { id: 2, name: 'B' },
    { id: 1, name: 'C' }
];
const uniqueUsers = uniqueArray(users, 'id');
```

#### calculatePercentage(part, total, decimals)
计算百分比

```javascript
import { calculatePercentage } from './utils/helpers.js';

console.log(calculatePercentage(25, 100));     // "25.0%"
console.log(calculatePercentage(1, 3, 2));     // "33.33%"
```

#### calculateLevel(exp)
根据经验值计算等级

```javascript
import { calculateLevel } from './utils/helpers.js';

console.log(calculateLevel(0));    // 1
console.log(calculateLevel(500));  // 4
console.log(calculateLevel(5000)); // 10
```

---

## 事件系统参考

### 系统事件列表

#### 用户事件
```javascript
SystemEvents.USER_LOGIN       // 用户登录
SystemEvents.USER_LOGOUT      // 用户登出
SystemEvents.USER_UPDATE      // 用户信息更新
SystemEvents.USER_LEVEL_UP    // 用户升级
```

#### 学习事件
```javascript
SystemEvents.STUDY_START         // 开始学习
SystemEvents.STUDY_PAUSE         // 暂停学习
SystemEvents.STUDY_COMPLETE      // 完成学习
SystemEvents.STUDY_TIME_UPDATE   // 学习时长更新
```

#### 答题事件
```javascript
SystemEvents.QUIZ_START       // 开始答题
SystemEvents.QUIZ_ANSWER      // 回答问题
SystemEvents.QUIZ_COMPLETE    // 完成答题
SystemEvents.QUIZ_STREAK      // 连击
```

#### 任务事件
```javascript
SystemEvents.TASK_UPDATE        // 任务更新
SystemEvents.TASK_COMPLETE      // 任务完成
SystemEvents.TASK_DAILY_RESET   // 每日任务重置
```

#### 成就事件
```javascript
SystemEvents.ACHIEVEMENT_UNLOCK   // 成就解锁
SystemEvents.ACHIEVEMENT_UPDATE   // 成就更新
```

#### 游戏事件
```javascript
SystemEvents.GAME_START      // 游戏开始
SystemEvents.GAME_END        // 游戏结束
SystemEvents.GAME_SCORE      // 游戏得分
```

#### 系统事件
```javascript
SystemEvents.NAVIGATE          // 页面导航
SystemEvents.MODAL_OPEN        // 模态框打开
SystemEvents.MODAL_CLOSE       // 模态框关闭
SystemEvents.NOTIFICATION      // 系统通知
SystemEvents.ERROR             // 系统错误
```

### 使用示例

#### 订阅事件
```javascript
import { eventBus, SystemEvents } from './utils/event-bus.js';

// 基本订阅
const unsubscribe = eventBus.on(SystemEvents.QUIZ_COMPLETE, (data) => {
    console.log('答题完成:', data);
});

// 一次性订阅
eventBus.once(SystemEvents.USER_LEVEL_UP, (data) => {
    console.log('升级了！');
});

// 取消订阅
unsubscribe();
```

#### 发布事件
```javascript
// 发布自定义事件
eventBus.emit(SystemEvents.QUIZ_COMPLETE, {
    level: 1,
    correct: 8,
    total: 10,
    accuracy: 80
});

// 发布通知事件
eventBus.emit(SystemEvents.NOTIFICATION, {
    title: '恭喜！',
    message: '答题正确率超过 90%',
    type: 'success'
});
```

---

## 性能优化指南

### 1. 使用缓存

```javascript
import { cacheManager } from './utils/performance.js';

// 缓存 API 响应
async function fetchData(key, url) {
    // 尝试缓存
    const cached = cacheManager.get(key);
    if (cached) return cached;

    // 获取数据
    const response = await fetch(url);
    const data = await response.json();

    // 存入缓存
    cacheManager.set(key, data);
    return data;
}
```

### 2. 虚拟滚动

```javascript
import { renderOptimizer } from './utils/performance.js';

// 优化长列表
renderOptimizer.setupVirtualScroll(
    document.getElementById('list'),
    largeArray,           // 1000+ 项
    (item, index) => {    // 渲染函数
        const div = document.createElement('div');
        div.textContent = item.name;
        return div;
    },
    50  // 每项高度 (px)
);
```

### 3. 批量 DOM 更新

```javascript
import { renderOptimizer } from './utils/performance.js';

// 批量更新
renderOptimizer.batchUpdate(() => {
    // 多次 DOM 操作只触发一次重排
    element1.textContent = 'A';
    element2.classList.add('active');
    element3.style.color = 'red';
});
```

### 4. 防抖节流

```javascript
import { debounce, throttle } from './utils/helpers.js';

// 搜索输入 - 防抖
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', debounce((e) => {
    performSearch(e.target.value);
}, 300));

// 窗口调整 - 节流
window.addEventListener('resize', throttle(() => {
    handleResize();
}, 200));
```

### 5. 懒加载资源

```javascript
import { resourceOptimizer } from './utils/performance.js';

// 懒加载脚本
const loadModule = async () => {
    await resourceOptimizer.loadScript('./modules/advanced.js');
    // 模块现在可用
};

// 预加载关键资源
resourceOptimizer.preloadResources([
    './css/critical.css',
    './images/hero.jpg'
]);
```

### 6. 性能监控

```javascript
import { perfMonitor } from './utils/performance.js';

// 启动 FPS 监控
perfMonitor.startFPSMonitor();

// 记录加载时间
perfMonitor.recordLoadTime();

// 获取性能报告
const report = perfMonitor.getReport();
console.log(`FPS: ${report.currentFPS}, 加载时间：${report.loadTime}ms`);
```

---

## 测试指南

### 编写测试

```javascript
// tests/test-example.js
import { describe, it, assert } from './test-framework.js';
import { myFunction } from '../js/utils/helpers.js';

describe('myFunction 测试', () => {
    it('应该返回正确结果', () => {
        const result = myFunction(5);
        assert.equal(result, 10);
    });

    it('应该处理边界情况', () => {
        assert.throws(() => myFunction(-1));
    });
});
```

### 运行测试

1. 访问测试中心：`http://localhost:8080/tests/index.html`
2. 点击"运行所有测试"
3. 查看测试结果和控制台输出

### 断言方法

```javascript
assert.equal(actual, expected)           // 相等
assert.deepEqual(actual, expected)       // 深度相等
assert.ok(value)                         // 值为 truthy
assert.notOk(value)                      // 值为 falsy
assert.arrayEqual(actual, expected)      // 数组相等
assert.throws(fn)                        // 抛出错误
assert.notThrows(fn)                     // 不抛出错误
assert.closeTo(actual, expected, delta)  // 接近
```

---

## 常见问题

### Q: 如何添加新的工具函数？

A: 
1. 在 `js/utils/helpers.js` 中添加函数
2. 编写 JSDoc 注释
3. 在文件末尾导出
4. 添加测试用例

```javascript
/**
 * 新工具函数
 * @param {type} param - 说明
 * @returns {type} 返回值说明
 */
export function newUtility(param) {
    // 实现
}
```

### Q: 如何调试模块加载问题？

A:
1. 打开浏览器开发者工具
2. 查看 Console 中的错误信息
3. 检查 Network 面板确认文件加载
4. 验证导入路径是否正确

### Q: 性能监控数据在哪里查看？

A:
1. 打开浏览器 Console
2. 性能监控数据会定期输出
3. 或调用 `perfMonitor.getReport()` 获取报告

### Q: 如何贡献代码？

A:
1. Fork 项目
2. 创建特性分支
3. 编写代码和测试
4. 提交 Pull Request

### Q: 测试失败怎么办？

A:
1. 查看测试中心的详细错误信息
2. 检查测试用例是否正确
3. 验证被测试函数实现
4. 在 Console 中调试

---

## 附录

### 快捷键

- `Ctrl + Shift + P` - 打开命令面板
- `Ctrl + `` ` - 切换终端
- `F12` - 打开开发者工具

### 资源链接

- [MDN Web Docs](https://developer.mozilla.org/)
- [JavaScript.info](https://javascript.info/)
- [Eloquent JavaScript](https://eloquentjavascript.net/)

---

**📚 祝开发愉快！**
