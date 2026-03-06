/**
 * 创新玩法系统扩展模块
 * 新增 5 种玩法：数学大富翁、公式拼图、时间挑战、数学迷宫、记忆宫殿
 * 总计 8 种玩法
 */

import { updateExp, getUserState } from './state.js';
import { effectManager } from './effects.js';

// ==================== 玩法 4: 数学大富翁 ====================
class MathMonopoly {
    constructor() {
        this.board = [
            { name: "起点", type: "start", effect: "获得 100 金币" },
            { name: "素数格", type: "quiz", question: "下列哪个是素数？", answer: 17 },
            { name: "机会", type: "chance", effect: "前进 2 格" },
            { name: "几何题", type: "quiz", question: "三角形内角和？", answer: 180 },
            { name: "休息站", type: "rest", effect: "暂停一回合" },
            { name: "代数题", type: "quiz", question: "2x+3=11, x=?", answer: 4 },
            { name: "命运", type: "fate", effect: "后退 1 格" },
            { name: "微积分", type: "boss", question: "∫xdx=?", answer: "x²/2" },
            { name: "奖励格", type: "reward", effect: "获得 50 金币" },
            { name: "陷阱", type: "trap", effect: "失去 30 金币" },
            { name: "传送门", type: "teleport", effect: "传送到对面" },
            { name: "终点", type: "goal", effect: "游戏结束" }
        ];
        
        this.players = [];
        this.currentPlayer = 0;
        this.gameState = 'waiting';
    }

    init(containerId, playerCount = 2) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        this.players = Array(playerCount).fill(0).map((_, i) => ({
            id: i,
            position: 0,
            gold: 100,
            emoji: ['🎲', '🎯', '🎪', '🎨'][i]
        }));
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-amber-900 to-orange-900 rounded-xl p-6 border border-amber-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-amber-400">🎲 数学大富翁</h3>
                    <div class="text-sm text-amber-300">当前玩家：<span id="mp-current">${this.players[0].emoji}</span></div>
                </div>
                
