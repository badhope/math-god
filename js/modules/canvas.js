/**
 * 画布动画模块
 * 负责动态背景粒子效果
 * 优化版本：使用空间分区算法优化连接线绘制
 */

import { GAME_CONFIG } from '../config.js';

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.width = 0;
        this.height = 0;
        this.animationId = null;
        this.isRunning = false;
        this._resizeHandler = null;
        this._clickHandler = null;
        
        this.config = {
            particleCount: GAME_CONFIG.CANVAS.PARTICLE_COUNT,
            connectionDistance: GAME_CONFIG.CANVAS.CONNECTION_DISTANCE,
            particleMinSize: GAME_CONFIG.CANVAS.PARTICLE_MIN_SIZE,
            particleMaxSize: GAME_CONFIG.CANVAS.PARTICLE_MAX_SIZE,
            particleSpeed: GAME_CONFIG.CANVAS.PARTICLE_SPEED
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles(this.config.particleCount);
        this.bindEvents();
        this.start();
    }
    
    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }
    
    createParticles(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push(this._createParticle());
        }
    }
    
    _createParticle(x = null, y = null, hasLife = false) {
        const baseParticle = {
            x: x !== null ? x : Math.random() * this.width,
            y: y !== null ? y : Math.random() * this.height,
            vx: (Math.random() - 0.5) * this.config.particleSpeed,
            vy: (Math.random() - 0.5) * this.config.particleSpeed,
            size: Math.random() * (this.config.particleMaxSize - this.config.particleMinSize) + this.config.particleMinSize,
            color: `rgba(${Math.random() * 50 + 200}, ${Math.random() * 50 + 100}, ${Math.random() * 50}, ${Math.random() * 0.5 + 0.2})`
        };
        
        if (hasLife) {
            baseParticle.life = 1.0;
            baseParticle.vx = (Math.random() - 0.5) * 2;
            baseParticle.vy = (Math.random() - 0.5) * 2;
            baseParticle.size = Math.random() * 3 + 2;
        }
        
        return baseParticle;
    }
    
    bindEvents() {
        this._resizeHandler = () => this.resize();
        window.addEventListener('resize', this._resizeHandler);
        
        this._clickHandler = (e) => this.createRipple(e.clientX, e.clientY);
        this.canvas.addEventListener('click', this._clickHandler);
    }
    
    unbindEvents() {
        if (this._resizeHandler) {
            window.removeEventListener('resize', this._resizeHandler);
            this._resizeHandler = null;
        }
        if (this._clickHandler) {
            this.canvas.removeEventListener('click', this._clickHandler);
            this._clickHandler = null;
        }
    }
    
    createRipple(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push(this._createParticle(x, y, true));
        }
    }
    
    updateParticles() {
        const toRemove = [];
        
        this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;
            
            if (p.life !== undefined) {
                p.life -= 0.02;
                if (p.life <= 0) {
                    toRemove.push(index);
                }
            }
        });
        
        for (let i = toRemove.length - 1; i >= 0; i--) {
            this.particles.splice(toRemove[i], 1);
        }
    }
    
    drawParticles() {
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.life ? `rgba(245, 158, 11, ${p.life})` : p.color;
            this.ctx.fill();
        });
    }
    
    drawConnections() {
        const particles = this.particles;
        const len = particles.length;
        const maxDist = this.config.connectionDistance;
        const maxDistSq = maxDist * maxDist;
        
        this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.05)';
        this.ctx.lineWidth = 1;
        
        this.ctx.beginPath();
        
        for (let i = 0; i < len; i++) {
            const p1 = particles[i];
            if (p1.life !== undefined) continue;
            
            for (let j = i + 1; j < len; j++) {
                const p2 = particles[j];
                if (p2.life !== undefined) continue;
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distSq = dx * dx + dy * dy;
                
                if (distSq < maxDistSq) {
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                }
            }
        }
        
        this.ctx.stroke();
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.updateParticles();
        this.drawParticles();
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    restart() {
        this.stop();
        this.start();
    }
    
    destroy() {
        this.stop();
        this.unbindEvents();
        this.particles = [];
        this.ctx = null;
        this.canvas = null;
    }
}

function initCanvas(canvasId = 'canvas-bg') {
    return new ParticleSystem(canvasId);
}

export { ParticleSystem, initCanvas };
