# 项目名称：wyx-photo-gallery (个人摄影作品集)

本项目是一个高品质个人摄影作品展示平台，旨在提供极简、沉浸式的浏览体验。它专注于以深色调、简洁的 UI 展现摄影作品（如风光、肖像等），突出视觉内容的冲击力。

## 项目概述
- **项目定位**：建立专业的摄影作品数字化名片。
- **视觉风格**：极简主义、全局深色模式（Dark Mode）、高对比度，旨在突出影像本身的色彩与光影。
- **核心功能**：
  - 响应式画廊，支持懒加载和沉浸式暗框（Lightbox）大图展示。
  - 自动提取并展示图片的 EXIF 元数据。
  - 作品分类管理（例如：风光、肖像等）。
  - 后台管理系统 (CMS Admin)，支持照片上传、EXIF 修正及内容编辑。
  - 轻量级互动功能（点赞、评论）。

## 技术架构与选型
项目采用“BaaS (后端即服务) + 现代前端框架”模式，特别针对 AI 辅助开发进行了优化，实现零服务器运维。
- **前端框架**：[Next.js](https://nextjs.org/) (App Router 模式), React, [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), Lucide Icons。
- **后端/数据库**：[Supabase](https://supabase.com/) (PostgreSQL 存储元数据，Storage 存储高清图片，Auth 处理管理员鉴权)。
- **部署平台**：[Vercel](https://vercel.com/) (通过 GitHub 集成实现自动构建与部署)。

## 构建与运行
*注意：本项目目前处于规划和架构阶段。以下是针对 Next.js 技术栈的标准命令。*

### 环境要求
- Node.js (建议使用最新的 LTS 版本)
- npm 或 pnpm
- Supabase 账号及项目配置

### 开发阶段
```bash
# 安装依赖（在项目开始实施时执行）
npm install

# 启动开发服务器
npm run dev
```

### 构建与生产环境
```bash
# 构建应用程序
npm run build

# 启动生产服务器
npm start
```

## 开发规范
0. **交流准则**：**以后必须用中文和我交流，回答我。**
1. **文档驱动开发 (重要)**：
   - 编写任何代码前，必须阅读 `memory-bank/architecture.md`（包含完整的数据库 Schema）。
   - 编写任何代码前，必须阅读 `memory-bank/prd.md`和`memory-bank/tech-stack.md`。
2. **实时进度同步**：
   - 在添加重大功能或完成里程碑后，必须更新 `memory-bank/architecture.md`。
   - 完成 Plan 中的每一个 Step 后，必须及时更新记录到 `progress.md` 和 `GEMINI.md`。
3. **AI 优先工作流**：架构设计高度兼容 AI 编程工具（如 Cursor, Codex, Gemini Cli）。优先使用 Next.js App Router 和服务端组件（Server Components）。
4. **极简主义原则**：严格遵守极简 UI 设计原则。剥离冗余 UI 元素，确保影像作品是页面的视觉重心。
5. **图像性能优化**：全站图片渲染必须使用 Next.js 的 `<Image>` 组件，以自动处理懒加载、WebP 格式转换和响应式尺寸。
6. **BaaS 集成**：充分利用 Supabase 的内置功能（存储、鉴权、数据库），避免自建复杂的后端逻辑或服务器。
7. **样式控制**：使用 Tailwind CSS 进行原子化样式管理，并确保全局深色模式的一致性。

## 相关资源
- `memory-bank/prd.md`：详细的需求与设计文档。
- `memory-bank/tech-stack.md`：技术栈选型理由及说明。