                <div id="mp-board" class="grid grid-cols-4 gap-2 mb-4">
                    ${this.board.map((cell, i) => `
                        <div class="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-center min-h-[80px] flex flex-col justify-center">
                            <div class="text-xs text-slate-400">${i}</div>
                            <div class="text-lg">${cell.name}</div>
                            <div class="text-xs text-slate-500">${cell.type}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                    <div class="space-y-2">
                        ${this.players.map((p, i) => `
                            <div class="p-3 bg-slate-700/50 rounded-lg flex justify-between items-center">
                                <div class="flex items-center gap-2">
                                    <span class="text-2xl">${p.emoji}</span>
                                    <div>
                                        <div class="text-sm font-bold text-slate-200">玩家${i+1}</div>
                                        <div class="text-xs text-slate-400">位置：${p.position} | 金币：${p.gold}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="space-y-2">
                        <button onclick="window.mathMonopoly.rollDice()" 
                                class="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-amber-500/30 transition-all">
                            🎲 掷骰子
                        </button>
                        <button onclick="window.mathMonopoly.answerQuestion()" 
                                class="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                            ✏️ 答题
                        </button>
                        <div class="p-3 bg-slate-700/50 rounded-lg">
                            <div class="text-xs text-slate-400">游戏规则</div>
                            <div class="text-sm text-slate-300 mt-1">掷骰子前进，答对题目获得奖励，先到达终点者胜！</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    rollDice() {
        const dice = Math.floor(Math.random() * 6) + 1;
        alert(`🎲 掷出了 ${dice} 点！`);
        
        const player = this.players[this.currentPlayer];
        player.position = (player.position + dice) % this.board.length;
        
        const cell = this.board[player.position];
        alert(`📍 到达：${cell.name}\n${cell.effect}`);
        
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.updateUI();
    }

    updateUI() {
        const currentPlayerEl = document.getElementById('mp-current');
        if (currentPlayerEl) {
            currentPlayerEl.textContent = this.players[this.currentPlayer].emoji;
        }
    }
}

// ==================== 玩法 5: 公式拼图 ====================
class FormulaPuzzle {
    constructor() {
        this.formulas = [
            { name: "勾股定理", parts: ["a²", "+", "b²", "=", "c²"], order: [0, 1, 2, 3, 4] },
            { name: "欧拉公式", parts: ["e^(iπ)", "+", "1", "=", "0"], order: [0, 1, 2, 3, 4] },
            { name: "二次方程求根公式", parts: ["x =", "(-b ± √(b²-4ac))", "/", "2a"], order: [0, 1, 2, 3] },
            { name: "三角恒等式", parts: ["sin²x", "+", "cos²x", "=", "1"], order: [0, 1, 2, 3, 4] },
            { name: "导数公式", parts: ["(xⁿ)'", "=", "nxⁿ⁻¹"], order: [0, 1, 2] },
            { name: "积分公式", parts: ["∫", "x dx", "=", "x²/2", "+ C"], order: [0, 1, 2, 3, 4] }
        ];
        
        this.currentFormula = null;
        this.playerOrder = [];
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        this.selectRandomFormula();
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 border border-indigo-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-indigo-400">🧩 公式拼图</h3>
                    <div class="text-sm text-indigo-300">目标：${this.currentFormula.name}</div>
                </div>
                
                <div class="bg-slate-800/50 rounded-lg p-6 mb-4 min-h-[120px] border border-slate-700">
                    <div class="text-sm text-slate-400 mb-3">将下方碎片拖拽到正确位置</div>
                    <div id="fp-dropzone" class="flex gap-2 flex-wrap min-h-[60px] items-center p-3 bg-slate-700/30 rounded-lg border-2 border-dashed border-slate-600">
                        <div class="text-slate-500 text-sm">拖拽碎片到这里</div>
                    </div>
                </div>
                
                <div id="fp-pieces" class="grid grid-cols-3 gap-3 mb-4">
                    ${this.currentFormula.parts.map((part, i) => `
                        <button onclick="window.formulaPuzzle.selectPiece(${i})" 
                                class="p-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg font-mono text-lg text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:scale-105">
                            ${part}
                        </button>
                    `).join('')}
                </div>
                
                <div class="flex gap-2">
                    <button onclick="window.formulaPuzzle.checkAnswer()" 
                            class="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-green-500/30 transition-all">
                        ✓ 检查答案
                    </button>
                    <button onclick="window.formulaPuzzle.nextPuzzle()" 
                            class="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                        ➡️ 下一题
                    </button>
                </div>
            </div>
        `;
    }

    selectRandomFormula() {
        const index = Math.floor(Math.random() * this.formulas.length);
        this.currentFormula = this.formulas[index];
        this.playerOrder = [];
    }

    selectPiece(index) {
        const piece = this.currentFormula.parts[index];
        this.playerOrder.push({ piece, index });
        
        const dropzone = document.getElementById('fp-dropzone');
        if (dropzone) {
            if (dropzone.textContent.includes('拖拽')) {
                dropzone.innerHTML = '';
            }
            const pieceEl = document.createElement('span');
            pieceEl.className = 'px-3 py-1 bg-indigo-600 rounded text-sm';
            pieceEl.textContent = piece;
            dropzone.appendChild(pieceEl);
        }
    }

    checkAnswer() {
        const correct = this.currentFormula.parts.map((p, i) => ({ piece: p, index: i }));
        const isCorrect = JSON.stringify(this.playerOrder.map(p => p.index)) === JSON.stringify(correct.map(p => p.index));
        
        if (isCorrect) {
            alert('✅ 正确！公式拼接成功！+20 经验');
            updateExp(20);
            effectManager.showFloatingText('正确!', 'success');
        } else {
            alert('❌ 错误，请重新排列。提示：回忆公式的标准形式。');
        }
    }

    nextPuzzle() {
        this.selectRandomFormula();
        const container = document.getElementById('fp-dropzone')?.parentElement?.parentElement;
        if (container) {
            this.init(container.id);
        }
    }
}

// ==================== 玩法 6: 时间挑战 ====================
class TimeChallenge {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.timeLeft = 60;
        this.timer = null;
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        this.generateQuestions();
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-red-900 to-orange-900 rounded-xl p-6 border border-red-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-red-400">⏱️ 时间挑战</h3>
                    <div class="flex gap-4 text-sm">
                        <span class="text-yellow-400">得分：<span id="tc-score">${this.score}</span></span>
                        <span class="text-cyan-400">时间：<span id="tc-time">${this.timeLeft}s</span></span>
                    </div>
                </div>
                
                <div id="tc-question" class="bg-slate-800/50 rounded-lg p-8 mb-4 text-center border border-slate-700">
                    <div class="text-3xl font-bold text-slate-200 mb-4">${this.questions[0]?.q}</div>
                    <div class="grid grid-cols-2 gap-3">
                        ${this.questions[0]?.opts.map((opt, i) => `
                            <button onclick="window.timeChallenge.answer(${i})" 
                                    class="py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-200 transition-all">
                                ${opt}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="progress-bar w-full bg-slate-700 rounded-full h-3 mb-4">
                    <div id="tc-progress" class="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all" style="width: 100%"></div>
                </div>
                
                <div class="flex gap-2">
                    <button onclick="window.timeChallenge.startGame()" 
                            class="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-green-500/30 transition-all">
                        ▶️ 开始挑战
                    </button>
                    <button onclick="window.timeChallenge.useHint()" 
                            class="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-yellow-500/30 transition-all">
                        💡 使用提示 (-5 分)
                    </button>
                </div>
            </div>
        `;
    }

    generateQuestions() {
        this.questions = Array(20).fill(0).map(() => {
            const a = Math.floor(Math.random() * 20) + 1;
            const b = Math.floor(Math.random() * 20) + 1;
            const correct = a * b;
            const wrong1 = correct + Math.floor(Math.random() * 10) + 1;
            const wrong2 = correct - Math.floor(Math.random() * 10) - 1;
            const wrong3 = correct + Math.floor(Math.random() * 5) * 10;
            
            return {
                q: `${a} × ${b} = ?`,
                opts: [correct, wrong1, wrong2, wrong3].sort(() => Math.random() - 0.5),
                ans: 0
            };
        });
    }

    startGame() {
        this.score = 0;
        this.timeLeft = 60;
        this.currentQuestion = 0;
        this.updateUI();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateUI();
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    answer(index) {
        const q = this.questions[this.currentQuestion];
        if (index === q.ans) {
            this.score += 10;
            effectManager.showFloatingText('+10', 'success');
        } else {
            this.score = Math.max(0, this.score - 5);
            effectManager.showFloatingText('-5', 'error');
        }
        
        this.currentQuestion = (this.currentQuestion + 1) % this.questions.length;
        this.updateUI();
    }

    useHint() {
        this.score = Math.max(0, this.score - 5);
        const q = this.questions[this.currentQuestion];
        const correctIndex = q.ans;
        alert(`💡 提示：正确答案不是选项${['A','B','C','D'].filter((_, i) => i !== correctIndex).join('、')}。`);
        this.updateUI();
    }

    updateUI() {
        const scoreEl = document.getElementById('tc-score');
        const timeEl = document.getElementById('tc-time');
        const progressEl = document.getElementById('tc-progress');
        
        if (scoreEl) scoreEl.textContent = this.score;
        if (timeEl) timeEl.textContent = this.timeLeft;
        if (progressEl) progressEl.style.width = `${(this.timeLeft / 60) * 100}%`;
    }

    endGame() {
        clearInterval(this.timer);
        alert(`⏰ 时间到！最终得分：${this.score}\n${this.score >= 100 ? '🏆 优秀！' : this.score >= 50 ? '👍 不错！' : '💪 继续加油！'}`);
    }
}

// ==================== 玩法 7: 数学迷宫 ====================
class MathMaze {
    constructor() {
        this.maze = [];
        this.playerPos = { x: 0, y: 0 };
        this.goal = { x: 0, y: 0 };
        this.obstacles = [];
    }

    init(containerId, size = 10) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        this.generateMaze(size);
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-green-900 to-teal-900 rounded-xl p-6 border border-green-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-green-400">🌀 数学迷宫</h3>
                    <div class="text-sm text-green-300">找到出口，答对题目开门</div>
                </div>
                
                <div id="mm-grid" class="grid gap-1 mb-4" style="grid-template-columns: repeat(${size}, 1fr)">
                    ${this.renderMaze(size)}
                </div>
                
                <div class="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
                    <div></div>
                    <button onclick="window.mathMaze.move(0, -1)" class="p-3 bg-slate-700 hover:bg-slate-600 rounded text-white">⬆️</button>
                    <div></div>
                    <button onclick="window.mathMaze.move(-1, 0)" class="p-3 bg-slate-700 hover:bg-slate-600 rounded text-white">⬅️</button>
                    <button onclick="window.mathMaze.move(0, 1)" class="p-3 bg-slate-700 hover:bg-slate-600 rounded text-white">⬇️</button>
                    <button onclick="window.mathMaze.move(1, 0)" class="p-3 bg-slate-700 hover:bg-slate-600 rounded text-white">➡️</button>
                </div>
            </div>
        `;
    }

    generateMaze(size) {
        this.maze = Array(size).fill(0).map(() => Array(size).fill(0));
        this.playerPos = { x: 0, y: 0 };
        this.goal = { x: size - 1, y: size - 1 };
        
        // 随机放置障碍
        for (let i = 0; i < size * 2; i++) {
            const x = Math.floor(Math.random() * size);
            const y = Math.floor(Math.random() * size);
            if ((x !== 0 || y !== 0) && (x !== size - 1 || y !== size - 1)) {
                this.maze[y][x] = 1;
            }
        }
    }

    renderMaze(size) {
        return this.maze.map((row, y) => 
            row.map((cell, x) => {
                if (x === this.playerPos.x && y === this.playerPos.y) return '🧑';
                if (x === this.goal.x && y === this.goal.y) return '🚩';
                if (cell === 1) return '🚧';
                return '⬜';
            }).join('')
        ).join('');
    }

    move(dx, dy) {
        const newX = this.playerPos.x + dx;
        const newY = this.playerPos.y + dy;
        
        if (newX >= 0 && newX < this.maze[0].length && newY >= 0 && newY < this.maze.length) {
            if (this.maze[newY][newX] === 0) {
                this.playerPos = { x: newX, y: newY };
                this.updateMaze();
                
                if (newX === this.goal.x && newY === this.goal.y) {
                    this.askQuestion();
                }
            } else {
                alert('🚧 此路不通！');
            }
        }
    }

    updateMaze() {
        const grid = document.getElementById('mm-grid');
        if (grid) {
            grid.innerHTML = this.renderMaze(this.maze.length);
        }
    }

    askQuestion() {
        const questions = [
            { q: "7 × 8 = ?", a: 56 },
            { q: "15² = ?", a: 225 },
            { q: "√144 = ?", a: 12 },
            { q: "2³ × 3² = ?", a: 72 }
        ];
        
        const q = questions[Math.floor(Math.random() * questions.length)];
        const answer = prompt(`🎯 到达终点！回答问题：${q.q}`);
        
        if (parseInt(answer) === q.a) {
            alert('✅ 正确！迷宫通关！+50 经验');
            updateExp(50);
        } else {
            alert('❌ 错误，被传送回起点。');
            this.playerPos = { x: 0, y: 0 };
            this.updateMaze();
        }
    }
}

// ==================== 玩法 8: 记忆宫殿 ====================
class MemoryPalace {
    constructor() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.showing = false;
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-pink-900 to-rose-900 rounded-xl p-6 border border-pink-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-pink-400">🧠 记忆宫殿</h3>
                    <div class="text-sm text-pink-300">等级：<span id="mp-level">${this.level}</span></div>
                </div>
                
                <div id="mp-display" class="bg-slate-800/50 rounded-lg p-8 mb-4 text-center border border-slate-700 min-h-[200px] flex items-center justify-center">
                    <div class="text-slate-400">点击开始，记住显示的数学公式序列</div>
                </div>
                
                <div class="grid grid-cols-2 gap-3 mb-4">
                    <button onclick="window.memoryPalace.start()" 
                            class="py-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                        ▶️ 开始
                    </button>
                    <button onclick="window.memoryPalace.showHint()" 
                            class="py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                        💡 提示
                    </button>
                </div>
                
                <div id="mp-input" class="grid grid-cols-2 gap-2">
                    <!-- 公式选项会在游戏开始时生成 -->
                </div>
            </div>
        `;
    }

    start() {
        this.sequence = [];
        this.playerSequence = [];
        this.level = 1;
        this.nextRound();
    }

    nextRound() {
        this.sequence.push(this.getRandomFormula());
        this.playerSequence = [];
        this.showSequence();
    }

    getRandomFormula() {
        const formulas = ['E=mc²', 'F=ma', 'a²+b²=c²', 'e^(iπ)+1=0', '∫xdx=x²/2', 'lim sinx/x=1'];
        return formulas[Math.floor(Math.random() * formulas.length)];
    }

    async showSequence() {
        this.showing = true;
        const display = document.getElementById('mp-display');
        
        for (let i = 0; i < this.sequence.length; i++) {
            if (display) {
                display.innerHTML = `<div class="text-3xl font-bold text-pink-400">${this.sequence[i]}</div>`;
            }
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            if (display) {
                display.innerHTML = '<div class="text-2xl text-slate-500">...</div>';
            }
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        this.showing = false;
        this.showInput();
    }

    showInput() {
        const display = document.getElementById('mp-display');
        const input = document.getElementById('mp-input');
        
        if (display) {
            display.innerHTML = '<div class="text-slate-300">请按顺序点击刚才显示的公式</div>';
        }
        
        if (input) {
            const formulas = [...new Set(this.sequence)];
            input.innerHTML = formulas.map(f => `
                <button onclick="window.memoryPalace.select('${f}')" 
                        class="p-3 bg-slate-700 hover:bg-slate-600 rounded text-sm text-white transition-all">
                    ${f}
                </button>
            `).join('');
        }
    }

    select(formula) {
        if (this.showing) return;
        
        this.playerSequence.push(formula);
        
        const currentIndex = this.playerSequence.length - 1;
        if (this.playerSequence[currentIndex] !== this.sequence[currentIndex]) {
            alert('❌ 错误！游戏结束。达到等级：' + this.level);
            this.init(document.getElementById('mp-input')?.parentElement?.parentElement?.id);
            return;
        }
        
        if (this.playerSequence.length === this.sequence.length) {
            this.level++;
            document.getElementById('mp-level').textContent = this.level;
            setTimeout(() => this.nextRound(), 1000);
        }
    }

    showHint() {
        if (this.sequence.length > 0) {
            const next = this.sequence[this.playerSequence.length];
            alert(`💡 提示：下一个公式包含 "${next.substring(0, 3)}..."`);
        }
    }
}

// 导出所有新玩法
export { MathMonopoly, FormulaPuzzle, TimeChallenge, MathMaze, MemoryPalace };
