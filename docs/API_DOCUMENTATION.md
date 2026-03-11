# 📚 数学修仙传 - API 技术文档

## 版本信息
- **版本**: v10.4
- **更新日期**: 2026-03-11
- **文档状态**: 正式版

---

## 一、核心配置 API

### 1.1 GAME_CONFIG

全局配置对象，包含所有游戏参数。

```javascript
import { GAME_CONFIG } from './js/config.js';

// 访问配置
const baseExp = GAME_CONFIG.LEVEL.BASE_EXP;        // 100
const maxLevel = GAME_CONFIG.LEVEL.MAX_LEVEL;      // 10
const particleCount = GAME_CONFIG.CANVAS.PARTICLE_COUNT; // 60
```

#### 配置结构

| 配置项 | 类型 | 描述 |
|--------|------|------|
| `VERSION` | string | 版本号 |
| `LEVEL` | object | 等级配置 |
| `CHECKIN` | object | 签到配置 |
| `QUIZ` | object | 测验配置 |
| `GAME` | object | 游戏配置 |
| `CANVAS` | object | 画布配置 |
| `EFFECTS` | object | 效果配置 |
| `STORAGE` | object | 存储配置 |
| `TIMING` | object | 时间配置 |
| `RECOMMENDER` | object | 推荐器配置 |
| `UI` | object | 界面配置 |

---

## 二、工具函数 API

### 2.1 安全函数

#### escapeHtml(str)
转义 HTML 特殊字符，防止 XSS 攻击。

```javascript
import { escapeHtml } from './js/utils/helpers.js';

const safe = escapeHtml('<script>alert(1)</script>');
// 结果: '&lt;script&gt;alert(1)&lt;/script&gt;'
```

**参数**:
- `str` (string): 需要转义的字符串

**返回值**: string - 转义后的安全字符串

---

#### safeTemplate(template, data)
安全渲染 HTML 模板，自动转义变量。

```javascript
import { safeTemplate } from './js/utils/helpers.js';

const html = safeTemplate('<div>{{name}}</div>', { name: '<b>Test</b>' });
// 结果: '<div>&lt;b&gt;Test&lt;/b&gt;</div>'
```

**参数**:
- `template` (string): HTML 模板，使用 `{{variable}}` 作为占位符
- `data` (object): 数据对象

**返回值**: string - 安全的 HTML 字符串

---

#### createElement(tag, attrs, textContent)
创建 DOM 元素，自动处理属性绑定。

```javascript
import { createElement } from './js/utils/helpers.js';

const button = createElement('button', {
    className: 'btn-primary',
    onClick: () => console.log('clicked'),
    dataset: { id: '123' }
}, '点击我');
```

**参数**:
- `tag` (string): 标签名
- `attrs` (object): 属性对象
- `textContent` (string): 文本内容

**返回值**: HTMLElement - 创建的元素

---

### 2.2 格式化函数

#### formatTime(date, format)
格式化日期时间。

```javascript
import { formatTime } from './js/utils/helpers.js';

formatTime(new Date(), 'YYYY-MM-DD');     // '2024-01-15'
formatTime(new Date(), 'YYYY-MM-DD HH:mm'); // '2024-01-15 14:30'
```

---

#### formatNumber(num)
格式化数字，添加千分位分隔符。

```javascript
import { formatNumber } from './js/utils/helpers.js';

formatNumber(1234567);  // '1,234,567'
formatNumber(1234.56);  // '1,234.56'
```

---

#### formatDuration(seconds)
格式化时长。

```javascript
import { formatDuration } from './js/utils/helpers.js';

formatDuration(3661);  // '1小时1分钟1秒'
formatDuration(65);    // '1分钟5秒'
```

---

### 2.3 数组工具函数

#### shuffleArray(array)
随机打乱数组顺序（返回新数组）。

```javascript
import { shuffleArray } from './js/utils/helpers.js';

const shuffled = shuffleArray([1, 2, 3, 4, 5]);
```

---

#### chunkArray(array, size)
将数组分割成指定大小的块。

```javascript
import { chunkArray } from './js/utils/helpers.js';

chunkArray([1, 2, 3, 4, 5, 6], 2);
// 结果: [[1, 2], [3, 4], [5, 6]]
```

---

#### uniqueArray(array)
数组去重。

```javascript
import { uniqueArray } from './js/utils/helpers.js';

uniqueArray([1, 2, 2, 3, 3, 4]);
// 结果: [1, 2, 3, 4]
```

---

### 2.4 其他工具函数

#### debounce(func, wait)
防抖函数。

```javascript
import { debounce } from './js/utils/helpers.js';

const debouncedSearch = debounce((query) => {
    console.log('搜索:', query);
}, 300);
```

---

#### throttle(func, limit)
节流函数。

```javascript
import { throttle } from './js/utils/helpers.js';

const throttledScroll = throttle(() => {
    console.log('滚动事件');
}, 100);
```

