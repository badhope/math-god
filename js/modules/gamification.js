/**
 * 游戏化系统模块
 * 包含：每日任务、签到系统、排行榜、成就系统增强
 */

import { getUserState, saveState } from './state.js';

// 每日任务配置
const dailyTasks = [
    {
        id: 'daily_quiz_1',
        name: '初出茅庐',
        desc: '完成 1 次境界挑战',
        type: 'quiz',
        target: 1,
        reward: 50,
        icon: '⚔️'
    },
    {
        id: 'daily_quiz_3',
        name: '连战连捷',
        desc: '完成 3 次境界挑战',
        type: 'quiz',
        target: 3,
        reward: 150,
        icon: '🔥'
    },
    {
        id: 'daily_game_1',
        name: '寓教于乐',
        desc: '玩 1 次小游戏',
        type: 'game',
        target: 1,
        reward: 30,
        icon: '🎮'
    },
    {
        id: 'daily_perfect',
        name: '完美表现',
        desc: '连续答对 3 题',
        type: 'streak',
        target: 3,
        reward: 200,
        icon: '✨'
    },
    {
        id: 'daily_explore',
        name: '探索者',
        desc: '浏览 3 个境界详情',
        type: 'explore',
        target: 3,
        reward: 40,
        icon: '📚'
    }
];

// 签到奖励配置
const checkInRewards = [
    { day: 1, exp: 50, item: '修为丹', icon: '🔮' },
    { day: 2, exp: 80, item: '智慧果', icon: '🍎' },
    { day: 3, exp: 120, item: '悟道茶', icon: '🍵' },
    { day: 4, exp: 150, item: '灵晶', icon: '💎' },
    { day: 5, exp: 200, item: '仙露', icon: '💧' },
    { day: 6, exp: 250, item: '神石', icon: '🪨' },
    { day: 7, exp: 500, item: '渡劫丹', icon: '🌟' }
];

// 排行榜数据（模拟）
const leaderboardData = [
    { rank: 1, name: '数学仙人', level: 50, exp: 5000, avatar: '🧙‍♂️' },
    { rank: 2, name: '微积分大师', level: 45, exp: 4500, avatar: '👨‍🏫' },
    { rank: 3, name: '几何剑仙', level: 42, exp: 4200, avatar: '⚔️' },
    { rank: 4, name: '代数尊者', level: 38, exp: 3800, avatar: '🔮' },
    { rank: 5, name: '数论散修', level: 35, exp: 3500, avatar: '🎋' },
    { rank: 6, name: '拓扑长老', level: 32, exp: 3200, avatar: '📐' },
    { rank: 7, name: '概率真君', level: 30, exp: 3000, avatar: '🎲' },
    { rank: 8, name: '逻辑元君', level: 28, exp: 2800, avatar: '📊' },
    { rank: 9, name: '统计仙子', level: 25, exp: 2500, avatar: '🧚‍♀️' },
    { rank: 10, name: '算术童子', level: 20, exp: 2000, avatar: '👦' }
];

class GamificationManager {
    constructor() {
        this.state = {
            checkInStreak: 0,
            lastCheckIn: null,
            completedTasks: [],
            taskProgress: {},
            exploredRealms: [],
            totalPlayTime: 0,
            sessionStart: Date.now()
        };
        this._timerId = null;
        this._saveIntervalId = null;
        this.loadProgress();
        this.startTimer();
        this._bindCleanupEvents();
    }

