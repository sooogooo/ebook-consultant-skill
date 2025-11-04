/**
 * 设计工具模块
 * 提供Canvas绘图、图片处理、导出等功能
 */

class DesignTool {
    constructor() {
        this.canvas = document.getElementById('designCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'brush';
        this.currentColor = '#d4a574';
        this.currentSize = 2;
        this.shapes = [];

        this.init();
        this.setupCanvas();
    }

    init() {
        // 绑定工具按钮
        document.getElementById('addText').addEventListener('click', () => this.addText());
        document.getElementById('addShape').addEventListener('click', () => this.addShape());
        document.getElementById('clearCanvas').addEventListener('click', () => this.clearCanvas());
        document.getElementById('exportPNG').addEventListener('click', () => this.exportAsPNG());
        document.getElementById('exportPDF').addEventListener('click', () => this.exportAsPDF());

        // 绑定画布事件
        this.setupEventListeners();

        // 初始化工具栏
        this.createToolbar();
    }

    setupCanvas() {
        // 设置画布大小
        const container = this.canvas.parentElement;
        const containerWidth = container.offsetWidth - 32;
        this.canvas.width = Math.min(800, containerWidth);
        this.canvas.height = 600;

        // 白色背景
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 设置绘图样式
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
    }

    setupEventListeners() {
        // 鼠标事件
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // 触摸事件（iOS兼容）
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });

        // 窗口大小改变
        window.addEventListener('resize', () => this.setupCanvas());
    }

    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'design-toolbar';
        toolbar.innerHTML = `
            <div class="tool-group">
                <button class="tool-btn active" data-tool="brush">
                    <span class="material-symbols-outlined">brush</span>
                    画笔
                </button>
                <button class="tool-btn" data-tool="eraser">
                    <span class="material-symbols-outlined">ink_eraser</span>
                    橡皮擦
                </button>
                <button class="tool-btn" data-tool="line">
                    <span class="material-symbols-outlined">straighten</span>
                    直线
                </button>
                <button class="tool-btn" data-tool="circle">
                    <span class="material-symbols-outlined">radio_button_unchecked</span>
                    圆形
                </button>
                <button class="tool-btn" data-tool="rectangle">
                    <span class="material-symbols-outlined">crop_din</span>
                    矩形
                </button>
            </div>
            <div class="tool-group">
                <label class="color-picker">
                    <span class="material-symbols-outlined">palette</span>
                    <input type="color" id="colorPicker" value="#d4a574">
                </label>
                <label class="size-picker">
                    <span class="material-symbols-outlined">line_weight</span>
                    <input type="range" id="sizePicker" min="1" max="20" value="2">
                    <span id="sizeValue">2</span>
                </label>
            </div>
        `;

        const designCanvas = document.querySelector('.design-canvas');
        designCanvas.insertBefore(toolbar, this.canvas);

        // 绑定工具按钮事件
        toolbar.addEventListener('click', (e) => {
            const btn = e.target.closest('.tool-btn');
            if (btn) {
                toolbar.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTool = btn.dataset.tool;
            }
        });

        // 颜色选择器
        const colorPicker = document.getElementById('colorPicker');
        colorPicker.addEventListener('input', (e) => {
            this.currentColor = e.target.value;
        });

        // 粗细选择器
        const sizePicker = document.getElementById('sizePicker');
        const sizeValue = document.getElementById('sizeValue');
        sizePicker.addEventListener('input', (e) => {
            this.currentSize = e.target.value;
            sizeValue.textContent = e.target.value;
            this.ctx.lineWidth = this.currentSize;
        });
    }

    getCanvasCoordinates(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        return { x, y };
    }

    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCanvasCoordinates(e);

        if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
            this.ctx.beginPath();
            this.ctx.moveTo(coords.x, coords.y);
        } else if (this.currentTool === 'line') {
            this.startX = coords.x;
            this.startY = coords.y;
        } else if (this.currentTool === 'circle') {
            this.startX = coords.x;
            this.startY = coords.y;
        } else if (this.currentTool === 'rectangle') {
            this.startX = coords.x;
            this.startY = coords.y;
        }
    }

    draw(e) {
        if (!this.isDrawing) return;

        const coords = this.getCanvasCoordinates(e);

        if (this.currentTool === 'brush' || this.currentTool === 'eraser') {
            this.ctx.globalCompositeOperation = this.currentTool === 'eraser' ? 'destination-out' : 'source-over';
            this.ctx.lineTo(coords.x, coords.y);
            this.ctx.stroke();
        }
    }

    stopDrawing() {
        if (!this.isDrawing) return;

        this.isDrawing = false;

        // 绘制最终形状
        if (this.currentTool === 'line') {
            this.drawLine(this.startX, this.startY, this.lastX, this.lastY);
        } else if (this.currentTool === 'circle') {
            const radius = Math.sqrt(
                Math.pow(this.lastX - this.startX, 2) + Math.pow(this.lastY - this.startY, 2)
            );
            this.drawCircle(this.startX, this.startY, radius);
        } else if (this.currentTool === 'rectangle') {
            this.drawRectangle(
                this.startX,
                this.startY,
                this.lastX - this.startX,
                this.lastY - this.startY
            );
        }
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawCircle(x, y, radius) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawRectangle(x, y, width, height) {
        this.ctx.strokeRect(x, y, width, height);
    }

    addText() {
        const text = prompt('请输入文字：');
        if (text) {
            const x = this.canvas.width / 2;
            const y = this.canvas.height / 2;

            this.ctx.font = 'bold 24px Arial';
            this.ctx.fillStyle = this.currentColor;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, x, y);
        }
    }

    addShape() {
        const shapes = ['circle', 'rectangle', 'triangle'];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];

        const x = Math.random() * (this.canvas.width - 100) + 50;
        const y = Math.random() * (this.canvas.height - 100) + 50;

        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;

        if (shape === 'circle') {
            this.drawCircle(x, y, 50);
        } else if (shape === 'rectangle') {
            this.ctx.strokeRect(x - 50, y - 50, 100, 100);
        } else if (shape === 'triangle') {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y - 50);
            this.ctx.lineTo(x - 50, y + 50);
            this.ctx.lineTo(x + 50, y + 50);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    clearCanvas() {
        if (confirm('确定要清空画布吗？')) {
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    exportAsPNG() {
        const link = document.createElement('a');
        link.download = `design-${Date.now()}.png`;
        link.href = this.canvas.toDataURL('image/png');
        link.click();
    }

    exportAsPDF() {
        // 使用jsPDF库实现PDF导出
        if (typeof jsPDF === 'undefined') {
            // 如果没有jsPDF，使用浏览器打印功能
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>设计作品</title>
                        <style>
                            body {
                                margin: 0;
                                padding: 20px;
                                text-align: center;
                            }
                            img {
                                max-width: 100%;
                                height: auto;
                            }
                        </style>
                    </head>
                    <body>
                        <h1>我的设计作品</h1>
                        <img src="${this.canvas.toDataURL('image/png')}" alt="设计作品">
                        <script>
                            window.onload = function() {
                                window.print();
                                window.close();
                            };
                        </script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        } else {
            const imgData = this.canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (this.canvas.height * imgWidth) / this.canvas.width;
            let heightLeft = imgHeight;

            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`design-${Date.now()}.pdf`);
        }
    }
}

// 初始化设计工具
document.addEventListener('DOMContentLoaded', () => {
    window.designTool = new DesignTool();
});
