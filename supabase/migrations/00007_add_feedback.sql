-- supabase/migrations/00007_add_feedback.sql
-- Adicionar tabela para coleta de relatórios de bugs e sugestões de usuários

CREATE TABLE IF NOT EXISTS public.feedbacks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'bug', 'suggestion', 'help'
  description text NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'in_progress', 'resolved'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Excluir políticas anteriores se existir
DROP POLICY IF EXISTS "Users can view their own feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Users can insert their own feedbacks" ON public.feedbacks;
DROP POLICY IF EXISTS "Admins can view all feedbacks" ON public.feedbacks;

-- Política: usuários autenticados só veem seus próprios feedbacks
CREATE POLICY "Users can view their own feedbacks"
  ON public.feedbacks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: usuários autenticados podem inserir feedbacks
CREATE POLICY "Users can insert their own feedbacks"
  ON public.feedbacks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Admins do SaaS podem ler e gerenciar todos (se você criar lógica de admin futuramente)
CREATE POLICY "Admins can view all feedbacks"
  ON public.feedbacks
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'admin@orven.com.br');
