/**
 * 内容审核与质量管理模块
 * 确保内容的历史准确性与文化价值
 */

class ContentModerationSystem {
    constructor() {
        this.moderationRules = {
            // 历史准确性检查
            historicalAccuracy: {
                enabled: true,
                checkDates: true,
                checkNames: true,
                checkFacts: true
            },
            
            // 内容质量标准
            qualityStandards: {
                minLength: 50,          // 最小字数
                maxLength: 10000,       // 最大字数
                requireSources: true,   // 需要引用来源
                requireImages: false,   // 需要图片
                minReadability: 0.3     // 最小可读性分数
            },
            
            // 敏感内容过滤
            sensitiveContent: {
                enabled: true,
                keywords: [],           // 敏感词库
                checkPolitical: true,
                checkViolence: true
            },
            
            // 文化价值评估
            culturalValue: {
                enabled: true,
                minEducationalValue: 0.5,
                requireHistoricalContext: true
            }
        };
        
        this.contentQueue = [];
        this.approvedContent = [];
        this.rejectedContent = [];
    }

    // 提交内容审核
    submitContent(content) {
        const moderationResult = this.moderateContent(content);
        
        const queueItem = {
            id: Date.now(),
            content,
            submittedAt: new Date().toISOString(),
            status: 'pending',
            moderationResult,
            reviewedBy: null,
            reviewedAt: null
        };
        
        this.contentQueue.push(queueItem);
        return queueItem;
    }

    // 自动审核内容
    moderateContent(content) {
        const issues = [];
        const warnings = [];
        let score = 100;

        // 1. 历史准确性检查
        if (this.moderationRules.historicalAccuracy.enabled) {
            const accuracyCheck = this.checkHistoricalAccuracy(content);
            if (!accuracyCheck.passed) {
                issues.push(...accuracyCheck.issues);
                score -= accuracyCheck.issues.length * 10;
            }
            warnings.push(...accuracyCheck.warnings);
        }

        // 2. 内容质量检查
        if (this.moderationRules.qualityStandards) {
            const qualityCheck = this.checkQualityStandards(content);
            if (!qualityCheck.passed) {
                issues.push(...qualityCheck.issues);
                score -= qualityCheck.issues.length * 5;
            }
            warnings.push(...qualityCheck.warnings);
        }

        // 3. 敏感内容检查
        if (this.moderationRules.sensitiveContent.enabled) {
            const sensitiveCheck = this.checkSensitiveContent(content);
            if (!sensitiveCheck.passed) {
                issues.push(...sensitiveCheck.issues);
                score -= sensitiveCheck.issues.length * 20;
            }
        }

        // 4. 文化价值评估
        if (this.moderationRules.culturalValue.enabled) {
            const valueCheck = this.assessCulturalValue(content);
            if (!valueCheck.passed) {
                issues.push(...valueCheck.issues);
                score -= valueCheck.issues.length * 15;
            }
            warnings.push(...valueCheck.warnings);
        }

        // 计算可读性分数
        const readabilityScore = this.calculateReadability(content);
        if (readabilityScore < this.moderationRules.qualityStandards.minReadability) {
            warnings.push({
                type: 'readability',
                message: `可读性分数较低：${readabilityScore.toFixed(2)}`
            });
            score -= 5;
        }

        return {
            passed: score >= 60 && issues.length === 0,
            score: Math.max(0, score),
            issues,
            warnings,
            readability: readabilityScore,
            timestamp: new Date().toISOString()
        };
    }

    // 检查历史准确性
    checkHistoricalAccuracy(content) {
        const issues = [];
        const warnings = [];

        // 检查日期格式
        if (content.year && !this.isValidYear(content.year)) {
            issues.push({
                type: 'date_format',
                field: 'year',
                message: '年份格式不正确'
            });
        }

        // 检查人名是否匹配
        if (content.people && Array.isArray(content.people)) {
            const knownPeople = ['高斯', '牛顿', '欧拉', '伽罗瓦', '黎曼', '庞加莱', '怀尔斯', '陶哲轩', '朗兰兹'];
            content.people.forEach(person => {
                if (!knownPeople.some(kp => person.includes(kp))) {
                    warnings.push({
                        type: 'unknown_person',
                        message: `未知人物：${person}，请核实`
                    });
                }
            });
        }

        // 检查事实一致性
        if (content.era && content.year) {
            const eraYearMap = {
                '古代': { start: -3000, end: 500 },
                '近代': { start: 500, end: 1900 },
                '现代': { start: 1900, end: 2100 }
            };
            
            const era = eraYearMap[content.era];
            const year = this.parseYear(content.year);
            
            if (era && year && (year < era.start || year > era.end)) {
                issues.push({
                    type: 'era_mismatch',
                    message: `时代（${content.era}）与年份（${content.year}）不匹配`
                });
            }
        }

        return {
            passed: issues.length === 0,
            issues,
            warnings
        };
    }

