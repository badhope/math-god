/**
 * 用户状态管理模块
 * 负责用户数据的存储、加载、更新
 */

const STORAGE_KEY = 'math_cultivation_v3';

const defaultUserState = {
    exp: 0,
    level: 1,
    unlockedLevels: [1],
    correctCount: 0,
    gamesPlayed: 0,
    achievements: [],
    challengeHistory: [],
    totalPlayTime: 0,
    lastLogin: null
};

let userState = { ...defaultUserState };

function initUserState() {
    loadState();
    if (!userState.lastLogin) {
        userState.lastLogin = new Date().toISOString();
        saveState();
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            userState = { ...defaultUserState, ...parsed };
        } else {
            userState = { ...defaultUserState };
        }
    } catch (error) {
        console.error('加载用户状态失败:', error);
        userState = { ...defaultUserState };
    }
}

function saveState() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userState));
    } catch (error) {
        console.error('保存用户状态失败:', error);
    }
}

function getUserState() {
    return { ...userState };
}

function updateExp(amount) {
    userState.exp += amount;
    const newLevel = 1 + Math.floor(userState.exp / 100);
    
    if (newLevel > userState.level) {
        const levelUpSound = {
            message: `恭喜突破！修为提升到第${newLevel}层！`,
            level: newLevel
        };
        userState.level = newLevel;
        return { levelUp: true, ...levelUpSound };
    }
    
    return { levelUp: false, exp: userState.exp };
}

function addCorrectCount() {
    userState.correctCount++;
    saveState();
}

function addGamePlayed() {
    userState.gamesPlayed++;
    saveState();
}

function unlockLevel(levelId) {
    if (!userState.unlockedLevels.includes(levelId)) {
        userState.unlockedLevels.push(levelId);
        userState.unlockedLevels.sort((a, b) => a - b);
        saveState();
        return true;
    }
    return false;
}

function isLevelUnlocked(levelId) {
    return userState.unlockedLevels.includes(levelId);
}

function addAchievement(achievement) {
    if (!userState.achievements.includes(achievement.id)) {
        userState.achievements.push(achievement.id);
        saveState();
        return {
            isNew: true,
            achievement
        };
    }
    return {
        isNew: false,
        achievement
    };
}

function getAchievements() {
    return userState.achievements;
}

function addChallengeRecord(levelId, correct) {
    userState.challengeHistory.push({
        levelId,
        correct,
        timestamp: new Date().toISOString()
    });
    
    if (correct) {
        userState.correctCount++;
    }
    
    saveState();
}

function getStats() {
    const totalChallenges = userState.challengeHistory.length;
    const correctChallenges = userState.challengeHistory.filter(h => h.correct).length;
    const accuracy = totalChallenges > 0 ? (correctChallenges / totalChallenges * 100).toFixed(1) : 0;
    
    return {
        exp: userState.exp,
        level: userState.level,
        correctCount: userState.correctCount,
        gamesPlayed: userState.gamesPlayed,
        unlockedLevelsCount: userState.unlockedLevels.length,
        achievementsCount: userState.achievements.length,
        totalChallenges,
        correctChallenges,
        accuracy
    };
}

function getNextLevelExp() {
    return userState.level * 100;
}

function getExpProgress() {
    const currentLevelExp = (userState.level - 1) * 100;
    const nextLevelExp = userState.level * 100;
    const progress = ((userState.exp - currentLevelExp) / 100) * 100;
    return {
        current: userState.exp - currentLevelExp,
        next: nextLevelExp,
        percentage: Math.min(progress, 100)
    };
}

function resetProgress() {
    if (confirm('确定要重置所有进度吗？此操作不可恢复！')) {
        userState = { ...defaultUserState };
        saveState();
        return true;
    }
    return false;
}

export {
    initUserState,
    loadState,
    saveState,
    getUserState,
    updateExp,
    addCorrectCount,
    addGamePlayed,
    unlockLevel,
    isLevelUnlocked,
    addAchievement,
    getAchievements,
    addChallengeRecord,
    getStats,
    getNextLevelExp,
    getExpProgress,
    resetProgress
};
