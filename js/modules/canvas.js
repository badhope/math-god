/**
 * 画布动画模块
 * 负责动态背景粒子效果
 */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.width = 0;
        this.height = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createParticles(60);
        this.bindEvents();
        this.animate();
    }
    
    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
    }
    
    createParticles(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                color: `rgba(${Math.random() * 50 + 200}, ${Math.random() * 50 + 100}, ${Math.random() * 50}, ${Math.random() * 0.5 + 0.2})`
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('click', (e) => {
            this.createRipple(e.clientX, e.clientY);
        });
    }
    
    createRipple(x, y) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 2,
                color: 'rgba(245, 158, 11, 0.8)',
                life: 1.0
            });
        }
    }
    
    updateParticles() {
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;
            
            if (p.life !== undefined) {
                p.life -= 0.02;
            }
        });
        
        this.particles = this.particles.filter(p => !p.life || p.life > 0);
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
        this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.05)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        this.updateParticles();
        this.drawParticles();
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    restart() {
        this.stop();
        this.animate();
    }
}

function initCanvas(canvasId = 'canvas-bg') {
    return new ParticleSystem(canvasId);
}

export { ParticleSystem, initCanvas };
