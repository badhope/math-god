/**
 * 动态效果增强模块
 * 包含：粒子特效、过渡动画、交互反馈、视觉特效
 */

class EffectManager {
    constructor() {
        this.effects = new Map();
        this.initGlobalEffects();
    }

    // 初始化全局效果
    initGlobalEffects() {
        // 页面加载完成时的绽放效果
        this.createBloomEffect();
        
        // 按钮点击波纹效果增强
        this.enhanceButtonEffects();
        
        // 滚动视差效果
        this.initParallaxScroll();
        
        // 鼠标跟随粒子
        this.initMouseTrail();
    }

    // 绽放效果
    createBloomEffect() {
        const bloom = document.createElement('div');
        bloom.id = 'bloom-overlay';
        bloom.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
            background: radial-gradient(circle at center, rgba(245, 158, 11, 0.3) 0%, transparent 70%);
            opacity: 0;
            transition: opacity 0.5s;
        `;
        document.body.appendChild(bloom);

        setTimeout(() => {
            bloom.style.opacity = '1';
            setTimeout(() => {
                bloom.style.opacity = '0';
                setTimeout(() => bloom.remove(), 500);
            }, 800);
        }, 300);
    }

    // 增强按钮效果
    enhanceButtonEffects() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
                this.createRipple(e);
                this.createSparkles(e.clientX, e.clientY);
            }
        });
    }

    // 波纹效果
    createRipple(event) {
        const button = event.target.closest('button');
        if (!button) return;

        const existing = button.querySelector('.ripple-enhanced');
        if (existing) existing.remove();

        const ripple = document.createElement('span');
        ripple.className = 'ripple-enhanced';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-enhanced 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // 粒子火花效果
    createSparkles(x, y) {
        const container = document.createElement('div');
        container.className = 'sparkle-container';
        container.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            pointer-events: none;
            z-index: 10000;
        `;

        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            const angle = (i / 8) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const dx = Math.cos(angle) * velocity;
            const dy = Math.sin(angle) * velocity;

            sparkle.style.cssText = `
                position: absolute;
                width: ${4 + Math.random() * 4}px;
                height: ${4 + Math.random() * 4}px;
                background: linear-gradient(135deg, #f59e0b, #ef4444);
                border-radius: 50%;
                animation: sparkle-fly 0.8s ease-out forwards;
                --dx: ${dx}px;
                --dy: ${dy}px;
            `;

            container.appendChild(sparkle);
        }

