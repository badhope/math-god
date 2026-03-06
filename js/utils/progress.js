/**
 * 数学修仙传 - 进度追踪系统
 * 提供学习进度、成就进度、任务进度的可视化和追踪功能
 */

import { storage } from './helpers.js';
import { eventBus, SystemEvents } from './event-bus.js';

/**
 * 进度追踪器
 */
export class ProgressTracker {
    constructor() {
        this.trackingData = {
            studySessions: [],
            quizHistory: [],
            taskCompletions: [],
            achievementProgress: {}
        };
        this.loadProgress();
        this.setupEventListeners();
    }

    /**
     * 加载进度数据
     */
    loadProgress() {
        const saved = storage.get('progress_tracking');
        if (saved) {
            this.trackingData = { ...this.trackingData, ...saved };
        }
    }

    /**
     * 保存进度数据
     */
    saveProgress() {
        storage.set('progress_tracking', this.trackingData);
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        eventBus.on(SystemEvents.STUDY_COMPLETE, (data) => this.recordStudySession(data));
        eventBus.on(SystemEvents.QUIZ_COMPLETE, (data) => this.recordQuiz(data));
        eventBus.on(SystemEvents.TASK_COMPLETE, (data) => this.recordTaskCompletion(data));
        eventBus.on(SystemEvents.ACHIEVEMENT_UNLOCK, (data) => this.recordAchievement(data));
    }

    /**
     * 记录学习会话
     */
    recordStudySession(data) {
        const session = {
            date: new Date().toISOString(),
            duration: data.duration,
            topic: data.topic,
            exp: data.exp || 0
        };
        this.trackingData.studySessions.push(session);
        
        // 只保留最近 100 条记录
        if (this.trackingData.studySessions.length > 100) {
            this.trackingData.studySessions.shift();
        }
        
        this.saveProgress();
        eventBus.emit(SystemEvents.DATA_UPDATE, { type: 'study_session', data: session });
    }

    /**
     * 记录答题历史
     */
    recordQuiz(data) {
        const quiz = {
            date: new Date().toISOString(),
            level: data.level,
            correct: data.correct,
            total: data.total,
            accuracy: data.accuracy,
            exp: data.exp || 0
        };
        this.trackingData.quizHistory.push(quiz);
        
        if (this.trackingData.quizHistory.length > 200) {
            this.trackingData.quizHistory.shift();
        }
        
        this.saveProgress();
        eventBus.emit(SystemEvents.DATA_UPDATE, { type: 'quiz_history', data: quiz });
    }

    /**
     * 记录任务完成
     */
    recordTaskCompletion(data) {
        const completion = {
            date: new Date().toISOString(),
            taskId: data.taskId,
            taskName: data.taskName,
            reward: data.reward
        };
        this.trackingData.taskCompletions.push(completion);
        
        if (this.trackingData.taskCompletions.length > 100) {
            this.trackingData.taskCompletions.shift();
        }
        
        this.saveProgress();
    }

    /**
     * 记录成就解锁
     */
    recordAchievement(data) {
        this.trackingData.achievementProgress[data.achievementId] = {
            unlocked: true,
            date: new Date().toISOString()
        };
        this.saveProgress();
    }

    /**
     * 获取统计数据
     */
    getStatistics() {
        const now = new Date();
        const today = now.toDateString();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

        // 今日学习时长
        const todayStudyTime = this.trackingData.studySessions
            .filter(s => new Date(s.date).toDateString() === today)
            .reduce((sum, s) => sum + s.duration, 0);

        // 本周学习时长
        const weekStudyTime = this.trackingData.studySessions
            .filter(s => new Date(s.date) >= weekAgo)
            .reduce((sum, s) => sum + s.duration, 0);

        // 总学习时长
        const totalStudyTime = this.trackingData.studySessions
            .reduce((sum, s) => sum + s.duration, 0);

        // 答题统计
        const totalQuizzes = this.trackingData.quizHistory.length;
        const totalQuestions = this.trackingData.quizHistory.reduce((sum, q) => sum + q.total, 0);
        const totalCorrect = this.trackingData.quizHistory.reduce((sum, q) => sum + q.correct, 0);
        const overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions * 100) : 0;

        // 任务完成统计
        const tasksCompleted = this.trackingData.taskCompletions.length;

        // 成就解锁统计
        const achievementsUnlocked = Object.values(this.trackingData.achievementProgress)
            .filter(a => a.unlocked).length;

        return {
            todayStudyTime,
            weekStudyTime,
            totalStudyTime,
            totalQuizzes,
            totalQuestions,
            totalCorrect,
            overallAccuracy: overallAccuracy.toFixed(1),
            tasksCompleted,
            achievementsUnlocked,
            studySessionCount: this.trackingData.studySessions.length
        };
    }

    /**
     * 获取学习趋势 (最近 7 天)
     */
    getStudyTrend() {
        const trend = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toDateString();
            
            const sessions = this.trackingData.studySessions.filter(
                s => new Date(s.date).toDateString() === dateStr
            );
            
            const duration = sessions.reduce((sum, s) => sum + s.duration, 0);
            
            trend.push({
                date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
                duration,
                sessions: sessions.length
            });
        }

        return trend;
    }

    /**
     * 获取答题准确率趋势
     */
    getAccuracyTrend() {
        const trend = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today - i * 24 * 60 * 60 * 1000);
            const dateStr = date.toDateString();
            
            const quizzes = this.trackingData.quizHistory.filter(
                q => new Date(q.date).toDateString() === dateStr
            );
            
            const totalQuestions = quizzes.reduce((sum, q) => sum + q.total, 0);
            const correctQuestions = quizzes.reduce((sum, q) => sum + q.correct, 0);
            const accuracy = totalQuestions > 0 ? (correctQuestions / totalQuestions * 100) : 0;
            
            trend.push({
                date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
                accuracy: accuracy.toFixed(1),
                quizCount: quizzes.length
            });
        }

        return trend;
    }

    /**
     * 获取成就进度
     */
    getAchievementProgress(achievements) {
        return achievements.map(achievement => {
            const progress = this.trackingData.achievementProgress[achievement.id];
            return {
                ...achievement,
                unlocked: progress?.unlocked || false,
                unlockedDate: progress?.date || null
            };
        });
    }

    /**
     * 清空进度数据
     */
    clearProgress() {
        this.trackingData = {
            studySessions: [],
            quizHistory: [],
            taskCompletions: [],
            achievementProgress: {}
        };
        this.saveProgress();
    }
}

