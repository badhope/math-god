/**
 * 数学修仙传 - 全局配置常量
 * 集中管理所有魔法数字和配置项
 */

export const GAME_CONFIG = {
    VERSION: 'v10.3',
    
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
        QUESTIONS_PER_ROUND: 5,
        EXP_MULTIPLIER: 10,
        STREAK_THRESHOLD: 5,
        STREAK_BONUS: 2
    },
    
    GAME: {
        TOWER_DEFENSE: {
            INITIAL_GOLD: 200,
            INITIAL_LIVES: 10,
            BASE_ENEMY_COUNT: 3,
            TOWER_COST: 50,
            ENEMY_SPAWN_INTERVAL: 2000
        },
        FORMULA_BATTLE: {
            INITIAL_HP: 100,
            BASE_HEAL: 20,
            HEAL_VARIANCE: 10,
            ENEMY_DAMAGE_BASE: 15,
            ENEMY_DAMAGE_VARIANCE: 15,
            MAX_FORMULAS: 5
        },
        QUIZ_COMPETITION: {
            BASE_SCORE: 10,
            TIME_BONUS_MULTIPLIER: 1
        },
        SEQUENCE_GAME: {
            BASE_EXP: 20,
            BONUS_MULTIPLIER: 2
        },
        CALCULATION_GAME: {
            BASE_EXP: 15,
            BONUS_EXP: 10
        },
        PUZZLE_GAME: {
            BASE_EXP: 10
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
        ACHIEVEMENT_DISPLAY_DURATION: 3000,
        PARTICLE_LIFE_DECAY: 0.02,
        MOUSE_TRAIL_DISTANCE: 20,
        ANIMATION_DURATION: {
            FAST: 300,
            NORMAL: 500,
            SLOW: 800
        }
    },
    
    STORAGE: {
        USER_STATE_KEY: 'math_cultivation_v3',
        GAMIFICATION_KEY: 'math_gamification_v1',
        AUTO_SAVE_INTERVAL: 30000,
        LEARNING_ANALYSIS_KEY: 'math_learning_analysis'
    },
    
    TIMING: {
        SESSION_RESET_INTERVAL: 3600000,
        DEBOUNCE_DELAY: 300,
        THROTTLE_LIMIT: 300,
        ONE_HOUR_MS: 3600000,
        ONE_DAY_MS: 86400000,
        ONE_MONTH_MS: 2592000000
    },
    
    RECOMMENDER: {
        TRACKING_INTERVAL: 60000,
        RECENT_ACTIVITY_DAYS: 30,
        RECENT_SESSION_HOURS: 1,
        MAX_SUGGESTIONS: 10,
        MIN_QUERY_LENGTH: 1,
        MAX_QUERY_LENGTH: 100
    },
    
    UI: {
        MODAL_Z_INDEX: 1000,
        TOAST_DURATION: 3000,
        NOTIFICATION_POSITION: 'top-right'
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
