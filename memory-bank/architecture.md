# System Architecture (系统架构)

## 架构概览
本项目采用 **BaaS (Backend as a Service) + 现代前端框架** 的架构模式。

- **Frontend**: Next.js (App Router 模式), React, Tailwind CSS, shadcn/ui.
- **Backend/Storage**: Supabase (PostgreSQL, Storage, Auth).
- **Deployment**: Vercel.

## 关键技术组件
- **Next.js `<Image>`**: 用于自动图像优化（懒加载、WebP 转换）。
- **Sharp/ExifReader**: 在服务端处理上传的图片，提取 EXIF 信息并生成 Base64 占位图。
- **Supabase SSR**: 提供服务端和客户端的数据库/存储访问。
- **Lightbox**: 使用 `yet-another-react-lightbox` 实现沉浸式大图展示。

## 目录结构
- `src/app/`: 路由与页面组件。
- `src/components/`: 可复用的 UI 组件。
- `src/lib/`: 工具函数与服务端逻辑。
- `src/hooks/`: 自定义 React Hooks。
- `public/`: 静态资源。

## 数据流向
1. **用户上传**: 管理端上传原图 -> 服务端 Action 处理 (Sharp/ExifReader) -> 图片存储至 Supabase Storage，元数据存储至 PostgreSQL。
2. **画廊展示**: 首页请求 PostgreSQL 获取图片列表 -> Next.js 渲染瀑布流 -> 延迟加载高清图，优先显示数据库中的 Base64 占位图。
3. **沉浸式浏览**: 点击图片 -> 弹出 Lightbox -> 加载高清原图并展示 EXIF 信息。
