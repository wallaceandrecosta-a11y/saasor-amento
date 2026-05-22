'use client';
// src/components/UpgradeGate.jsx
// Modal/overlay de bloqueio quando o usuário Free atinge o limite ou tenta usar feature paga

import { MdClose, MdCheckCircle, MdLock, MdRocketLaunch, MdStar } from 'react-icons/md';
import Link from 'next/link';

const PLANS_COMPARISON = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0',
    period: '',
    badge: null,
    badgeColor: null,
    features: [
      { text: 'Até 3 orçamentos por mês', included: true },
      { text: 'Templates básicos', included: true },
      { text: 'Marca d\'água discreta', included: true },
      { text: 'Orçamentos ilimitados', included: false },
      { text: 'Sem marca d\'água', included: false },
      { text: 'Templates premium', included: false },
      { text: 'Logo personalizado', included: false },
    ],
    cta: 'Seu plano atual',
    ctaDisabled: true,
    highlight: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 11,90',
    period: '/mês',
    badge: 'MAIS POPULAR',
    badgeColor: 'bg-primary-500 text-white',
    tagline: 'Menos que um café por dia.',
    features: [
      { text: 'Orçamentos ilimitados', included: true },
      { text: 'Sem marca d\'água', included: true },
      { text: 'Templates premium', included: true },
      { text: 'Logo personalizado', included: true },
      { text: 'Histórico completo', included: true },
      { text: 'Dicas diárias de negócios', included: true },
      { text: 'Templates exclusivos PRO', included: false },
    ],
    cta: 'Assinar Premium',
    ctaLink: '/checkout?plan=premium',
    highlight: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 19,90',
    period: '/mês',
    badge: 'PRO',
    badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
    tagline: 'Para quem quer elevar o nível profissional.',
    features: [
      { text: 'Tudo do Premium', included: true },
      { text: 'Templates exclusivos', included: true },
      { text: 'Personalização avançada', included: true },
      { text: 'Prioridade em novos recursos', included: true },
      { text: 'Organização avançada', included: true },
      { text: 'Dicas e estratégias PRO', included: true },
      { text: 'Experiência diferenciada', included: true },
    ],
    cta: 'Assinar Pro',
    ctaLink: '/checkout?plan=pro',
    highlight: false,
  },
];

export default function UpgradeGate({ isOpen, onClose, reason = 'limit_reached' }) {
  if (!isOpen) return null;

  const messages = {
    limit_reached: {
      title: 'Seu limite gratuito foi atingido.',
      subtitle: 'Você usou todos os seus 3 orçamentos gratuitos deste mês. Faça upgrade para continuar criando sem limites.',
    },
    watermark: {
      title: 'Remova a marca d\'água.',
      subtitle: 'Esta funcionalidade está disponível nos planos pagos. O custo se paga no primeiro cliente fechado.',
    },
    premium_template: {
      title: 'Template Premium.',
      subtitle: 'Templates premium estão disponíveis a partir do plano Premium. Cause mais impacto visual nos seus clientes.',
    },
    custom_logo: {
      title: 'Logo personalizado.',
      subtitle: 'Adicione seu logo aos orçamentos com o plano Premium. Mais profissionalismo para seus clientes.',
    },
  };

  const { title, subtitle } = messages[reason] || messages.limit_reached;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 8, 22, 0.92)', backdropFilter: 'blur(16px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-4xl bg-[#071A3D]/50 backdrop-blur-2xl border border-blue-900/25 rounded-[28px] shadow-[0_40px_100px_rgba(0,0,0,0.7)] animate-slide-up overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-primary-500/8 rounded-full blur-3xl pointer-events-none" />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
        >
          <MdClose className="text-lg" />
        </button>

        {/* Header */}
        <div className="relative text-center px-8 pt-10 pb-8 border-b border-blue-900/15">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MdRocketLaunch className="text-amber-400 text-2xl" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">{title}</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {/* Plans Grid */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS_COMPARISON.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col border transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-primary-500/10 border-primary-500/50 shadow-glow'
                    : 'bg-[#050816]/60 border-blue-900/20'
                }`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap ${plan.badgeColor}`}>
                    {plan.badge === 'MAIS POPULAR' && <MdStar className="inline mr-1 text-xs" />}
                    {plan.badge}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-base font-extrabold text-white tracking-tight">{plan.name}</h3>
                  {plan.tagline && (
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight italic">{plan.tagline}</p>
                  )}
                </div>

                <div className="mb-5">
                  <span className="text-3xl font-black text-white">{plan.price}</span>
                  <span className="text-sm text-slate-500 font-medium">{plan.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs">
                      {feat.included ? (
                        <MdCheckCircle className="text-emerald-400 shrink-0 text-base" />
                      ) : (
                        <MdLock className="text-slate-600 shrink-0 text-base" />
                      )}
                      <span className={feat.included ? 'text-slate-300' : 'text-slate-600 line-through'}>{feat.text}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {plan.ctaDisabled ? (
                  <div className="w-full text-center py-2.5 px-4 bg-[#050816]/60 border border-blue-900/20 text-slate-600 text-xs font-bold rounded-xl">
                    {plan.cta}
                  </div>
                ) : (
                  <Link
                    href={plan.ctaLink}
                    onClick={onClose}
                    className={`w-full text-center py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 ${
                      plan.highlight
                        ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-glow hover:shadow-glow-intense hover:-translate-y-0.5'
                        : 'bg-[#071A3D]/60 border border-blue-900/25 text-slate-300 hover:text-white hover:border-primary-500/30'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Footer social proof */}
          <p className="text-center text-[11px] text-slate-600 mt-6 leading-relaxed">
            💳 Sem cartão de crédito obrigatório · Cancele quando quiser · O valor se paga no primeiro cliente fechado
          </p>
        </div>
      </div>
    </div>
  );
}
