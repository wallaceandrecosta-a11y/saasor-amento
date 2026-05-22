// src/app/page.js — Landing page pública (sem login obrigatório)
'use client';
import { useState } from 'react';
import Link from 'next/link';
import AuthModal from '@/components/AuthModal';
import { MdCheckCircle, MdStar, MdRocketLaunch, MdAutoAwesome, MdDescription, MdPeople, MdBuild, MdArrowForward, MdShare, MdPictureAsPdf } from 'react-icons/md';
import { FiLayout } from 'react-icons/fi';

// Exemplos de orçamentos mockados para demo
const DEMO_BUDGETS = [
  { id: 1, numero: 'ORV-2001', cliente: 'Studio Rebeka', servico: 'Gestão de Redes Sociais', valor: 'R$ 1.500,00', status: 'aprovado', template: 'tech' },
  { id: 2, numero: 'ORV-2002', cliente: 'Dr. Carvalho Clínica', servico: 'Sessão de Fisioterapia × 12', valor: 'R$ 1.440,00', status: 'pendente', template: 'health' },
  { id: 3, numero: 'ORV-2003', cliente: 'Construtora Lima', servico: 'Instalação Elétrica Predial', valor: 'R$ 8.200,00', status: 'aprovado', template: 'engineering' },
];

const FEATURES = [
  { icon: <MdDescription className="text-primary-400 text-2xl" />, title: 'Orçamentos profissionais', desc: 'Gere propostas com design premium em segundos. Templates por nicho prontos para usar.' },
  { icon: <MdPictureAsPdf className="text-emerald-400 text-2xl" />, title: 'PDF com 1 clique', desc: 'Gere e envie PDFs de alta qualidade diretamente do navegador. Sem instalar nada.' },
  { icon: <MdShare className="text-amber-400 text-2xl" />, title: 'Link de proposta online', desc: 'Compartilhe um link único com seu cliente para ele visualizar e aprovar digitalmente.' },
  { icon: <FiLayout className="text-purple-400 text-2xl" />, title: 'Templates por nicho', desc: 'Beleza, Saúde, Tech, Advocacia, Engenharia — cada template certo para sua área.' },
];

const PLANS = [
  {
    name: 'Free', price: 'R$ 0', period: '',
    desc: 'Para você conhecer e sentir o valor.',
    features: ['3 orçamentos por mês', 'Templates básicos', 'PDF gerador'],
    cta: 'Começar grátis', isPopular: false,
  },
  {
    name: 'Premium', price: 'R$ 11,90', period: '/mês',
    desc: 'O valor se paga no primeiro cliente fechado.',
    features: ['Orçamentos ilimitados', 'Sem marca d\'água', 'Templates premium', 'Logo personalizado', 'Dicas de negócios diárias'],
    cta: 'Assinar Premium', isPopular: true,
    tagline: 'Menos que um café por dia.',
  },
  {
    name: 'Pro', price: 'R$ 19,90', period: '/mês',
    desc: 'Para quem quer elevar o nível profissional.',
    features: ['Tudo do Premium', 'Templates exclusivos', 'Personalização avançada', 'Prioridade em novos recursos'],
    cta: 'Assinar Pro', isPopular: false,
    badge: 'PRO',
  },
];

