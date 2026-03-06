/**
 * 数学修仙传 - 通知系统
 * 提供统一的通知、提示、确认等交互功能
 */

import { eventBus, SystemEvents } from './event-bus.js';

/**
 * 通知管理器
 */
export class NotificationManager {
    constructor() {
        this.container = null;
        this.notifications = new Map();
        this.maxNotifications = 5;
        this.defaultDuration = 3000;
        this.init();
    }

    /**
     * 初始化通知容器
     */
    init() {
        this.container = document.createElement('div');
        this.container.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(this.container);
    }

    /**
     * 显示通知
     * @param {Object} options - 通知选项
     * @param {string} options.title - 标题
     * @param {string} options.message - 消息内容
     * @param {string} options.type - 类型 (success/error/warning/info)
     * @param {number} options.duration - 显示时长 (毫秒)
     * @param {boolean} options.closable - 是否可关闭
     * @param {Function} options.onClick - 点击回调
     * @returns {string} 通知 ID
     */
    show({
        title = '通知',
        message = '',
        type = 'info',
        duration = this.defaultDuration,
        closable = true,
        onClick = null
    } = {}) {
        const id = this.generateId();
        
        // 如果通知太多，移除最早的
        if (this.notifications.size >= this.maxNotifications) {
            const firstKey = this.notifications.keys().next().value;
            this.remove(firstKey);
        }

        const notification = this.createNotificationElement(id, {
            title,
            message,
            type,
            closable
        });

        this.notifications.set(id, { element: notification, timer: null });

        // 点击事件
        if (onClick) {
            notification.addEventListener('click', () => {
                onClick();
                this.remove(id);
            });
            notification.style.cursor = 'pointer';
        }

        // 自动关闭
        if (duration > 0) {
            const timer = setTimeout(() => this.remove(id), duration);
            this.notifications.get(id).timer = timer;
        }

        return id;
    }

