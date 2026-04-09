-- 1. 创建分类表 (categories)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 创建照片表 (photos)
CREATE TABLE IF NOT EXISTS public.photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    storage_path TEXT NOT NULL,
    exif JSONB,
    blur_data_url TEXT, -- 存储 Base64 占位图
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 启用行级安全性 (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- 4. 配置公共读取策略 (Allow public read access)
CREATE POLICY "Enable read access for all users" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON public.photos
    FOR SELECT USING (true);

-- 5. 管理员操作策略 (暂时假设管理员通过 Dashboard 或之后配置 Auth)
-- 只有经过身份验证的用户才能进行写操作 (INSERT/UPDATE/DELETE)
CREATE POLICY "Enable write for authenticated users only" ON public.categories
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable write for authenticated users only" ON public.photos
    FOR ALL USING (auth.role() = 'authenticated');
