/**
 * 数学修仙传 - 全局配置常量
 * 集中管理所有魔法数字和配置项
 */

export const GAME_CONFIG = {
    LEVEL: {
        BASE_EXP: 100,
        MAX_LEVEL: 10,
        EXP_MULTIPLIER: 1
    },
    
    CHECKIN: {
        MAX_STREAK: 7,
        BONUS_EXP: 200,
        REWARDS: [
            { day: 1, exp: 50, item: '修为丹', icon: '🔮' },
            { day: 2, exp: 80, item: '智慧果', icon: '🍎' },
            { day: 3, exp: 120, item: '悟道茶', icon: '🍵' },
            { day: 4, exp: 150, item: '灵晶', icon: '💎' },
            { day: 5, exp: 200, item: '仙露', icon: '💧' },
            { day: 6, exp: 250, item: '神石', icon: '🪨' },
            { day: 7, exp: 500, item: '渡劫丹', icon: '🌟' }
        ]
    },
    
    QUIZ: {
        BASE_EXP_PER_LEVEL: 10,
        STREAK_BONUS_MAX: 5,
        STREAK_BONUS_PER_CORRECT: 2,
        TIMER_DURATION: 30,
        QUESTIONS_PER_ROUND: 5
    },
    
    GAME: {
        TOWER_DEFENSE: {
            INITIAL_GOLD: 200,
            INITIAL_LIVES: 10,
            BASE_ENEMY_COUNT: 3
        },
        FORMULA_BATTLE: {
            INITIAL_HP: 100,
            BASE_HEAL: 20,
            HEAL_VARIANCE: 10,
            ENEMY_DAMAGE_BASE: 15,
            ENEMY_DAMAGE_VARIANCE: 15
        },
        QUIZ_COMPETITION: {
            BASE_SCORE: 10,
            TIME_BONUS_MULTIPLIER: 1
        }
    },
    
    CANVAS: {
        PARTICLE_COUNT: 60,
        CONNECTION_DISTANCE: 150,
        PARTICLE_MIN_SIZE: 1,
        PARTICLE_MAX_SIZE: 3,
        PARTICLE_SPEED: 0.5
    },
    
    EFFECTS: {
        SPARKLE_COUNT: 8,
        SPARKLE_VELOCITY_MIN: 50,
        SPARKLE_VELOCITY_MAX: 100,
        PARTICLE_FADE_DURATION: 1000,
        LEVEL_UP_DURATION: 2000,
        ACHIEVEMENT_DISPLAY_DURATION: 3000
    },
    
    STORAGE: {
        USER_STATE_KEY: 'math_cultivation_v3',
        GAMIFICATION_KEY: 'math_gamification_v1',
        AUTO_SAVE_INTERVAL: 30000
    },
    
    TIMING: {
        SESSION_RESET_INTERVAL: 3600000,
        DEBOUNCE_DELAY: 300,
        THROTTLE_LIMIT: 300
    }
};

export const STORAGE_KEYS = {
    USER_STATE: 'math_cultivation_v3',
    GAMIFICATION: 'math_gamification_v1'
};

export const ACHIEVEMENTS = [
    { id: 'first_blood', name: '初出茅庐', desc: '首次挑战成功', icon: '🎯' },
    { id: 'scholar', name: '博学之士', desc: '通关 3 个境界', icon: '📚' },
    { id: 'master', name: '数学大师', desc: '通关所有境界', icon: '🏆' },
    { id: 'gamer', name: '游戏达人', desc: '完成 10 场游戏', icon: '🎮' },
    { id: 'perfectionist', name: '完美主义', desc: '连续答对 5 题', icon: '✨' }
];

export default GAME_CONFIG;
