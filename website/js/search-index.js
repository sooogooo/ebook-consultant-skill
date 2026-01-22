// 搜索索引数据
const searchIndex = [
    {
        title: "第1章：医美咨询师的角色定位与价值",
        url: "chapters/ch01-role-and-position.html",
        keywords: ["角色定位", "专业价值", "咨询师", "客户信任", "职业发展"],
        description: "了解医美咨询师的真正价值，掌握五大核心能力"
    },
    {
        title: "第2章：医美行业生态与客户心理分析",
        url: "chapters/ch02-industry-ecosystem.html",
        keywords: ["行业生态", "客户心理", "消费动机", "决策分析", "客户类型"],
        description: "深入理解行业生态和客户心理，提升咨询效果"
    },
    {
        title: "第3章：专业形象塑造与沟通基础",
        url: "chapters/ch03-professional-image.html",
        keywords: ["专业形象", "沟通技巧", "倾听艺术", "共情沟通", "形象管理"],
        description: "打造专业形象，掌握有效沟通的核心技巧"
    },
    {
        title: "第4章：客户需求挖掘的七大技巧",
        url: "chapters/ch04-demand-discovery.html",
        keywords: ["需求挖掘", "SPIN法则", "提问技巧", "需求分析", "客户洞察"],
        description: "系统学习需求挖掘技巧，精准把握客户真实需求"
    },
    {
        title: "第5章：专业咨询话术与异议处理",
        url: "chapters/ch05-consultation-script.html",
        keywords: ["话术模板", "异议处理", "FABE法则", "开场话术", "成交话术"],
        description: "掌握专业话术和异议处理技巧，提升成交率"
    },
    {
        title: "第6章：价值呈现与方案设计",
        url: "chapters/ch06-value-proposition.html",
        keywords: ["价值呈现", "方案设计", "个性化方案", "价值塑造", "组合套餐"],
        description: "学会价值呈现和方案设计，让客户看到项目价值"
    },
    {
        title: "第7章：成交临门一脚的关键动作",
        url: "chapters/ch07-closing-techniques.html",
        keywords: ["成交技巧", "成交信号", "临门一脚", "促成交易", "决策引导"],
        description: "识别成交信号，把握时机促成最终成交"
    },
    {
        title: "第8章：不同类型客户的差异化成交策略",
        url: "chapters/ch08-customer-segmentation.html",
        keywords: ["客户分类", "差异化策略", "高端客户", "理性客户", "感性客户"],
        description: "针对不同类型客户采用差异化成交策略"
    },
    {
        title: "第9章：高客单价项目的成交心法",
        url: "chapters/ch09-high-value-sales.html",
        keywords: ["高客单价", "大单成交", "高端客户", "信任建立", "价值传递"],
        description: "掌握高客单价项目成交技巧，实现业绩突破"
    },
    {
        title: "第10章：客户转介绍与复购的运营技巧",
        url: "chapters/ch10-referral-retention.html",
        keywords: ["转介绍", "复购运营", "客户维护", "会员体系", "口碑营销"],
        description: "建立客户忠诚度，提升转介绍和复购率"
    },
    {
        title: "第11章：咨询流程标准化与话术模板",
        url: "chapters/ch11-process-standardization.html",
        keywords: ["流程标准化", "话术模板", "服务流程", "标准化管理", "服务体系"],
        description: "建立标准化咨询流程，提升服务效率和质量"
    },
    {
        title: "第12章：成交数据分析与业绩提升",
        url: "chapters/ch12-data-analysis.html",
        keywords: ["数据分析", "业绩提升", "KPI管理", "数据驱动", "业绩复盘"],
        description: "用数据分析驱动业绩提升，科学管理客户资源"
    },
    {
        title: "第13章：常见问题FAQ与应对策略",
        url: "chapters/ch13-faq-strategies.html",
        keywords: ["常见问题", "FAQ", "专业问答", "咨询话术", "问题应对"],
        description: "掌握常见问题的标准答案，从容应对客户咨询"
    },
    {
        title: "第14章：从咨询师到销冠的成长路径",
        url: "chapters/ch14-career-growth.html",
        keywords: ["职业成长", "销冠之路", "技能提升", "业绩突破", "职业规划"],
        description: "规划职业发展路径，从新手成长为销冠"
    },
    {
        title: "第15章：团队管理与培训技巧",
        url: "chapters/ch15-team-management.html",
        keywords: ["团队管理", "员工培训", "激励机制", "目标管理", "团队建设"],
        description: "学习团队管理和培训技巧，打造高效咨询团队"
    },
    {
        title: "第16章：个人品牌建设与职业规划",
        url: "chapters/ch16-personal-branding.html",
        keywords: ["个人品牌", "职业规划", "IP打造", "行业影响力", "专业形象"],
        description: "打造个人品牌，实现职业发展目标"
    }
];

// 搜索功能
function searchChapters(query) {
    if (!query || query.length < 2) return [];

    query = query.toLowerCase();
    const results = [];

    for (const chapter of searchIndex) {
        let score = 0;

        // 标题匹配（最高权重）
        if (chapter.title.toLowerCase().includes(query)) {
            score += 10;
        }

        // 关键词匹配
        for (const keyword of chapter.keywords) {
            if (keyword.toLowerCase().includes(query)) {
                score += 5;
            }
        }

        // 描述匹配
        if (chapter.description.toLowerCase().includes(query)) {
            score += 2;
        }

        if (score > 0) {
            results.push({
                ...chapter,
                score: score,
                matchedKeywords: chapter.keywords.filter(k => k.toLowerCase().includes(query))
            });
        }
    }

    // 按分数排序
    return results.sort((a, b) => b.score - a.score);
}

// 导出搜索函数
window.searchChapters = searchChapters;
window.searchIndex = searchIndex;
