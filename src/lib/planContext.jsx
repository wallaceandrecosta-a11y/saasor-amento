'use client';
// src/lib/planContext.jsx
// Context global do plano do usuário — consulta Supabase e expõe dados de plano para toda a app

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from './supabase/client';
import { useAuthStore } from './store';

const PlanContext = createContext(null);

/**
 * Estrutura padrão de plano Free (fallback quando não há assinatura no banco)
 */
const FREE_PLAN_FALLBACK = {
  id: 'free',
  name: 'Free',
  price: 0,
  max_budgets_per_month: 3,
  features: ['create_budget'],
};

export function PlanProvider({ children }) {
  const { user } = useAuthStore();
  const [plan, setPlan] = useState(FREE_PLAN_FALLBACK);
  const [used, setUsed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  const fetchPlanData = useCallback(async () => {
    if (!user?.id) {
      setPlan(FREE_PLAN_FALLBACK);
      setUsed(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const supabase = createClient();

      // 1. Busca assinatura ativa + dados do plano
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*, plan:plans(*)')
        .eq('user_id', user.id)
        .in('status', ['active', 'trial'])
        .single();

      if (sub?.plan) {
        setSubscription(sub);
        setPlan(sub.plan);
      } else {
        setSubscription(null);
        setPlan(FREE_PLAN_FALLBACK);
      }

      // 2. Busca uso no mês atual
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59).toISOString();

      const { data: usageLogs } = await supabase
        .from('usage_logs')
        .select('amount')
        .eq('user_id', user.id)
        .eq('resource_type', 'budget_creation')
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth);

      const totalUsed = (usageLogs || []).reduce((acc, log) => acc + log.amount, 0);
      setUsed(totalUsed);
    } catch (err) {
      console.error('Erro ao carregar plano:', err);
      setPlan(FREE_PLAN_FALLBACK);
      setUsed(0);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPlanData();
  }, [fetchPlanData]);

  // Dados computados expostos para os componentes
  const limit = plan.max_budgets_per_month; // null = ilimitado
  const isUnlimited = limit === null;
  const canCreate = isUnlimited || used < limit;
  const isFree = plan.price === 0 || plan.name === 'Free';
  const isPremium = plan.name === 'Premium';
  const isPro = plan.name === 'Pro';
  const isPaid = isPremium || isPro;

  // Porcentagem de uso (0-100)
  const usagePercentage = isUnlimited ? 0 : Math.min(Math.round((used / limit) * 100), 100);

  // Mensagem estratégica baseada no uso
  const getUsageMessage = () => {
    if (isUnlimited) return null;
    const remaining = limit - used;
    if (used === 0) return `Você tem ${limit} orçamentos gratuitos disponíveis este mês.`;
    if (remaining > 1) return `${used} de ${limit} orçamentos utilizados este mês.`;
    if (remaining === 1) return `Último orçamento disponível! Desbloqueie recursos premium.`;
    return `Limite gratuito atingido. Continue criando sem limites.`;
  };

  // Verifica acesso a feature específica
  const hasFeature = (featureName) => {
    const features = plan.features || [];
    return Array.isArray(features) ? features.includes(featureName) : false;
  };

  const value = {
    plan,
    subscription,
    used,
    limit,
    isUnlimited,
    canCreate,
    isFree,
    isPremium,
    isPro,
    isPaid,
    usagePercentage,
    isLoading,
    getUsageMessage,
    hasFeature,
    refetch: fetchPlanData,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan() {
  const ctx = useContext(PlanContext);
  if (!ctx) {
    // Retorna fallback seguro se usado fora do Provider
    return {
      plan: FREE_PLAN_FALLBACK,
      subscription: null,
      used: 0,
      limit: 3,
      isUnlimited: false,
      canCreate: true,
      isFree: true,
      isPremium: false,
      isPro: false,
      isPaid: false,
      usagePercentage: 0,
      isLoading: false,
      getUsageMessage: () => null,
      hasFeature: () => false,
      refetch: () => {},
    };
  }
  return ctx;
}