    // 检查内容质量标准
    checkQualityStandards(content) {
        const issues = [];
        const warnings = [];

        // 检查字数
        const textLength = this.extractText(content).length;
        
        if (textLength < this.moderationRules.qualityStandards.minLength) {
            issues.push({
                type: 'too_short',
                message: `内容过短：${textLength}字（最小${this.moderationRules.qualityStandards.minLength}字）`
            });
        }
        
        if (textLength > this.moderationRules.qualityStandards.maxLength) {
            warnings.push({
                type: 'too_long',
                message: `内容过长：${textLength}字（最大${this.moderationRules.qualityStandards.maxLength}字）`
            });
        }

        // 检查引用来源
        if (this.moderationRules.qualityStandards.requireSources) {
            if (!content.sources || content.sources.length === 0) {
                warnings.push({
                    type: 'missing_sources',
                    message: '缺少引用来源'
                });
            }
        }

        // 检查结构完整性
        const requiredFields = ['title', 'description'];
        requiredFields.forEach(field => {
            if (!content[field]) {
                issues.push({
                    type: 'missing_field',
                    message: `缺少必填字段：${field}`
                });
            }
        });

        return {
            passed: issues.length === 0,
            issues,
            warnings
        };
    }

    // 检查敏感内容
    checkSensitiveContent(content) {
        const issues = [];
        const text = this.extractText(content).toLowerCase();

        // 简单的敏感词检查（示例）
        const sensitivePatterns = [
            // 可以添加更多敏感词模式
        ];

        sensitivePatterns.forEach(pattern => {
            if (text.includes(pattern)) {
                issues.push({
                    type: 'sensitive_content',
                    message: '包含敏感内容'
                });
            }
        });

        return {
            passed: issues.length === 0,
            issues
        };
    }

    // 评估文化价值
    assessCulturalValue(content) {
        const issues = [];
        const warnings = [];

        // 评估教育价值
        const educationalKeywords = ['数学', '科学', '发现', '证明', '理论', '公式', '定理'];
        const text = this.extractText(content);
        const educationalScore = educationalKeywords.filter(k => text.includes(k)).length / educationalKeywords.length;

        if (educationalScore < this.moderationRules.culturalValue.minEducationalValue) {
            warnings.push({
                type: 'low_educational_value',
                message: `教育价值较低：${(educationalScore * 100).toFixed(0)}%`
            });
        }

        // 检查历史背景
        if (this.moderationRules.culturalValue.requireHistoricalContext) {
            if (!content.era && !content.year && !content.location) {
                warnings.push({
                    type: 'missing_historical_context',
                    message: '缺少历史背景信息'
                });
            }
        }

        return {
            passed: issues.length === 0,
            issues,
            warnings,
            educationalScore
        };
    }

    // 计算可读性分数（简化版 Flesch 可读性公式）
    calculateReadability(content) {
        const text = this.extractText(content);
        
        if (!text || text.length === 0) return 0;

        // 计算句子数（简化：按句号、问号、感叹号分割）
        const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0).length;
        
        // 计算单词数（中文按字符数估算）
        const words = text.length;
        
        // 计算音节数（中文每个字算一个音节）
        const syllables = text.length;

        if (sentences === 0) return 0;

        // Flesch Reading Ease (简化版)
        const score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
        
        return Math.max(0, Math.min(100, score / 100)); // 归一化到 0-1
    }

    // 辅助函数
    isValidYear(yearStr) {
        return /^(\d+ 年 | 公元前\d+ 年)$/.test(yearStr) || /^\d{4}$/.test(yearStr);
    }

    parseYear(yearStr) {
        if (!yearStr) return null;
        if (yearStr.includes('公元前')) {
            return -parseInt(yearStr.replace(/[^\d]/g, ''));
        }
        return parseInt(yearStr.replace(/[^\d]/g, ''));
    }

    extractText(content) {
        if (typeof content === 'string') return content;
        
        let text = '';
        if (content.title) text += content.title + ' ';
        if (content.description) text += content.description + ' ';
        if (content.biography) text += content.biography + ' ';
        if (content.impact) text += content.impact + ' ';
        
        return text;
    }

    // 审核内容（人工审核接口）
    reviewContent(itemId, approved, reviewerId, notes = '') {
        const item = this.contentQueue.find(i => i.id === itemId);
        if (!item) return null;

        item.status = approved ? 'approved' : 'rejected';
        item.reviewedBy = reviewerId;
        item.reviewedAt = new Date().toISOString();
        item.notes = notes;

        if (approved) {
            this.approvedContent.push(item);
        } else {
            this.rejectedContent.push(item);
        }

        this.contentQueue = this.contentQueue.filter(i => i.id !== itemId);
        
        return item;
    }

    // 获取待审核内容
    getPendingContent() {
        return this.contentQueue;
    }

    // 获取已审核内容
    getApprovedContent() {
        return this.approvedContent;
    }

    // 获取被拒绝内容
    getRejectedContent() {
        return this.rejectedContent;
    }

    // 获取审核统计
    getModerationStats() {
        return {
            pending: this.contentQueue.length,
            approved: this.approvedContent.length,
            rejected: this.rejectedContent.length,
            approvalRate: this.approvedContent.length / (this.approvedContent.length + this.rejectedContent.length) || 0
        };
    }
}

const contentModerationSystem = new ContentModerationSystem();

export { ContentModerationSystem, contentModerationSystem };
