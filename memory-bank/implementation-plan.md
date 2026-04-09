# Implementation Plan (核心原型版 - 深度优化迭代)

说明：
- 目标：交付一个具备 Base64 预加载、高性能 Lightbox 和动态分类管理的专业摄影作品集。
- 规范：每个步骤包含具体的指令与验证方法，确保技术方案闭环。
- 关键决策：后端处理 EXIF/占位图，Middleware 路由保护，支持沉浸式交互。

---

## 阶段一：基础骨架与安全防线 (Foundation & Security)

### step1: 初始化 Next.js 生产环境
- **执行指令**：
  - 使用 `npx create-next-app@latest` 初始化。
  - 选项：TypeScript, ESLint, Tailwind CSS, App Router, `@/*` 别名。
- **验证测试**：
  - `npm run dev` 访问成功。

### step2: 安装核心依赖包
- **执行指令**：
  - 基础：`lucide-react`, `clsx`, `tailwind-merge` (shadcn 必备)。
  - 后端处理：`exifreader`, `sharp` (用于生成 Base64 缩略图)。
  - Supabase：`@supabase/supabase-js`, `@supabase/ssr`。
  - 交互：`yet-another-react-lightbox` (提供键盘/手势支持)。
- **验证测试**：
  - 检查 `package.json` 确认 `sharp` 和 `exifreader` 已安装。

### step3: 强制视觉基线与 Middleware 保护
- **执行指令**：
  - 修改 `app/globals.css`：背景 `#000000`，文字 `#f8fafc`。
  - 创建 `middleware.ts`：利用 Supabase Auth 保护所有以 `/admin` 开头的路由，未登录重定向至 `/login`。
- **验证测试**：
  - 未登录状态访问 `localhost:3000/admin`，应自动跳转到登录页。

---

## 阶段二：数据底层与存储策略 (Infrastructure)

### step4: 完善 Supabase 数据库模型
- **执行指令**：
  - 执行 SQL 建表：
    - `categories`: `id (uuid), name (text), slug (text), created_at`。
    - `photos`: `id (uuid), title (text), category_id (fk), storage_path (text), exif (jsonb), blur_data_url (text), description (text), created_at`。
- **验证测试**：
  - 在 Supabase Dashboard 确认 `blur_data_url` 字段为 `text` 类型。

### step5: 封装 Supabase 服务端客户端
- **执行指令**：
  - 在 `lib/supabase/` 创建 `server.ts` 和 `client.ts`（支持 SSR 和 Client Component）。
  - 配置 `.env.local` 环境变量。
- **验证测试**：
  - 编写测试 API 确认能正常连接数据库。

---

## 阶段三：管理端核心逻辑 (CMS Admin)

### step6: 实现分类管理页面 (CRUD)
- **执行指令**：
  - 在 `/admin/categories` 创建管理页，支持新增、修改和删除分类。
- **验证测试**：
  - 创建一个名为“风光”的分类，在数据库中确认记录。

### step7: 编写后端图像处理工具 (Server-Side)
- **执行指令**：
  - 在 `lib/image-processing.ts` 封装两个函数：
    1. `extractExif(buffer)`: 使用 `exifreader` 提取核心参数。
    2. `generateBlurPlaceholder(buffer)`: 使用 `sharp` 将原图缩小至 10px 并转换为 Base64 字符串。
- **验证测试**：
  - 编写单元测试或临时脚本，确认能输出以 `data:image/jpeg;base64,...` 开头的字符串。

### step8: 实现上传 Server Action 闭环
- **执行指令**：
  - 编写 `uploadPhoto` Action：
    1. 接收 FormData 中的文件。
    2. 并行执行：上传至 Storage，提取 EXIF，生成 Base64 占位图。
    3. 将所有元数据写入 `photos` 表。
- **验证测试**：
  - 管理端上传一张 10MB 的原图，检查数据库中 `blur_data_url` 是否有值，`exif` 是否包含相机型号。

---

## 阶段四：C端沉浸式展示 (Public Gallery)

### step9: 构建高性能网格列表
- **执行指令**：
  - 在首页使用 `columns-1 md:columns-2 lg:columns-3` 瀑布流布局。
  - 使用 Next.js `<Image>`：`src` 指向原图（带 Supabase 转换参数），`blurDataURL` 使用数据库中的 Base64 字符串，`placeholder="blur"`。
- **验证测试**：
  - 刷新页面，肉眼可见极速展示模糊图，随后渐变为清晰图。

### step10: 实现高交互 Lightbox
- **执行指令**：
  - 集成 `yet-another-react-lightbox`。
  - 绑定键盘事件（Esc 退出，左右键切换）。
  - 在下方叠加显示 EXIF 浮层。
- **验证测试**：
  - 点击缩略图进入大图，使用键盘左右键顺畅切换。

---

## 阶段五：收尾与发布 (Deployment)

### step11: 全局极简 UI 巡检
- **执行指令**：
  - 检查字体：统一使用无衬线系统字体。
  - 检查边距：确保在大屏幕下画廊有足够的留白 (Container Max-width)。
- **验证测试**：
  - 手机端测试上传功能，确认移动端上传流程无卡顿。

### step12: Vercel 自动化部署
- **执行指令**：
  - 推送代码，配置 Vercel 环境变量。
- **验证测试**：
  - 线上环境冒烟测试：成功上传一张照片 -> 首页刷新可见 -> 点击进入沉浸式浏览。