    /**
     * 创建通知元素
     */
    createNotificationElement(id, { title, message, type, closable }) {
        const notification = document.createElement('div');
        notification.className = `
            notification-item
            animate-slide-in-right
            bg-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-[400px]
            border-l-4 ${this.getTypeBorder(type)}
            transition-all duration-300 ease-in-out
        `;
        notification.dataset.id = id;

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <div class="flex items-start gap-3">
                <div class="text-2xl">${icons[type]}</div>
                <div class="flex-1">
                    <div class="font-bold text-gray-800">${title}</div>
                    ${message ? `<div class="text-sm text-gray-600 mt-1">${message}</div>` : ''}
                </div>
                ${closable ? `
                    <button 
                        class="notification-close text-gray-400 hover:text-gray-600 transition-colors"
                        onclick="event.stopPropagation()"
                    >
                        ✕
                    </button>
                ` : ''}
            </div>
        `;

        // 关闭按钮事件
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.remove(id);
            });
        }

        this.container.appendChild(notification);
        return notification;
    }

    /**
     * 移除通知
     * @param {string} id - 通知 ID
     */
    remove(id) {
        const notification = this.notifications.get(id);
        if (!notification) return;

        const { element, timer } = notification;
        
        // 清除定时器
        if (timer) clearTimeout(timer);

        // 添加移除动画
        element.classList.remove('animate-slide-in-right');
        element.classList.add('animate-slide-out-right');

        // 动画结束后移除 DOM
        setTimeout(() => {
            element.remove();
            this.notifications.delete(id);
        }, 300);
    }

    /**
     * 移除所有通知
     */
    clear() {
        this.notifications.forEach((_, id) => this.remove(id));
    }

    /**
     * 获取类型对应的边框样式
     */
    getTypeBorder(type) {
        const borders = {
            success: 'border-green-500',
            error: 'border-red-500',
            warning: 'border-yellow-500',
            info: 'border-blue-500'
        };
        return borders[type] || borders.info;
    }

    /**
     * 生成唯一 ID
     * @returns {string} 唯一 ID
     */
    generateId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * 快捷方法 - 成功通知
     */
    success(title, message, duration = 3000) {
        return this.show({ title, message, type: 'success', duration });
    }

    /**
     * 快捷方法 - 错误通知
     */
    error(title, message, duration = 5000) {
        return this.show({ title, message, type: 'error', duration });
    }

    /**
     * 快捷方法 - 警告通知
     */
    warning(title, message, duration = 4000) {
        return this.show({ title, message, type: 'warning', duration });
    }

    /**
     * 快捷方法 - 信息通知
     */
    info(title, message, duration = 3000) {
        return this.show({ title, message, type: 'info', duration });
    }
}

/**
 * 确认对话框管理器
 */
export class ConfirmManager {
    constructor() {
        this.container = null;
        this.activeConfirm = null;
        this.init();
    }

    /**
     * 初始化容器
     */
    init() {
        this.container = document.createElement('div');
        this.container.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 hidden';
        document.body.appendChild(this.container);
    }

    /**
     * 显示确认对话框
     * @param {Object} options - 选项
     * @param {string} options.title - 标题
     * @param {string} options.message - 消息
     * @param {string} options.confirmText - 确认按钮文字
     * @param {string} options.cancelText - 取消按钮文字
     * @param {Function} options.onConfirm - 确认回调
     * @param {Function} options.onCancel - 取消回调
     * @returns {Promise<boolean>} 用户选择结果
     */
    show({
        title = '确认',
        message = '',
        confirmText = '确认',
        cancelText = '取消',
        onConfirm = null,
        onCancel = null
    } = {}) {
        return new Promise((resolve) => {
            this.activeConfirm = { resolve, onConfirm, onCancel };

            this.container.classList.remove('hidden');
            this.container.innerHTML = `
                <div class="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 animate-scale-in">
                    <div class="text-xl font-bold text-gray-800 mb-3">${title}</div>
                    <div class="text-gray-600 mb-6">${message}</div>
                    <div class="flex justify-end gap-3">
                        <button 
                            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        >
                            ${cancelText}
                        </button>
                        <button 
                            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            ${confirmText}
                        </button>
                    </div>
                </div>
            `;

            const [cancelBtn, confirmBtn] = this.container.querySelectorAll('button');
            
            cancelBtn.addEventListener('click', () => this.handleResponse(false));
            confirmBtn.addEventListener('click', () => this.handleResponse(true));

            // ESC 键关闭
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    this.handleResponse(false);
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);

            // 点击背景关闭
            this.container.addEventListener('click', (e) => {
                if (e.target === this.container) {
                    this.handleResponse(false);
                }
            });
        });
    }

    /**
     * 处理响应
     */
    async handleResponse(confirmed) {
        const { resolve, onConfirm, onCancel } = this.activeConfirm;
        
        if (confirmed && onConfirm) await onConfirm();
        if (!confirmed && onCancel) await onCancel();

        this.container.classList.add('hidden');
        this.container.innerHTML = '';
        resolve(confirmed);
        this.activeConfirm = null;
    }
}

/**
 * 加载提示管理器
 */
export class LoadingManager {
    constructor() {
        this.container = null;
        this.loadingCount = 0;
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.container = document.createElement('div');
        this.container.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 hidden';
        this.container.innerHTML = `
            <div class="bg-white rounded-lg p-6 shadow-xl">
                <div class="animate-spin text-4xl">🔄</div>
                <div class="text-center mt-3 text-gray-600">加载中...</div>
            </div>
        `;
        document.body.appendChild(this.container);
    }

    /**
     * 显示加载
     */
    show(message = '加载中...') {
        if (this.loadingCount === 0) {
            this.container.querySelector('div.text-center').textContent = message;
            this.container.classList.remove('hidden');
        }
        this.loadingCount++;
    }

    /**
     * 隐藏加载
     */
    hide() {
        this.loadingCount = Math.max(0, this.loadingCount - 1);
        if (this.loadingCount === 0) {
            this.container.classList.add('hidden');
        }
    }

    /**
     * 强制隐藏
     */
    forceHide() {
        this.loadingCount = 0;
        this.container.classList.add('hidden');
    }
}

/**
 * 提示工具管理器
 */
export class TooltipManager {
    constructor() {
        this.tooltip = null;
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'fixed z-50 px-3 py-2 text-sm text-white bg-gray-800 rounded shadow-lg pointer-events-none opacity-0 transition-opacity duration-200';
        document.body.appendChild(this.tooltip);
    }

    /**
     * 绑定提示到元素
     * @param {HTMLElement} element - 目标元素
     * @param {string} content - 提示内容
     * @param {string} position - 位置 (top/bottom/left/right)
     */
    bind(element, content, position = 'top') {
        const show = (e) => {
            this.tooltip.textContent = content;
            this.tooltip.classList.remove('opacity-0');
            this.updatePosition(e.target, position);
        };

        const hide = () => {
            this.tooltip.classList.add('opacity-0');
        };

        element.addEventListener('mouseenter', show);
        element.addEventListener('mouseleave', hide);
        element.addEventListener('focus', show);
        element.addEventListener('blur', hide);
    }

    /**
     * 更新提示位置
     */
    updatePosition(element, position) {
        const rect = element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        let top, left;

        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 8;
                break;
        }

        this.tooltip.style.top = `${top}px`;
        this.tooltip.style.left = `${left}px`;
    }
}

// 创建全局实例
export const notificationManager = new NotificationManager();
export const confirmManager = new ConfirmManager();
export const loadingManager = new LoadingManager();
export const tooltipManager = new TooltipManager();

// 导出便捷函数
export function notify(title, message, type = 'info') {
    return notificationManager.show({ title, message, type });
}

export function confirm(title, message) {
    return confirmManager.show({ title, message });
}

export function showLoading(message = '加载中...') {
    loadingManager.show(message);
}

export function hideLoading() {
    loadingManager.hide();
}

// 监听系统事件，自动显示通知
eventBus.on(SystemEvents.NOTIFICATION, (data) => {
    notificationManager.show(data);
});

eventBus.on(SystemEvents.ERROR, (error) => {
    notificationManager.error('系统错误', error.message || '发生未知错误');
});

console.log('✅ 通知系统已初始化');
