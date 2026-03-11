/**
 * 创新玩法系统模块
 * 包含：数学塔防、公式对战、知识竞答、修炼秘境、数学接龙
 */

import { updateExp, getUserState } from './state.js';
import { effectManager } from './effects.js';
import { quizBank } from '../data.js';

// ==================== 玩法 1: 数学塔防 ====================
class MathTowerDefense {
    constructor() {
        this.enemies = [
            { name: '粗心怪', hp: 100, speed: 1, reward: 20, emoji: '👾' },
            { name: '遗忘魔', hp: 150, speed: 0.8, reward: 30, emoji: '👻' },
            { name: '困惑灵', hp: 200, speed: 0.6, reward: 40, emoji: '👹' },
            { name: '错误王', hp: 300, speed: 0.5, reward: 60, emoji: '🤖' },
            { name: '难题 BOSS', hp: 500, speed: 0.4, reward: 100, emoji: '👑' }
        ];
        
        this.towers = [
            { name: '算术塔', damage: 20, range: 3, cost: 50, emoji: '🗼' },
            { name: '几何塔', damage: 35, range: 4, cost: 80, emoji: '🔺' },
            { name: '代数塔', damage: 50, range: 5, cost: 120, emoji: '⚗️' },
            { name: '微积分塔', damage: 80, range: 6, cost: 200, emoji: '∫' }
        ];
        
        this.gameState = {
            gold: 200,
            lives: 10,
            wave: 0,
            towers: [],
            enemies: [],
            isPlaying: false
        };
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-slate-900 to-purple-900 rounded-xl p-6 border border-purple-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-purple-400">🏰 数学塔防</h3>
                    <div class="flex gap-4 text-sm">
                        <span class="text-yellow-400">💰 金币：<span id="td-gold">${this.gameState.gold}</span></span>
                        <span class="text-red-400">❤️ 生命：<span id="td-lives">${this.gameState.lives}</span></span>
                        <span class="text-cyan-400">🌊 波次：<span id="td-wave">${this.gameState.wave}</span></span>
                    </div>
                </div>
                
                <div id="td-battlefield" class="bg-slate-800/50 rounded-lg h-80 mb-4 relative overflow-hidden border border-slate-700">
                    <div class="absolute inset-0 flex items-center justify-center text-slate-600">
                        点击"开始游戏"进入战场
                    </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <div class="text-sm text-slate-400 mb-2">建造防御塔</div>
                        ${this.towers.map((tower, i) => `
                            <button onclick="window.towerDefense.buyTower(${i})" 
                                    class="w-full p-2 bg-slate-700 hover:bg-slate-600 rounded flex items-center gap-2 transition-colors">
                                <span class="text-2xl">${tower.emoji}</span>
                                <div class="text-left flex-1">
                                    <div class="text-sm font-bold text-slate-200">${tower.name}</div>
                                    <div class="text-xs text-slate-400">伤害：${tower.damage} | 范围：${tower.range}</div>
                                </div>
                                <span class="text-yellow-400 text-sm">💰${tower.cost}</span>
                            </button>
                        `).join('')}
                    </div>
                    
                    <div class="space-y-2">
                        <div class="text-sm text-slate-400 mb-2">游戏控制</div>
                        <button onclick="window.towerDefense.startGame()" 
                                class="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-green-500/30 transition-all">
                            ▶️ 开始游戏
                        </button>
                        <button onclick="window.towerDefense.nextWave()" 
                                class="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                            🌊 下一波
                        </button>
                        <div class="p-3 bg-slate-700/50 rounded-lg">
                            <div class="text-xs text-slate-400">游戏说明</div>
                            <div class="text-sm text-slate-300 mt-1">建造防御塔抵御数学怪物，答对题目可提升塔的伤害！</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    startGame() {
        this.gameState.isPlaying = true;
        this.gameState.wave = 1;
        this.gameState.gold = 200;
        this.gameState.lives = 10;
        this.gameState.enemies = [];
        this.updateUI();
        this.spawnEnemies();
    }

    spawnEnemies() {
        const count = 3 + this.gameState.wave;
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                if (this.gameState.isPlaying) {
                    const enemy = this.enemies[Math.min(Math.floor(this.gameState.wave / 2), this.enemies.length - 1)];
                    this.gameState.enemies.push({
                        ...enemy,
                        maxHp: enemy.hp,
                        x: 0,
                        id: Date.now() + i
                    });
                    this.renderBattlefield();
                }
            }, i * 1500);
        }
    }

    renderBattlefield() {
        const battlefield = document.getElementById('td-battlefield');
        if (!battlefield) return;
        
        battlefield.innerHTML = `
            <div class="absolute inset-0 bg-gradient-to-r from-green-900/20 to-red-900/20"></div>
            ${this.gameState.towers.map((tower, i) => `
                <div class="absolute text-4xl" style="left: ${tower.x}%; top: ${tower.y}%;">
                    ${tower.emoji}
                </div>
            `).join('')}
            ${this.gameState.enemies.map(enemy => `
                <div class="absolute transition-all duration-1000" style="left: ${enemy.x}%; top: 50%;">
                    <div class="text-3xl">${enemy.emoji}</div>
                    <div class="w-12 h-1 bg-red-900 rounded mt-1">
                        <div class="h-full bg-red-500 rounded transition-all" style="width: ${(enemy.hp / enemy.maxHp) * 100}%"></div>
                    </div>
                </div>
            `).join('')}
        `;
    }

    buyTower(towerIndex) {
        const tower = this.towers[towerIndex];
        if (this.gameState.gold >= tower.cost) {
            this.gameState.gold -= tower.cost;
            const x = 20 + Math.random() * 60;
            const y = 20 + Math.random() * 60;
            this.gameState.towers.push({
                ...tower,
                x, y,
                id: Date.now()
            });
            this.updateUI();
            this.renderBattlefield();
        } else {
            alert('金币不足！');
        }
    }

    nextWave() {
        this.gameState.wave++;
        this.spawnEnemies();
        this.updateUI();
    }

    updateUI() {
        const goldEl = document.getElementById('td-gold');
        const livesEl = document.getElementById('td-lives');
        const waveEl = document.getElementById('td-wave');
        
        if (goldEl) goldEl.innerText = this.gameState.gold;
        if (livesEl) livesEl.innerText = this.gameState.lives;
        if (waveEl) waveEl.innerText = this.gameState.wave;
    }
}

