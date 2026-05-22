import React from 'react';
import AppLayout from '@/components/AppLayout';
import UsageProgress from '@/components/billing/UsageProgress';
import { createClient } from '@/lib/supabase/server';
import { getUserSubscription, canCreateBudget } from '@/lib/permissions/limits';
import { MdCheck, MdOutlineWorkspacePremium, MdSettings, MdCreditCard } from 'react-icons/md';
import Link from 'next/link';

export default async function BillingPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <h2 className="text-xl font-bold text-white">Você precisa estar logado para ver esta página.</h2>
        </div>
      </AppLayout>
    );
  }

  const userId = session.user.id;
  const subscription = await getUserSubscription(userId);
  const limits = await canCreateBudget(userId);
  
  // Lista de planos para exibição de Upgrade
  const { data: plansData } = await supabase.from('plans').select('*').order('price');
  const safePlansData = plansData || [];
  
  // Configuração atual
  const currentPlan = subscription?.plan || safePlansData.find(p => p.price === 0);
  const usedBudgets = limits.used || 0;
  const statusLabel = subscription?.status === 'trial' ? 'Em Período de Teste (Trial)' :
                      subscription?.status === 'active' ? 'Ativa' :
                      subscription?.status === 'expired_trial' ? 'Trial Expirado' :
                      subscription?.status === 'expired' ? 'Pagamento Pendente (Bloqueado)' :
                      'Gratuito';
  const isActive = ['active', 'trial'].includes(subscription?.status);

  // Detalhes estáticos dos planos para ficar extremamente profissional e premium
  const planFeatures = {
    'Free': [
      'Até 3 orçamentos mensais',
      'Modelos básicos de propostas',
      'Download em PDF',
      'Marca d\'água ORVEN',
    ],
    'Premium': [
      'Orçamentos ilimitados',
      'Assinatura digital e aprovação online',
      'Histórico e analytics de visualização',
      'Remoção de marca d\'água',
    ],
    'Pro': [
      'Tudo do plano Premium',
      'Personalização de cores da marca',
      'Logotipo personalizado',
      'Domínio próprio (Em breve)',
    ]
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto pb-16">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Assinatura e Planos</h1>
          <p className="mt-2 text-sm text-[#8B95A7] font-medium">Gerencie seu plano, faturamento e limites de uso da plataforma em tempo real.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Status do Plano Atual (Premium Dark Card) */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#071A3D] via-[#0B1533] to-[#050816] border border-blue-900/25 text-white shadow-2xl p-8 flex flex-col justify-between group">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-primary-600/5 rounded-full blur-3xl group-hover:bg-primary-600/15 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[9px] font-extrabold tracking-widest uppercase bg-primary-500/10 text-primary-400 px-3 py-1 rounded-full border border-primary-500/30 shadow-glow">
                  {currentPlan?.name || 'Free'}
                </span>
                <span className="text-[10px] font-bold text-slate-500">ID Assinatura: {subscription?.id ? `${subscription.id.slice(0,8)}...` : 'N/A'}</span>
              </div>
              
              <h2 className="text-3xl font-extrabold tracking-tight mb-4">Plano Atual: {currentPlan?.name || 'Free'}</h2>
              
              <div className="text-[#8B95A7] text-sm mb-8 flex items-center gap-2 font-medium">
                Status da assinatura: 
                <span className={`font-bold uppercase text-[9px] tracking-wider px-2.5 py-0.5 rounded-full
                  ${isActive ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20' : 'bg-red-500/10 text-red-450 border border-red-500/20'}`}>
                  {statusLabel}
                </span>
              </div>
              
              <div className="bg-[#050816]/65 border border-blue-900/20 rounded-2xl p-5 inline-block backdrop-blur-sm">
                <span className="block text-[9px] font-extrabold text-[#8B95A7] uppercase tracking-widest mb-1.5">Valor da Assinatura</span>
                <span className="text-2xl font-black text-white">
                  {currentPlan?.price === 0 ? 'Grátis' : `R$ ${Number(currentPlan?.price || 0).toFixed(2).replace('.', ',')} / mês`}
                </span>
              </div>
            </div>

            <div className="relative z-10 mt-8 flex flex-wrap gap-4">
              {currentPlan?.price > 0 && isActive && (
                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-[#8B95A7] hover:text-white transition-all rounded-xl text-xs font-bold border border-white/10 backdrop-blur-sm cursor-pointer">
                  Cancelar Assinatura
                </button>
              )}
              {subscription?.isLocked && (
                <Link href="/checkout" className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-900 transition-all rounded-xl text-xs font-black shadow-md">
                  Regularizar Faturamento
                </Link>
              )}
            </div>
          </div>

          {/* Progresso de Uso */}
          <div className="lg:col-span-1">
            <UsageProgress limit={limits?.limit || currentPlan?.max_budgets_per_month} used={usedBudgets} />
          </div>
        </div>

        {/* Lista de Planos e Comparativo */}
        <div className="mt-16">
          <h2 className="text-xl font-extrabold text-white tracking-tight mb-8 text-center">Encontre o plano ideal para acelerar seu negócio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {safePlansData?.map(plan => {
              const isCurrent = currentPlan?.id === plan.id;
              const featuresList = planFeatures[plan.name] || [];
              const isProPlan = plan.name === 'Pro';
              const isPremiumPlan = plan.name === 'Premium';

              return (
                <div 
                  key={plan.id} 
                  className={`p-8 rounded-[24px] flex flex-col justify-between relative transition-all duration-500 shadow-2xl backdrop-blur-xl border
                    ${isCurrent ? 'bg-[#071A3D]/45 border-[#0A4DFF]/40 shadow-glow' : 'bg-[#071A3D]/25 border-blue-900/15'}
                    ${isProPlan ? 'md:-translate-y-2 border-primary-500 shadow-glow-intense bg-[#071A3D]/40' : ''}
                    ${plan.name === 'Free' ? 'opacity-85' : ''}`}
                >
                  {isProPlan && (
                    <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-primary-500 text-white text-[9px] font-extrabold uppercase rounded-full tracking-widest shadow-glow flex items-center gap-1">
                      <MdOutlineWorkspacePremium className="text-amber-400" /> Mais Recomendado
                    </span>
                  )}

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-extrabold text-white">{plan.name}</h3>
                      {isCurrent && (
                        <span className="text-[9px] font-extrabold tracking-widest uppercase bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/25">Ativo</span>
                      )}
                    </div>
                    <p className="mt-2.5 text-xs text-[#8B95A7] font-semibold leading-relaxed min-h-[48px]">{plan.description || ''}</p>
                    
                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {plan.price === 0 ? 'Grátis' : `R$ ${Number(plan.price).toFixed(2).replace('.', ',')}`}
                      </span>
                      {plan.price > 0 && <span className="text-xs font-bold text-slate-500">/mês</span>}
                    </div>

                    {/* Features List */}
                    <ul className="mt-8 space-y-3.5 border-t border-blue-900/10 pt-6">
                      {featuresList.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-semibold">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5
                            ${isProPlan ? 'bg-primary-500/20 text-primary-400' : 'bg-blue-900/20 text-slate-400'}`}>
                            <MdCheck className="text-xs" />
                          </span>
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8">
                    {isCurrent ? (
                      <span className="block w-full text-center py-3 bg-[#050816]/80 text-[#8B95A7] text-xs font-bold rounded-xl border border-blue-900/10 cursor-default">
                        Plano Ativo
                      </span>
                    ) : (
                      <Link 
                        href={`/checkout?plan=${plan.id}`}
                        className={`block w-full text-center py-3 rounded-xl text-xs font-bold shadow-sm transition-all duration-350 hover:-translate-y-0.5 hover:shadow-glow cursor-pointer
                          ${isProPlan 
                            ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-glow' 
                            : 'bg-[#071A3D]/40 hover:bg-[#071A3D]/70 text-[#8B95A7] hover:text-white border border-blue-900/30 hover:border-primary-500/25'}`}
                      >
                        Mudar Plano
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
