/**
 * 智能内容推荐系统
 * 基于用户行为数据提供个性化推荐
 */

import { hallOfFameManager, historicalEventsManager } from './hall-of-fame.js';
import { getUserState } from './state.js';

class ContentRecommender {
    constructor() {
        this.userBehavior = {
            views: [],      // 浏览记录 {type, id, timestamp, duration}
            interactions: [], // 交互记录 {type, id, action, timestamp}
            searches: [],    // 搜索记录 {query, timestamp, results}
            preferences: {   // 偏好设置
                categories: {},
                eras: {},
                difficulties: {}
            }
        };
        
        this.loadBehavior();
        this.startTracking();
    }

    loadBehavior() {
        const saved = localStorage.getItem('math_recommender_v1');
        if (saved) {
            try {
                this.userBehavior = { ...this.userBehavior, ...JSON.parse(saved) };
            } catch (e) {
                console.error('加载用户行为失败', e);
            }
        }
    }

    saveBehavior() {
        localStorage.setItem('math_recommender_v1', JSON.stringify(this.userBehavior));
    }

    startTracking() {
        // 清理过期数据（保留 30 天）
        setInterval(() => {
            const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
            this.userBehavior.views = this.userBehavior.views.filter(v => v.timestamp > thirtyDaysAgo);
            this.userBehavior.interactions = this.userBehavior.interactions.filter(i => i.timestamp > thirtyDaysAgo);
            this.userBehavior.searches = this.userBehavior.searches.filter(s => s.timestamp > thirtyDaysAgo);
            this.saveBehavior();
        }, 60 * 60 * 1000); // 每小时清理一次
    }

    // 记录浏览
    recordView(type, id, duration = 0) {
        this.userBehavior.views.push({
            type,
            id,
            timestamp: Date.now(),
            duration
        });
        this.updatePreferences(type, id);
        this.saveBehavior();
    }

    // 记录交互（点赞、收藏、分享等）
    recordInteraction(type, id, action) {
        this.userBehavior.interactions.push({
            type,
            id,
            action,
            timestamp: Date.now()
        });
        
        // 根据交互类型更新偏好
        const weight = action === 'like' ? 2 : action === 'favorite' ? 3 : 1;
        this.updatePreferences(type, id, weight);
        this.saveBehavior();
    }

    // 记录搜索
    recordSearch(query, results) {
        this.userBehavior.searches.push({
            query,
            results: results.length,
            timestamp: Date.now()
        });
        this.saveBehavior();
    }

    // 更新用户偏好
    updatePreferences(type, id, weight = 1) {
        if (type === 'person') {
            const person = hallOfFameManager.getPerson(id);
            if (person) {
                // 类别偏好
                this.userBehavior.preferences.categories[person.category] = 
                    (this.userBehavior.preferences.categories[person.category] || 0) + weight;
                
                // 难度偏好
                this.userBehavior.preferences.difficulties[person.difficulty] = 
                    (this.userBehavior.preferences.difficulties[person.difficulty] || 0) + weight;
            }
        } else if (type === 'event') {
            const event = historicalEventsManager.getAllEvents().find(e => e.id === id);
            if (event) {
                // 时代偏好
                this.userBehavior.preferences.eras[event.era] = 
                    (this.userBehavior.preferences.eras[event.era] || 0) + weight;
                
                // 类别偏好
                this.userBehavior.preferences.categories[event.category] = 
                    (this.userBehavior.preferences.categories[event.category] || 0) + weight;
            }
        }
    }

    // 计算内容得分
    calculateScore(content, contentType) {
        let score = 0;
        
        // 1. 基于浏览历史
        const viewedIds = this.userBehavior.views
            .filter(v => v.type === contentType)
            .map(v => v.id);
        
        if (content.relatedPeople && content.relatedPeople.some(id => viewedIds.includes(id))) {
            score += 3;
        }

        // 2. 基于交互历史
        const likedIds = this.userBehavior.interactions
            .filter(i => i.type === contentType && i.action === 'like')
            .map(i => i.id);
        
        if (content.relatedPeople && content.relatedPeople.some(id => likedIds.includes(id))) {
            score += 5;
        }

        // 3. 基于类别偏好
        const categoryScore = this.userBehavior.preferences.categories[content.category] || 0;
        score += categoryScore * 0.5;

        // 4. 基于难度匹配（根据用户等级）
        const userState = getUserState();
        const userLevel = userState.level;
        const difficultyMatch = Math.abs(content.difficulty - userLevel) <= 1;
        if (difficultyMatch) {
            score += 2;
        }

        // 5. 基于热度
        if (content.views) {
            score += Math.log10(content.views) * 0.5;
        }

        // 6. 基于重要性
        if (content.importance) {
            score += content.importance;
        }

        // 7. 去重：已浏览过的适当降权
        if (viewedIds.includes(content.id)) {
            score *= 0.7;
        }

        return score;
    }