// ==================== 玩法 2: 公式对战 ====================
class FormulaBattle {
    constructor() {
        this.formulas = [
            { name: '勾股定理', formula: 'a²+b²=c²', power: 20, emoji: '📐' },
            { name: '欧拉公式', formula: 'e^(iπ)+1=0', power: 50, emoji: '✨' },
            { name: '质能方程', formula: 'E=mc²', power: 30, emoji: '⚡' },
            { name: '牛顿第二定律', formula: 'F=ma', power: 25, emoji: '🍎' },
            { name: '圆的面积', formula: 'S=πr²', power: 20, emoji: '⭕' },
            { name: '导数公式', formula: 'lim Δx→0', power: 35, emoji: '📈' }
        ];
        
        this.battleState = {
            playerHP: 100,
            enemyHP: 100,
            playerTurn: true,
            round: 1,
            selectedFormula: null
        };
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-red-900/30 to-slate-900 rounded-xl p-6 border border-red-500/30">
                <div class="text-center mb-4">
                    <h3 class="text-2xl font-bold text-red-400">⚔️ 公式对战</h3>
                    <div class="text-sm text-slate-400">第 <span id="fb-round">1</span> 回合</div>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="text-center">
                        <div class="text-6xl mb-2">🧙‍♂️</div>
                        <div class="text-sm text-slate-300 mb-2">你</div>
                        <div class="w-full bg-slate-700 rounded-full h-4">
                            <div id="fb-player-hp" class="bg-green-500 h-4 rounded-full transition-all" style="width: 100%"></div>
                        </div>
                        <div class="text-xs text-slate-400 mt-1"><span id="fb-player-hp-text">100</span>/100</div>
                    </div>
                    
                    <div class="text-center">
                        <div class="text-6xl mb-2">👹</div>
                        <div class="text-sm text-slate-300 mb-2">心魔</div>
                        <div class="w-full bg-slate-700 rounded-full h-4">
                            <div id="fb-enemy-hp" class="bg-red-500 h-4 rounded-full transition-all" style="width: 100%"></div>
                        </div>
                        <div class="text-xs text-slate-400 mt-1"><span id="fb-enemy-hp-text">100</span>/100</div>
                    </div>
                </div>
                
                <div class="grid grid-cols-3 gap-2 mb-4">
                    ${this.formulas.map((f, i) => `
                        <button onclick="window.formulaBattle.selectFormula(${i})" 
                                class="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all hover:scale-105 ${this.battleState.selectedFormula === i ? 'ring-2 ring-amber-400' : ''}">
                            <div class="text-3xl mb-1">${f.emoji}</div>
                            <div class="text-xs text-slate-300 font-bold">${f.name}</div>
                            <div class="text-xs text-red-400">威力：${f.power}</div>
                        </button>
                    `).join('')}
                </div>
                
                <div class="flex gap-2">
                    <button onclick="window.formulaBattle.attack()" 
                            class="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-red-500/30 transition-all">
                        ⚔️ 攻击
                    </button>
                    <button onclick="window.formulaBattle.heal()" 
                            class="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-green-500/30 transition-all">
                        💚 治疗
                    </button>
                </div>
                
                <div id="fb-battle-log" class="mt-4 p-3 bg-slate-800/50 rounded-lg h-24 overflow-y-auto text-sm text-slate-300">
                    战斗开始！选择公式进行攻击！
                </div>
            </div>
        `;
    }

    selectFormula(index) {
        this.battleState.selectedFormula = index;
        this.init('formula-battle-game');
    }

    attack() {
        if (!this.battleState.playerTurn || this.battleState.selectedFormula === null) {
            alert('请选择一个公式！');
            return;
        }
        
        const formula = this.formulas[this.battleState.selectedFormula];
        const damage = formula.power * (1 + Math.random() * 0.5);
        this.battleState.enemyHP = Math.max(0, this.battleState.enemyHP - damage);
        
        this.log(`你使用${formula.name}，造成${Math.floor(damage)}点伤害！`);
        effectManager.createCorrectAnswerEffect(document.getElementById('formula-battle-game'));
        
        this.updateHP();
        
        if (this.battleState.enemyHP <= 0) {
            this.win();
            return;
        }
        
        this.battleState.playerTurn = false;
        setTimeout(() => this.enemyTurn(), 1000);
    }

    heal() {
        if (!this.battleState.playerTurn) return;
        
        const healAmount = 20 + Math.random() * 10;
        this.battleState.playerHP = Math.min(100, this.battleState.playerHP + healAmount);
        
        this.log(`你运功疗伤，恢复${Math.floor(healAmount)}点生命值！`);
        this.updateHP();
        
        this.battleState.playerTurn = false;
        setTimeout(() => this.enemyTurn(), 1000);
    }

    enemyTurn() {
        const enemyDamage = 15 + Math.random() * 15;
        this.battleState.playerHP = Math.max(0, this.battleState.playerHP - enemyDamage);
        
        this.log(`心魔攻击你，造成${Math.floor(enemyDamage)}点伤害！`);
        effectManager.createWrongAnswerEffect(document.getElementById('formula-battle-game'));
        this.updateHP();
        
        if (this.battleState.playerHP <= 0) {
            this.lose();
            return;
        }
        
        this.battleState.playerTurn = true;
        this.battleState.round++;
        document.getElementById('fb-round').innerText = this.battleState.round;
    }

    updateHP() {
        const playerHPBar = document.getElementById('fb-player-hp');
        const enemyHPBar = document.getElementById('fb-enemy-hp');
        const playerHPText = document.getElementById('fb-player-hp-text');
        const enemyHPText = document.getElementById('fb-enemy-hp-text');
        
        if (playerHPBar) playerHPBar.style.width = `${this.battleState.playerHP}%`;
        if (enemyHPBar) enemyHPBar.style.width = `${this.battleState.enemyHP}%`;
        if (playerHPText) playerHPText.innerText = Math.floor(this.battleState.playerHP);
        if (enemyHPText) enemyHPText.innerText = Math.floor(this.battleState.enemyHP);
    }

    log(message) {
        const logEl = document.getElementById('fb-battle-log');
        if (logEl) {
            logEl.innerHTML = `<div>> ${message}</div>` + logEl.innerHTML;
        }
    }

    win() {
        const exp = 50 + this.battleState.round * 5;
        updateExp(exp);
        this.log(`🎉 胜利！获得${exp}点修为！`);
        effectManager.createLevelUpEffect(this.battleState.round);
        
        setTimeout(() => {
            alert(`胜利！获得${exp}点修为！`);
            this.reset();
        }, 1000);
    }

    lose() {
        this.log('☠️ 失败！心魔入侵，重修再来！');
        setTimeout(() => {
            alert('失败！重修再来！');
            this.reset();
        }, 1000);
    }

    reset() {
        this.battleState = {
            playerHP: 100,
            enemyHP: 100,
            playerTurn: true,
            round: 1,
            selectedFormula: null
        };
        this.init('formula-battle-game');
    }
}

// ==================== 玩法 3: 知识竞答 ====================
class QuizCompetition {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 30;
        this.timer = null;
        this.usedQuestions = new Set();
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-blue-900/30 to-slate-900 rounded-xl p-6 border border-blue-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-blue-400">🧠 知识竞答</h3>
                    <div class="flex gap-4">
                        <span class="text-yellow-400">⭐ 得分：<span id="qc-score">0</span></span>
                        <span class="text-cyan-400">⏱️ 时间：<span id="qc-time">30</span>s</span>
                    </div>
                </div>
                
                <button onclick="window.quizCompetition.startGame()" 
                        class="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-bold text-white text-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all mb-4">
                    🚀 开始竞答
                </button>
                
                <div id="qc-game-area" class="hidden">
                    <div class="text-center mb-4">
                        <div class="text-sm text-slate-400">第 <span id="qc-question-num">1</span> 题</div>
                    </div>
                    
                    <div class="bg-slate-800/50 p-6 rounded-lg mb-4">
                        <p id="qc-question" class="text-lg text-slate-200 text-center"></p>
                    </div>
                    
                    <div id="qc-options" class="grid grid-cols-2 gap-3"></div>
                </div>
            </div>
        `;
    }

