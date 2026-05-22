import { createClient } from '../supabase/server';

/**
 * Retorna a assinatura ativa do usuário, incluindo as informações do plano.
 */
export async function getUserSubscription(userId) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:plans (*)
    `)
    .eq('user_id', userId)
    .in('status', ['active', 'trial'])
    .single();

  if (error || !data) {
    return null;
  }

  const now = new Date();

  // Verifica se o trial expirou
  if (data.status === 'trial' && data.trial_ends_at) {
    if (new Date(data.trial_ends_at) < now) {
      // Trial acabou e não assinou
      return { ...data, status: 'expired_trial', isLocked: true };
    }
  }

  // Verifica se a assinatura paga expirou
  if (data.status === 'active' && data.expires_at) {
    if (new Date(data.expires_at) < now) {
      // Passou do vencimento e não renovou (Asaas não enviou webhook de pagamento confirmado a tempo)
      return { ...data, status: 'expired', isLocked: true };
    }
  }

  return { ...data, isLocked: false };
}

/**
 * Verifica se o usuário pode criar um orçamento com base no seu plano atual.
 */
export async function canCreateBudget(userId) {
  const supabase = createClient();
  const subscription = await getUserSubscription(userId);

  // Se não tiver assinatura ativa ou se estiver bloqueada
  if (!subscription || subscription.isLocked) {
    // Retorno fallback para simular o plano "Free" com 3 orçamentos
    // caso a pessoa tenha perdido o Premium
    const fallbackPlan = { max_budgets_per_month: 3 };
    
    // Verificamos o uso no fallback (plano free virtual)
    const { totalUsed, error } = await getUsageInCurrentMonth(supabase, userId);
    if (error) return { allowed: false, reason: 'error_checking_usage' };

    if (totalUsed >= fallbackPlan.max_budgets_per_month) {
      return {
        allowed: false,
        reason: subscription?.isLocked ? 'subscription_locked' : 'limit_reached_free',
        limit: fallbackPlan.max_budgets_per_month,
        used: totalUsed
      };
    }

    return { allowed: true, limit: fallbackPlan.max_budgets_per_month, used: totalUsed };
  }

  const { plan } = subscription;

  // Plano ilimitado
  if (plan.max_budgets_per_month === null) {
    return { allowed: true };
  }

  const { totalUsed, error } = await getUsageInCurrentMonth(supabase, userId);

  if (error) {
    console.error('Error fetching usage logs', error);
    return { allowed: false, reason: 'error_checking_usage' };
  }

  if (totalUsed >= plan.max_budgets_per_month) {
    return { 
      allowed: false, 
      reason: 'limit_reached',
      limit: plan.max_budgets_per_month,
      used: totalUsed
    };
  }

  return { allowed: true, limit: plan.max_budgets_per_month, used: totalUsed };
}

/**
 * Verifica se o usuário tem acesso a uma funcionalidade específica (baseado no JSONB 'features' do plano)
 */
export async function canAccessFeature(userId, featureName) {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return false;
  }

  const { plan } = subscription;
  const features = plan.features || [];

  return features.includes(featureName);
}

/**
 * Registra o consumo de um recurso no mês atual.
 */
export async function logUsage(userId, resourceType, amount = 1) {
  const supabase = createClient();
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59).toISOString();

  const { error } = await supabase
    .from('usage_logs')
    .insert({
      user_id: userId,
      resource_type: resourceType,
      amount,
      billing_cycle_start: startOfMonth,
      billing_cycle_end: endOfMonth
    });

  if (error) {
    console.error('Failed to log usage:', error);
  }
}

// Helper para reuso de consulta de uso
async function getUsageInCurrentMonth(supabase, userId) {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59).toISOString();

  const { data: usageLogs, error } = await supabase
    .from('usage_logs')
    .select('amount')
    .eq('user_id', userId)
    .eq('resource_type', 'budget_creation')
    .gte('created_at', startOfMonth)
    .lte('created_at', endOfMonth);

  if (error) return { error };
  
  const totalUsed = usageLogs.reduce((acc, log) => acc + log.amount, 0);
  return { totalUsed };
}
