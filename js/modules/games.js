/**
 * 游戏逻辑模块
 * 负责小游戏的逻辑处理
 */

import { gameSequences, gameFormulas } from '../data.js';
import { addGamePlayed, updateExp } from './state.js';

class PuzzleGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.targetFormula = '';
        this.shuffledChars = [];
    }
    
    init() {
        this.targetFormula = gameFormulas[Math.floor(Math.random() * gameFormulas.length)];
        this.shuffledChars = this.targetFormula.split('').sort(() => Math.random() - 0.5);
        this.render();
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="bg-slate-800/80 rounded-xl p-6 border border-amber-500/30 shadow-lg fade-in-up">
                <h3 class="text-xl font-bold text-amber-400 mb-4">公式拼图：请还原因公式</h3>
                <div id="puzzle-target" class="min-h-[50px] bg-slate-900 p-2 rounded mb-4 flex flex-wrap gap-2 border border-dashed border-slate-600"></div>
                <div id="puzzle-source" class="flex flex-wrap gap-2 justify-center mb-4">
                    ${this.shuffledChars.map((c, i) => 
                        `<button class="px-3 py-1 bg-slate-700 rounded hover:bg-amber-500/30 transition-colors active:scale-90 puzzle-char" 
                                  data-char="${c}" 
                                  onclick="window.gameManager.movePuzzleChar(this)">
                            ${c}
                        </button>`
                    ).join('')}
                </div>
                <div class="text-center">
                    <button onclick="window.gameManager.checkPuzzle()" 
                            class="px-6 py-2 bg-amber-500 text-slate-900 rounded font-bold active:scale-95 hover:bg-amber-400 transition-colors">
                        确认
                    </button>
                </div>
            </div>
        `;
    }
    
    getCurrentFormula() {
        const target = document.getElementById('puzzle-target');
        if (!target) return '';
        return Array.from(target.querySelectorAll('button')).map(b => b.dataset.char).join('');
    }
    
    check() {
        const current = this.getCurrentFormula();
        return current === this.targetFormula;
    }
}

class SequenceGame {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentSequence = null;
    }
    
    init() {
        this.currentSequence = gameSequences[Math.floor(Math.random() * gameSequences.length)];
        this.render();
    }
    
    render() {
        if (!this.container) return;
        
        this.container.innerHTML = `
            <div class="bg-slate-800/80 rounded-xl p-6 border border-blue-500/30 shadow-lg fade-in-up">
                <h3 class="text-xl font-bold text-blue-400 mb-4">数列推演</h3>
                <p class="text-slate-300 mb-4">提示：${this.currentSequence.hint}</p>
                <div class="text-2xl tracking-widest mb-6 text-center font-mono text-white">
                    ${this.currentSequence.arr.join(' , ')} , ?
                </div>
                <input id="seq-answer" type="number" 
                       class="w-full p-2 bg-slate-900 rounded border border-slate-600 mb-4 focus:border-blue-500 focus:outline-none" 
                       placeholder="输入下一个数字">
                <div class="text-center">
                    <button onclick="window.gameManager.checkSeq()" 
                            class="px-6 py-2 bg-blue-500 text-white rounded font-bold active:scale-95 hover:bg-blue-400 transition-colors">
                        提交
                    </button>
                </div>
            </div>
        `;
    }
    
    check(answer) {
        return parseInt(answer) === this.currentSequence.ans;
    }
}

class GameManager {
    constructor() {
        this.currentGame = null;
        this.gameAreaId = 'game-area';
    }
    
    startGame(type) {
        const container = document.getElementById(this.gameAreaId);
        if (!container) return;
        
        container.classList.remove('hidden');
        addGamePlayed();
        
        switch(type) {
            case 'puzzle':
                this.currentGame = new PuzzleGame(this.gameAreaId);
                this.currentGame.init();
                break;
            case 'sequence':
                this.currentGame = new SequenceGame(this.gameAreaId);
                this.currentGame.init();
                break;
            case 'calc':
                this.startCalculationGame();
                break;
        }
        
        if (window.updateUI) {
            window.updateUI();
        }
    }
    
    movePuzzleChar(btn) {
        const target = document.getElementById('puzzle-target');
        const source = document.getElementById('puzzle-source');
        
        if (!target || !source) return;
        
        if (btn.parentElement.id === 'puzzle-source') {
            target.appendChild(btn);
        } else {
            source.appendChild(btn);
        }
    }
    
    checkPuzzle() {
        if (!this.currentGame) return;
        
        const isCorrect = this.currentGame.check();
        if (isCorrect) {
            this.handleSuccess(20, '拼图正确！');
        } else {
            this.handleFailure('顺序不对哦，再试试');
        }
    }
    
    checkSeq() {
        if (!this.currentGame) return;
        
        const input = document.getElementById('seq-answer');
        if (!input) return;
        
        const isCorrect = this.currentGame.check(input.value);
        if (isCorrect) {
            this.handleSuccess(15, '推演正确！');
        } else {
            this.handleFailure('再想想，不对哦');
        }
    }
    
    handleSuccess(exp, message) {
        const result = updateExp(exp);
        
        if (window.showModal) {
            window.showModal('modal-quiz', `
                <div class="text-center">
                    <div class="text-6xl mb-4">✨</div>
                    <h3 class="text-2xl font-bold text-green-400 mb-2">道心通明</h3>
                    <p class="text-slate-300 mb-6">${message} 修为 +${exp}</p>
                    ${result.levelUp ? '<p class="text-amber-400 mb-4">恭喜突破到第' + result.level + '层！</p>' : ''}
                    <button onclick="window.closeModal('modal-quiz'); document.getElementById('game-area').classList.add('hidden');" 
                            class="px-6 py-2 bg-green-600 rounded hover:bg-green-500 transition-colors">
                        继续修炼
                    </button>
                </div>
            `);
        }
    }
    
    handleFailure(message) {
        if (window.showModal) {
            window.showModal('modal-quiz', `
                <div class="text-center">
                    <div class="text-6xl mb-4">☁️</div>
                    <h3 class="text-2xl font-bold text-red-400 mb-2">心魔入侵</h3>
                    <p class="text-slate-300 mb-6">${message}</p>
                    <button onclick="window.closeModal('modal-quiz')" 
                            class="px-6 py-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors">
                        重新挑战
                    </button>
                </div>
            `);
        } else {
            alert(message);
        }
    }
    
    startCalculationGame() {
        const num1 = Math.floor(Math.random() * 20) + 1;
        const num2 = Math.floor(Math.random() * 20) + 1;
        const operators = ['+', '-', '×'];
        const operator = operators[Math.floor(Math.random() * operators.length)];
        
        let answer;
        switch(operator) {
            case '+': answer = num1 + num2; break;
            case '-': answer = num1 - num2; break;
            case '×': answer = num1 * num2; break;
        }
        
        const container = document.getElementById(this.gameAreaId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="bg-slate-800/80 rounded-xl p-6 border border-green-500/30 shadow-lg fade-in-up">
                <h3 class="text-xl font-bold text-green-400 mb-4">快速计算</h3>
                <div class="text-3xl text-center mb-6 font-mono text-white">
                    ${num1} ${operator} ${num2} = ?
                </div>
                <input id="calc-answer" type="number" 
                       class="w-full p-2 bg-slate-900 rounded border border-slate-600 mb-4 focus:border-green-500 focus:outline-none" 
                       placeholder="输入答案">
                <div class="text-center">
                    <button onclick="window.gameManager.checkCalc(${answer})" 
                            class="px-6 py-2 bg-green-500 text-white rounded font-bold active:scale-95 hover:bg-green-400 transition-colors">
                        提交
                    </button>
                </div>
            </div>
        `;
    }
    
    checkCalc(correctAnswer) {
        const input = document.getElementById('calc-answer');
        if (!input) return;
        
        const userAnswer = parseInt(input.value);
        if (userAnswer === correctAnswer) {
            this.handleSuccess(10, '计算正确！');
        } else {
            this.handleFailure(`正确答案是 ${correctAnswer}`);
        }
    }
}

const gameManager = new GameManager();

export { PuzzleGame, SequenceGame, GameManager, gameManager };