export default function LandingPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  const openAuth = (message) => {
    setAuthMessage(message || 'Torne seus orçamentos mais profissionais em segundos.');
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundImage: 'radial-gradient(circle at 50% -20%, #0c1a40 0%, #050816 70%)' }}>
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} message={authMessage} />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#050816]/80 backdrop-blur-xl border-b border-blue-900/15">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#071A3D]/60 border border-blue-900/25 rounded-lg flex items-center justify-center p-1.5">
            <img src="/icon.svg" alt="ORVEN" className="w-full h-full object-contain" />
          </div>
          <span className="text-sm font-black text-white uppercase tracking-widest">ORVEN</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuth()}
            className="text-xs font-bold text-slate-400 hover:text-white transition-colors px-4 py-2"
          >
            Entrar
          </button>
          <button
            onClick={() => openAuth('Crie sua conta grátis e comece a gerar orçamentos profissionais agora.')}
            className="btn-primary text-xs py-2.5 px-5 shadow-glow"
          >
            Começar grátis
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/25 rounded-full text-[10px] font-extrabold text-primary-400 uppercase tracking-widest mb-8 animate-fade-in">
            <MdAutoAwesome className="text-xs" />
            Orçamentos profissionais para freelancers e autônomos
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 animate-fade-in">
            Gere orçamentos
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
              profissionais em segundos.
            </span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Pare de perder tempo com planilhas e documentos sem visual. Com a ORVEN, você cria propostas
            que impressionam clientes e fecha mais negócios.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => openAuth('Crie sua conta grátis. Nenhum cartão de crédito necessário.')}
              className="btn-primary text-base py-4 px-8 shadow-glow-intense"
            >
              <MdRocketLaunch className="text-lg" />
              Começar grátis agora
            </button>
            <Link href="#demo" className="text-sm font-bold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
              Ver demonstração <MdArrowForward />
            </Link>
          </div>

          {/* Social proof */}
          <p className="text-xs text-slate-600">
            ✓ Grátis para sempre no plano básico &nbsp;·&nbsp; ✓ Sem cartão de crédito &nbsp;·&nbsp; ✓ Configuração em 30 segundos
          </p>
        </div>
      </section>

      {/* ── DEMO PREVIEW ── */}
      <section id="demo" className="px-6 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-white mb-3">Veja como funciona</h2>
          <p className="text-sm text-slate-500">Orçamentos reais que nossos usuários geram todos os dias</p>
        </div>

        {/* Mock Dashboard Preview */}
        <div className="bg-[#071A3D]/30 backdrop-blur-xl border border-blue-900/20 rounded-[24px] p-6 shadow-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest">ORVEN Dashboard</p>
              <h3 className="text-sm font-extrabold text-white">Últimos Orçamentos</h3>
            </div>
            <button
              onClick={() => openAuth()}
              className="text-xs font-bold text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors"
            >
              Criar orçamento <MdArrowForward />
            </button>
          </div>

          <div className="space-y-3">
            {DEMO_BUDGETS.map((budget) => (
              <div key={budget.id} className="flex items-center justify-between p-4 bg-[#050816]/50 border border-blue-900/15 rounded-xl hover:border-primary-500/20 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-bold">
                    {budget.cliente[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{budget.cliente}</p>
                    <p className="text-[10px] text-slate-500">{budget.servico}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-white">{budget.valor}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider border ${
                    budget.status === 'aprovado'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {budget.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Blur overlay com CTA para ver mais */}
          <div className="relative mt-4">
            <div className="h-16 bg-gradient-to-t from-[#050816]/90 to-transparent rounded-b-xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => openAuth()}
                className="btn-primary text-xs py-2 px-5 shadow-glow"
              >
                Criar sua conta grátis para ver tudo
              </button>
            </div>
          </div>
        </div>

        {/* Feature cards interativas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feat, i) => (
            <button
              key={i}
              onClick={() => openAuth(`${feat.title} — faça login para usar esta funcionalidade.`)}
              className="card p-5 text-left hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <div className="mb-3">{feat.icon}</div>
              <h3 className="text-sm font-extrabold text-white mb-1.5">{feat.title}</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">{feat.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-white mb-3">Planos simples e honestos</h2>
          <p className="text-sm text-slate-400">Comece grátis. Faça upgrade quando precisar de mais.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[20px] border p-6 flex flex-col transition-all duration-500 ${
                plan.isPopular
                  ? 'bg-primary-500/10 border-primary-500/50 shadow-glow md:scale-[1.04] md:z-10'
                  : 'bg-[#071A3D]/30 backdrop-blur-xl border-blue-900/20'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary-500 text-white rounded-full text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1 shadow-glow">
                  <MdStar className="text-xs" /> MAIS POPULAR
                </div>
              )}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded-full text-[10px] font-extrabold uppercase tracking-widest">
                  {plan.badge}
                </div>
              )}

              <h3 className="text-base font-extrabold text-white mb-1">{plan.name}</h3>
              {plan.tagline && <p className="text-[11px] text-primary-400 font-semibold italic mb-1">{plan.tagline}</p>}
              <p className="text-[11px] text-slate-500 mb-4 leading-snug">{plan.desc}</p>

              <div className="mb-5">
                <span className="text-3xl font-black text-white">{plan.price}</span>
                {plan.period && <span className="text-sm text-slate-500">{plan.period}</span>}
              </div>

              <button
                onClick={() => openAuth(`Assine o plano ${plan.name} e comece a criar orçamentos profissionais agora.`)}
                className={`w-full py-3 text-sm font-bold rounded-xl transition-all duration-300 mb-5 ${
                  plan.isPopular
                    ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-glow hover:-translate-y-0.5'
                    : 'bg-[#071A3D]/60 border border-blue-900/25 text-slate-300 hover:text-white hover:border-primary-500/30'
                }`}
              >
                {plan.cta}
              </button>

              <ul className="space-y-2 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-400">
                    <MdCheckCircle className="text-emerald-400 shrink-0 text-base" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-blue-900/10 py-10 px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-7 h-7 bg-[#071A3D]/60 border border-blue-900/25 rounded-lg flex items-center justify-center p-1.5">
            <img src="/icon.svg" alt="ORVEN" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-black text-white uppercase tracking-widest">ORVEN</span>
        </div>
        <p className="text-xs text-slate-600 mb-3">Sistema de orçamentos profissionais para freelancers e autônomos.</p>
        <div className="flex items-center justify-center gap-6">
          <button onClick={() => openAuth()} className="text-xs text-slate-500 hover:text-white transition-colors">Entrar</button>
          <Link href="/pricing" className="text-xs text-slate-500 hover:text-white transition-colors">Planos</Link>
          <button onClick={() => openAuth()} className="text-xs text-slate-500 hover:text-white transition-colors">Criar conta</button>
        </div>
        <p className="text-[10px] text-slate-700 mt-6">© 2025 ORVEN — Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
