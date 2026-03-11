/**
 * 学习分析模块
 * 提供学习数据分析、进度追踪、个性化推荐、学习报告等功能
 */

import { getUserState, getStats } from '../modules/state.js';
import { mathData, quizBank } from '../data.js';
import { smartCache } from './performance-optimizer.js';

class LearningAnalyzer {
    constructor() {
        this.analysisData = {
            studySessions: [],
            questionHistory: [],
            weakAreas: [],
            strongAreas: [],
            recommendations: [],
            dailyProgress: new Map()
        };
        this.loadAnalysisData();
    }

    loadAnalysisData() {
        try {
            const saved = localStorage.getItem('math_learning_analysis');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.analysisData = {
                    ...parsed,
                    dailyProgress: new Map(parsed.dailyProgress || [])
                };
            }
        } catch (e) {
            console.warn('Failed to load analysis data:', e);
        }
    }

    saveAnalysisData() {
        try {
            const toSave = {
                ...this.analysisData,
                dailyProgress: Array.from(this.analysisData.dailyProgress.entries())
            };
            localStorage.setItem('math_learning_analysis', JSON.stringify(toSave));
        } catch (e) {
            console.warn('Failed to save analysis data:', e);
        }
    }

    recordStudySession(session) {
        const record = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            duration: session.duration || 0,
            levelId: session.levelId,
            questionsAnswered: session.questionsAnswered || 0,
            correctAnswers: session.correctAnswers || 0,
            topics: session.topics || []
        };
        
        this.analysisData.studySessions.push(record);
        this._updateDailyProgress(record);
        this._analyzeWeakAreas();
        this.saveAnalysisData();
        
        return record;
    }

    recordQuestionResult(questionData) {
        const record = {
            questionId: questionData.questionId,
            levelId: questionData.levelId,
            isCorrect: questionData.isCorrect,
            timeSpent: questionData.timeSpent || 0,
            timestamp: new Date().toISOString()
        };
        
        this.analysisData.questionHistory.push(record);
        
        if (this.analysisData.questionHistory.length > 1000) {
            this.analysisData.questionHistory = this.analysisData.questionHistory.slice(-500);
        }
        
        this.saveAnalysisData();
        return record;
    }

    _updateDailyProgress(session) {
        const today = new Date().toISOString().split('T')[0];
        const current = this.analysisData.dailyProgress.get(today) || {
            totalQuestions: 0,
            correctAnswers: 0,
            studyTime: 0,
            levels: new Set()
        };
        
        current.totalQuestions += session.questionsAnswered;
        current.correctAnswers += session.correctAnswers;
        current.studyTime += session.duration;
        if (session.levelId) {
            current.levels.add(session.levelId);
        }
        
        this.analysisData.dailyProgress.set(today, current);
        
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const cutoff = thirtyDaysAgo.toISOString().split('T')[0];
        
        for (const [date] of this.analysisData.dailyProgress) {
            if (date < cutoff) {
                this.analysisData.dailyProgress.delete(date);
            }
        }
    }

    _analyzeWeakAreas() {
        const levelStats = new Map();
        
        this.analysisData.questionHistory.forEach(record => {
            if (!levelStats.has(record.levelId)) {
                levelStats.set(record.levelId, { total: 0, correct: 0 });
            }
            const stats = levelStats.get(record.levelId);
            stats.total++;
            if (record.isCorrect) stats.correct++;
        });
        
        this.analysisData.weakAreas = [];
        this.analysisData.strongAreas = [];
        
        levelStats.forEach((stats, levelId) => {
            const accuracy = stats.total > 0 ? stats.correct / stats.total : 0;
            const realm = mathData.find(r => r.id === levelId);
            
            if (realm) {
                const areaData = {
                    levelId,
                    name: realm.name,
                    accuracy: accuracy * 100,
                    totalQuestions: stats.total
                };
                
                if (accuracy < 0.6 && stats.total >= 5) {
                    this.analysisData.weakAreas.push(areaData);
                } else if (accuracy >= 0.8 && stats.total >= 5) {
                    this.analysisData.strongAreas.push(areaData);
                }
            }
        });
        
        this.analysisData.weakAreas.sort((a, b) => a.accuracy - b.accuracy);
        this.analysisData.strongAreas.sort((a, b) => b.accuracy - a.accuracy);
    }

    getAccuracyByLevel() {
        const levelStats = new Map();
        
        this.analysisData.questionHistory.forEach(record => {
            if (!levelStats.has(record.levelId)) {
                levelStats.set(record.levelId, { total: 0, correct: 0, avgTime: 0, timeCount: 0 });
            }
            const stats = levelStats.get(record.levelId);
            stats.total++;
            if (record.isCorrect) stats.correct++;
            if (record.timeSpent > 0) {
                stats.avgTime = (stats.avgTime * stats.timeCount + record.timeSpent) / (stats.timeCount + 1);
                stats.timeCount++;
            }
        });
        
        const result = [];
        levelStats.forEach((stats, levelId) => {
            const realm = mathData.find(r => r.id === levelId);
            if (realm) {
                result.push({
                    levelId,
                    name: realm.name,
                    color: realm.color,
                    accuracy: stats.total > 0 ? (stats.correct / stats.total * 100).toFixed(1) : 0,
                    totalQuestions: stats.total,
                    correctQuestions: stats.correct,
                    avgTime: stats.avgTime.toFixed(1)
                });
            }
        });
        
        return result.sort((a, b) => a.levelId - b.levelId);
    }

    getStudyTrend(days = 7) {
        const trend = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const progress = this.analysisData.dailyProgress.get(dateStr) || {
                totalQuestions: 0,
                correctAnswers: 0,
                studyTime: 0
            };
            
            trend.push({
                date: dateStr,
                dayName: date.toLocaleDateString('zh-CN', { weekday: 'short' }),
                questions: progress.totalQuestions,
                correct: progress.correctAnswers,
                accuracy: progress.totalQuestions > 0 
                    ? (progress.correctAnswers / progress.totalQuestions * 100).toFixed(1) 
                    : 0,
                studyTime: progress.studyTime
            });
        }
        
        return trend;
    }

    getRecommendations() {
        const recommendations = [];
        const userState = getUserState();
        const stats = getStats();
        
        if (this.analysisData.weakAreas.length > 0) {
            const weakest = this.analysisData.weakAreas[0];
            recommendations.push({
                type: 'weak_area',
                priority: 'high',
                title: `加强${weakest.name}练习`,
                description: `您在${weakest.name}的准确率为${weakest.accuracy.toFixed(1)}%，建议重点复习`,
                action: `startQuiz(${weakest.levelId})`,
                icon: '🎯'
            });
        }
        
        const unlockedLevels = userState.unlockedLevels || [];
        const nextLevel = unlockedLevels.length + 1;
        if (nextLevel <= 10) {
            const nextRealm = mathData.find(r => r.id === nextLevel);
            if (nextRealm) {
                const expNeeded = nextLevel * 100 - userState.exp;
                recommendations.push({
                    type: 'progress',
                    priority: 'medium',
                    title: `解锁${nextRealm.name}`,
                    description: `还需${expNeeded}修为即可解锁新境界`,
                    action: null,
                    icon: '🔓'
                });
            }
        }
        
        const today = new Date().toISOString().split('T')[0];
        const todayProgress = this.analysisData.dailyProgress.get(today);
        if (!todayProgress || todayProgress.totalQuestions < 10) {
            recommendations.push({
                type: 'daily',
                priority: 'medium',
                title: '完成今日学习目标',
                description: '建议每天完成至少10道题目',
                action: null,
                icon: '📅'
            });
        }
        
        if (stats.totalChallenges > 0 && stats.accuracy > 80) {
            const currentLevel = userState.level;
            const currentRealm = mathData.find(r => r.id === Math.min(currentLevel, 10));
            if (currentRealm && currentRealm.difficulty < 5) {
                recommendations.push({
                    type: 'challenge',
                    priority: 'low',
                    title: '尝试更高难度',
                    description: '您的表现优秀，可以挑战更高级别的题目',
                    action: null,
                    icon: '🚀'
                });
            }
        }
        
        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }

    getLearningReport() {
        const stats = getStats();
        const trend = this.getStudyTrend(7);
        const accuracyByLevel = this.getAccuracyByLevel();
        
        const totalStudyTime = this.analysisData.studySessions.reduce((sum, s) => sum + s.duration, 0);
        const avgDailyQuestions = trend.reduce((sum, d) => sum + d.questions, 0) / 7;
        const avgAccuracy = trend.reduce((sum, d) => sum + parseFloat(d.accuracy || 0), 0) / 7;
        
        return {
            summary: {
                totalStudyTime,
                totalQuestions: stats.totalChallenges,
                overallAccuracy: stats.accuracy,
                currentLevel: stats.level,
                achievementsCount: stats.achievementsCount
            },
            weekly: {
                avgDailyQuestions: avgDailyQuestions.toFixed(1),
                avgAccuracy: avgAccuracy.toFixed(1),
                trend: trend
            },
            areas: {
                weak: this.analysisData.weakAreas.slice(0, 3),
                strong: this.analysisData.strongAreas.slice(0, 3),
                byLevel: accuracyByLevel
            },
            recommendations: this.getRecommendations()
        };
    }

    predictNextMilestone() {
        const userState = getUserState();
        const currentExp = userState.exp;
        const currentLevel = userState.level;
        
        const recentSessions = this.analysisData.studySessions.slice(-10);
        const avgExpPerSession = recentSessions.length > 0
            ? recentSessions.reduce((sum, s) => sum + (s.correctAnswers * s.levelId * 10), 0) / recentSessions.length
            : 50;
        
        const nextLevelExp = currentLevel * 100;
        const expNeeded = nextLevelExp - currentExp;
        const estimatedSessions = Math.ceil(expNeeded / avgExpPerSession);
        
        return {
            currentLevel,
            currentExp,
            nextLevelExp,
            expNeeded,
            estimatedSessions,
            avgExpPerSession: avgExpPerSession.toFixed(0)
        };
    }

    clearHistory() {
        this.analysisData = {
            studySessions: [],
            questionHistory: [],
            weakAreas: [],
            strongAreas: [],
            recommendations: [],
            dailyProgress: new Map()
        };
        this.saveAnalysisData();
    }
}

