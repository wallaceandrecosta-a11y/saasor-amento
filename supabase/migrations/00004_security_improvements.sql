-- supabase/migrations/00004_security_improvements.sql

-- 1. Webhook Logs (Logs de pagamento e webhooks)
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  provider text DEFAULT 'asaas',
  payload jsonb DEFAULT '{}'::jsonb,
  status text NOT NULL,
  error_message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;
-- Apenas admin (ou ninguem publicamente)
CREATE POLICY "Nobody can view webhook logs publicly" ON public.webhook_logs FOR SELECT USING (false);

-- 2. System Logs (Logs básicos de erros e auth)
CREATE TABLE IF NOT EXISTS public.system_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  description text,
  ip_address text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Nobody can view system logs publicly" ON public.system_logs FOR SELECT USING (false);

-- 3. Soft Deletes in Budgets (Proteção contra exclusão acidental)
ALTER TABLE public.budgets ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone;

-- Modify budget policies to exclude deleted ones
DROP POLICY IF EXISTS "Users can manage their own budgets" ON public.budgets;

CREATE POLICY "Users can manage their own budgets" ON public.budgets
  FOR ALL USING (auth.uid() = user_id AND deleted_at IS NULL);

-- Modificar a politica publica para nao ler deletados
DROP POLICY IF EXISTS "Public read budgets by UUID" ON public.budgets;
CREATE POLICY "Public read budgets by UUID" ON public.budgets
  FOR SELECT USING (deleted_at IS NULL);

-- Melhorar a segurança da politica de update publica. 
-- Em vez de deixar fazer UPDATE direto, é melhor forçar a atualização por funções de banco 
-- ou via uma API onde a key anon não tem acesso de escrita total.
-- Por agora vamos manter a existente mas recomendar que os status updates sejam apenas em colunas especificas (usando trigger) 
-- ou revogar a politica publica de update e criar uma Security Definer Function.

DROP POLICY IF EXISTS "Public update budgets tracking and status by UUID" ON public.budgets;

-- Somente as permissões que deixam cliente atualizar view_count ou aprovado (apenas se for api backend com service role)
-- Com a service role o RLS é by-passed. Então podemos remover o update publico!
-- Assim "dados críticos apenas no backend" e "nenhuma chave sensivel no frontend".
