/**
 * 内容质量审核与知识图谱模块
 * 包含：
 * 1. 内容质量审核系统（历史准确性、数学严谨性、教育适宜性）
 * 2. 数学知识图谱（概念关联、学习路径、前置知识）
 * 3. 内容推荐引擎（基于知识图谱的智能推荐）
 */

// ==================== 内容质量审核系统 ====================
class ContentQualityAuditor {
    constructor() {
        this.qualityCriteria = {
            historicalAccuracy: {
                weight: 0.3,
                checks: ['年份验证', '人物关系验证', '事件描述验证', '引用来源验证']
            },
            mathematicalRigor: {
                weight: 0.3,
                checks: ['定义准确性', '公式正确性', '证明逻辑性', '符号规范性']
            },
            educationalValue: {
                weight: 0.25,
                checks: ['难度适宜性', '解释清晰度', '示例恰当性', '练习充分性']
            },
            culturalValue: {
                weight: 0.15,
                checks: ['文化尊重', '多样性体现', '价值观正确', '启发性']
            }
        };
        
        this.knowledgeBase = this.initKnowledgeBase();
    }

    initKnowledgeBase() {
        return {
            mathematicians: {
                '高斯': { birth: -1777, death: 1855, country: '德国', achievements: ['数论', '代数', '几何'] },
                '牛顿': { birth: 1643, death: 1727, country: '英国', achievements: ['微积分', '力学'] },
                '欧拉': { birth: 1707, death: 1783, country: '瑞士', achievements: ['分析', '图论'] }
            },
            formulas: {
                '勾股定理': { expression: 'a²+b²=c²', domain: '欧几里得几何', conditions: '直角三角形' },
                '欧拉公式': { expression: 'e^(iπ)+1=0', domain: '复分析', conditions: '复数' },
                '二次方程求根公式': { expression: 'x=(-b±√(b²-4ac))/2a', domain: '代数', conditions: 'a≠0' }
            },
            theorems: {
                '费马大定理': { provedBy: '怀尔斯', provedYear: 1994, statement: 'xⁿ+yⁿ=zⁿ无正整数解 (n>2)' },
                '哥德尔不完备性定理': { provedBy: '哥德尔', provedYear: 1931, domain: '数理逻辑' }
            }
        };
    }

    async auditContent(content) {
        const report = {
            overallScore: 0,
            dimensions: {},
            issues: [],
            warnings: [],
            suggestions: []
        };

        // 1. 历史准确性审核
        const historicalScore = this.checkHistoricalAccuracy(content);
        report.dimensions.historicalAccuracy = historicalScore;

        // 2. 数学严谨性审核
        const rigorScore = this.checkMathematicalRigor(content);
        report.dimensions.mathematicalRigor = rigorScore;

        // 3. 教育适宜性审核
        const educationalScore = this.checkEducationalValue(content);
        report.dimensions.educationalValue = educationalScore;

        // 4. 文化价值审核
        const culturalScore = this.checkCulturalValue(content);
        report.dimensions.culturalValue = culturalScore;

        // 计算总分
        report.overallScore = (
            historicalScore.score * 0.3 +
            rigorScore.score * 0.3 +
            educationalScore.score * 0.25 +
            culturalScore.score * 0.15
        );

        report.passed = report.overallScore >= 70;
        report.level = this.getQualityLevel(report.overallScore);

        return report;
    }

    checkHistoricalAccuracy(content) {
        const result = {
            score: 100,
            checks: [],
            issues: []
        };

        // 检查年份
        const yearMatches = content.match(/\b(\d{4})\b/g);
        if (yearMatches) {
            yearMatches.forEach(year => {
                const yearNum = parseInt(year);
                if (yearNum < -1000 || yearNum > 2100) {
                    result.score -= 10;
                    result.issues.push(`可疑年份：${year}`);
                }
            });
        }

        // 检查人物关系
        const knownMathematicians = Object.keys(this.knowledgeBase.mathematicians);
        knownMathematicians.forEach(name => {
            if (content.includes(name)) {
                const info = this.knowledgeBase.mathematicians[name];
                // 验证生卒年份
                const lifeSpanMatch = content.match(`${name}.*?(\\d{4}).*?(\\d{4})`);
                if (lifeSpanMatch) {
                    const birth = parseInt(lifeSpanMatch[1]);
                    const death = parseInt(lifeSpanMatch[2]);
                    if (Math.abs(birth - info.birth) > 1 || Math.abs(death - info.death) > 1) {
                        result.score -= 15;
                        result.issues.push(`${name} 的生卒年份可能有误`);
                    }
                }
            }
        });

        result.checks = this.qualityCriteria.historicalAccuracy.checks;
        return result;
    }