class AdaptiveDifficultyManager {
    constructor() {
        this.difficultyAdjustments = new Map();
        this.userPerformance = {
            recentAccuracy: [],
            streakCount: 0,
            lastAdjustment: null
        };
    }

    calculateOptimalDifficulty(levelId) {
        const history = this.userPerformance.recentAccuracy;
        if (history.length < 5) return levelId;
        
        const recentAvg = history.slice(-5).reduce((a, b) => a + b, 0) / 5;
        
        let adjustment = 0;
        if (recentAvg > 0.85 && this.userPerformance.streakCount >= 3) {
            adjustment = 1;
        } else if (recentAvg < 0.5) {
            adjustment = -1;
        }
        
        return Math.max(1, Math.min(10, levelId + adjustment));
    }

    recordPerformance(isCorrect) {
        this.userPerformance.recentAccuracy.push(isCorrect ? 1 : 0);
        
        if (this.userPerformance.recentAccuracy.length > 20) {
            this.userPerformance.recentAccuracy = this.userPerformance.recentAccuracy.slice(-20);
        }
        
        if (isCorrect) {
            this.userPerformance.streakCount++;
        } else {
            this.userPerformance.streakCount = 0;
        }
    }

    getDifficultyInsights() {
        const history = this.userPerformance.recentAccuracy;
        const avg = history.length > 0 
            ? history.reduce((a, b) => a + b, 0) / history.length 
            : 0;
        
        return {
            recentAccuracy: (avg * 100).toFixed(1),
            currentStreak: this.userPerformance.streakCount,
            recommendation: this._getRecommendation(avg)
        };
    }

