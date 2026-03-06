/**
 * 数学修仙传 - 工具模块索引
 * 统一导出所有工具函数和类
 */

// 基础工具函数
export * from './helpers.js';

// 事件总线
export { eventBus, SystemEvents, onSystemEvent, emitSystemEvent, monitorEvent } from './event-bus.js';

// 性能优化
export {
    PerformanceMonitor,
    ResourceOptimizer,
    RenderOptimizer,
    CacheManager,
    perfMonitor,
    resourceOptimizer,
    renderOptimizer,
    cacheManager
} from './performance.js';

// 通知系统
export {
    NotificationManager,
    ConfirmManager,
    LoadingManager,
    TooltipManager,
    notificationManager,
    confirmManager,
    loadingManager,
    tooltipManager,
    notify,
    confirm,
    showLoading,
    hideLoading
} from './notification.js';

// 进度追踪
export {
    ProgressTracker,
    StudyTimeTracker,
    GoalTracker,
    progressTracker,
    studyTimeTracker,
    goalTracker
} from './progress.js';

console.log('✅ 工具模块索引已加载');
