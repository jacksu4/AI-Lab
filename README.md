# AI LAB_

<div align="center">

![AI Lab Banner](https://img.shields.io/badge/AI-LAB-00D9FF?style=for-the-badge&logo=react&logoColor=white)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/AI-Lab)

一个展示 AI 驱动应用的赛博朋克风格作品集

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 项目简介

**AI Lab** 是一个单页应用 (SPA),展示了两个创新的 AI 驱动项目:

1. **Cyber Soul Observer** - 基于 Gemini AI 的性格分析系统
   - 动态生成 8 个深邃的抽象情境问题
   - AI 驱动的 MBTI 性格分析
   - 结合道家哲学与赛博朋克美学

2. **Alpha Seeker** (开发中) - 智能股票分析工具
   - 美股与港股科技板块财报分析
   - LLM 驱动的情绪分析

## ✨ 特性

- 🎨 **赛博朋克设计** - 炫酷的视觉效果,包括玻璃态射、渐变和动画
- 🤖 **AI 驱动** - 使用 Google Gemini API 进行智能分析
- 📱 **响应式设计** - 完美适配桌面和移动设备
- ⚡ **高性能** - 基于 Vite + React 构建
- 🎭 **动态内容** - 每次运行生成不同的问题

## 🛠️ 技术栈

### 前端
- **框架**: React 18
- **构建工具**: Vite 6
- **样式**: TailwindCSS 3
- **图标**: Lucide React
- **字体**: Inter, JetBrains Mono (Google Fonts)

### AI / API
- **AI 引擎**: Google Gemini 2.5 Flash
- **API 集成**: Gemini REST API

### 部署
- **平台**: Vercel
- **CI/CD**: 自动化部署

## 🚀 快速开始

### 前置条件

- Node.js 18+ 
- npm 或 yarn
- Gemini API Key ([获取地址](https://ai.google.dev/))

### 本地运行

1. **克隆项目**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AI-Lab.git
   cd AI-Lab
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env.local` 文件:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问应用**
   
   打开浏览器访问 [http://localhost:5173](http://localhost:5173)

### 构建生产版本

```bash
npm run build
npm run preview  # 预览生产构建
```

## 📦 部署到 Vercel

### 方式一: 一键部署

点击下方按钮一键部署到 Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/AI-Lab)

### 方式二: 手动部署

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   ```

3. **部署项目**
   ```bash
   vercel
   ```

4. **配置环境变量**
   
   在 Vercel Dashboard 中添加环境变量:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: 你的 Gemini API Key

5. **完成部署**
   
   Vercel 会自动构建并部署你的应用

## 🎮 使用指南

### Cyber Soul Observer

1. 点击首页的 "Cyber Soul Observer" 卡片
2. 点击 "Initialize" 初始化系统
3. 等待 AI 生成 8 个情境问题
4. 逐个回答问题
5. 查看 AI 分析结果:
   - MBTI 性格类型
   - 性格原型
   - 能量色
   - 深度分析

### Alpha Seeker

当前处于开发状态,敬请期待!

## 📁 项目结构

```
AI-Lab/
├── public/                 # 静态资源
├── src/
│   ├── App.jsx            # 主应用组件
│   ├── main.jsx           # React 入口
│   └── index.css          # 全局样式
├── .env.local             # 环境变量 (不提交)
├── index.html             # HTML 入口
├── package.json           # 项目配置
├── tailwind.config.js     # Tailwind 配置
├── vite.config.js         # Vite 配置
├── vercel.json            # Vercel 部署配置
└── README.md              # 项目文档
```

## 🔧 开发说明

### 添加新的 AI 项目

1. 在 `App.jsx` 中创建新组件
2. 在主页面的项目网格中添加新卡片
3. 更新路由逻辑

### 自定义样式

全局样式定义在组件内的 `globalStyles` 常量中,可以根据需要修改。

### API 限流

Gemini API 有使用限制,建议:
- 开发时使用较小的配额
- 生产环境启用缓存
- 实现错误重试机制

## ⚠️ 注意事项

- **API Key 安全**: 永远不要将 `.env.local` 提交到 Git
- **环境变量前缀**: Vite 要求客户端环境变量使用 `VITE_` 前缀
- **Tailwind 警告**: CSS 中的 `@tailwind` 警告可以忽略,不影响功能

## 🤝 贡献

欢迎贡献! 请遵循以下步骤:

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [React](https://reactjs.org/) - UI 框架
- [Vite](https://vitejs.dev/) - 构建工具
- [TailwindCSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 图标库
- [Google Gemini](https://ai.google.dev/) - AI 引擎
- [Vercel](https://vercel.com/) - 部署平台

---

<div align="center">

Made with ❤️ and 🤖

**[⬆ 返回顶部](#ai-lab_)**

</div>