    checkMathematicalRigor(content) {
        const result = {
            score: 100,
            checks: [],
            issues: []
        };

        // 检查公式格式
        const formulaPatterns = [
            { pattern: /\^(\d+)/g, desc: '指数格式' },
            { pattern: /√\([^)]*\)/g, desc: '根号格式' },
            { pattern: /∫.*?dx/g, desc: '积分格式' }
        ];

        formulaPatterns.forEach(({ pattern, desc }) => {
            const matches = content.match(pattern);
            if (!matches && this.shouldHaveFormula(content, desc)) {
                result.score -= 5;
                result.issues.push(`可能缺少${desc}的公式`);
            }
        });

        // 检查数学符号一致性
        const variables = content.match(/\b([a-z])(?:\s*\+\s*\1)\b/g);
        if (variables) {
            result.checks.push('符号一致性检查：通过');
        }

        result.checks = this.qualityCriteria.mathematicalRigor.checks;
        return result;
    }

    checkEducationalValue(content) {
        const result = {
            score: 100,
            checks: [],
            suggestions: []
        };

        // 检查是否有解释
        if (!content.includes('因为') && !content.includes('所以') && !content.includes('由于')) {
            result.suggestions.push('建议增加因果关系的解释');
        }

        // 检查是否有示例
        if (!content.includes('例如') && !content.includes('比如') && !content.includes('举例')) {
            result.suggestions.push('建议添加具体示例');
        }

        // 检查可读性（简单实现）
        const avgSentenceLength = content.length / (content.match(/[。！？.!?]/g) || ['']).length;
        if (avgSentenceLength > 50) {
            result.suggestions.push('句子过长，建议拆分');
        }

        result.checks = this.qualityCriteria.educationalValue.checks;
        return result;
    }

    checkCulturalValue(content) {
        const result = {
            score: 100,
            checks: [],
            warnings: []
        };

        // 检查不当用词
        const inappropriateWords = ['愚蠢', '笨蛋', '白痴'];
        inappropriateWords.forEach(word => {
            if (content.includes(word)) {
                result.score -= 20;
                result.warnings.push(`包含不当用词："${word}"`);
            }
        });

        // 检查性别平等
        const genderBiasPatterns = ['他 (?!们)', '男人.*?女人'];
        genderBiasPatterns.forEach(pattern => {
            if (new RegExp(pattern).test(content)) {
                result.warnings.push('可能存在性别偏见表述');
            }
        });

        result.checks = this.qualityCriteria.culturalValue.checks;
        return result;
    }

    shouldHaveFormula(content, desc) {
        const formulaKeywords = {
            '指数格式': ['次方', '幂', '平方', '立方'],
            '根号格式': ['平方根', '开方', '根号'],
            '积分格式': ['积分', '面积', '累积']
        };
        
        return formulaKeywords[desc]?.some(keyword => content.includes(keyword));
    }

    getQualityLevel(score) {
        if (score >= 90) return '优秀';
        if (score >= 80) return '良好';
        if (score >= 70) return '合格';
        if (score >= 60) return '待改进';
        return '不合格';
    }
}

// ==================== 数学知识图谱 ====================
class MathKnowledgeGraph {
    constructor() {
        this.nodes = [];
        this.edges = [];
        this.initGraph();
    }

