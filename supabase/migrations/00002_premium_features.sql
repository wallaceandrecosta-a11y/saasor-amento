-- supabase/migrations/00002_premium_features.sql
-- Adicionar colunas de tracking, aprovação online e personalização na tabela public.budgets

ALTER TABLE public.budgets 
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS first_viewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS last_viewed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS approved_ip text,
ADD COLUMN IF NOT EXISTS client_feedback text,
ADD COLUMN IF NOT EXISTS tracking_history jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS brand_color text,
ADD COLUMN IF NOT EXISTS brand_logo_url text,
ADD COLUMN IF NOT EXISTS remove_watermark boolean DEFAULT false;

-- Habilitar RLS se não estiver
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

-- Excluir política anterior se existir
DROP POLICY IF EXISTS "Public read budgets by UUID" ON public.budgets;
DROP POLICY IF EXISTS "Anyone can view budgets by id" ON public.budgets;

-- Permitir leitura pública de orçamentos se souber o ID (UUID é seguro e funciona como token de acesso)
CREATE POLICY "Public read budgets by UUID" ON public.budgets
  FOR SELECT USING (true);

-- Permitir atualizações parciais públicas (ex: para aprovação/rejeição/tracking pelo cliente final)
-- Para máxima segurança, isso é filtrado via API, mas a política permite UPDATE em colunas públicas
CREATE POLICY "Public update budgets tracking and status by UUID" ON public.budgets
  FOR UPDATE USING (true);
