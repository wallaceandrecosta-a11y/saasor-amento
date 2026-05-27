-- supabase/migrations/00006_add_company_email.sql
-- Adicionar coluna company_email na tabela public.users para corrigir o aviso de perfil incompleto

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS company_email text;