        document.body.appendChild(container);
        setTimeout(() => container.remove(), 800);
    }

    // 滚动视差
    initParallaxScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const parallaxElements = document.querySelectorAll('.parallax');
                    
                    parallaxElements.forEach(el => {
                        const speed = el.dataset.speed || 0.5;
                        el.style.transform = `translateY(${scrolled * speed}px)`;
                    });
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // 鼠标跟随粒子 - 性能优化版本
    initMouseTrail() {
        this.mouseTrailParticles = [];
        this.maxMouseTrailParticles = 20;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.mouseTrailThrottle = 50;
        this.lastMouseTrailTime = 0;
        
        this._mouseMoveHandler = (e) => {
            const now = Date.now();
            if (now - this.lastMouseTrailTime < this.mouseTrailThrottle) return;
            
            const dx = e.clientX - this.lastMouseX;
            const dy = e.clientY - this.lastMouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > 30) {
                this.createMouseParticle(e.clientX, e.clientY);
                this.lastMouseX = e.clientX;
                this.lastMouseY = e.clientY;
                this.lastMouseTrailTime = now;
            }
        };
        
        document.addEventListener('mousemove', this._mouseMoveHandler);
    }

    createMouseParticle(x, y) {
        if (this.mouseTrailParticles.length >= this.maxMouseTrailParticles) {
            const oldParticle = this.mouseTrailParticles.shift();
            if (oldParticle && oldParticle.parentNode) {
                oldParticle.remove();
            }
        }
        
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${2 + Math.random() * 3}px;
            height: ${2 + Math.random() * 3}px;
            background: rgba(245, 158, 11, ${0.3 + Math.random() * 0.4});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            animation: particle-fade 0.8s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        this.mouseTrailParticles.push(particle);
        
        setTimeout(() => {
            const index = this.mouseTrailParticles.indexOf(particle);
            if (index > -1) {
                this.mouseTrailParticles.splice(index, 1);
            }
            if (particle.parentNode) {
                particle.remove();
            }
        }, 800);
    }

    // 升级特效
    createLevelUpEffect(newLevel) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: levelup-fade 2s ease-out forwards;
        `;

        const text = document.createElement('div');
        text.innerHTML = `
            <div style="text-align: center; color: #f59e0b; font-size: 3rem; font-weight: bold; text-shadow: 0 0 20px rgba(245, 158, 11, 0.8);">
                <div style="font-size: 5rem; margin-bottom: 20px;">🎉</div>
                <div>突破成功！</div>
                <div style="font-size: 2rem; margin-top: 10px;">Lv.${newLevel}</div>
            </div>
        `;

        overlay.appendChild(text);
        document.body.appendChild(overlay);
        setTimeout(() => overlay.remove(), 2000);
    }

    // 答题正确特效
    createCorrectAnswerEffect(element) {
        element.style.animation = 'correct-pulse 0.5s ease-in-out';
        this.createFloatingText(element, '✓ 正确！', '#10b981');
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // 答题错误特效
    createWrongAnswerEffect(element) {
        element.style.animation = 'wrong-shake 0.5s ease-in-out';
        this.createFloatingText(element, '✗ 错误', '#ef4444');
        
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // 浮动文字效果
    createFloatingText(target, text, color) {
        const rect = target.getBoundingClientRect();
        const floater = document.createElement('div');
        floater.textContent = text;
        floater.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top}px;
            color: ${color};
            font-size: 1.5rem;
            font-weight: bold;
            pointer-events: none;
            z-index: 10002;
            transform: translateX(-50%);
            animation: float-up 1s ease-out forwards;
            text-shadow: 0 0 10px rgba(255,255,255,0.8);
        `;
        
        document.body.appendChild(floater);
        setTimeout(() => floater.remove(), 1000);
    }

    // 页面切换过渡
    setupPageTransition(fromPage, toPage) {
        fromPage.style.transition = 'opacity 0.3s, transform 0.3s';
        fromPage.style.opacity = '0';
        fromPage.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            toPage.style.opacity = '1';
            toPage.style.transform = 'translateY(0)';
        }, 300);
    }

    // 销毁管理器，清理事件监听
    destroy() {
        if (this._mouseMoveHandler) {
            document.removeEventListener('mousemove', this._mouseMoveHandler);
            this._mouseMoveHandler = null;
        }
        
        if (this.mouseTrailParticles) {
            this.mouseTrailParticles.forEach(p => {
                if (p && p.parentNode) p.remove();
            });
            this.mouseTrailParticles = [];
        }
    }

    // 成就解锁特效
    createAchievementUnlocked(achievement) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: -400px;
            background: linear-gradient(135deg, #1e293b, #0f172a);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 20px;
            width: 350px;
            z-index: 10003;
            box-shadow: 0 10px 40px rgba(245, 158, 11, 0.3);
            transition: right 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        `;

        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="font-size: 3rem;">${achievement.icon}</div>
                <div>
                    <div style="color: #f59e0b; font-size: 1.2rem; font-weight: bold;">🏆 成就解锁</div>
                    <div style="color: #e2e8f0; font-weight: bold; margin-top: 5px;">${achievement.name}</div>
                    <div style="color: #94a3b8; font-size: 0.9rem; margin-top: 3px;">${achievement.desc}</div>
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.right = '20px';
        });

        setTimeout(() => {
            notification.style.right = '-400px';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
}

// 添加 CSS 动画关键帧
function injectAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-enhanced {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes sparkle-fly {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--dx), var(--dy)) scale(0);
                opacity: 0;
            }
        }
        
        @keyframes particle-fade {
            0% {
                transform: translateY(0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translateY(-50px) scale(0);
                opacity: 0;
            }
        }
        
        @keyframes levelup-fade {
            0% {
                opacity: 0;
                transform: scale(0.5);
            }
            50% {
                opacity: 1;
                transform: scale(1.1);
            }
            100% {
                opacity: 0;
                transform: scale(1);
            }
        }
        
        @keyframes correct-pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); box-shadow: 0 0 20px #10b981; }
        }
        
        @keyframes wrong-shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        @keyframes float-up {
            0% {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            100% {
                transform: translateX(-50%) translateY(-100px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 初始化
injectAnimationStyles();
const effectManager = new EffectManager();

export { EffectManager, effectManager };