/**
 * 学习时长追踪器
 */
export class StudyTimeTracker {
    constructor() {
        this.startTime = null;
        this.elapsedTime = 0;
        this.timer = null;
        this.isRunning = false;
        this.currentTopic = null;
    }

    /**
     * 开始追踪
     */
    start(topic = '自由学习') {
        if (this.isRunning) return;
        
        this.startTime = Date.now() - this.elapsedTime;
        this.currentTopic = topic;
        this.isRunning = true;
        
        this.timer = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            eventBus.emit(SystemEvents.STUDY_TIME_UPDATE, {
                elapsedTime: this.elapsedTime,
                topic: this.currentTopic
            });
        }, 1000);

        eventBus.emit(SystemEvents.STUDY_START, { topic });
    }

    /**
     * 暂停追踪
     */
    pause() {
        if (!this.isRunning) return;
        
        clearInterval(this.timer);
        this.isRunning = false;
        eventBus.emit(SystemEvents.STUDY_PAUSE, { elapsedTime: this.elapsedTime });
    }

    /**
     * 继续追踪
     */
    resume() {
        if (!this.elapsedTime || this.isRunning) return;
        
        this.startTime = Date.now() - this.elapsedTime;
        this.isRunning = true;
        
        this.timer = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            eventBus.emit(SystemEvents.STUDY_TIME_UPDATE, {
                elapsedTime: this.elapsedTime,
                topic: this.currentTopic
            });
        }, 1000);

        eventBus.emit(SystemEvents.STUDY_START, { topic: this.currentTopic });
    }

    /**
     * 结束追踪
     */
    end() {
        if (!this.isRunning) return this.elapsedTime;
        
        clearInterval(this.timer);
        this.isRunning = false;
        
        const finalTime = this.elapsedTime;
        
        eventBus.emit(SystemEvents.STUDY_COMPLETE, {
            duration: finalTime,
            topic: this.currentTopic,
            exp: Math.floor(finalTime / 60000) // 每分钟 1 点经验
        });

        // 重置
        this.elapsedTime = 0;
        this.currentTopic = null;
        
        return finalTime;
    }

    /**
     * 获取当前时长 (毫秒)
     */
    getElapsedTime() {
        if (this.isRunning) {
            return Date.now() - this.startTime;
        }
        return this.elapsedTime;
    }

    /**
     * 格式化当前时长
     */
    getFormattedTime() {
        const totalSeconds = Math.floor(this.getElapsedTime() / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return {
            hours,
            minutes,
            seconds,
            formatted: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        };
    }
}

/**
 * 目标设定与追踪
 */
export class GoalTracker {
    constructor() {
        this.goals = [];
        this.loadGoals();
    }

    /**
     * 加载目标
     */
    loadGoals() {
        const saved = storage.get('user_goals');
        if (saved) {
            this.goals = saved;
        }
    }

    /**
     * 保存目标
     */
    saveGoals() {
        storage.set('user_goals', this.goals);
    }

    /**
     * 创建目标
     */
    createGoal(goal) {
        const newGoal = {
            id: 'goal_' + Date.now(),
            title: goal.title,
            description: goal.description || '',
            type: goal.type, // 'study_time', 'quiz_count', 'accuracy', 'task_completion'
            target: goal.target,
            unit: goal.unit, // 'minutes', 'count', 'percent'
            deadline: goal.deadline || null,
            progress: 0,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.goals.push(newGoal);
        this.saveGoals();
        return newGoal;
    }

    /**
     * 更新目标进度
     */
    updateProgress(goalId, value) {
        const goal = this.goals.find(g => g.id === goalId);
        if (!goal || goal.completed) return;

        goal.progress = value;
        
        // 检查是否完成
        if (goal.progress >= goal.target) {
            goal.completed = true;
            goal.completedAt = new Date().toISOString();
            eventBus.emit(SystemEvents.NOTIFICATION, {
                title: '🎯 目标达成！',
                message: `恭喜你完成了目标：${goal.title}`,
                type: 'success'
            });
        }
        
        this.saveGoals();
    }

    /**
     * 获取所有目标
     */
    getGoals() {
        return this.goals;
    }

    /**
     * 获取进行中的目标
     */
    getActiveGoals() {
        return this.goals.filter(g => !g.completed);
    }

    /**
     * 获取已完成的目标
     */
    getCompletedGoals() {
        return this.goals.filter(g => g.completed);
    }

    /**
     * 删除目标
     */
    deleteGoal(goalId) {
        this.goals = this.goals.filter(g => g.id !== goalId);
        this.saveGoals();
    }

    /**
     * 获取目标完成率
     */
    getCompletionRate() {
        if (this.goals.length === 0) return 0;
        const completed = this.goals.filter(g => g.completed).length;
        return (completed / this.goals.length * 100).toFixed(1);
    }
}

// 创建全局实例
export const progressTracker = new ProgressTracker();
export const studyTimeTracker = new StudyTimeTracker();
export const goalTracker = new GoalTracker();

console.log('✅ 进度追踪系统已初始化');
