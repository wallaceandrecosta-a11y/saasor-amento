-- Migração de banco de dados para SaaS (Supabase)

-- 1. Criação da tabela 'users' (Estendendo auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view their own profile." ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile." ON public.users
  FOR UPDATE USING (auth.uid() = id);


-- 2. Criação da tabela 'plans'
CREATE TABLE IF NOT EXISTS public.plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  features jsonb DEFAULT '{}'::jsonb NOT NULL,
  max_budgets_per_month integer, -- null significa ilimitado
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Popular planos iniciais
INSERT INTO public.plans (name, description, price, max_budgets_per_month, features)
VALUES 
  ('Free', 'Plano básico para iniciar', 0, 3, '["create_budget"]'::jsonb),
  ('Premium', 'Orçamentos ilimitados', 49.90, null, '["create_budget", "remove_watermark"]'::jsonb),
  ('Pro', 'Tudo do Premium + personalização', 99.90, null, '["create_budget", "remove_watermark", "custom_branding"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Habilitar RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Todos podem ver os planos disponíveis
CREATE POLICY "Anyone can view plans" ON public.plans
  FOR SELECT USING (true);


-- 3. Criação da tabela 'subscriptions'
CREATE TYPE subscription_status AS ENUM ('active', 'pending', 'expired', 'cancelled', 'trial');

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES public.plans(id) NOT NULL,
  status subscription_status DEFAULT 'active' NOT NULL,
  starts_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  expires_at timestamp with time zone,
  trial_ends_at timestamp with time zone,
  payment_provider text,
  external_subscription_id text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);


-- 4. Criação da tabela 'budgets'
CREATE TABLE IF NOT EXISTS public.budgets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  client_id text, -- Alterar dependendo da estrutura de clientes
  number text NOT NULL,
  total_amount numeric(10,2) DEFAULT 0,
  status text DEFAULT 'draft',
  data jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own budgets" ON public.budgets
  FOR ALL USING (auth.uid() = user_id);


-- 5. Criação da tabela 'usage_logs'
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  resource_type text NOT NULL, -- Ex: 'budget_creation'
  amount integer DEFAULT 1 NOT NULL,
  billing_cycle_start timestamp with time zone NOT NULL,
  billing_cycle_end timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their usage" ON public.usage_logs
  FOR SELECT USING (auth.uid() = user_id);


-- Triggers para created_at/updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Trigger para criar perfil de usuário automaticamente ao se registrar no Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Atribuir plano Free automaticamente
  INSERT INTO public.subscriptions (user_id, plan_id, status)
  VALUES (
    new.id,
    (SELECT id FROM public.plans WHERE name = 'Free' LIMIT 1),
    'active'
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
