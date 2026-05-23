-- Migration 00005: Production Ready & Discount Logic

-- 1. Create table for tracking 50% discount usage per CPF
CREATE TABLE IF NOT EXISTS public.discount_usage (
  cpf_cnpj text PRIMARY KEY,
  used_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create webhook_logs table (referenced in API but missing)
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type text NOT NULL,
  payload jsonb,
  status text DEFAULT 'received',
  error_message text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create system_logs table (referenced in API but missing)
CREATE TABLE IF NOT EXISTS public.system_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  action text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Sync Plan Prices to official values
UPDATE public.plans 
SET price = 11.90 
WHERE name = 'Premium';

UPDATE public.plans 
SET price = 19.90 
WHERE name = 'Pro';
