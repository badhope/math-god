/**
 * 任务系统模块
 * 包含：每日任务、成就系统、自习倒计时、任务进度跟踪
 */

import { updateExp, updateGold, getUserState, saveUserState } from './state.js';
import { effectManager } from './effects.js';

// ==================== 每日任务系统 ====================
class DailyTaskSystem {
    constructor() {
        this.tasks = [];
        this.dailyTasks = [
            {
                id: 'daily_1',
                title: '初出茅庐',
                description: '完成 5 道基础题目',
                condition: { type: 'quiz_complete', count: 5, level: 1 },
                reward: { exp: 50, gold: 20 },
                progress: 0,
                completed: false
            },
            {
                id: 'daily_2',
                title: '勤学苦练',
                description: '学习 30 分钟',
                condition: { type: 'study_time', minutes: 30 },
                reward: { exp: 100, gold: 30 },
                progress: 0,
                completed: false
            },
            {
                id: 'daily_3',
                title: '探索者',
                description: '浏览 3 位数学家传记',
                condition: { type: 'view_mathematician', count: 3 },
                reward: { exp: 60, gold: 25 },
                progress: 0,
                completed: false
            },
            {
                id: 'daily_4',
                title: '游戏达人',
                description: '玩 1 次数学游戏',
                condition: { type: 'play_game', count: 1 },
                reward: { exp: 40, gold: 15 },
                progress: 0,
                completed: false
            },
            {
                id: 'daily_5',
                title: '挑战自我',
                description: '完成 1 道难题（难度≥5）',
                condition: { type: 'quiz_complete', count: 1, minDifficulty: 5 },
                reward: { exp: 150, gold: 50 },
                progress: 0,
                completed: false
            },
            {
                id: 'daily_6',
                title: '记忆大师',
                description: '完成 1 次记忆宫殿游戏',
                condition: { type: 'memory_palace', count: 1 },
                reward: { exp: 80, gold: 30 },
                progress: 0,
                completed: false
            }
        ];
        
        this.loadDailyTasks();
    }

    loadDailyTasks() {
        const saved = localStorage.getItem('dailyTasks');
        const lastDate = localStorage.getItem('lastTaskDate');
        const today = new Date().toDateString();
        
        if (lastDate !== today || !saved) {
            // 新的一天，重置任务
            this.resetDailyTasks();
            localStorage.setItem('lastTaskDate', today);
        } else {
            this.tasks = JSON.parse(saved);
        }
    }

    resetDailyTasks() {
        this.tasks = JSON.parse(JSON.stringify(this.dailyTasks));
        this.saveDailyTasks();
    }

    saveDailyTasks() {
        localStorage.setItem('dailyTasks', JSON.stringify(this.tasks));
    }

    updateProgress(taskType, value = 1) {
        this.tasks.forEach(task => {
            if (task.completed) return;
            
            if (task.condition.type === taskType) {
                task.progress += value;
                
                if (task.progress >= task.condition.count) {
                    this.completeTask(task);
                }
                
                this.saveDailyTasks();
                this.renderTaskList();
            }
        });
    }

    completeTask(task) {
        task.completed = true;
        task.progress = task.condition.count;
        
        // 发放奖励
        updateExp(task.reward.exp);
        updateGold(task.reward.gold);
        
        // 显示完成特效
        effectManager.showFloatingText(`+${task.reward.exp} exp`, 'success');
        
        // 检查成就
        achievementSystem.checkAchievement('daily_task_complete');
    }

