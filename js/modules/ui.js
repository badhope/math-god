/**
 * UI 交互模块
 * 负责导航、模态框、页面切换等 UI 交互
 */

import { mathData } from '../data.js';
import { escapeHtml, sanitizeHtml } from '../utils/security.js';

const currentSection = {
    value: 'home'
};

function navigateTo(pageId) {
    const sections = document.querySelectorAll('.page-section');
    const navItems = document.querySelectorAll('.nav-item');
    
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const targetSection = document.getElementById(pageId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection.value = pageId;
    }
    
    const navMap = {
        'home': 0,
        'realms': 1,
        'challenge': 2,
        'games': 3
    };
    
    const navIndex = navMap[pageId];
    if (navIndex !== undefined && navItems[navIndex]) {
        navItems[navIndex].classList.add('active');
    }
    
    window.scrollTo(0, 0);
    
    if (window.onNavigate) {
        window.onNavigate(pageId);
    }
}

function showModal(modalId, content) {
    const modal = document.getElementById(modalId);
    const modalBody = document.getElementById(`${modalId}-body`) || modal.querySelector('.modal-content');
    
    if (!modal || !modalBody) return;
    
    if (typeof content === 'string') {
        modalBody.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        modalBody.innerHTML = '';
        modalBody.appendChild(content);
    }
    
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function showRealmDetail(realm) {
    const modalBody = document.getElementById('modal-detail-body');
    if (!modalBody) return;
    
    const safeName = escapeHtml(realm.name);
    const safeTitle = escapeHtml(realm.title);
    const safeDesc = escapeHtml(realm.desc);
    const safeColor = escapeHtml(realm.color);
    const safeTrivia = escapeHtml(realm.trivia);
    
    const safeConcepts = realm.concepts.map(c => escapeHtml(c));
    const safeFormulas = realm.formulas.map(f => escapeHtml(f));
    
    modalBody.innerHTML = `
        <div class="border-b border-slate-700 pb-4 mb-4">
            <h2 class="text-3xl font-bold mb-1" style="color: ${safeColor}; font-family: 'Ma Shan Zheng', cursive;">
                ${safeName}
            </h2>
            <span class="text-sm text-slate-400">${safeTitle}</span>
        </div>
        
        <p class="text-slate-300 leading-relaxed mb-6 text-md">${safeDesc}</p>
        
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div class="bg-slate-900/80 p-4 rounded-lg border border-slate-700">
                <h4 class="text-amber-400 font-bold mb-3">核心心法</h4>
                <ul class="space-y-2">
                    ${safeConcepts.map(c => 
                        `<li class="text-slate-300 text-sm flex items-center gap-2">
                            <span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>${c}
                        </li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="bg-slate-900/80 p-4 rounded-lg border border-slate-700">
                <h4 class="text-cyan-400 font-bold mb-3">经典公式</h4>
                <div class="space-y-3 font-mono text-sm">
                    ${safeFormulas.map(f => 
                        `<div class="text-cyan-300 bg-slate-800 p-2 rounded">${f}</div>`
                    ).join('')}
                </div>
            </div>
        </div>
        
        <div class="mt-6 bg-amber-500/5 border-l-4 border-amber-500 p-4 rounded">
            <p class="text-amber-400 italic text-sm">"${safeTrivia}"</p>
        </div>
        
        <div class="mt-6 flex justify-end gap-4">
            <button onclick="window.closeModal('modal-detail')" 
                    class="px-4 py-2 text-slate-400 hover:text-white transition-colors">
                关闭
            </button>
            <button onclick="window.closeModal('modal-detail'); window.navigateTo('challenge');" 
                    class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white transition-colors active:scale-95">
                去挑战此境界
            </button>
        </div>
    `;
    
    showModal('modal-detail', modalBody.innerHTML);
}

function initModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.active').forEach(modal => {
                closeModal(modal.id);
            });
        }
    });
}

function createRippleEffect(event, element) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function initRippleButtons() {
    document.querySelectorAll('button, .btn-primary').forEach(button => {
        button.addEventListener('click', (e) => {
            createRippleEffect(e, button);
        });
    });
}

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-[200] px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full fade-in-up`;
    
    const colors = {
        info: 'bg-blue-600',
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-amber-600'
    };
    
    notification.classList.add(colors[type] || colors.info);
    notification.innerHTML = `
        <div class="flex items-center gap-2 text-white">
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.classList.remove('translate-x-full');
    });
    
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, duration);
}

function updateNavigation(currentRealm) {
    const realmNameEl = document.getElementById('current-realm-name');
    if (realmNameEl && currentRealm) {
        realmNameEl.innerText = currentRealm.name;
        realmNameEl.style.color = currentRealm.color;
    }
}

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const pages = ['home', 'realms', 'challenge', 'games'];
            if (pages[index]) {
                navigateTo(pages[index]);
            }
        });
    });
}

function getCurrentSection() {
    return currentSection.value;
}

export {
    navigateTo,
    showModal,
    closeModal,
    showRealmDetail,
    initModals,
    initRippleButtons,
    showNotification,
    updateNavigation,
    initNavigation,
    getCurrentSection
};
