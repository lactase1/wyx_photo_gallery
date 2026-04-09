# Implementation Plan (核心原型版 - 细粒度迭代)

说明：
- 目标：快速交付一个视觉高品质、功能闭环的摄影作品集原型。
- 规范：每个步骤以 `stepX` 编号，包含具体的指令与验证方法，不含具体代码。
- 优先级：优先保证“上传-展示-详情”核心链路的稳定性与视觉极简感。

---

## 阶段一：基础骨架与视觉基线 (Foundation)

### step1: 初始化 Next.js 生产环境
- **执行指令**：
  - 使用 `npx create-next-app@latest` 初始化项目。
  - 选项：TypeScript (Yes), ESLint (Yes), Tailwind CSS (Yes), src/ directory (No), App Router (Yes), import alias (Yes, `@/*`)。
- **验证测试**：
  - 运行 `npm run dev`，成功访问 `http://localhost:3000`。

### step2: 安装并初始化 shadcn/ui
- **执行指令**：
  - 运行 `npx shadcn-ui@latest init`。
  - 配置：Style (Default), Base color (Slate), CSS variables (Yes)。
- **验证测试**：
  - 检查 `components.json` 是否生成，`lib/utils.ts` 是否存在。

### step3: 强制全局深色模式与极简样式
- **执行指令**：
  - 修改 `app/globals.css`，将背景设为纯黑 (`#000000`)，文字设为近白 (`#f8fafc`)。
  - 在 `app/layout.tsx` 的 `html` 标签中强制添加 `className="dark"`。
  - 移除 Next.js 默认的所有演示样式（如背景渐变）。
- **验证测试**：
  - 刷新页面，确认背景为纯黑，文字为白色，无多余装饰。

### step4: 安装基础依赖包
- **执行指令**：
  - 安装 Supabase SDK: `@supabase/supabase-js`, `@supabase/ssr`。
  - 安装 EXIF 解析库: `exifreader`。
  - 安装图标库: `lucide-react`。
- **验证测试**：
  - 检查 `package.json` 中的 `dependencies` 列表确认安装成功。

---

## 阶段二：数据底层与存储 (Infrastructure)

### step5: 定义 Supabase 数据库模型 (SQL)
- **执行指令**：
  - 在 Supabase SQL Editor 执行建表脚本。
  - 创建 `photos` 表（UUID, 标题, 分类, 缩略图URL, 原图URL, EXIF(JSONB), 描述, 状态）。
  - 创建 `categories` 表（名称, 别名）。
  - 创建 `comments` 和 `likes` 表。
- **验证测试**：
  - 在 Supabase Dashboard 确认所有表及字段已正确创建。

### step6: 配置 Storage 存储桶
- **执行指令**：
  - 创建名为 `gallery` 的存储桶（Bucket）。
  - 设置策略：管理员（Authenticated）可读写，匿名用户（Public）仅可读取。
- **验证测试**：
  - 从 Supabase 后台手动上传一张图，并尝试通过 Public URL 访问。

### step7: 封装 Supabase 客户端工具
- **执行指令**：
  - 在 `lib/` 下创建 `supabase/server.ts` 和 `supabase/client.ts`。
  - 配置 `.env.local` 存储 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
- **验证测试**：
  - 编写一个简单的 Server Component 尝试从 `photos` 表 select 数据，控制台不报错。

---

## 阶段三：管理端与上传逻辑 (CMS Admin)

### step8: 实现管理员登录页面
- **执行指令**：
  - 创建 `/login` 路由。
  - 使用 shadcn 的 `Input` 和 `Button` 组件构建极简登录表单。
- **验证测试**：
  - 使用 Supabase 预设账号登录，成功跳转至 `/admin`。

### step9: 实现 EXIF 提取工具函数
- **执行指令**：
  - 编写 `lib/exif.ts`，接收图片文件对象，返回处理后的核心 EXIF 字段（相机、镜头、光圈、快门、ISO）。
- **验证测试**：
  - 传入一张带 EXIF 的本地图片，确认函数能输出预期的 JSON 格式数据。

### step10: 构建单图上传表单
- **执行指令**：
  - 在 `/admin/upload` 创建表单。
  - 包含：文件选择器、标题、分类下拉框（从数据库读取）、描述文本域。
- **验证测试**：
  - 页面能正常渲染，且分类下拉框中有正确选项。

### step11: 实现上传 Server Action 闭环
- **执行指令**：
  - 编写上传 Action：1. 上传文件至 Storage -> 2. 提取 EXIF -> 3. 写入 `photos` 表。
- **验证测试**：
  - 提交表单上传图，在数据库中确认 EXIF 字段已自动填充。

---

## 阶段四：C端展示与交互 (Public Gallery)

### step12: 构建响应式作品网格 (Home/Gallery)
- **执行指令**：
  - 在首页使用 CSS Grid 构建响应式网格。
  - 使用 Next.js `<Image>` 组件加载缩略图，设置 `placeholder="blur"`。
- **验证测试**：
  - 模拟慢速网络，确认有模糊占位图显示。

### step13: 实现分类过滤逻辑
- **执行指令**：
  - 在列表顶部增加导航组件（全部、风光、肖像）。
  - 通过 URL 查询参数（如 `?category=landscape`）进行服务器端过滤。
- **验证测试**：
  - 切换分类，确认列表刷新并显示正确结果。

### step14: 实现沉浸式暗框 (Lightbox) 基础
- **执行指令**：
  - 使用 shadcn 的 `Dialog` 组件。
  - 点击缩略图时，打开对话框并加载高清原图。
- **验证测试**：
  - 点击图片弹出层正常，点击遮罩层可关闭。

### step15: EXIF 数据展示组件
- **执行指令**：
  - 在 Lightbox 内大图侧边或下方展示 EXIF 信息。
  - 使用 Lucide 图标辅助展示。
- **验证测试**：
  - 检查光圈、快门等参数展示格式是否符合摄影师习惯（如 f/2.8, 1/200s）。

### step16: “关于/器材” 静态页开发
- **执行指令**：
  - 创建 `/about` 路由。
  - 采用大字号标题和窄版正文排版，列出器材清单。
- **验证测试**：
  - 确认移动端下文字无溢出，边距适中。

---

## 阶段五：互动功能与收尾 (Interactions & Deployment)

### step17: 点赞（Like）按钮与乐观更新
- **执行指令**：
  - 在 Lightbox 中添加点赞图标。
  - 使用 `useOptimistic` 实现点击即更新计数。
- **验证测试**：
  - 点击点赞，数字立即增加，刷新页面后计数持久化。

### step18: 轻量级评论列表
- **执行指令**：
  - 在 Lightbox 底部实现评论展示与输入框。
  - 仅保留昵称和内容两个必填项。
- **验证测试**：
  - 提交评论后，列表即时显示新记录。

### step19: 响应式细节巡检
- **执行指令**：
  - 针对 iPad 和手机端优化网格列数。
  - 修复 Lightbox 在小屏下的最大高度限制。
- **验证测试**：
  - 在 Chrome 模拟器下通过所有关键断点测试。

### step20: Vercel 部署与冒烟测试
- **执行指令**：
  - 推送代码至 GitHub。
  - 在 Vercel 配置 Supabase 环境变量并部署。
- **验证测试**：
  - 在线上环境完整测试一次“上传-展示-点赞-评论”闭环。