    loadProgress() {
        const saved = localStorage.getItem('math_gamification_v1');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                this.state = { ...this.state, ...parsed };
            } catch (e) {
                console.error('加载游戏化进度失败', e);
            }
        }
        
        this.resetDailyTasksIfNeeded();
    }

    saveProgress() {
        localStorage.setItem('math_gamification_v1', JSON.stringify(this.state));
    }

    startTimer() {
        if (this._timerId) return;
        
        this._timerId = setInterval(() => {
            this.state.totalPlayTime++;
            if (Date.now() - this.state.sessionStart > 3600000) {
                this.state.sessionStart = Date.now();
            }
        }, 1000);
        
        this._saveIntervalId = setInterval(() => {
            this.saveProgress();
        }, 30000);
    }

    stopTimer() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this._timerId = null;
        }
        if (this._saveIntervalId) {
            clearInterval(this._saveIntervalId);
            this._saveIntervalId = null;
        }
        this.saveProgress();
    }

    _bindCleanupEvents() {
        window.addEventListener('beforeunload', () => {
            this.stopTimer();
        });
        
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveProgress();
            }
        });
    }

    destroy() {
        this.stopTimer();
        this.state = {
            checkInStreak: 0,
            lastCheckIn: null,
            completedTasks: [],
            taskProgress: {},
            exploredRealms: [],
            totalPlayTime: 0,
            sessionStart: Date.now()
        };
    }

    resetDailyTasksIfNeeded() {
        const today = new Date().toDateString();
        if (this.state.lastTaskReset !== today) {
            this.state.completedTasks = [];
            this.state.taskProgress = {};
            this.state.lastTaskReset = today;
            this.saveProgress();
        }
    }

    // 签到系统
    checkIn() {
        const today = new Date().toDateString();
        if (this.state.lastCheckIn === today) {
            return { success: false, message: '今日已签到' };
        }

        this.state.checkInStreak = (this.state.checkInStreak % 7) + 1;
        this.state.lastCheckIn = today;
        
        const reward = checkInRewards[this.state.checkInStreak - 1];
        
        // 连续签到 7 天额外奖励
        let bonusExp = 0;
        if (this.state.checkInStreak === 7) {
            bonusExp = 200;
        }

        this.saveProgress();
        
        return {
            success: true,
            streak: this.state.checkInStreak,
            reward: reward,
            bonusExp: bonusExp,
            message: `签到成功！获得${reward.item}，修为 +${reward.exp}${bonusExp > 0 ? `，额外奖励 +${bonusExp}` : ''}`
        };
    }

    // 任务进度更新
    updateTaskProgress(type, count = 1) {
        const key = `${type}`;
        if (!this.state.taskProgress[key]) {
            this.state.taskProgress[key] = 0;
        }
        this.state.taskProgress[key] += count;
        this.saveProgress();

        // 检查是否完成任务
        const completed = [];
        dailyTasks.forEach(task => {
            if (task.type === type && 
                !this.state.completedTasks.includes(task.id) &&
                this.state.taskProgress[key] >= task.target) {
                this.state.completedTasks.push(task.id);
                completed.push(task);
            }
        });

        return completed;
    }

    // 获取今日任务状态
    getDailyTasks() {
        return dailyTasks.map(task => {
            const progress = this.state.taskProgress[task.type] || 0;
            const completed = this.state.completedTasks.includes(task.id);
            return {
                ...task,
                progress: Math.min(progress, task.target),
                completed: completed,
                progressPercent: (progress / task.target) * 100
            };
        });
    }

    // 获取签到状态
    getCheckInStatus() {
        const today = new Date().toDateString();
        const isCheckedIn = this.state.lastCheckIn === today;
        return {
            streak: this.state.checkInStreak,
            isCheckedIn: isCheckedIn,
            rewards: checkInRewards,
            nextReward: checkInRewards[this.state.checkInStreak % 7]
        };
    }

    // 获取排行榜
    getLeaderboard() {
        const userState = getUserState();
        const userRank = leaderboardData.findIndex(p => p.exp <= userState.exp) + 1;
        
        return {
            top: leaderboardData,
            userRank: userRank > 0 ? userRank : 11,
            userExp: userState.exp,
            userLevel: userState.level
        };
    }

    // 记录探索
    recordExploration(realmId) {
        if (!this.state.exploredRealms.includes(realmId)) {
            this.state.exploredRealms.push(realmId);
            this.saveProgress();
            
            // 探索奖励
            if (this.state.exploredRealms.length === 3) {
                const completedTasks = this.updateTaskProgress('explore', 3);
                return { isNew: true, completedTasks };
            }
            return { isNew: true, completedTasks: [] };
        }
        return { isNew: false, completedTasks: [] };
    }

    // 获取统计数据
    getStats() {
        return {
            totalPlayTime: this.state.totalPlayTime,
            exploredRealmsCount: this.state.exploredRealms.length,
            checkInStreak: this.state.checkInStreak,
            completedTasksToday: this.state.completedTasks.length,
            totalTasksToday: dailyTasks.length
        };
    }
}

const gamificationManager = new GamificationManager();

export { 
    GamificationManager, 
    gamificationManager, 
    dailyTasks, 
    checkInRewards, 
    leaderboardData 
};
