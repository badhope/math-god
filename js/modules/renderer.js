/**
 * 渲染引擎模块
 * 负责所有 UI 元素的渲染和更新
 */

import { mathData } from '../data.js';
import { isLevelUnlocked, getStats, getExpProgress } from './state.js';

function renderRealms(containerId = 'realm-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    mathData.forEach((realm, index) => {
        const card = document.createElement('div');
        card.className = 'realm-card rounded-xl p-6 cursor-pointer fade-in-up';
        card.style.borderLeft = `4px solid ${realm.color}`;
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="text-xl font-bold" style="color: ${realm.color}; font-family: 'Ma Shan Zheng', cursive;">${realm.name}</h3>
                <span class="text-xs bg-slate-900 px-2 py-1 rounded border border-slate-700">${realm.title}</span>
            </div>
            <p class="text-slate-400 text-sm mb-4 line-clamp-3 h-12">${realm.desc}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${realm.concepts.slice(0, 3).map(c => 
                    `<span class="text-xs bg-slate-800/50 px-2 py-1 rounded text-slate-300 border border-slate-700">${c}</span>`
                ).join('')}
            </div>
            <div class="text-right text-xs text-amber-500 opacity-80 hover:opacity-100 transition-opacity flex items-center justify-end gap-1">
                查看详情 <span>→</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (window.showRealmDetail) {
                window.showRealmDetail(realm);
            }
        });
        
        container.appendChild(card);
    });
}

function renderChallengeList(containerId = 'challenge-list') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    mathData.forEach((realm) => {
        const unlocked = isLevelUnlocked(realm.id);
        const card = document.createElement('div');
        card.className = `rounded-xl p-6 border transition-all duration-500 ${
            unlocked 
                ? 'bg-slate-800/50 border-amber-500/30 hover:bg-slate-800' 
                : 'bg-slate-900/50 border-slate-700 opacity-50'
        }`;
        
        card.innerHTML = `
            <div class="flex justify-between items-center mb-3">
                <h3 class="text-lg font-bold" style="color: ${unlocked ? realm.color : '#64748b'}">
                    ${realm.name} · 试炼
                </h3>
                ${!unlocked 
                    ? '<span class="text-xs text-red-400">🔒 需通关前一关</span>' 
                    : '<span class="text-xs text-green-400">可挑战</span>'
                }
            </div>
            <p class="text-slate-400 text-sm mb-4">难度：${realm.title}</p>
            ${unlocked 
                ? `<button onclick="window.startQuiz(${realm.id})" class="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded text-white font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95">
                    开始挑战 (+${realm.id * 10} 修为)
                   </button>`
                : `<button disabled class="w-full py-2 bg-slate-700 rounded text-slate-500 font-bold text-sm cursor-not-allowed">
                    未解锁
                   </button>`
            }
        `;
        
        container.appendChild(card);
    });
}

function updateProfileUI() {
    const stats = getStats();
    const expProgress = getExpProgress();
    
    const elements = {
        'nav-level': stats.level,
        'profile-level': stats.level,
        'stat-correct': stats.correctCount,
        'stat-games': stats.gamesPlayed,
        'profile-exp-text': `${expProgress.current} / ${expProgress.next}`
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const el = document.getElementById(id);
        if (el) {
            if (typeof value === 'number') {
                animateNumber(el, value);
            } else {
                el.innerText = value;
            }
        }
    });
    
    const progressBar = document.getElementById('profile-exp-bar');
    if (progressBar) {
        progressBar.style.width = `${expProgress.percentage}%`;
    }
}

function updateCurrentRealm() {
    const stats = getStats();
    const currentRealm = mathData.find(r => r.id === Math.min(stats.level, 9));
    
    const realmNameEl = document.getElementById('current-realm-name');
    const userExpEl = document.getElementById('user-exp');
    
    if (realmNameEl && currentRealm) {
        realmNameEl.innerText = currentRealm.name;
        realmNameEl.style.color = currentRealm.color;
    }
    
    if (userExpEl) {
        userExpEl.innerText = stats.exp;
    }
}

function animateStats(containerId = 'home') {
    const targets = {
        'stat-realms': 9,
        'stat-problems': 7,
        'stat-players': 2333
    };
    
    Object.entries(targets).forEach(([id, target]) => {
        const el = document.getElementById(id);
        if (el) {
            animateNumber(el, target);
        }
    });
}

function animateNumber(element, target) {
    if (!element) return;
    
    const duration = 1500;
    const start = 0;
    const change = target - start;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(start + change * easeOutQuart);
        
        element.innerText = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function renderAchievements(containerId = 'achievements-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const achievements = [
        { id: 'first_blood', name: '初出茅庐', desc: '首次挑战成功', icon: '🎯' },
        { id: 'scholar', name: '博学之士', desc: '通关 3 个境界', icon: '📚' },
        { id: 'master', name: '数学大师', desc: '通关所有境界', icon: '🏆' },
        { id: 'gamer', name: '游戏达人', desc: '完成 10 场游戏', icon: '🎮' },
        { id: 'perfectionist', name: '完美主义', desc: '连续答对 5 题', icon: '✨' }
    ];
    
    container.innerHTML = '';
    
    achievements.forEach(achievement => {
        const badge = document.createElement('div');
        badge.className = 'bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-amber-500/50 transition-all';
        
        const unlocked = window.userState && window.userState.achievements && 
                        window.userState.achievements.includes(achievement.id);
        
        badge.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="text-3xl ${unlocked ? '' : 'grayscale opacity-50'}">
                    ${achievement.icon}
                </div>
                <div>
                    <h4 class="font-bold ${unlocked ? 'text-amber-400' : 'text-slate-500'}">
                        ${achievement.name}
                    </h4>
                    <p class="text-xs text-slate-400">${achievement.desc}</p>
                </div>
            </div>
        `;
        
        container.appendChild(badge);
    });
}

export {
    renderRealms,
    renderChallengeList,
    updateProfileUI,
    updateCurrentRealm,
    animateStats,
    renderAchievements
};
