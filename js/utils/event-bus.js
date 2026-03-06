/**
 * 数学修仙传 - 事件总线模块
 * 实现模块间的松耦合通信
 */

class EventBus {
    constructor() {
        this.events = new Map();
    }

    /**
     * 订阅事件
     * @param {string} event - 事件名
     * @param {Function} callback - 回调函数
     * @param {Object} context - 回调执行的上下文
     * @returns {Function} 取消订阅函数
     */
    on(event, callback, context = null) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        const subscription = { callback, context };
        this.events.get(event).push(subscription);

        // 返回取消订阅的函数
        return () => this.off(event, subscription);
    }

    /**
     * 取消订阅
     * @param {string} event - 事件名
     * @param {Object} subscription - 订阅对象
     */
    off(event, subscription) {
        if (!this.events.has(event)) return;
        const subscriptions = this.events.get(event);
        const index = subscriptions.indexOf(subscription);
        if (index > -1) {
            subscriptions.splice(index, 1);
        }
        if (subscriptions.length === 0) {
            this.events.delete(event);
        }
    }

    /**
     * 发布事件
     * @param {string} event - 事件名
     * @param  {...any} args - 传递的参数
     */
    emit(event, ...args) {
        if (!this.events.has(event)) return;
        const subscriptions = this.events.get(event);
        subscriptions.forEach(({ callback, context }) => {
            try {
                callback.apply(context, args);
            } catch (error) {
                console.error(`Event "${event}" callback error:`, error);
            }
        });
    }

    /**
     * 一次性订阅
     * @param {string} event - 事件名
     * @param {Function} callback - 回调函数
     * @param {Object} context - 回调执行的上下文
     */
    once(event, callback, context = null) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            callback.apply(context, args);
        };
        return this.on(event, wrapper, context);
    }

    /**
     * 清空事件
     * @param {string} [event] - 可选，只清空指定事件
     */
    clear(event = null) {
        if (event) {
            this.events.delete(event);
        } else {
            this.events.clear();
        }
    }

    /**
     * 获取事件订阅数
     * @param {string} event - 事件名
     * @returns {number} 订阅数
     */
    getListenerCount(event) {
        if (!this.events.has(event)) return 0;
        return this.events.get(event).length;
    }

    /**
     * 获取所有事件名
     * @returns {Array<string>} 事件名数组
     */
    getEvents() {
        return Array.from(this.events.keys());
    }
}

// 创建全局事件总线实例
export const eventBus = new EventBus();

// 预定义的系统事件
export const SystemEvents = {
    // 用户相关
    USER_LOGIN: 'user:login',
    USER_LOGOUT: 'user:logout',
    USER_UPDATE: 'user:update',
    USER_LEVEL_UP: 'user:levelup',
    
    // 学习相关
    STUDY_START: 'study:start',
    STUDY_PAUSE: 'study:pause',
    STUDY_COMPLETE: 'study:complete',
    STUDY_TIME_UPDATE: 'study:time_update',
    
    // 答题相关
    QUIZ_START: 'quiz:start',
    QUIZ_ANSWER: 'quiz:answer',
    QUIZ_COMPLETE: 'quiz:complete',
    QUIZ_STREAK: 'quiz:streak',
    
    // 任务相关
    TASK_UPDATE: 'task:update',
    TASK_COMPLETE: 'task:complete',
    TASK_DAILY_RESET: 'task:daily_reset',
    
    // 成就相关
    ACHIEVEMENT_UNLOCK: 'achievement:unlock',
    ACHIEVEMENT_UPDATE: 'achievement:update',
    
    // 游戏相关
    GAME_START: 'game:start',
    GAME_END: 'game:end',
    GAME_SCORE: 'game:score',
    
    // 社交相关
    SOCIAL_SHARE: 'social:share',
    SOCIAL_LIKE: 'social:like',
    
    // 系统相关
    NAVIGATE: 'system:navigate',
    MODAL_OPEN: 'system:modal_open',
    MODAL_CLOSE: 'system:modal_close',
    NOTIFICATION: 'system:notification',
    ERROR: 'system:error',
    
    // 数据相关
    DATA_LOAD: 'data:load',
    DATA_SAVE: 'data:save',
    DATA_UPDATE: 'data:update'
};

// 便捷的事件订阅函数
export function onSystemEvent(event, handler, context = null) {
    return eventBus.on(event, handler, context);
}

export function emitSystemEvent(event, ...args) {
    eventBus.emit(event, ...args);
}

// 性能监控 - 记录事件处理时间
export function monitorEvent(event, handler, context = null) {
    return eventBus.on(event, function(...args) {
        const start = performance.now();
        try {
            return handler.apply(this, args);
        } finally {
            const end = performance.now();
            console.log(`[Event Monitor] ${event}: ${(end - start).toFixed(2)}ms`);
        }
    }, context);
}

// 事件日志 - 用于调试
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    const originalEmit = eventBus.emit.bind(eventBus);
    eventBus.emit = function(event, ...args) {
        console.log(`[EventBus] ${event}:`, ...args);
        return originalEmit(event, ...args);
    };
}

console.log('✅ 事件总线已初始化');