    // 获取个性化推荐
    getPersonalizedRecommendations(contentType = 'all', limit = 10) {
        let recommendations = [];

        if (contentType === 'person' || contentType === 'all') {
            const people = hallOfFameManager.getAllPeople().map(person => ({
                ...person,
                contentType: 'person',
                score: this.calculateScore(person, 'person')
            }));
            recommendations.push(...people);
        }

        if (contentType === 'event' || contentType === 'all') {
            const events = historicalEventsManager.getAllEvents().map(event => ({
                ...event,
                contentType: 'event',
                score: this.calculateScore(event, 'event')
            }));
            recommendations.push(...events);
        }

        // 按得分排序
        recommendations.sort((a, b) => b.score - a.score);

        // 去重并限制数量
        const seen = new Set();
        return recommendations.filter(r => {
            if (seen.has(r.id)) return false;
            seen.add(r.id);
            return true;
        }).slice(0, limit);
    }

    // 基于协同过滤的推荐（简化版）
    getCollaborativeRecommendations(limit = 5) {
        // 找到与当前用户行为相似的用户（模拟）
        // 实际应用中需要服务器端支持
        
        // 这里使用热门内容作为替代
        const popularPeople = hallOfFameManager.getPopular(5);
        const popularEvents = historicalEventsManager.getAllEvents()
            .sort((a, b) => b.importance - a.importance)
            .slice(0, 5);

        return [
            ...popularPeople.map(p => ({ ...p, contentType: 'person' })),
            ...popularEvents.map(e => ({ ...e, contentType: 'event' }))
        ].slice(0, limit);
    }

    // 获取"你可能感兴趣"
    getYouMayLike(userId, limit = 5) {
        // 基于用户等级推荐合适难度的内容
        const userState = getUserState();
        const userLevel = userState.level;

        const people = hallOfFameManager.getAllPeople()
            .filter(p => Math.abs(p.difficulty - userLevel) <= 1)
            .sort((a, b) => b.likes - a.likes)
            .slice(0, limit);

        return people.map(p => ({ ...p, contentType: 'person' }));
    }

    // 获取搜索建议
    getSearchSuggestions(query) {
        const lower = query.toLowerCase();
        const suggestions = [];

        // 人名建议
        hallOfFameManager.getAllPeople().forEach(p => {
            if (p.name.toLowerCase().includes(lower)) {
                suggestions.push({
                    type: 'person',
                    text: p.name,
                    subtitle: p.title
                });
            }
        });

        // 事件建议
        historicalEventsManager.getAllEvents().forEach(e => {
            if (e.title.toLowerCase().includes(lower)) {
                suggestions.push({
                    type: 'event',
                    text: e.title,
                    subtitle: e.year
                });
            }
        });

        return suggestions.slice(0, 5);
    }

    // 获取用户画像
    getUserProfile() {
        const topCategories = Object.entries(this.userBehavior.preferences.categories)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([cat, score]) => ({ category: cat, score }));

        const topEras = Object.entries(this.userBehavior.preferences.eras)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([era, score]) => ({ era, score }));

        const totalViews = this.userBehavior.views.length;
        const totalInteractions = this.userBehavior.interactions.length;

        return {
            totalViews,
            totalInteractions,
            topCategories,
            topEras,
            searchCount: this.userBehavior.searches.length
        };
    }

    // 清空用户数据
    clearUserData() {
        this.userBehavior = {
            views: [],
            interactions: [],
            searches: [],
            preferences: {
                categories: {},
                eras: {},
                difficulties: {}
            }
        };
        this.saveBehavior();
    }
}

const contentRecommender = new ContentRecommender();

export { ContentRecommender, contentRecommender };