    _getRecommendation(accuracy) {
        if (accuracy > 0.9) return '表现卓越！可以尝试更高难度的挑战';
        if (accuracy > 0.7) return '表现良好！继续保持';
        if (accuracy > 0.5) return '需要更多练习，建议复习基础知识';
        return '建议从基础题目开始，循序渐进';
    }
}

class SpacedRepetitionScheduler {
    constructor() {
        this.schedule = new Map();
        this.intervals = [1, 3, 7, 14, 30];
    }

    scheduleReview(questionId, isCorrect) {
        const current = this.schedule.get(questionId) || { level: 0, nextReview: null };
        
        if (isCorrect) {
            current.level = Math.min(current.level + 1, this.intervals.length - 1);
        } else {
            current.level = Math.max(0, current.level - 1);
        }
        
        const daysUntilReview = this.intervals[current.level];
        const nextReview = new Date();
        nextReview.setDate(nextReview.getDate() + daysUntilReview);
        
        current.nextReview = nextReview.toISOString();
        this.schedule.set(questionId, current);
        
        this._saveSchedule();
        return current;
    }

    getDueReviews() {
        const now = new Date();
        const due = [];
        
        this.schedule.forEach((data, questionId) => {
            if (data.nextReview && new Date(data.nextReview) <= now) {
                due.push(questionId);
            }
        });
        
        return due;
    }

    _saveSchedule() {
        try {
            const data = Array.from(this.schedule.entries());
            localStorage.setItem('math_spaced_repetition', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save spaced repetition schedule:', e);
        }
    }

    _loadSchedule() {
        try {
            const saved = localStorage.getItem('math_spaced_repetition');
            if (saved) {
                this.schedule = new Map(JSON.parse(saved));
            }
        } catch (e) {
            console.warn('Failed to load spaced repetition schedule:', e);
        }
    }
}

const learningAnalyzer = new LearningAnalyzer();
const adaptiveDifficulty = new AdaptiveDifficultyManager();
const spacedRepetition = new SpacedRepetitionScheduler();

spacedRepetition._loadSchedule();

export {
    LearningAnalyzer,
    AdaptiveDifficultyManager,
    SpacedRepetitionScheduler,
    learningAnalyzer,
    adaptiveDifficulty,
    spacedRepetition
};
