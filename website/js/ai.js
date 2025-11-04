/**
 * AI功能模块
 * 包含AI聊天、建议、历史记录等功能
 */

class AIAssistant {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('sendMessage');
        this.suggestions = document.getElementById('aiSuggestions');
        this.historyList = document.getElementById('historyList');
        this.refreshBtn = document.getElementById('refreshSuggestions');

        this.conversations = [];
        this.currentConversationId = null;
        this.settings = {
            style: localStorage.getItem('aiStyle') || 'standard',
            length: localStorage.getItem('aiLength') || 'concise'
        };

        this.init();
        this.loadHistory();
        this.generateSuggestions();
    }

    init() {
        // 绑定事件
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 监听建议点击
        this.suggestions.addEventListener('click', (e) => {
            const item = e.target.closest('.suggestion-item');
            if (item) {
                const prompt = item.dataset.prompt;
                this.chatInput.value = prompt;
                this.sendMessage();
            }
        });

        // 刷新建议
        this.refreshBtn.addEventListener('click', () => this.generateSuggestions());

        // 绑定历史记录点击
        this.historyList.addEventListener('click', (e) => {
            const item = e.target.closest('.history-item');
            if (item) {
                const conversationId = item.dataset.id;
                this.loadConversation(conversationId);
            }
        });
    }

    // 生成AI建议
    generateSuggestions() {
        const baseSuggestions = [
            {
                icon: 'help',
                text: '如何成为一名优秀的医美咨询师？'
            },
            {
                icon: 'question_answer',
                text: '客户犹豫不决时，该如何处理？'
            },
            {
                icon: 'trending_up',
                text: '医美行业有哪些发展趋势？'
            },
            {
                icon: 'chat',
                text: '如何建立客户信任关系？'
            },
            {
                icon: 'analytics',
                text: '如何提升成交转化率？'
            },
            {
                icon: 'groups',
                text: '不同年龄段客户特点分析'
            },
            {
                icon: 'shield',
                text: '如何处理客户安全疑虑？'
            },
            {
                icon: 'stars',
                text: '高价值客户开发策略'
            },
            {
                icon: 'repeat',
                text: '客户转介绍技巧'
            },
            {
                icon: 'badge',
                text: '个人品牌建设方法'
            }
        ];

        // 随机选择3个建议
        const shuffled = baseSuggestions.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        this.suggestions.innerHTML = selected.map(suggestion => `
            <div class="suggestion-item" data-prompt="${suggestion.text}">
                <span class="material-symbols-outlined">${suggestion.icon}</span>
                <span>${suggestion.text}</span>
            </div>
        `).join('');
    }

    // 发送消息
    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        // 显示用户消息
        this.addMessage('user', message);
        this.chatInput.value = '';

        // 显示加载状态
        const loadingId = this.showLoading();

        try {
            // 获取AI回复
            const response = await this.getAIResponse(message);

            // 移除加载状态
            this.removeLoading(loadingId);

            // 显示AI回复
            this.addMessage('ai', response);

            // 保存对话
            this.saveConversation(message, response);

        } catch (error) {
            this.removeLoading(loadingId);
            this.addMessage('ai', '抱歉，系统暂时无法回复。请稍后重试。');
            console.error('AI Error:', error);
        }
    }

    // 获取AI回复
    async getAIResponse(message) {
        // 模拟AI回复
        await new Promise(resolve => setTimeout(resolve, 1000));

        const responses = {
            '如何成为一名优秀的医美咨询师？': {
                casual: '哈哈，成为优秀的医美咨询师就像打造自己的品牌！🎨 首先，你得是个"全能选手"：专业懂行、情商在线、还能读懂客户小心思～',
                standard: '成为优秀的医美咨询师需要以下几个关键要素：\n\n1. **专业素养**：深入了解医美知识、项目原理和效果\n2. **沟通能力**：倾听客户需求，表达清晰专业\n3. **服务意识**：以客户为中心，提供贴心服务\n4. **持续学习**：跟进行业动态，不断提升自己\n5. **个人品牌**：建立专业形象，积累口碑\n\n建议从基础技能开始，逐步提升综合能力。',
                professional: '医美咨询师的职业发展路径分析：\n\n**核心竞争力构成**\n- 专业维度：医学基础知识、项目理解、风险评估\n- 服务维度：需求分析、方案设计、跟踪服务\n- 商业维度：销售技巧、客户管理、业绩达成\n\n**能力模型**\n1. 知识结构：医美+心理学+美学+营销\n2. 技能体系：咨询+设计+成交+维护\n3. 素养要求：专业+诚信+耐心+创新\n\n**发展建议**\n建立系统化学习体系，理论结合实践，重视客户反馈，持续优化服务流程。'
            },
            '客户犹豫不决时，该如何处理？': {
                casual: '客户犹豫就像在十字路口纠结！🚦 这时候别着急，给TA一点时间，同时用小技巧引导～',
                standard: '处理客户犹豫的策略：\n\n**理解阶段**\n- 认同客户顾虑："我理解您的担心..."\n- 了解真实原因：价格？效果？安全？\n- 分析决策类型：理性型vs感性型\n\n**引导阶段**\n- 提供案例证明：相似客户的成功经验\n- 强调核心价值：最符合需求的方案\n- 创造决策机会：限时优惠、专家会诊\n\n**跟进阶段**\n- 保持适度联系，不施压\n- 提供有价值的信息\n- 等待合适时机再次沟通',
                professional: '客户犹豫决策分析框架：\n\n**决策心理模型**\n- 风险感知 vs 收益期待\n- 现状维持 vs 改变意愿\n- 理性评估 vs 情感驱动\n\n**干预策略**\n1. 认知层面：补充信息，消除误区\n2. 情感层面：建立信任，增强信心\n3. 行为层面：降低门槛，提供保障\n\n**效果评估指标**\n- 决策周期缩短率\n- 最终成交转化率\n- 客户满意度评价'
            }
        };

        const key = Object.keys(responses).find(k => message.includes(k.split('：')[0]));
        if (key && responses[key]) {
            return responses[key][this.settings.style] || responses[key][this.settings.length] || responses[key].standard;
        }

        // 默认回复
        const defaultResponses = {
            casual: '这是个很好的问题呢！💡 让我来帮你分析一下...',
            standard: '关于您的问题，我的建议是：\n\n基于医美咨询的最佳实践，建议从客户需求出发，结合专业判断...',
            professional: '从专业角度分析，该问题涉及多个维度的考量...'
        };

        return defaultResponses[this.settings.style] || defaultResponses.standard;
    }

    // 添加消息到聊天界面
    addMessage(sender, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';

        // 处理Markdown格式
        contentDiv.innerHTML = this.formatMarkdown(content);

        bubble.appendChild(contentDiv);
        messageDiv.appendChild(bubble);
        this.chatMessages.appendChild(messageDiv);

        // 滚动到底部
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;

        // 添加选词AI功能
        this.addWordSelectionAI(contentDiv);
    }

    // Markdown格式化
    formatMarkdown(text) {
        return text
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/\n/g, '<br>');
    }

    // 添加选词AI功能
    addWordSelectionAI(element) {
        element.addEventListener('mouseup', () => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();

            if (selectedText.length > 2 && selectedText.length < 50) {
                this.showWordAITooltip(selectedText, selection);
            }
        });
    }

    // 显示选词AI工具提示
    showWordAITooltip(text, selection) {
        // 移除之前的工具提示
        this.removeWordSelectionTooltip();

        const tooltip = document.createElement('div');
        tooltip.className = 'word-ai-tooltip';
        tooltip.innerHTML = `
            <button class="tooltip-btn" data-action="explain">
                <span class="material-symbols-outlined">lightbulb</span>
                解释
            </button>
            <button class="tooltip-btn" data-action="expand">
                <span class="material-symbols-outlined">expand</span>
                展开
            </button>
        `;

        document.body.appendChild(tooltip);

        // 定位工具提示
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 40}px`;

        // 绑定事件
        tooltip.addEventListener('click', (e) => {
            const btn = e.target.closest('.tooltip-btn');
            if (btn) {
                const action = btn.dataset.action;
                this.handleWordAIAction(action, text);
                this.removeWordSelectionTooltip();
            }
        });

        // 点击其他地方关闭
        document.addEventListener('click', (e) => {
            if (!tooltip.contains(e.target) && !element.contains(e.target)) {
                this.removeWordSelectionTooltip();
            }
        });
    }

    // 移除工具提示
    removeWordSelectionTooltip() {
        const tooltip = document.querySelector('.word-ai-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // 处理选词AI动作
    handleWordAIAction(action, text) {
        if (action === 'explain') {
            this.addMessage('ai', `关于"${text}"的详细说明：\n\n${text}是医美咨询中的重要概念，涉及多个方面的专业知识。建议深入学习相关理论，并在实践中不断总结经验。`);
        } else if (action === 'expand') {
            this.addMessage('ai', `针对"${text}"的深入分析：\n\n1. **理论基础**：从专业角度解读\n2. **实践应用**：如何在实际工作中运用\n3. **注意事项**：需要特别关注的要点\n4. **案例分析**：真实案例参考\n\n建议结合具体情况进行灵活应用。`);
        }
    }

    // 显示加载状态
    showLoading() {
        const loadingId = Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'chat-message ai loading';
        loadingDiv.id = `loading-${loadingId}`;
        loadingDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-content">
                    <span class="material-symbols-outlined">hourglass_top</span>
                    AI正在思考中...
                </div>
            </div>
        `;
        this.chatMessages.appendChild(loadingDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        return loadingId;
    }

    // 移除加载状态
    removeLoading(loadingId) {
        const loadingDiv = document.getElementById(`loading-${loadingId}`);
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    // 保存对话
    saveConversation(userMessage, aiResponse) {
        const conversationId = Date.now().toString();
        const conversation = {
            id: conversationId,
            timestamp: new Date().toISOString(),
            messages: [
                { sender: 'user', content: userMessage },
                { sender: 'ai', content: aiResponse }
            ]
        };

        this.conversations.unshift(conversation);

        // 只保留最近20条对话
        if (this.conversations.length > 20) {
            this.conversations = this.conversations.slice(0, 20);
        }

        // 保存到本地存储
        localStorage.setItem('aiConversations', JSON.stringify(this.conversations));

        // 更新历史列表
        this.updateHistoryList();
    }

    // 加载历史记录
    loadHistory() {
        const stored = localStorage.getItem('aiConversations');
        if (stored) {
            this.conversations = JSON.parse(stored);
            this.updateHistoryList();
        }
    }

    // 更新历史列表
    updateHistoryList() {
        this.historyList.innerHTML = this.conversations.map(conv => `
            <div class="history-item" data-id="${conv.id}">
                <div class="history-preview">${conv.messages[0]?.content?.substring(0, 30)}...</div>
                <div class="history-time">${new Date(conv.timestamp).toLocaleString()}</div>
            </div>
        `).join('');
    }

    // 加载对话
    loadConversation(conversationId) {
        const conversation = this.conversations.find(c => c.id === conversationId);
        if (conversation) {
            // 清空聊天界面
            this.chatMessages.innerHTML = '';

            // 加载消息
            conversation.messages.forEach(msg => {
                this.addMessage(msg.sender, msg.content);
            });
        }
    }

    // 更新设置
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        localStorage.setItem('aiStyle', this.settings.style);
        localStorage.setItem('aiLength', this.settings.length);
    }
}

// 初始化AI助手
document.addEventListener('DOMContentLoaded', () => {
    window.aiAssistant = new AIAssistant();
});
