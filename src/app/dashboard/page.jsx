'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { useClientesStore, useServicosStore, useOrcamentosStore, useAuthStore } from '@/lib/store';
import { usePlan } from '@/lib/planContext';
import Link from 'next/link';
import { 
  MdPeople, MdDescription, MdAddCircle, MdTrendingUp, 
  MdArrowForward, MdCheckCircleOutline, MdOutlineHourglassEmpty, 
  MdOutlineClose, MdTimeline, MdWavingHand, MdRocketLaunch, MdStar
} from 'react-icons/md';
import UsageBanner from '@/components/UsageBanner';
import DailyTip from '@/components/DailyTip';

export default function DashboardPage() {
  const { clientes }    = useClientesStore();
  const { servicos }    = useServicosStore();
  const { orcamentos }  = useOrcamentosStore();
  const { user }        = useAuthStore();
  const { plan, used, limit, isUnlimited, isFree, isPaid, usagePercentage, isLoading: planLoading } = usePlan();

  const aprovados  = orcamentos.filter((o) => o.status === 'aprovado');
  const pendentes  = orcamentos.filter((o) => o.status === 'pendente');
  const recusados  = orcamentos.filter((o) => o.status === 'recusado');
  
  const taxaAprovacao = orcamentos.length > 0 
    ? `${((aprovados.length / orcamentos.length) * 100).toFixed(0)}%` 
    : '0%';

  const [greeting, setGreeting] = useState('Olá');

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) setGreeting('Bom dia');
    else if (hora >= 12 && hora < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  const recentes = orcamentos.slice(0, 5);

  // Mensagem de uso do plano para o card de assinatura
  const usageBarWidth = isUnlimited ? '100%' : `${usagePercentage}%`;
  const usageBarColor = isUnlimited
    ? 'bg-primary-500'
    : usagePercentage >= 100 ? 'bg-gradient-to-r from-red-600 to-rose-500'
    : usagePercentage >= 66 ? 'bg-gradient-to-r from-amber-500 to-orange-400'
    : 'bg-primary-500';

  const planBadgeStyle = isFree
    ? 'bg-slate-500/10 border-slate-500/25 text-slate-400'
    : plan.name === 'Pro'
    ? 'bg-amber-500/10 border-amber-500/25 text-amber-400'
    : 'bg-primary-500/10 border-primary-500/25 text-primary-400';

  return (
    <AppLayout>
      <div className="space-y-8 pb-16">

        {/* Usage Banner (só para Free) */}
        <UsageBanner />
        
        {/* Top Banner */}
        <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-r from-[#071A3D] via-[#0B1533] to-[#050816] border border-blue-900/25 shadow-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-fade-in group">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none overflow-hidden select-none">
            <svg className="w-full h-full object-cover" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 220 L250 -20 M120 220 L320 -20 M190 220 L390 -20" stroke="url(#line-grad)" strokeWidth="1" />
              <circle cx="350" cy="90" r="45" stroke="#0A4DFF" strokeWidth="0.75" strokeDasharray="4 6" />
              <circle cx="350" cy="90" r="85" stroke="#0A4DFF" strokeWidth="0.5" strokeOpacity="0.25" />
              <defs>
                <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#050816" stopOpacity="0" />
                  <stop offset="50%" stopColor="#0A4DFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0A4DFF" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="relative z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                {greeting}! <MdWavingHand className="text-amber-400 text-3xl animate-bounce" />
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-primary-500/10 border border-primary-500/30 text-primary-400 tracking-widest shadow-glow">
                Telemetria Online
              </span>
              <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 flex items-center gap-1.5 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                ⚡ Economia de Tempo: +3.8h salvas esta semana com a ORVEN
              </div>
            </div>
            <p className="text-[#8B95A7] font-medium text-sm max-w-xl leading-relaxed">
              Bem-vindo ao centro de operações da ORVEN. Aqui está a telemetria e o andamento geral das suas propostas comerciais hoje.
            </p>
          </div>

          <div className="relative z-10 shrink-0">
            <Link href="/orcamentos/novo" className="btn-primary flex items-center gap-2 shadow-glow">
              <MdAddCircle className="text-xl" />
              Novo Orçamento
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Corporate CTA Card */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-[24px] bg-[#071A3D]/30 border border-blue-900/20 backdrop-blur-xl shadow-2xl p-8 flex flex-col justify-between group hover:border-primary-500/35 hover:shadow-glow transition-all duration-500">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl group-hover:bg-primary-600/10 transition-all duration-500"></div>
            
            <div className="space-y-3">
              <span className="text-[10px] font-extrabold text-[#8B95A7] uppercase tracking-widest">Acelere Vendas</span>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Criar Proposta Comercial</h2>
              <p className="text-[#8B95A7] max-w-md text-sm font-medium leading-relaxed">Gere propostas altamente profissionais em segundos e envie o link online para que seu cliente responda de forma rápida.</p>
            </div>
            
            <div className="mt-8">
              <Link href="/orcamentos/novo" className="inline-flex items-center gap-2 px-5 py-3 bg-[#0A4DFF]/15 border border-primary-500/30 hover:bg-[#0A4DFF] hover:text-white text-primary-400 font-bold rounded-xl shadow-sm transition-all duration-300">
                <MdAddCircle className="text-lg" />
                Começar agora
              </Link>
            </div>
          </div>

          {/* Plan Usage Card — dados reais */}
          <div className="card p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-extrabold text-[#8B95A7] uppercase tracking-widest">Assinatura Ativa</h3>
                <span className={`px-3 py-0.5 border text-[10px] font-bold rounded-full uppercase tracking-wider ${planBadgeStyle}`}>
                  {planLoading ? '...' : plan.name}
                </span>
              </div>

              {isUnlimited ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-4">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Uso Ilimitado Ativo
                </div>
              ) : (
                <>
                  <p className="text-xs text-[#8B95A7] font-semibold mb-2">Orçamentos gerados este mês</p>
                  <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-black text-white">{planLoading ? '—' : used}</span>
                    <span className="text-sm font-bold text-slate-500 mb-1">/ {limit}</span>
                  </div>
                  <div className="w-full bg-[#050816] h-2 rounded-full overflow-hidden border border-blue-900/10">
                    <div className={`${usageBarColor} h-full rounded-full shadow-glow transition-all duration-700`} style={{ width: usageBarWidth }} />
                  </div>
                  {/* Mensagem estratégica */}
                  {!planLoading && isFree && (
                    <p className="text-[10px] text-slate-500 mt-2 leading-snug">
                      {limit - used === 1 && '⚠️ Último orçamento disponível!'}
                      {limit - used === 0 && '🔒 Limite atingido. Faça upgrade para continuar.'}
                      {limit - used > 1 && `${limit - used} orçamentos restantes este mês.`}
                    </p>
                  )}
                </>
              )}

              {/* Dica diária preview no card (só para Premium/Pro) */}
              {isPaid && !planLoading && (
                <div className="mt-4 pt-4 border-t border-blue-900/10">
                  <p className="text-[10px] text-emerald-400 font-bold flex items-center gap-1.5">
                    <MdStar className="text-xs" /> Plano ativo — dica do dia disponível abaixo
                  </p>
                </div>
              )}
            </div>

            {isFree ? (
              <Link href="/pricing" className="mt-8 w-full text-center px-4 py-3 bg-primary-500/10 border border-primary-500/25 text-primary-400 hover:bg-primary-500 hover:text-white text-xs font-bold rounded-xl hover:shadow-glow transition-all duration-300 flex items-center justify-center gap-2">
                <MdRocketLaunch className="text-sm" />
                Ver planos — a partir de R$11,90
              </Link>
            ) : (
              <Link href="/settings/billing" className="mt-8 w-full text-center px-4 py-3 bg-[#071A3D]/40 border border-blue-900/25 text-[#8B95A7] hover:text-white text-xs font-bold rounded-xl hover:bg-[#071A3D]/70 hover:border-primary-500/20 transition-all duration-300">
                Gerenciar Assinatura
              </Link>
            )}
          </div>
        </div>

        {/* Daily Tip (Premium/Pro) + Stats side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <DailyTip />
          </div>

          {/* Mini Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="card p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20 flex items-center justify-center text-2xl shrink-0"><MdDescription /></div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-extrabold text-[#8B95A7] uppercase tracking-widest">Propostas Geradas</p>
                <p className="text-xl font-bold text-white">{orcamentos.length}</p>
              </div>
            </div>
            
            <div className="card p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-2xl shrink-0"><MdTimeline /></div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-extrabold text-[#8B95A7] uppercase tracking-widest">Taxa de Aprovação</p>
                <p className="text-xl font-bold text-white">{taxaAprovacao}</p>
              </div>
            </div>
            
            <div className="card p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center text-2xl shrink-0"><MdOutlineHourglassEmpty /></div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-extrabold text-[#8B95A7] uppercase tracking-widest">Propostas Abertas</p>
                <p className="text-xl font-bold text-white">{pendentes.length}</p>
              </div>
            </div>

            <div className="card p-6 flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center text-2xl shrink-0"><MdOutlineClose /></div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-extrabold text-[#8B95A7] uppercase tracking-widest">Propostas Recusadas</p>
                <p className="text-xl font-bold text-white">{recusados.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Budgets Table */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-blue-900/15 bg-[#071A3D]/25 backdrop-blur-md">
            <h2 className="text-xs font-extrabold text-white uppercase tracking-widest">Últimos Orçamentos</h2>
            <Link href="/orcamentos" className="text-sm font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
              Ver todos <MdArrowForward />
            </Link>
          </div>
          
          {recentes.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-[#050816] border border-blue-900/20 rounded-full flex items-center justify-center text-[#8B95A7] mb-4 shadow-inner">
                <MdDescription className="text-3xl" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Nenhum orçamento ainda</h3>
              <p className="text-xs text-[#8B95A7] mb-6 max-w-xs leading-relaxed">Você ainda não gerou nenhum orçamento. Comece agora mesmo e envie para seus clientes.</p>
              <Link href="/orcamentos/novo" className="btn-primary">Criar meu primeiro orçamento</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-blue-900/15 bg-[#050816]/40">
                    <th className="px-6 py-4 text-xs font-extrabold text-[#8B95A7] uppercase tracking-widest">Cliente</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-[#8B95A7] uppercase tracking-widest">Valor</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-[#8B95A7] uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-[#8B95A7] uppercase tracking-widest">Data</th>
                    <th className="px-6 py-4 text-xs font-extrabold text-[#8B95A7] uppercase tracking-widest text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/10">
                  {recentes.map((o) => (
                    <tr key={o.id} className="hover:bg-[#071A3D]/25 transition-all duration-300 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold shrink-0">
                            {o.clienteNome ? o.clienteNome.charAt(0).toUpperCase() : 'C'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">{o.clienteNome || 'Cliente'}</p>
                            <p className="text-[10px] text-[#8B95A7] font-medium">#{o.numero}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-white">
                        R$ {Number(o.total || 0).toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-extrabold tracking-widest uppercase border
                          ${o.status === 'aprovado' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                            o.status === 'pendente' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                            o.status === 'recusado' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-[#050816] border-blue-900/30 text-[#8B95A7]'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-[#8B95A7]">
                        {new Date(o.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/orcamentos/${o.id}`} className="inline-flex items-center justify-center px-4 py-2 bg-[#071A3D]/40 border border-blue-900/25 text-[#8B95A7] hover:text-white hover:border-primary-500/25 text-xs font-bold rounded-xl transition-all shadow-sm">
                          Abrir
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