    initGraph() {
        // 初始化知识点节点
        this.nodes = [
            { id: 'arithmetic', name: '算术基础', category: '基础', difficulty: 1 },
            { id: 'algebra', name: '代数基础', category: '基础', difficulty: 2 },
            { id: 'geometry', name: '几何基础', category: '基础', difficulty: 2 },
            { id: 'functions', name: '函数', category: '核心', difficulty: 3 },
            { id: 'calculus', name: '微积分', category: '核心', difficulty: 4 },
            { id: 'linear_algebra', name: '线性代数', category: '核心', difficulty: 4 },
            { id: 'probability', name: '概率论', category: '核心', difficulty: 4 },
            { id: 'abstract_algebra', name: '抽象代数', category: '进阶', difficulty: 6 },
            { id: 'topology', name: '拓扑学', category: '进阶', difficulty: 6 },
            { id: 'number_theory', name: '数论', category: '进阶', difficulty: 6 },
            { id: 'analysis', name: '数学分析', category: '进阶', difficulty: 5 },
            { id: 'langlands', name: '朗兰兹纲领', category: '前沿', difficulty: 9 }
        ];

        // 初始化知识点边（前置关系）
        this.edges = [
            { from: 'arithmetic', to: 'algebra', type: 'prerequisite', strength: 1.0 },
            { from: 'arithmetic', to: 'geometry', type: 'prerequisite', strength: 0.8 },
            { from: 'algebra', to: 'functions', type: 'prerequisite', strength: 0.9 },
            { from: 'geometry', to: 'functions', type: 'related', strength: 0.5 },
            { from: 'algebra', to: 'linear_algebra', type: 'prerequisite', strength: 0.7 },
            { from: 'functions', to: 'calculus', type: 'prerequisite', strength: 1.0 },
            { from: 'arithmetic', to: 'number_theory', type: 'prerequisite', strength: 0.6 },
            { from: 'algebra', to: 'abstract_algebra', type: 'extension', strength: 0.8 },
            { from: 'geometry', to: 'topology', type: 'extension', strength: 0.7 },
            { from: 'calculus', to: 'analysis', type: 'extension', strength: 0.9 },
            { from: 'number_theory', to: 'langlands', type: 'prerequisite', strength: 0.8 },
            { from: 'abstract_algebra', to: 'langlands', type: 'prerequisite', strength: 0.9 }
        ];
    }

    // 获取学习路径
    getLearningPath(startNode, endNode) {
        const graph = this.buildAdjacencyList();
        const visited = new Set();
        const path = [];
        
        const dfs = (current, target) => {
            if (current === target) {
                path.push(current);
                return true;
            }
            
            visited.add(current);
            path.push(current);
            
            const neighbors = graph[current] || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.to)) {
                    if (dfs(neighbor.to, target)) {
                        return true;
                    }
                }
            }
            
            path.pop();
            return false;
        };
        
        dfs(startNode, endNode);
        return path.map(id => this.nodes.find(n => n.id === id));
    }

    // 获取前置知识
    getPrerequisites(nodeId) {
        return this.edges
            .filter(edge => edge.to === nodeId && edge.type === 'prerequisite')
            .map(edge => this.nodes.find(n => n.id === edge.from));
    }

    // 获取后续知识
    getAdvancedTopics(nodeId) {
        return this.edges
            .filter(edge => edge.from === nodeId && (edge.type === 'extension' || edge.type === 'prerequisite'))
            .map(edge => this.nodes.find(n => n.id === edge.to));
    }

    // 获取相关知识
    getRelatedTopics(nodeId, minStrength = 0.5) {
        return this.edges
            .filter(edge => 
                (edge.from === nodeId || edge.to === nodeId) && 
                edge.strength >= minStrength
            )
            .map(edge => ({
                node: this.nodes.find(n => n.id === (edge.from === nodeId ? edge.to : edge.from)),
                strength: edge.strength,
                type: edge.type
            }));
    }

    buildAdjacencyList() {
        const graph = {};
        this.edges.forEach(edge => {
            if (!graph[edge.from]) graph[edge.from] = [];
            graph[edge.from].push(edge);
        });
        return graph;
    }

    // 可视化知识图谱（返回结构化数据）
    visualize() {
        return {
            nodes: this.nodes.map(n => ({
                id: n.id,
                name: n.name,
                category: n.category,
                difficulty: n.difficulty
            })),
            edges: this.edges.map(e => ({
                from: e.from,
                to: e.to,
                type: e.type,
                strength: e.strength
            }))
        };
    }

    // 推荐下一个学习主题
    recommendNext(currentKnowledge) {
        const mastered = new Set(currentKnowledge);
        const candidates = [];

        this.nodes.forEach(node => {
            if (mastered.has(node.id)) return;

            const prereqs = this.getPrerequisites(node.id);
            const allPrereqsMastered = prereqs.every(p => mastered.has(p.id));

            if (allPrereqsMastered) {
                candidates.push({
                    ...node,
                    readiness: prereqs.length / prereqs.filter(p => mastered.has(p.id)).length
                });
            }
        });

        return candidates.sort((a, b) => b.readiness - a.readiness);
    }
}

