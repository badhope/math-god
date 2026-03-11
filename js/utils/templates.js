/**
 * 数学修仙传 - 公共模板模块
 * 提取重复的UI模板代码，统一管理
 */

import { escapeHtml } from './helpers.js';

export const Templates = {
    modal: {
        base(id, title, content, footer = '') {
            return `
                <div id="${id}" class="modal-overlay fixed inset-0 bg-black/70 z-50 flex items-center justify-center hidden">
                    <div class="modal-content bg-slate-900 rounded-xl border border-slate-700 max-w-lg w-full mx-4 transform transition-all">
                        <div class="modal-header flex justify-between items-center p-4 border-b border-slate-700">
                            <h3 class="text-lg font-bold text-amber-400">${escapeHtml(title)}</h3>
                            <button onclick="closeModal('${id}')" class="text-slate-400 hover:text-white text-2xl">&times;</button>
                        </div>
                        <div class="modal-body p-4" id="${id}-body">
                            ${content}
                        </div>
                        ${footer ? `<div class="modal-footer p-4 border-t border-slate-700">${footer}</div>` : ''}
                    </div>
                </div>
            `;
        },

        confirm(title, message, onConfirm, onCancel) {
            return `
                <div class="text-center">
                    <div class="text-4xl mb-4">⚠️</div>
                    <h3 class="text-xl font-bold text-amber-400 mb-2">${escapeHtml(title)}</h3>
                    <p class="text-slate-300 mb-6">${escapeHtml(message)}</p>
                    <div class="flex gap-3 justify-center">
                        <button onclick="${onCancel}" class="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-colors">
                            取消
                        </button>
                        <button onclick="${onConfirm}" class="px-4 py-2 bg-amber-500 hover:bg-amber-600 rounded-lg text-white font-bold transition-colors">
                            确认
                        </button>
                    </div>
                </div>
            `;
        }
    },

    quiz: {
        question(data) {
            return `
                <div class="quiz-question bg-slate-800/50 rounded-lg p-6 mb-4">
                    <div class="flex justify-between items-center mb-4">
                        <span class="text-cyan-400 text-sm">第 ${data.current} / ${data.total} 题</span>
                        <span class="text-amber-400 text-sm">⏱️ ${data.timeLeft}s</span>
                    </div>
                    <h4 class="text-lg text-slate-200 mb-4">${escapeHtml(data.question)}</h4>
                    <div class="quiz-options grid grid-cols-2 gap-3">
                        ${data.options.map((opt, i) => `
                            <button onclick="selectAnswer(${i})" 
                                    class="quiz-option p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-all text-left">
                                <span class="font-bold text-amber-400 mr-2">${['A', 'B', 'C', 'D'][i]}.</span>
                                ${escapeHtml(opt)}
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        },

        result(data) {
            const icon = data.isCorrect ? '✅' : '❌';
            const color = data.isCorrect ? 'text-green-400' : 'text-red-400';
            const message = data.isCorrect ? '回答正确！' : '回答错误';
            
            return `
                <div class="quiz-result text-center py-6">
                    <div class="text-5xl mb-4">${icon}</div>
                    <h4 class="${color} text-xl font-bold mb-2">${message}</h4>
                    ${!data.isCorrect ? `<p class="text-slate-400">正确答案：${escapeHtml(data.correctAnswer)}</p>` : ''}
                    <p class="text-amber-400 mt-2">获得 ${data.exp} 修为</p>
                </div>
            `;
        },

        summary(data) {
            return `
                <div class="quiz-summary text-center py-6">
                    <div class="text-5xl mb-4">🏆</div>
                    <h3 class="text-2xl font-bold text-amber-400 mb-4">挑战完成！</h3>
                    <div class="grid grid-cols-3 gap-4 mb-6">
                        <div class="bg-slate-800/50 rounded-lg p-4">
                            <div class="text-2xl font-bold text-cyan-400">${data.correct}</div>
                            <div class="text-xs text-slate-400">正确</div>
                        </div>
                        <div class="bg-slate-800/50 rounded-lg p-4">
                            <div class="text-2xl font-bold text-red-400">${data.wrong}</div>
                            <div class="text-xs text-slate-400">错误</div>
                        </div>
                        <div class="bg-slate-800/50 rounded-lg p-4">
                            <div class="text-2xl font-bold text-amber-400">${data.accuracy}%</div>
                            <div class="text-xs text-slate-400">正确率</div>
                        </div>
                    </div>
                    <p class="text-amber-400 text-lg">获得 ${data.totalExp} 修为</p>
                </div>
            `;
        }
    },

    game: {
        card(data) {
            return `
                <div class="game-card bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer"
                     onclick="${data.onclick}">
                    <div class="text-3xl mb-2">${data.icon}</div>
                    <h4 class="font-bold text-slate-200 mb-1">${escapeHtml(data.title)}</h4>
                    <p class="text-xs text-slate-400">${escapeHtml(data.description)}</p>
                    ${data.badge ? `<span class="inline-block mt-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded">${data.badge}</span>` : ''}
                </div>
            `;
        },

        stats(data) {
            return `
                <div class="game-stats grid grid-cols-${data.items.length} gap-4 mb-4">
                    ${data.items.map(item => `
                        <div class="stat-item bg-slate-800/50 rounded-lg p-3 text-center">
                            <div class="text-xl font-bold ${item.color || 'text-amber-400'}">${item.value}</div>
                            <div class="text-xs text-slate-400">${escapeHtml(item.label)}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        button(data) {
            const colorClass = data.variant === 'primary' 
                ? 'bg-amber-500 hover:bg-amber-600 text-white' 
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200';
            
            return `
                <button onclick="${data.onclick}" 
                        class="px-4 py-2 ${colorClass} rounded-lg font-medium transition-colors ${data.disabled ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${data.disabled ? 'disabled' : ''}>
                    ${data.icon ? `<span class="mr-2">${data.icon}</span>` : ''}${escapeHtml(data.text)}
                </button>
            `;
        }
    },

    notification: {
        toast(data) {
            const colors = {
                success: 'bg-green-500',
                error: 'bg-red-500',
                warning: 'bg-amber-500',
                info: 'bg-blue-500'
            };
            
            return `
                <div class="toast ${colors[data.type] || colors.info} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
                    <span class="text-xl">${data.icon || '📢'}</span>
                    <span>${escapeHtml(data.message)}</span>
                </div>
            `;
        },

        achievement(data) {
            return `
                <div class="achievement-popup fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 border-2 border-amber-500 rounded-xl p-6 text-center z-50 animate-bounce">
                    <div class="text-5xl mb-4">${data.icon}</div>
                    <h3 class="text-xl font-bold text-amber-400 mb-2">🎉 成就解锁！</h3>
                    <p class="text-slate-200 font-bold">${escapeHtml(data.name)}</p>
                    <p class="text-slate-400 text-sm mt-1">${escapeHtml(data.description)}</p>
                </div>
            `;
        }
    },

    realm: {
        card(data) {
            const statusClass = data.unlocked 
                ? 'border-amber-500/50 hover:border-amber-500' 
                : 'border-slate-700 opacity-60';
            
            return `
                <div class="realm-card bg-slate-800/50 rounded-xl p-6 border ${statusClass} transition-all cursor-pointer"
                     onclick="${data.unlocked ? `showRealmDetail(${data.id})` : ''}">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                             style="background: linear-gradient(135deg, ${data.color}, ${data.color}88)">
                            ${data.icon}
                        </div>
                        <div>
                            <h4 class="font-bold text-slate-200">${escapeHtml(data.name)}</h4>
                            <p class="text-xs text-slate-400">${escapeHtml(data.subtitle)}</p>
                        </div>
                    </div>
                    <p class="text-sm text-slate-300 mb-4">${escapeHtml(data.description)}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs text-slate-400">难度：${'⭐'.repeat(data.difficulty)}</span>
                        ${data.unlocked 
                            ? `<span class="text-xs text-green-400">✓ 已解锁</span>` 
                            : `<span class="text-xs text-amber-400">🔒 需要 Lv.${data.requiredLevel}</span>`
                        }
                    </div>
                </div>
            `;
        }
    },

    profile: {
        statItem(data) {
            return `
                <div class="stat-item bg-slate-800/50 rounded-lg p-4">
                    <div class="text-2xl font-bold ${data.color || 'text-amber-400'}">${data.value}</div>
                    <div class="text-xs text-slate-400">${escapeHtml(data.label)}</div>
                </div>
            `;
        },

        progressBar(data) {
            const percentage = Math.min(100, Math.max(0, (data.current / data.max) * 100));
            
            return `
                <div class="progress-bar">
                    <div class="flex justify-between text-xs text-slate-400 mb-1">
                        <span>${escapeHtml(data.label)}</span>
                        <span>${data.current} / ${data.max}</span>
                    </div>
                    <div class="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div class="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                             style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
        }
    }
};

export function renderTemplate(template, data) {
    if (typeof template === 'function') {
        return template(data);
    }
    return template;
}

export function createElementFromTemplate(templateString) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = templateString.trim();
    return wrapper.firstElementChild;
}

export default Templates;
