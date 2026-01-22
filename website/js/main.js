/**
 * 主JavaScript文件
 * 处理所有页面交互功能
 */

class App {
    constructor() {
        this.settingsModal = document.getElementById('settingsModal');
        this.themeSelect = document.getElementById('themeSelect');
        this.fontSizeSelect = document.getElementById('fontSizeSelect');
        this.aiStyleSelect = document.getElementById('aiStyleSelect');
        this.aiLengthSelect = document.getElementById('aiLengthSelect');

        this.init();
        this.loadSettings();
    }

    init() {
        // 绑定设置按钮事件
        document.querySelectorAll('[data-action="settings"]').forEach(btn => {
            btn.addEventListener('click', () => this.openSettings());
        });

        document.getElementById('closeSettings').addEventListener('click', () => {
            this.closeSettings();
        });

        // 点击模态框背景关闭
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });

        // 绑定设置变更事件
        this.themeSelect.addEventListener('change', (e) => this.changeTheme(e.target.value));
        this.fontSizeSelect.addEventListener('change', (e) => this.changeFontSize(e.target.value));
        this.aiStyleSelect.addEventListener('change', (e) => this.changeAIStyle(e.target.value));
        this.aiLengthSelect.addEventListener('change', (e) => this.changeAILength(e.target.value));

        // 绑定导航按钮
        document.querySelectorAll('[data-action="usage"]').forEach(btn => {
            btn.addEventListener('click', () => this.showUsage());
        });

        document.querySelectorAll('[data-action="about"]').forEach(btn => {
            btn.addEventListener('click', () => this.showAbout());
        });

        // 绑定分类折叠事件
        this.initCategoryCollapsible();

        // 键盘快捷键
        this.initKeyboardShortcuts();

        // 页面加载动画
        this.initPageAnimations();
    }

    // 打开设置
    openSettings() {
        this.settingsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 关闭设置
    closeSettings() {
        this.settingsModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 改变主题
    changeTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    // 改变字体大小
    changeFontSize(size) {
        document.body.setAttribute('data-font-size', size);
        localStorage.setItem('fontSize', size);
    }

    // 改变AI风格
    changeAIStyle(style) {
        localStorage.setItem('aiStyle', style);
        if (window.aiAssistant) {
            window.aiAssistant.updateSettings({ style });
        }
    }

    // 改变AI长度
    changeAILength(length) {
        localStorage.setItem('aiLength', length);
        if (window.aiAssistant) {
            window.aiAssistant.updateSettings({ length });
        }
    }

    // 加载设置
    loadSettings() {
        const theme = localStorage.getItem('theme') || 'default';
        const fontSize = localStorage.getItem('fontSize') || 'medium';
        const aiStyle = localStorage.getItem('aiStyle') || 'standard';
        const aiLength = localStorage.getItem('aiLength') || 'concise';

        this.themeSelect.value = theme;
        this.fontSizeSelect.value = fontSize;
        this.aiStyleSelect.value = aiStyle;
        this.aiLengthSelect.value = aiLength;

        this.changeTheme(theme);
        this.changeFontSize(fontSize);
    }

    // 显示使用说明
    showUsage() {
        alert('使用说明：\n\n1. AI智能助手：输入问题获取专业建议\n2. 课程内容：点击章节链接查看详细内容\n3. 设计工具：绘制图形，导出PNG/PDF\n4. 设置：自定义主题、字体、AI风格\n\n快捷键：\n- Ctrl/Cmd + Enter：发送消息\n- Esc：关闭弹窗\n- Ctrl/Cmd + /：显示快捷键帮助');
    }

    // 显示关于
    showAbout() {
        alert('医美咨询师实战技巧\n\n版本：v1.0.0\n\n重庆联合丽格科技有限公司\n地址：重庆市渝中区临江支路28号\n电话：023-63326559\n邮箱：yuxiaodong@beaucare.org\n\n© 2025 保留所有权利');
    }

    // 初始化分类折叠
    initCategoryCollapsible() {
        const categoryHeaders = document.querySelectorAll('.category-header');
        categoryHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const group = header.closest('.category-group');
                group.classList.toggle('expanded');
            });
        });
    }

    // 初始化键盘快捷键
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Enter：发送消息
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                const chatInput = document.getElementById('chatInput');
                if (document.activeElement === chatInput) {
                    e.preventDefault();
                    document.getElementById('sendMessage').click();
                }
            }

            // Esc：关闭弹窗
            if (e.key === 'Escape') {
                this.closeSettings();
            }

            // Ctrl/Cmd + /：显示帮助
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                this.showUsage();
            }
        });
    }

    // 初始化页面动画
    initPageAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // 观察所有section
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    }

    // 平滑滚动到顶部
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // 复制文本到剪贴板
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('已复制到剪贴板');
            });
        } else {
            // 备用方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('已复制到剪贴板');
        }
    }

    // 显示提示消息
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// 添加Toast样式
const toastStyles = `
.toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background-color: var(--text-primary);
    color: var(--bg-primary);
    padding: 12px 24px;
    border-radius: 8px;
    z-index: 9999;
    transition: transform 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.toast.show {
    transform: translateX(-50%) translateY(0);
}
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = toastStyles;
document.head.appendChild(styleSheet);

// 页面性能监控
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // 监控页面加载时间
        window.addEventListener('load', () => {
            const perfData = performance.getEntriesByType('navigation')[0];
            this.metrics.loadTime = perfData.loadEventEnd - perfData.fetchStart;
            console.log('页面加载时间:', this.metrics.loadTime + 'ms');
        });

        // 监控首次内容绘制
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.fcp = entry.startTime;
                    console.log('首次内容绘制:', this.metrics.fcp + 'ms');
                }
            });
        }).observe({ entryTypes: ['paint'] });
    }

    getMetrics() {
        return this.metrics;
    }
}

// 图片懒加载
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            this.images.forEach(img => imageObserver.observe(img));
        } else {
            // 降级处理
            this.images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }
}

// Service Worker注册（PWA支持）
class PWA {
    constructor() {
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker 注册成功');
            } catch (error) {
                console.log('Service Worker 注册失败:', error);
            }
        }
    }
}

// 错误处理
class ErrorHandler {
    constructor() {
        this.init();
    }

    init() {
        window.addEventListener('error', (e) => {
            console.error('全局错误:', e.error);
            this.reportError(e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('未处理的Promise错误:', e.reason);
            this.reportError(e.reason);
        });
    }

    reportError(error) {
        // 这里可以添加错误上报逻辑
        console.log('错误已记录:', error.message || error);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    // 初始化核心功能
    window.app = new App();

    // 初始化性能监控
    window.performanceMonitor = new PerformanceMonitor();

    // 初始化图片懒加载
    window.lazyLoader = new LazyLoader();

    // 初始化PWA
    window.pwa = new PWA();

    // 初始化错误处理
    window.errorHandler = new ErrorHandler();

    // 添加页面加载完成的提示
    console.log('医美咨询师实战技巧网站加载完成 ✓');
});

// 导出全局函数
window.scrollToTop = () => window.app?.scrollToTop();
window.copyToClipboard = (text) => window.app?.copyToClipboard(text);

// ========== 章节页面功能 ==========

// 阅读进度条
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// 目录生成与滚动跟踪
function initTableOfContents() {
    const tocList = document.getElementById('tocList');
    const tocSidebar = document.getElementById('tocSidebar');
    const chapterContent = document.getElementById('chapterContent');

    if (!tocList || !tocSidebar || !chapterContent) return;

    // 生成目录
    const headings = chapterContent.querySelectorAll('h2, h3');
    if (headings.length === 0) {
        tocSidebar.style.display = 'none';
        return;
    }

    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = 'heading-' + index;
        }

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#' + heading.id;
        a.textContent = heading.textContent.substring(0, 30) + (heading.textContent.length > 30 ? '...' : '');
        a.dataset.target = heading.id;

        li.appendChild(a);
        tocList.appendChild(li);
    });

    // 滚动跟踪
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocList.querySelectorAll('a').forEach(a => {
                    a.classList.remove('active');
                    if (a.dataset.target === id) {
                        a.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-100px 0px -66% 0px'
    });

    headings.forEach(heading => observer.observe(heading));
}

// 字体大小调整
let currentFontSize = 16;

function adjustFontSize(delta) {
    const chapterContent = document.getElementById('chapterContent');
    if (!chapterContent) return;

    currentFontSize = Math.max(12, Math.min(24, currentFontSize + delta));
    chapterContent.style.fontSize = currentFontSize + 'px';
    localStorage.setItem('chapterFontSize', currentFontSize);
}

function resetFontSize() {
    const chapterContent = document.getElementById('chapterContent');
    if (!chapterContent) return;

    currentFontSize = 16;
    chapterContent.style.fontSize = currentFontSize + 'px';
    localStorage.removeItem('chapterFontSize');
}

// 初始化章节页面
document.addEventListener('DOMContentLoaded', () => {
    initProgressBar();
    initTableOfContents();

    // 加载保存的字体大小
    const savedFontSize = localStorage.getItem('chapterFontSize');
    if (savedFontSize) {
        currentFontSize = parseInt(savedFontSize);
        const chapterContent = document.getElementById('chapterContent');
        if (chapterContent) {
            chapterContent.style.fontSize = currentFontSize + 'px';
        }
    }

    // 导出字体调整函数到全局
    window.adjustFontSize = adjustFontSize;
    window.resetFontSize = resetFontSize;
});

// ========== 搜索功能 ==========

// 初始化搜索功能
function initSearch() {
    const searchInput = document.getElementById('headerSearch');
    const searchResults = document.getElementById('searchResults');

    if (!searchInput || !searchResults) return;

    // 加载搜索索引
    let searchIndex = [];
    if (window.searchIndex) {
        searchIndex = window.searchIndex;
    }

    // 输入防抖
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                performSearch(query, searchIndex, searchResults);
            } else {
                searchResults.classList.remove('active');
                searchResults.innerHTML = '';
            }
        }, 300);
    });

    // 聚焦时显示结果
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim().length >= 2) {
            searchResults.classList.add('active');
        }
    });

    // 点击外部关闭结果
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('active');
        }
    });

    // 键盘导航
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchResults.classList.remove('active');
            searchInput.blur();
        } else if (e.key === 'Enter') {
            const firstResult = searchResults.querySelector('.search-result-item');
            if (firstResult) {
                window.location.href = firstResult.dataset.url;
            }
        }
    });
}

// 执行搜索
function performSearch(query, searchIndex, searchResults) {
    const results = window.searchChapters(query);

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-result">
                <span class="material-symbols-outlined">search_off</span>
                <p>未找到相关章节</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.slice(0, 6).map(result => `
            <div class="search-result-item" data-url="${result.url}">
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-desc">${result.description}</div>
                <div class="search-result-keywords">
                    ${result.matchedKeywords.map(k => `<span class="search-keyword">${k}</span>`).join('')}
                </div>
            </div>
        `).join('');

        // 绑定点击事件
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = item.dataset.url;
            });
        });
    }

    searchResults.classList.add('active');
}

// 页面加载时初始化搜索
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...

    // 初始化搜索
    initSearch();
});
