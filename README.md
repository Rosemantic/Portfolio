# 🎨 响应式个人作品集网站

一个使用 HTML、CSS、GSAP、Lenis 构建的现代化响应式个人作品集网站，采用模块化结构，流畅动画，极简设计风格。

## 📑 目录

- [✨ 特性](#-特性)
- [📁 项目结构](#-项目结构)
- [🎨 设计规范](#-设计规范)
- [🚀 技术栈](#-技术栈)
- [📦 开始使用](#-开始使用)
- [🔧 开发指南](#-开发指南)
- [📝 代码规范](#-代码规范)
- [🛠️ 构建与部署](#️-构建与部署)
- [📱 功能模块](#-功能模块)
- [🎯 浏览器支持](#-浏览器支持)
- [💡 开发提示](#-开发提示)
- [🐛 常见问题](#-常见问题)
- [📚 学习资源](#-学习资源)

## ✨ 特性

- 🎯 **现代极简设计** - 参考 Awwwards 风格，浅色主题，简洁优雅
- 🎬 **流畅动画效果** - 基于 GSAP + ScrollTrigger 实现滚动触发动画
- 📱 **完全响应式** - 适配桌面、平板、移动端全设备
- ⚡ **平滑滚动** - 使用 Lenis 实现丝滑滚动体验
- 🧩 **模块化架构** - HTML 组件化，CSS 分区管理，JS 职责分离
- 🎨 **BEM 命名规范** - 清晰的 CSS 类名结构
- 📊 **数据驱动** - 项目信息通过 JSON 配置管理

## 📁 项目结构

```
portfolio/
├── 📄 页面
│   ├── index.html          # 首页
│   ├── about.html          # 关于页面
│   ├── works.html          # 作品展示
│   └── contact.html        # 联系方式
│
├── 🎨 css/                 # 样式文件
│   ├── reset.css          # 样式重置
│   ├── variables.css      # CSS 变量（颜色、字体、间距）
│   ├── base.css           # 基础样式
│   ├── style.css          # 主样式
│   ├── responsive.css     # 响应式布局
│   └── sections/          # 分区样式
│       ├── hero.css       # 首屏区域
│       ├── about.css      # 关于区域
│       ├── works.css      # 作品展示
│       ├── contact.css    # 联系区域
│       └── modal.css      # 弹窗样式
│
├── 📜 js/                  # JavaScript 文件
│   ├── main.js            # 初始化 Lenis 与 GSAP 插件
│   ├── include.js         # 动态引入模块（header/footer）
│   ├── animations.js      # 定义滚动触发与入场动画
│   ├── navigation.js      # 控制导航栏与移动端菜单
│   └── utils.js           # 工具函数
│
├── 📦 sections/            # HTML 模块组件
│   ├── header.html        # 头部导航
│   ├── hero.html          # 首屏英雄区
│   ├── about-section.html # 关于模块
│   ├── works-section.html # 作品模块
│   ├── contact-section.html # 联系模块
│   └── footer.html        # 页脚
│
├── 💾 data/                # 数据配置
│   ├── projects.json      # 作品项目数据
│   ├── social.json        # 社交媒体链接
│   └── site-meta.json     # 网站元信息
│
├── 🖼️ assets/             # 静态资源
│   ├── images/            # 图片资源
│   ├── videos/            # 视频资源
│   ├── fonts/             # 字体文件
│   └── icons/             # 图标文件
│
├── 🔧 tools/               # 构建工具
│   ├── build.sh           # 构建脚本
│   ├── deploy.sh          # 部署脚本
│   └── compress-images.js # 图片压缩工具
│
└── 📦 build/               # 构建输出目录
```

## 🎨 设计规范

### 主题配色
```css
--bg-color: #F4F4F4;         /* 浅灰色背景 */
--text-color: #272727;       /* 深灰色文字 */
--font-family: 'Poppins', sans-serif;
```

### 响应式断点
- 🖥️ **Desktop**: `min-width: 1024px`
- 📱 **Tablet**: `768px - 1023px`
- 📱 **Mobile**: `max-width: 767px`

### 动画原则
- 自然流畅，不夸张
- 滚动触发渐显
- 元素滑入、淡入淡出
- 轻微视差与惯性动画

## 🚀 技术栈

- **HTML5** - 语义化结构
- **CSS3** - Flexbox / Grid 布局
- **JavaScript (ES6+)** - 原生 JS，无框架依赖
- **GSAP** - 高性能动画库
- **ScrollTrigger** - 滚动触发动画
- **Lenis** - 平滑滚动效果

## 📦 开始使用

### 1. 克隆项目
```bash
git clone <repository-url>
cd portfolio
```

### 2. 本地开发
使用任意本地服务器运行项目：

```bash
# 使用 Python
python -m http.server 8000

# 或使用 Node.js (http-server)
npx http-server -p 8000

# 或使用 Live Server (VS Code 插件)
```

### 3. 访问网站
打开浏览器访问 `http://localhost:8000`

## 🔧 开发指南

### CSS 加载顺序
```html
<!-- 严格按照以下顺序引入 -->
<link rel="stylesheet" href="css/reset.css">
<link rel="stylesheet" href="css/variables.css">
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/sections/*.css">
<link rel="stylesheet" href="css/responsive.css">
```

### JS 加载顺序
```html
<!-- 在 </body> 前引入，严格按以下顺序 -->
<!-- 1. 第三方库 -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/studio-freight/lenis@latest/bundled/lenis.min.js"></script>

<!-- 2. 项目脚本 -->
<script src="js/utils.js"></script>
<script src="js/include.js"></script>
<script src="js/main.js"></script>
<script src="js/animations.js"></script>
<script src="js/navigation.js"></script>
```

### BEM 命名规范
```css
/* Block */
.hero { }

/* Block__Element */
.hero__title { }

/* Block__Element--Modifier */
.hero__title--large { }
```

## 📝 代码规范

- **缩进**: 2 个空格
- **引号**: 双引号
- **命名**: BEM 规范
- **注释**: 中文注释，说明功能与用途

## 🛠️ 构建与部署

### 图片压缩
```bash
node tools/compress-images.js
```

### 构建生产版本
```bash
bash tools/build.sh
```

### 部署
```bash
bash tools/deploy.sh
```

## 📱 功能模块

### 核心功能
- ✅ **响应式导航栏** - 支持移动端汉堡菜单，平滑切换动画
- ✅ **Hero 首屏区** - 全屏大标题，支持视差与渐显动画
- ✅ **关于模块** - 个人简介，技能展示，滚动触发动画
- ✅ **作品展示** - 项目网格布局，卡片悬停效果，详情弹窗
- ✅ **联系表单** - 表单验证，提交反馈，动画过渡
- ✅ **页脚** - 社交媒体链接，版权信息

### 动画效果
- 🎬 **页面滚动** - Lenis 平滑滚动体验
- 🎬 **元素入场** - ScrollTrigger 滚动触发渐显
- 🎬 **视差效果** - 轻微视差移动增强层次感
- 🎬 **交互反馈** - 按钮、链接、卡片悬停动画

### 数据管理
- 📊 **projects.json** - 作品项目信息
- 📊 **social.json** - 社交媒体配置
- 📊 **site-meta.json** - 网站元数据

## 🎯 浏览器支持

| 浏览器 | 版本 |
|-------|------|
| Chrome | 最新 2 个版本 |
| Firefox | 最新 2 个版本 |
| Safari | 最新 2 个版本 |
| Edge | 最新 2 个版本 |

**注意**: 项目使用了现代 JavaScript 特性和 CSS Grid/Flexbox，不支持 IE 浏览器。

## 💡 开发提示

### 添加新页面
1. 在根目录创建 HTML 文件（如 `blog.html`）
2. 在 `/sections` 创建对应模块（如 `blog-section.html`）
3. 在 `/css/sections` 创建样式（如 `blog.css`）
4. 在 `/js/animations.js` 添加动画效果

### 修改主题颜色
编辑 `css/variables.css` 中的 CSS 变量：
```css
:root {
  --bg-color: #F4F4F4;
  --text-color: #272727;
  /* 添加更多自定义变量 */
}
```

### 添加新项目
编辑 `data/projects.json`：
```json
{
  "id": "project-id",
  "title": "项目名称",
  "description": "项目描述",
  "image": "assets/images/project.jpg",
  "link": "https://project-url.com",
  "tags": ["HTML", "CSS", "JavaScript"]
}
```

### 调试动画
在浏览器控制台输入：
```javascript
// 查看所有 GSAP 动画
gsap.globalTimeline.getChildren()

// 暂停所有动画
gsap.globalTimeline.pause()

// 恢复所有动画
gsap.globalTimeline.play()
```

## 🐛 常见问题

### Q: 动画不生效？
**A**: 检查以下事项：
1. 确认已正确引入 GSAP 和 ScrollTrigger
2. 确认 `main.js` 在 `animations.js` 之前加载
3. 使用浏览器控制台查看是否有 JavaScript 错误

### Q: 导航栏在移动端不显示？
**A**: 检查 `navigation.js` 是否正确加载，确认使用了正确的类名。

### Q: 平滑滚动不工作？
**A**: 确认 Lenis 库已加载，并在 `main.js` 中正确初始化。

### Q: 图片加载慢？
**A**: 运行 `node tools/compress-images.js` 压缩图片资源。

## 📚 学习资源

- [GSAP 官方文档](https://greensock.com/docs/)
- [ScrollTrigger 教程](https://greensock.com/scrolltrigger/)
- [Lenis GitHub](https://github.com/studio-freight/lenis)
- [BEM 命名规范](https://getbem.com/)
- [Awwwards 设计灵感](https://www.awwwards.com/)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👤 作者

**你的名字**
- 网站: [你的网站](https://your-website.com)
- GitHub: [@你的GitHub](https://github.com/yourusername)
- Twitter: [@你的Twitter](https://twitter.com/yourusername)

## 🙏 致谢

- 感谢 [GSAP](https://greensock.com/) 提供强大的动画库
- 感谢 [Lenis](https://github.com/studio-freight/lenis) 提供平滑滚动方案
- 设计灵感来自 [Awwwards](https://www.awwwards.com/) 优秀作品

---

⭐ **如果这个项目对你有帮助，欢迎 Star！**

📮 **有问题或建议？** 欢迎提交 [Issue](../../issues) 或 [Pull Request](../../pulls)