// ==================== 内容推荐引擎 ====================
class ContentRecommendationEngine {
    constructor(knowledgeGraph) {
        this.knowledgeGraph = knowledgeGraph;
        this.userProfiles = new Map();
    }

    // 记录用户行为
    trackUserBehavior(userId, action, contentId, metadata = {}) {
        if (!this.userProfiles.has(userId)) {
            this.userProfiles.set(userId, {
                viewed: new Set(),
                liked: new Set(),
                completed: new Set(),
                preferences: {},
                knowledgeLevel: {}
            });
        }

        const profile = this.userProfiles.get(userId);
        
        switch (action) {
            case 'view':
                profile.viewed.add(contentId);
                break;
            case 'like':
                profile.liked.add(contentId);
                break;
            case 'complete':
                profile.completed.add(contentId);
                if (metadata.score) {
                    profile.knowledgeLevel[contentId] = metadata.score;
                }
                break;
        }

        this.updatePreferences(profile, contentId, metadata);
    }

    updatePreferences(profile, contentId, metadata) {
        const category = metadata.category || 'general';
        const difficulty = metadata.difficulty || 1;

        if (!profile.preferences[category]) {
            profile.preferences[category] = 0;
        }
        profile.preferences[category]++;

        // 更新知识水平评估
        if (metadata.knowledgePoint) {
            profile.knowledgeLevel[metadata.knowledgePoint] = 
                (profile.knowledgeLevel[metadata.knowledgePoint] || 0) + 1;
        }
    }

    // 个性化推荐
    recommendForUser(userId, count = 5) {
        const profile = this.userProfiles.get(userId);
        if (!profile) {
            return this.getPopularContent(count);
        }

        const recommendations = [];

        // 1. 基于知识图谱的推荐
        const masteredTopics = Array.from(profile.completed);
        masteredTopics.forEach(topic => {
            const advanced = this.knowledgeGraph.getAdvancedTopics(topic);
            advanced.forEach(a => {
                if (!profile.viewed.has(a.id)) {
                    recommendations.push({
                        ...a,
                        reason: `基于您已掌握的${topic}`,
                        score: 0.9
                    });
                }
            });
        });

        // 2. 基于偏好的推荐
        const topCategories = Object.entries(profile.preferences)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        topCategories.forEach(([category, _]) => {
            const relatedContent = this.getRelatedContent(category);
            relatedContent.forEach(content => {
                if (!profile.viewed.has(content.id)) {
                    recommendations.push({
                        ...content,
                        reason: `根据您的兴趣：${category}`,
                        score: 0.8
                    });
                }
            });
        });

        // 3. 基于难度匹配的推荐
        const avgDifficulty = this.calculateAverageDifficulty(profile);
        const suitableContent = this.getContentByDifficulty(avgDifficulty);
        suitableContent.forEach(content => {
            if (!profile.viewed.has(content.id)) {
                recommendations.push({
                    ...content,
                    reason: '适合您的难度',
                    score: 0.7
                });
            }
        });

        // 去重并排序
        const unique = recommendations.reduce((acc, curr) => {
            if (!acc.find(a => a.id === curr.id)) {
                acc.push(curr);
            }
            return acc;
        }, []);

        return unique.sort((a, b) => b.score - a.score).slice(0, count);
    }

    calculateAverageDifficulty(profile) {
        const completedLevels = Array.from(profile.completed)
            .map(id => {
                const node = this.knowledgeGraph.nodes.find(n => n.id === id);
                return node ? node.difficulty : 0;
            })
            .filter(l => l > 0);

        if (completedLevels.length === 0) return 1;
        return completedLevels.reduce((a, b) => a + b, 0) / completedLevels.length;
    }

    getPopularContent(count) {
        // 返回热门内容（简化实现）
        return this.knowledgeGraph.nodes
            .sort((a, b) => b.difficulty - a.difficulty)
            .slice(0, count)
            .map(n => ({ ...n, reason: '热门内容', score: 0.5 }));
    }

    getRelatedContent(category) {
        return this.knowledgeGraph.nodes.filter(n => n.category === category);
    }

    getContentByDifficulty(targetDifficulty, tolerance = 1) {
        return this.knowledgeGraph.nodes.filter(n => 
            Math.abs(n.difficulty - targetDifficulty) <= tolerance
        );
    }
}

// 导出
export { ContentQualityAuditor, MathKnowledgeGraph, ContentRecommendationEngine };