    renderTaskList() {
        const container = document.getElementById('daily-task-list');
        if (!container) return;
        
        container.innerHTML = this.tasks.map(task => `
            <div class="task-card p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border ${task.completed ? 'border-green-500/50' : 'border-slate-700'} transition-all hover:shadow-lg">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                        <h4 class="font-bold text-slate-200 flex items-center gap-2">
                            ${task.completed ? '✅' : '⭕'} ${task.title}
                        </h4>
                        <p class="text-sm text-slate-400 mt-1">${task.description}</p>
                    </div>
                    <div class="text-right">
                        <div class="text-xs text-yellow-400">+${task.reward.exp} exp</div>
                        <div class="text-xs text-amber-400">+${task.reward.gold} 金币</div>
                    </div>
                </div>
                
                <div class="mt-3">
                    <div class="flex justify-between text-xs text-slate-500 mb-1">
                        <span>进度</span>
                        <span>${task.progress}/${task.condition.count}</span>
                    </div>
                    <div class="progress-bar w-full bg-slate-700 rounded-full h-2">
                        <div class="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 rounded-full transition-all" 
                             style="width: ${(task.progress / task.condition.count) * 100}%"></div>
                    </div>
                </div>
                
                ${task.completed ? `
                    <div class="mt-2 text-xs text-green-400 flex items-center gap-1">
                        ✓ 已完成 - 奖励已发放
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 border border-indigo-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-indigo-400">📋 每日任务</h3>
                    <div class="text-sm text-indigo-300">
                        完成：${this.tasks.filter(t => t.completed).length}/${this.tasks.length}
                    </div>
                </div>
                
                <div id="daily-task-list" class="space-y-3">
                    ${this.renderTaskList()}
                </div>
                
                <div class="mt-4 p-3 bg-slate-800/50 rounded-lg">
                    <div class="text-xs text-slate-400">💡 提示：每日 0 点刷新任务，坚持完成可获得丰厚奖励！</div>
                </div>
            </div>
        `;
        
        this.renderTaskList();
    }
}

// ==================== 成就系统 ====================
class AchievementSystem {
    constructor() {
        this.achievements = [
            // 学习类成就
            {
                id: 'learning_1',
                name: '初学者',
                description: '累计学习 1 小时',
                icon: '📚',
                category: 'learning',
                difficulty: 'bronze',
                condition: { type: 'study_time', totalMinutes: 60 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'learning_2',
                name: '勤奋学子',
                description: '累计学习 10 小时',
                icon: '📖',
                category: 'learning',
                difficulty: 'silver',
                condition: { type: 'study_time', totalMinutes: 600 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'learning_3',
                name: '学霸',
                description: '累计学习 100 小时',
                icon: '🎓',
                category: 'learning',
                difficulty: 'gold',
                condition: { type: 'study_time', totalMinutes: 6000 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'learning_4',
                name: '学神',
                description: '累计学习 500 小时',
                icon: '🌟',
                category: 'learning',
                difficulty: 'platinum',
                condition: { type: 'study_time', totalMinutes: 30000 },
                unlocked: false,
                unlockedDate: null
            },
            
            // 答题类成就
            {
                id: 'quiz_1',
                name: '小试牛刀',
                description: '完成 10 道题目',
                icon: '✏️',
                category: 'quiz',
                difficulty: 'bronze',
                condition: { type: 'quiz_complete', count: 10 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'quiz_2',
                name: '答题达人',
                description: '完成 100 道题目',
                icon: '🎯',
                category: 'quiz',
                difficulty: 'silver',
                condition: { type: 'quiz_complete', count: 100 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'quiz_3',
                name: '题海征服者',
                description: '完成 500 道题目',
                icon: '🏆',
                category: 'quiz',
                difficulty: 'gold',
                condition: { type: 'quiz_complete', count: 500 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'quiz_4',
                name: '全知全能',
                description: '完成 1000 道题目',
                icon: '👑',
                category: 'quiz',
                difficulty: 'platinum',
                condition: { type: 'quiz_complete', count: 1000 },
                unlocked: false,
                unlockedDate: null
            },
            
            // 连击类成就
            {
                id: 'streak_1',
                name: '持之以恒',
                description: '连续登录 7 天',
                icon: '🔥',
                category: 'streak',
                difficulty: 'bronze',
                condition: { type: 'login_streak', days: 7 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'streak_2',
                name: '坚持不懈',
                description: '连续登录 30 天',
                icon: '⚡',
                category: 'streak',
                difficulty: 'silver',
                condition: { type: 'login_streak', days: 30 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'streak_3',
                name: '铁杆粉丝',
                description: '连续登录 100 天',
                icon: '💎',
                category: 'streak',
                difficulty: 'gold',
                condition: { type: 'login_streak', days: 100 },
                unlocked: false,
                unlockedDate: null
            },
            
            // 探索类成就
            {
                id: 'explore_1',
                name: '好奇宝宝',
                description: '浏览 10 位数学家',
                icon: '🔍',
                category: 'explore',
                difficulty: 'bronze',
                condition: { type: 'view_mathematician', count: 10 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'explore_2',
                name: '博览群书',
                description: '浏览 50 位数学家',
                icon: '📚',
                category: 'explore',
                difficulty: 'silver',
                condition: { type: 'view_mathematician', count: 50 },
                unlocked: false,
                unlockedDate: null
            },
            
            // 游戏类成就
            {
                id: 'game_1',
                name: '游戏新手',
                description: '玩 10 次游戏',
                icon: '🎮',
                category: 'game',
                difficulty: 'bronze',
                condition: { type: 'play_game', count: 10 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'game_2',
                name: '游戏大师',
                description: '玩 50 次游戏',
                icon: '🕹️',
                category: 'game',
                difficulty: 'silver',
                condition: { type: 'play_game', count: 50 },
                unlocked: false,
                unlockedDate: null
            },
            
            // 特殊成就
            {
                id: 'special_1',
                name: '完美主义',
                description: '单次答题正确率 100%（至少 10 题）',
                icon: '💯',
                category: 'special',
                difficulty: 'gold',
                condition: { type: 'perfect_quiz', accuracy: 100, minQuestions: 10 },
                unlocked: false,
                unlockedDate: null
            },
            {
                id: 'special_2',
                name: '收藏家',
                description: '解锁所有成就',
                icon: '🌈',
                category: 'special',
                difficulty: 'platinum',
                condition: { type: 'all_achievements' },
                unlocked: false,
                unlockedDate: null
            }
        ];
        
        this.loadAchievements();
    }

    loadAchievements() {
        const saved = localStorage.getItem('achievements');
        if (saved) {
            const savedData = JSON.parse(saved);
            savedData.forEach(saved => {
                const achievement = this.achievements.find(a => a.id === saved.id);
                if (achievement) {
                    achievement.unlocked = saved.unlocked;
                    achievement.unlockedDate = saved.unlockedDate;
                }
            });
        }
    }

    saveAchievements() {
        localStorage.setItem('achievements', JSON.stringify(this.achievements));
    }

    checkAchievement(type, value = null) {
        let changed = false;
        
        this.achievements.forEach(achievement => {
            if (achievement.unlocked) return;
            
            let shouldUnlock = false;
            
            // 检查成就条件
            switch (achievement.condition.type) {
                case 'study_time':
                    const totalTime = this.getTotalStudyTime();
                    shouldUnlock = totalTime >= achievement.condition.totalMinutes;
                    break;
                    
                case 'quiz_complete':
                    const totalQuiz = this.getTotalQuizCompleted();
                    shouldUnlock = totalQuiz >= achievement.condition.count;
                    break;
                    
                case 'login_streak':
                    const streak = this.getLoginStreak();
                    shouldUnlock = streak >= achievement.condition.days;
                    break;
                    
                case 'view_mathematician':
                    const viewed = this.getViewedMathematicians();
                    shouldUnlock = viewed >= achievement.condition.count;
                    break;
                    
                case 'play_game':
                    const games = this.getGamesPlayed();
                    shouldUnlock = games >= achievement.condition.count;
                    break;
            }
            
            if (shouldUnlock) {
                achievement.unlocked = true;
                achievement.unlockedDate = new Date().toISOString();
                changed = true;
                
                // 显示解锁通知
                this.showUnlockNotification(achievement);
            }
        });
        
        if (changed) {
            this.saveAchievements();
            this.renderAchievements();
        }
    }

    getTotalStudyTime() {
        const saved = localStorage.getItem('studyTime');
        return saved ? parseInt(saved) : 0;
    }

    getTotalQuizCompleted() {
        const saved = localStorage.getItem('quizCompleted');
        return saved ? parseInt(saved) : 0;
    }

    getLoginStreak() {
        const saved = localStorage.getItem('loginStreak');
        return saved ? parseInt(saved) : 0;
    }

    getViewedMathematicians() {
        const saved = localStorage.getItem('viewedMathematicians');
        return saved ? JSON.parse(saved).length : 0;
    }

    getGamesPlayed() {
        const saved = localStorage.getItem('gamesPlayed');
        return saved ? parseInt(saved) : 0;
    }

    showUnlockNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 z-50 animate-slide-in-right';
        notification.innerHTML = `
            <div class="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg p-4 shadow-lg shadow-yellow-500/30">
                <div class="flex items-center gap-3">
                    <div class="text-4xl">${achievement.icon}</div>
                    <div>
                        <div class="font-bold text-white">🏆 成就解锁！</div>
                        <div class="text-sm text-yellow-100">${achievement.name}</div>
                        <div class="text-xs text-yellow-200">${achievement.description}</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('animate-slide-out-right');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    renderAchievements() {
        const container = document.getElementById('achievement-list');
        if (!container) return;
        
        const byCategory = this.achievements.reduce((acc, a) => {
            if (!acc[a.category]) acc[a.category] = [];
            acc[a.category].push(a);
            return acc;
        }, {});
        
        const categoryNames = {
            learning: '📚 学习',
            quiz: '✏️ 答题',
            streak: '🔥 连击',
            explore: '🔍 探索',
            game: '🎮 游戏',
            special: '⭐ 特殊'
        };
        
        container.innerHTML = Object.entries(byCategory).map(([category, achievements]) => `
            <div class="mb-6">
                <h4 class="text-lg font-bold text-slate-200 mb-3">${categoryNames[category]}</h4>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    ${achievements.map(a => `
                        <div class="achievement-card p-3 bg-gradient-to-br ${a.unlocked ? 'from-yellow-900/50 to-amber-900/50 border-yellow-500/50' : 'from-slate-800 to-slate-900 border-slate-700'} rounded-lg border transition-all hover:scale-105 cursor-pointer" 
                             onclick="achievementSystem.showAchievementDetail('${a.id}')">
                            <div class="text-3xl text-center mb-2">${a.icon}</div>
                            <div class="text-xs font-bold text-center text-slate-200">${a.name}</div>
                            <div class="text-xs text-center text-slate-400 mt-1">${a.description}</div>
                            ${a.unlocked ? `
                                <div class="text-xs text-yellow-400 text-center mt-2">✓ 已解锁</div>
                            ` : `
                                <div class="text-xs text-slate-500 text-center mt-2">🔒 未解锁</div>
                            `}
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    showAchievementDetail(id) {
        const achievement = this.achievements.find(a => a.id === id);
        if (!achievement) return;
        
        alert(`🏆 ${achievement.icon} ${achievement.name}\n\n${achievement.description}\n\n难度：${this.getDifficultyName(achievement.difficulty)}\n${achievement.unlocked ? '解锁时间：' + new Date(achievement.unlockedDate).toLocaleDateString() : '继续努力解锁吧！'}`);
    }

    getDifficultyName(difficulty) {
        const names = {
            bronze: '🥉 青铜',
            silver: '🥈 白银',
            gold: '🥇 黄金',
            platinum: '💎 白金'
        };
        return names[difficulty] || difficulty;
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-amber-900 to-orange-900 rounded-xl p-6 border border-amber-500/30">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-2xl font-bold text-amber-400">🏆 成就系统</h3>
                    <div class="text-sm text-amber-300">
                        已解锁：${this.achievements.filter(a => a.unlocked).length}/${this.achievements.length}
                    </div>
                </div>
                
                <div id="achievement-list" class="space-y-6">
                    ${this.renderAchievements()}
                </div>
            </div>
        `;
        
        this.renderAchievements();
    }
}

// ==================== 自习倒计时系统 ====================
class StudyTimer {
    constructor() {
        this.timer = null;
        this.isRunning = false;
        this.startTime = null;
        this.elapsedTime = 0;
        this.sessionHistory = [];
        
        this.loadHistory();
    }

    loadHistory() {
        const saved = localStorage.getItem('studySessions');
        if (saved) {
            this.sessionHistory = JSON.parse(saved);
        }
    }

    saveHistory() {
        localStorage.setItem('studySessions', JSON.stringify(this.sessionHistory));
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        
        this.timer = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
        }, 1000);
        
        // 禁用开始按钮，启用暂停按钮
        this.updateControls();
    }

    pause() {
        if (!this.isRunning) return;
        
        clearInterval(this.timer);
        this.isRunning = false;
        
        this.updateControls();
    }

    resume() {
        if (!this.startTime || this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        
        this.timer = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            this.updateDisplay();
        }, 1000);
        
        this.updateControls();
    }

    end() {
        this.pause();
        
        if (this.elapsedTime > 60000) { // 至少 1 分钟才记录
            const session = {
                date: new Date().toISOString(),
                duration: this.elapsedTime
            };
            
            this.sessionHistory.push(session);
            this.saveHistory();
            
            // 更新总学习时间
            const totalTime = this.getTotalStudyTime() + Math.floor(this.elapsedTime / 60000);
            localStorage.setItem('studyTime', totalTime.toString());
            
            // 检查成就
            achievementSystem.checkAchievement('learning');
            
            // 发放奖励
            const minutes = Math.floor(this.elapsedTime / 60000);
            const exp = Math.floor(minutes / 2);
            const gold = Math.floor(minutes / 5);
            
            if (exp > 0) {
                updateExp(exp);
                updateGold(gold);
            }
        }
        
        this.elapsedTime = 0;
        this.startTime = null;
        this.updateDisplay();
        this.updateControls();
    }

    updateDisplay() {
        const display = document.getElementById('study-timer-display');
        if (!display) return;
        
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        display.textContent = [
            hours.toString().padStart(2, '0'),
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].join(':');
    }

    updateControls() {
        const startBtn = document.getElementById('study-start-btn');
        const pauseBtn = document.getElementById('study-pause-btn');
        const resumeBtn = document.getElementById('study-resume-btn');
        const endBtn = document.getElementById('study-end-btn');
        
        if (startBtn) startBtn.disabled = this.isRunning;
        if (pauseBtn) pauseBtn.disabled = !this.isRunning;
        if (resumeBtn) resumeBtn.disabled = !(!this.isRunning && this.elapsedTime > 0);
        if (endBtn) endBtn.disabled = this.elapsedTime === 0;
    }

    renderHistory() {
        const container = document.getElementById('study-history');
        if (!container) return;
        
        const today = new Date();
        const weekHistory = this.sessionHistory.filter(session => {
            const sessionDate = new Date(session.date);
            const diffDays = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
            return diffDays < 7;
        });
        
        const byDay = {};
        weekHistory.forEach(session => {
            const date = new Date(session.date).toLocaleDateString();
            if (!byDay[date]) byDay[date] = 0;
            byDay[date] += session.duration;
        });
        
        container.innerHTML = `
            <div class="grid grid-cols-7 gap-2">
                ${['日', '一', '二', '三', '四', '五', '六'].map(d => `
                    <div class="text-center text-xs text-slate-400">${d}</div>
                `).join('')}
            </div>
            <div class="grid grid-cols-7 gap-2 mt-2">
                ${Array(7).fill(0).map((_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - i));
                    const dateStr = date.toLocaleDateString();
                    const duration = byDay[dateStr] || 0;
                    const minutes = Math.floor(duration / 60000);
                    const height = Math.min(100, (minutes / 120) * 100); // 最多显示 2 小时
                    
                    return `
                        <div class="flex flex-col items-center">
                            <div class="w-full bg-slate-700 rounded-t" style="height: ${Math.max(10, height)}px"></div>
                            <div class="text-xs text-slate-400 mt-1">${minutes}min</div>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="text-center text-xs text-slate-400 mt-2">最近 7 天学习时长</div>
        `;
    }

    getTotalStudyTime() {
        const saved = localStorage.getItem('studyTime');
        return saved ? parseInt(saved) : 0;
    }

    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div class="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-xl p-6 border border-emerald-500/30">
                <div class="text-center mb-4">
                    <h3 class="text-2xl font-bold text-emerald-400">📖 自习倒计时</h3>
                    <p class="text-sm text-emerald-300 mt-1">专注学习，记录每一分钟</p>
                </div>
                
                <div class="text-center mb-6">
                    <div id="study-timer-display" class="text-6xl font-mono font-bold text-emerald-300 bg-slate-800/50 rounded-lg p-6 inline-block border border-emerald-500/30">
                        00:00:00
                    </div>
                </div>
                
                <div class="grid grid-cols-4 gap-3 mb-6">
                    <button id="study-start-btn" onclick="studyTimer.start()" 
                            class="py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        ▶️ 开始
                    </button>
                    <button id="study-pause-btn" onclick="studyTimer.pause()" 
                            class="py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-yellow-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        ⏸️ 暂停
                    </button>
                    <button id="study-resume-btn" onclick="studyTimer.resume()" 
                            class="py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        ▶️ 继续
                    </button>
                    <button id="study-end-btn" onclick="studyTimer.end()" 
                            class="py-3 bg-gradient-to-r from-red-500 to-rose-600 rounded-lg font-bold text-white hover:shadow-lg hover:shadow-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        ⏹️ 结束
                    </button>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="bg-slate-800/50 rounded-lg p-4 text-center">
                        <div class="text-2xl font-bold text-emerald-400">${this.getTotalStudyTime()}</div>
                        <div class="text-xs text-slate-400 mt-1">累计学习（分钟）</div>
                    </div>
                    <div class="bg-slate-800/50 rounded-lg p-4 text-center">
                        <div class="text-2xl font-bold text-cyan-400">${this.sessionHistory.length}</div>
                        <div class="text-xs text-slate-400 mt-1">学习次数</div>
                    </div>
                </div>
                
                <div id="study-history" class="bg-slate-800/30 rounded-lg p-4">
                    ${this.renderHistory()}
                </div>
                
                <div class="mt-4 p-3 bg-slate-800/50 rounded-lg">
                    <div class="text-xs text-slate-400">💡 提示：学习时长可转换为经验值和金币奖励！</div>
                </div>
            </div>
        `;
        
        this.updateControls();
        this.renderHistory();
    }
}

// 导出单例
const dailyTaskSystem = new DailyTaskSystem();
const achievementSystem = new AchievementSystem();
const studyTimer = new StudyTimer();

export { dailyTaskSystem, achievementSystem, studyTimer };
