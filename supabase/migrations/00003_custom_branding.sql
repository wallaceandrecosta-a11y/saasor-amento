-- supabase/migrations/00003_custom_branding.sql
-- Adicionar colunas de marca corporativa e personalização na tabela public.users

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS company_cnpj text,
ADD COLUMN IF NOT EXISTS brand_color text DEFAULT '#2563eb',
ADD COLUMN IF NOT EXISTS brand_logo_url text,
ADD COLUMN IF NOT EXISTS remove_watermark boolean DEFAULT false;