---

#### deepClone(obj)
深拷贝对象。

```javascript
import { deepClone } from './js/utils/helpers.js';

const cloned = deepClone({ a: 1, b: { c: 2 } });
```

---

## 三、缓存管理 API

### 3.1 CacheManager

统一缓存管理器。

```javascript
import { cacheManager } from './js/utils/cache-manager.js';

// 设置缓存
cacheManager.set('quizBank', 'level_1', quizData);

// 获取缓存
const data = cacheManager.get('quizBank', 'level_1');

// 检查缓存是否存在
cacheManager.has('quizBank', 'level_1');

// 删除缓存
cacheManager.delete('quizBank', 'level_1');

// 清空指定缓存
cacheManager.clear('quizBank');

// 获取缓存统计
const stats = cacheManager.getStats('quizBank');
```

---

### 3.2 memoize(fn, options)
函数记忆化装饰器。

```javascript
import { memoize } from './js/utils/cache-manager.js';

const expensiveCalculation = memoize((n) => {
    // 复杂计算
    return n * n;
}, { ttl: 60000, maxSize: 100 });
```

---

## 四、通知系统 API

### 4.1 NotificationManager

统一通知管理器，替代 alert()。

```javascript
import { notify } from './js/utils/notify.js';

// 成功通知
notify.success('操作成功！');

// 错误通知
notify.error('操作失败！', { duration: 5000 });

// 警告通知
notify.warning('请注意！');

// 信息通知
notify.info('提示信息');

// 成就通知
notify.achievement('初出茅庐', '首次挑战成功', { icon: '🎯' });

// 确认对话框
const confirmed = await notify.confirm('确认删除？', '此操作不可恢复');
if (confirmed) {
    // 用户点击确认
}

// 提示对话框
await notify.alert('提示', '这是一条提示信息');

// 输入对话框
const value = await notify.prompt('请输入', '请输入您的名字');
```

---

### 4.2 快捷函数

```javascript
import { showToast, showAlert, showConfirm, showAchievement } from './js/utils/notify.js';

showToast('消息', 'success');
showAlert('标题', '内容');
showConfirm('标题', '内容').then(result => console.log(result));
showAchievement('成就名称', '成就描述');
```

---

## 五、输入验证 API

### 5.1 InputValidator

输入验证器。

```javascript
import { inputValidator } from './js/utils/error-handler.js';

// 验证输入
const result = inputValidator.validate('test@example.com', [
    'required',
    { name: 'maxLength', params: [100] }
]);

if (result.valid) {
    // 验证通过
} else {
    console.log(result.results.filter(r => !r.valid));
}

// 清理输入
const clean = inputValidator.sanitize(userInput, 'html');
```

#### 内置验证规则

| 规则名 | 参数 | 描述 |
|--------|------|------|
| `required` | - | 必填验证 |
| `number` | - | 数字验证 |
| `positiveNumber` | - | 正数验证 |
| `integer` | - | 整数验证 |
| `range` | [min, max] | 范围验证 |
| `maxLength` | [max] | 最大长度验证 |
| `minLength` | [min] | 最小长度验证 |
| `pattern` | [RegExp] | 正则验证 |
| `answer` | [correct, tolerance] | 答案验证 |

---

## 六、边界处理 API

### 6.1 BoundaryHandler

边界条件处理器。

```javascript
import { boundaryHandler } from './js/utils/error-handler.js';

// 安全除法
const result = boundaryHandler.safeDivide(10, 2, 0);  // 5
const fallback = boundaryHandler.safeDivide(10, 0, -1);  // -1

// 值范围限制
const clamped = boundaryHandler.clamp(150, 0, 100);  // 100

// 安全数组访问
const value = boundaryHandler.safeArrayAccess(arr, index, null);

// 安全对象属性访问
const prop = boundaryHandler.safeObjectAccess(obj, 'a.b.c', 'default');

// 安全百分比计算
const percent = boundaryHandler.safePercentage(3, 10, 1);  // '30.0'
```

---

## 七、恢复管理 API

### 7.1 RecoveryManager

状态恢复管理器。

```javascript
import { recoveryManager } from './js/utils/error-handler.js';

// 保存检查点
recoveryManager.saveCheckpoint('before_save', { level: 5, exp: 500 });

// 恢复检查点
const state = recoveryManager.restoreCheckpoint('before_save');

// 检查检查点是否存在
recoveryManager.hasCheckpoint('before_save');

// 清除检查点
recoveryManager.clearCheckpoint('before_save');
recoveryManager.clearAllCheckpoints();
```

---

## 八、响应式管理 API

### 8.1 ResponsiveManager

响应式布局管理器。

