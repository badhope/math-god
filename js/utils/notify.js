/**
 * 数学修仙传 - 统一通知管理器
 * 替换所有 alert() 调用，提供友好的用户通知体验
 */

import { escapeHtml } from './helpers.js';

class NotificationManager {
    constructor() {
        this.container = null;
        this.queue = [];
        this.maxVisible = 5;
        this.defaultDuration = 3000;
        this._init();
    }

    _init() {
        if (typeof document === 'undefined') return;
        
        this.container = document.getElementById('notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none';
            this.container.style.cssText = 'max-height: calc(100vh - 100px); overflow-y: auto;';
            document.body.appendChild(this.container);
        }
    }

    _createNotification(type, message, options = {}) {
        const config = this._getTypeConfig(type);
        const duration = options.duration || this.defaultDuration;
        
        const notification = document.createElement('div');
        notification.className = `notification pointer-events-auto transform transition-all duration-300 translate-x-full opacity-0`;
        notification.innerHTML = `
            <div class="flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border ${config.borderClass} ${config.bgClass}"
                 style="min-width: 280px; max-width: 400px;">
                <span class="text-xl flex-shrink-0">${options.icon || config.icon}</span>
                <div class="flex-1 min-w-0">
                    ${options.title ? `<div class="font-bold ${config.titleClass} mb-1">${escapeHtml(options.title)}</div>` : ''}
                    <div class="${config.textClass} text-sm">${escapeHtml(message)}</div>
                </div>
                <button onclick="this.closest('.notification').remove()" 
                        class="text-current opacity-50 hover:opacity-100 transition-opacity flex-shrink-0">
                    ✕
                </button>
            </div>
        `;

        this.container.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.classList.remove('translate-x-full', 'opacity-0');
        });

        if (duration > 0) {
            setTimeout(() => {
                notification.classList.add('translate-x-full', 'opacity-0');
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }

        return notification;
    }

    _getTypeConfig(type) {
        const configs = {
            success: {
                icon: '✅',
                bgClass: 'bg-green-900/90',
                borderClass: 'border-green-500/50',
                titleClass: 'text-green-400',
                textClass: 'text-green-100'
            },
            error: {
                icon: '❌',
                bgClass: 'bg-red-900/90',
                borderClass: 'border-red-500/50',
                titleClass: 'text-red-400',
                textClass: 'text-red-100'
            },
            warning: {
                icon: '⚠️',
                bgClass: 'bg-amber-900/90',
                borderClass: 'border-amber-500/50',
                titleClass: 'text-amber-400',
                textClass: 'text-amber-100'
            },
            info: {
                icon: 'ℹ️',
                bgClass: 'bg-blue-900/90',
                borderClass: 'border-blue-500/50',
                titleClass: 'text-blue-400',
                textClass: 'text-blue-100'
            },
            achievement: {
                icon: '🏆',
                bgClass: 'bg-purple-900/90',
                borderClass: 'border-purple-500/50',
                titleClass: 'text-purple-400',
                textClass: 'text-purple-100'
            }
        };
        return configs[type] || configs.info;
    }

    success(message, options = {}) {
        return this._createNotification('success', message, options);
    }

    error(message, options = {}) {
        return this._createNotification('error', message, { ...options, duration: options.duration || 5000 });
    }

    warning(message, options = {}) {
        return this._createNotification('warning', message, options);
    }

    info(message, options = {}) {
        return this._createNotification('info', message, options);
    }

    achievement(name, description, options = {}) {
        return this._createNotification('achievement', description, {
            ...options,
            title: `🎉 ${name}`,
            icon: options.icon || '🏆',
            duration: options.duration || 5000
        });
    }

    confirm(title, message, options = {}) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/70 z-[9998] flex items-center justify-center';
            modal.innerHTML = `
                <div class="bg-slate-900 rounded-xl border border-slate-700 max-w-md w-full mx-4 transform transition-all">
                    <div class="p-6 text-center">
                        <div class="text-4xl mb-4">${options.icon || '⚠️'}</div>
                        <h3 class="text-xl font-bold text-amber-400 mb-2">${escapeHtml(title)}</h3>
                        <p class="text-slate-300 mb-6">${escapeHtml(message)}</p>
                        <div class="flex gap-3 justify-center">
                            <button id="confirm-cancel" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors">
                                ${options.cancelText || '取消'}
                            </button>
                            <button id="confirm-ok" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white font-bold transition-colors">
                                ${options.confirmText || '确认'}
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('#confirm-cancel').addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });

            modal.querySelector('#confirm-ok').addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            });
        });
    }

    alert(title, message, options = {}) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/70 z-[9998] flex items-center justify-center';
            modal.innerHTML = `
                <div class="bg-slate-900 rounded-xl border border-slate-700 max-w-md w-full mx-4 transform transition-all">
                    <div class="p-6 text-center">
                        <div class="text-4xl mb-4">${options.icon || 'ℹ️'}</div>
                        <h3 class="text-xl font-bold text-amber-400 mb-2">${escapeHtml(title)}</h3>
                        <p class="text-slate-300 mb-6">${escapeHtml(message)}</p>
                        <button id="alert-ok" class="px-6 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white font-bold transition-colors">
                            ${options.buttonText || '确定'}
                        </button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            modal.querySelector('#alert-ok').addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(true);
                }
            });
        });
    }

    prompt(title, message, options = {}) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/70 z-[9998] flex items-center justify-center';
            modal.innerHTML = `
                <div class="bg-slate-900 rounded-xl border border-slate-700 max-w-md w-full mx-4 transform transition-all">
                    <div class="p-6">
                        <div class="text-center mb-4">
                            <div class="text-4xl mb-4">${options.icon || '✏️'}</div>
                            <h3 class="text-xl font-bold text-amber-400 mb-2">${escapeHtml(title)}</h3>
                            <p class="text-slate-300">${escapeHtml(message)}</p>
                        </div>
                        <input type="${options.inputType || 'text'}" 
                               id="prompt-input"
                               value="${options.defaultValue || ''}"
                               placeholder="${options.placeholder || ''}"
                               class="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:border-amber-500 focus:outline-none mb-4">
                        <div class="flex gap-3 justify-center">
                            <button id="prompt-cancel" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors">
                                取消
                            </button>
                            <button id="prompt-ok" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white font-bold transition-colors">
                                确定
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            const input = modal.querySelector('#prompt-input');
            input.focus();

            modal.querySelector('#prompt-cancel').addEventListener('click', () => {
                modal.remove();
                resolve(null);
            });

            modal.querySelector('#prompt-ok').addEventListener('click', () => {
                modal.remove();
                resolve(input.value);
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    modal.remove();
                    resolve(input.value);
                } else if (e.key === 'Escape') {
                    modal.remove();
                    resolve(null);
                }
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(null);
                }
            });
        });
    }

    clearAll() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

const notify = new NotificationManager();

function showToast(message, type = 'info', options = {}) {
    return notify[type](message, options);
}

function showAlert(title, message, options = {}) {
    return notify.alert(title, message, options);
}

function showConfirm(title, message, options = {}) {
    return notify.confirm(title, message, options);
}

function showPrompt(title, message, options = {}) {
    return notify.prompt(title, message, options);
}

function showAchievement(name, description, options = {}) {
    return notify.achievement(name, description, options);
}

window.showNotification = showToast;
window.showAlert = showAlert;
window.showConfirm = showConfirm;
window.showPrompt = showPrompt;
window.showAchievement = showAchievement;

export {
    NotificationManager,
    notify,
    showToast,
    showAlert,
    showConfirm,
    showPrompt,
    showAchievement
};

export default notify;
