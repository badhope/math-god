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

// 核心性能优化模块
export {
    PerformanceOptimizer,
    VirtualScrollManager,
    SmartCache,
    RequestBatcher,
    ImageOptimizer,
    performanceOptimizer,
    smartCache,
    requestBatcher,
    imageOptimizer
} from './performance-optimizer.js';

// 学习分析模块
export {
    LearningAnalyzer,
    AdaptiveDifficultyManager,
    SpacedRepetitionScheduler,
    learningAnalyzer,
    adaptiveDifficulty,
    spacedRepetition
} from './learning-analyzer.js';

// 离线支持模块
export {
    OfflineSupportManager,
    DataPersistenceManager,
    NetworkAwareLoader,
    offlineSupport,
    dataPersistence,
    networkLoader
} from './offline-support.js';

// 异常处理模块
export {
    ErrorHandler,
    InputValidator,
    BoundaryHandler,
    RecoveryManager,
    errorHandler,
    inputValidator,
    boundaryHandler,
    recoveryManager
} from './error-handler.js';

// 响应式与兼容性模块
export {
    ResponsiveManager,
    BrowserCompatibility,
    AccessibilityManager,
    responsiveManager,
    browserCompatibility,
    accessibilityManager
} from './responsive-compat.js';

console.log('✅ 工具模块索引已加载');