```javascript
import { responsiveManager } from './js/utils/responsive-compat.js';

// 获取当前断点
const breakpoint = responsiveManager.currentBreakpoint;  // 'md', 'lg', etc.

// 检查是否为移动端
const isMobile = responsiveManager.isMobile();

// 检查是否为平板
const isTablet = responsiveManager.isTablet();

// 检查是否为桌面端
const isDesktop = responsiveManager.isDesktop();

// 获取设备信息
const device = responsiveManager.deviceInfo;
// { isMobile, isTablet, isDesktop, isTouch, isIOS, isAndroid, ... }

// 检查是否达到指定断点
const isLarge = responsiveManager.isBreakpoint('lg');
```

---

## 九、浏览器兼容性 API

### 9.1 BrowserCompatibility

浏览器特性检测器。

```javascript
import { browserCompatibility } from './js/utils/responsive-compat.js';

// 检查特性支持
const supportsServiceWorker = browserCompatibility.isSupported('serviceWorker');
const supportsIndexedDB = browserCompatibility.isSupported('indexedDB');

// 获取浏览器信息
const browser = browserCompatibility.browser;
// { name: 'chrome', version: 120, userAgent: '...' }

// 获取不支持的特性列表
const unsupported = browserCompatibility.getUnsupportedFeatures();
```

---

## 十、无障碍管理 API

### 10.1 AccessibilityManager

无障碍功能管理器。

```javascript
import { accessibilityManager } from './js/utils/responsive-compat.js';

// 获取偏好设置
const prefs = accessibilityManager.getPreferences();
// { highContrast, reducedMotion, fontSize, screenReader }

// 设置偏好
accessibilityManager.setPreference('highContrast', true);
accessibilityManager.setPreference('fontSize', 'large');

// 屏幕阅读器通知
accessibilityManager.announce('新消息已到达');
```

---

## 十一、模板系统 API

### 11.1 Templates

预定义的 UI 模板。

```javascript
import { Templates } from './js/utils/templates.js';

// 模态框模板
const modalHtml = Templates.modal.base('my-modal', '标题', '内容', '底部');

// 测验问题模板
const questionHtml = Templates.quiz.question({
    current: 1,
    total: 10,
    timeLeft: 30,
    question: '1 + 1 = ?',
    options: ['1', '2', '3', '4']
});

// 游戏卡片模板
const cardHtml = Templates.game.card({
    icon: '🎮',
    title: '游戏名称',
    description: '游戏描述',
    onclick: 'startGame("type")'
});

// 通知模板
const toastHtml = Templates.notification.toast({
    type: 'success',
    message: '操作成功！'
});
```

---

## 十二、存储 API

### 12.1 storage

本地存储封装。

```javascript
import { storage } from './js/utils/helpers.js';

// 存储数据
storage.set('user_data', { name: 'User', level: 5 });

// 获取数据
const data = storage.get('user_data');
const data = storage.get('nonexistent', 'default_value');

// 删除数据
storage.remove('user_data');

// 清空所有数据
storage.clear();
```

---

## 十三、事件系统 API

### 13.1 eventBus

全局事件总线。

```javascript
import { eventBus, SystemEvents } from './js/utils/event-bus.js';

// 监听事件
eventBus.on('user:levelUp', (data) => {
    console.log('升级了！', data);
});

// 触发事件
eventBus.emit('user:levelUp', { level: 5, exp: 500 });

// 一次性监听
eventBus.once('game:complete', () => {
    console.log('游戏完成！');
});

// 取消监听
const handler = (data) => console.log(data);
eventBus.on('event', handler);
eventBus.off('event', handler);
```

---

## 十四、性能监控 API

### 14.1 PerformanceMonitor

性能监控器。

```javascript
import { perfMonitor } from './js/utils/performance.js';

// 开始 FPS 监控
perfMonitor.startFPSMonitor();

// 获取当前 FPS
const fps = perfMonitor.metrics.fps;

// 获取性能历史
const history = perfMonitor.history;
```

---

## 附录

### A. 错误码定义

| 错误码 | 描述 |
|--------|------|
| `E001` | 存储空间不足 |
| `E002` | 数据解析失败 |
| `E003` | 网络请求失败 |
| `E004` | 输入验证失败 |
| `E005` | 权限不足 |

### B. 事件类型

| 事件名 | 描述 | 数据 |
|--------|------|------|
| `user:levelUp` | 用户升级 | `{ level, exp }` |
| `user:expGain` | 获得经验 | `{ amount, source }` |
| `quiz:complete` | 测验完成 | `{ correct, total, exp }` |
| `game:start` | 游戏开始 | `{ type }` |
| `game:end` | 游戏结束 | `{ score, exp }` |
| `achievement:unlock` | 成就解锁 | `{ id, name }` |

### C. 存储键名

| 键名 | 描述 |
|------|------|
| `math_cultivation_v3` | 用户状态 |
| `math_gamification_v1` | 游戏化数据 |
| `math_learning_analysis` | 学习分析数据 |
| `math_spaced_repetition` | 间隔重复数据 |

---

**文档版本**: v1.0  
**最后更新**: 2026-03-11
