/**
 * 挑战系统模块
 * 负责答题挑战的逻辑处理
 */

import { mathData, quizBank } from '../data.js';
import { updateExp, unlockLevel, addChallengeRecord, addAchievement } from './state.js';

class ChallengeManager {
    constructor() {
        this.currentQuestion = null;
        this.currentLevelId = null;
        this.streak = 0;
        this.consecutiveCorrect = 0;
    }
    
    startQuiz(levelId) {
        this.currentLevelId = levelId;
        const questions = quizBank.filter(q => q.level === levelId);
        
        if (questions.length === 0) {
            alert('该境界暂无题库！');
            return;
        }
        
        this.currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        this.renderQuiz(levelId);
    }
    
    renderQuiz(levelId) {
        const realm = mathData.find(r => r.id === levelId);
        const modalBody = document.getElementById('modal-quiz-body');
        
        if (!modalBody) return;
        
        modalBody.innerHTML = `
            <div class="text-center mb-6">
                <h3 class="text-xl font-bold" style="color: ${realm.color}">${realm.name} · 试炼</h3>
                <div class="text-xs text-slate-400 mt-2">连续答对：${this.consecutiveCorrect} 题</div>
            </div>
            <div class="bg-slate-900/50 p-4 rounded-lg mb-6">
                <p class="text-lg">${this.currentQuestion.q}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                ${this.currentQuestion.opts.map((opt, i) => `
                    <button onclick="window.challengeManager.handleAnswer(${i})" 
                            class="w-full p-3 bg-slate-700 hover:bg-slate-600 rounded text-left transition-colors active:scale-95 quiz-option">
                        <span class="inline-block w-6 h-6 rounded bg-slate-900 text-center mr-2">${['A','B','C','D'][i]}</span>
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
        
        if (window.showModal) {
            window.showModal('modal-quiz', modalBody.innerHTML);
        }
    }
    
    handleAnswer(selectedIndex) {
        const isCorrect = selectedIndex === this.currentQuestion.ans;
        const modalBody = document.getElementById('modal-quiz-body');
        
        if (isCorrect) {
            this.consecutiveCorrect++;
            const baseExp = this.currentLevelId * 10;
            const streakBonus = Math.min(this.consecutiveCorrect - 1, 5) * 2;
            const totalExp = baseExp + streakBonus;
            
            const result = updateExp(totalExp);
            addChallengeRecord(this.currentLevelId, true);
            
            if (this.consecutiveCorrect >= 5) {
                addAchievement({ id: 'perfectionist', name: '完美主义', desc: '连续答对 5 题', icon: '✨' });
            }
            
            if (result.levelUp) {
                this.checkAchievements();
            }
            
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="text-center">
                        <div class="text-6xl mb-4">✨</div>
                        <h3 class="text-2xl font-bold text-green-400 mb-2">道心通明</h3>
                        <p class="text-slate-300 mb-6">回答正确！修为 +${totalExp}${streakBonus > 0 ? ` (连击奖励 +${streakBonus})` : ''}</p>
                        ${result.levelUp ? '<p class="text-amber-400 mb-4">恭喜突破到第' + result.level + '层！</p>' : ''}
                        <button onclick="window.closeModal('modal-quiz'); window.challengeManager.startQuiz(${this.currentLevelId});" 
                                class="px-6 py-2 bg-green-600 rounded hover:bg-green-500 transition-colors mr-2">
                            继续挑战
                        </button>
                        <button onclick="window.closeModal('modal-quiz')" 
                                class="px-6 py-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors">
                            退出
                        </button>
                    </div>
                `;
            }
        } else {
            this.consecutiveCorrect = 0;
            addChallengeRecord(this.currentLevelId, false);
            
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="text-center">
                        <div class="text-6xl mb-4">☁️</div>
                        <h3 class="text-2xl font-bold text-red-400 mb-2">心魔入侵</h3>
                        <p class="text-slate-300 mb-6">回答错误，再接再厉。</p>
                        <p class="text-sm text-slate-400 mb-4">正确答案是：${this.currentQuestion.opts[this.currentQuestion.ans]}</p>
                        <button onclick="window.closeModal('modal-quiz')" 
                                class="px-6 py-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors">
                            重新闭关
                        </button>
                    </div>
                `;
            }
        }
    }
    
    checkAchievements() {
        const stats = {
            first_blood: true,
            scholar: this.currentLevelId >= 3,
            master: this.currentLevelId >= 9
        };
        
        if (stats.first_blood) {
            const result = addAchievement({ id: 'first_blood', name: '初出茅庐', desc: '首次挑战成功', icon: '🎯' });
            if (result.isNew && window.showModal) {
                setTimeout(() => {
                    window.showModal('modal-quiz', `
                        <div class="text-center">
                            <div class="text-6xl mb-4">${result.achievement.icon}</div>
                            <h3 class="text-2xl font-bold text-amber-400 mb-2">成就解锁</h3>
                            <p class="text-slate-300 mb-4">${result.achievement.name}</p>
                            <p class="text-sm text-slate-400">${result.achievement.desc}</p>
                        </div>
                    `);
                }, 500);
            }
        }
    }
}

const challengeManager = new ChallengeManager();

export { ChallengeManager, challengeManager };