    _getRandomQuestions(count = 5) {
        const availableQuestions = quizBank.filter((_, index) => !this.usedQuestions.has(index));
        if (availableQuestions.length < count) {
            this.usedQuestions.clear();
            return this._shuffleArray([...quizBank]).slice(0, count);
        }
        const shuffled = this._shuffleArray([...availableQuestions]);
        return shuffled.slice(0, count);
    }

    _shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    startGame() {
        this.score = 0;
        this.currentQuestion = 0;
        this.usedQuestions.clear();
        this.questions = this._getRandomQuestions(5);
        document.getElementById('qc-game-area').classList.remove('hidden');
        this.nextQuestion();
    }

    nextQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.endGame();
            return;
        }
        
        const q = this.questions[this.currentQuestion];
        document.getElementById('qc-question-num').innerText = this.currentQuestion + 1;
        document.getElementById('qc-question').innerText = q.q;
        
        const optionsEl = document.getElementById('qc-options');
        optionsEl.innerHTML = q.opts.map((opt, i) => `
            <button onclick="window.quizCompetition.answer(${i})" 
                    class="p-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-all hover:scale-105">
                ${['A', 'B', 'C', 'D'][i]}. ${opt}
            </button>
        `).join('');
        
        this.startTimer();
    }

    startTimer() {
        this.timeLeft = 30;
        document.getElementById('qc-time').innerText = this.timeLeft;
        
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            document.getElementById('qc-time').innerText = this.timeLeft;
            
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.nextQuestion();
            }
        }, 1000);
    }

    answer(selectedIndex) {
        const q = this.questions[this.currentQuestion];
        
        if (selectedIndex === q.ans) {
            this.score += 10 + this.timeLeft;
            effectManager.createCorrectAnswerEffect(document.getElementById('qc-options'));
        } else {
            effectManager.createWrongAnswerEffect(document.getElementById('qc-options'));
        }
        
        document.getElementById('qc-score').innerText = this.score;
        clearInterval(this.timer);
        
        this.currentQuestion++;
        setTimeout(() => this.nextQuestion(), 500);
    }

    endGame() {
        clearInterval(this.timer);
        const exp = this.score;
        updateExp(exp);
        
        alert(`竞答结束！得分：${this.score}，获得${exp}修为！`);
        effectManager.createLevelUpEffect(Math.floor(this.score / 50));
        
        document.getElementById('qc-game-area').classList.add('hidden');
    }

    destroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// 导出实例
const towerDefense = new MathTowerDefense();
const formulaBattle = new FormulaBattle();
const quizCompetition = new QuizCompetition();

export { MathTowerDefense, FormulaBattle, QuizCompetition, towerDefense, formulaBattle, quizCompetition };
