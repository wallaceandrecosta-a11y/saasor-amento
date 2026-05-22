'use client';
// src/app/pricing/page.jsx — Preços corretos + mensagens estratégicas de conversão

import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { MdCheckCircle, MdLock, MdStar, MdRocketLaunch } from 'react-icons/md';
import UsageBanner from '@/components/UsageBanner';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 'R$ 0',
    period: '',
    badge: null,
    tagline: 'Para você conhecer e sentir o valor da plataforma.',
    features: [
      { text: 'Até 3 orçamentos por mês', included: true },
      { text: 'Templates básicos', included: true },
      { text: 'Gerador de PDF', included: true },
      { text: 'Marca d\'água discreta', included: true },
      { text: 'Orçamentos ilimitados', included: false },
      { text: 'Sem marca d\'água', included: false },
      { text: 'Templates premium', included: false },
      { text: 'Logo personalizado', included: false },
      { text: 'Dicas diárias de negócios', included: false },
    ],
    cta: 'Plano Atual',
    ctaDisabled: true,
    isPopular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 11,90',
    period: '/mês',
    badge: 'MAIS POPULAR',
    tagline: 'O valor se paga no primeiro cliente fechado.',
    strategicMessages: [
      'Menos que um café por dia.',
      'Economize tempo e pareça mais profissional.',
      'Mais organização por um valor acessível.',
    ],
    features: [
      { text: 'Orçamentos ilimitados', included: true },
      { text: 'Sem marca d\'água', included: true },
      { text: 'Templates premium', included: true },
      { text: 'Logo personalizado', included: true },
      { text: 'Histórico completo', included: true },
      { text: 'Dicas diárias de negócios', included: true },
      { text: 'Mais opções de modelos', included: true },
      { text: 'Templates exclusivos PRO', included: false },
    ],
    cta: 'Assinar Premium',
    ctaLink: '/checkout?plan=premium',
    isPopular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 19,90',
    period: '/mês',
    badge: 'PRO',
    tagline: 'Para quem quer elevar o nível profissional.',
    strategicMessages: [
      'Mais presença profissional para seus clientes.',
      'Mais personalização e mais destaque.',
    ],
    features: [
      { text: 'Tudo do Premium', included: true },
      { text: 'Templates exclusivos', included: true },
      { text: 'Personalização avançada', included: true },
      { text: 'Prioridade em novos recursos', included: true },
      { text: 'Organização avançada', included: true },
      { text: 'Experiência diferenciada', included: true },
      { text: 'Dicas e estratégias PRO', included: true },
    ],
    cta: 'Assinar Pro',
    ctaLink: '/checkout?plan=pro',
    isPopular: false,
  },
];

export default function PricingPage() {
  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto pb-16">
        <UsageBanner />

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/25 rounded-full text-[10px] font-extrabold text-primary-400 uppercase tracking-widest mb-5">
            <MdRocketLaunch className="text-xs" />
            Planos & Preços
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
            Planos que crescem com você
          </h1>
          <p className="text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Comece de graça e faça o upgrade quando precisar. Sem surpresas ou taxas ocultas.
            <br />
            <span className="text-primary-400 font-semibold">O valor se paga no primeiro cliente fechado.</span>
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-[24px] border p-7 transition-all duration-500 ${
                plan.isPopular
                  ? 'bg-primary-500/10 border-primary-500/50 shadow-glow md:scale-[1.04] md:z-10'
                  : 'bg-[#071A3D]/30 backdrop-blur-xl border-blue-900/20 hover:border-primary-500/20 hover:shadow-glow'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap flex items-center gap-1.5 ${
                  plan.isPopular
                    ? 'bg-primary-500 text-white shadow-glow'
                    : 'bg-amber-500/20 border border-amber-500/40 text-amber-400'
                }`}>
                  {plan.isPopular && <MdStar className="text-xs" />}
                  {plan.badge}
                </div>
              )}

              {/* Plan name + tagline */}
              <div className="mb-5">
                <h2 className="text-lg font-extrabold text-white tracking-tight">{plan.name}</h2>
                <p className="text-xs text-slate-400 mt-1 italic leading-snug">{plan.tagline}</p>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                {plan.period && <span className="text-sm text-slate-500 font-medium">{plan.period}</span>}
              </div>

              {/* Strategic messages (Premium/Pro only) */}
              {plan.strategicMessages && (
                <div className="mb-5 space-y-1.5">
                  {plan.strategicMessages.map((msg, i) => (
                    <p key={i} className="text-[11px] text-primary-400 font-semibold flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary-500 shrink-0" />
                      {msg}
                    </p>
                  ))}
                </div>
              )}

              {/* CTA */}
              {plan.ctaDisabled ? (
                <div className="w-full text-center py-3 px-4 bg-[#050816]/60 border border-blue-900/20 text-slate-600 text-xs font-bold rounded-xl mb-6">
                  {plan.cta}
                </div>
              ) : (
                <Link
                  href={plan.ctaLink}
                  className={`w-full text-center py-3.5 px-4 text-sm font-bold rounded-xl transition-all duration-300 mb-6 block ${
                    plan.isPopular
                      ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-glow hover:-translate-y-0.5 hover:shadow-glow-intense'
                      : 'bg-[#071A3D]/60 border border-blue-900/25 text-slate-300 hover:text-white hover:border-primary-500/30'
                  }`}
                >
                  {plan.cta}
                </Link>
              )}

              {/* Features */}
              <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest mb-3">O que está incluso</p>
              <ul className="space-y-2.5 flex-1">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs">
                    {feat.included
                      ? <MdCheckCircle className="text-emerald-400 shrink-0 text-base" />
                      : <MdLock className="text-slate-700 shrink-0 text-base" />
                    }
                    <span className={feat.included ? 'text-slate-300' : 'text-slate-600'}>{feat.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer FAQ */}
        <div className="mt-14 text-center space-y-2">
          <p className="text-sm text-slate-500">
            💳 Pagamento via PIX, Boleto ou Cartão de crédito · Cancele quando quiser · Sem multas
          </p>
          <p className="text-xs text-slate-600">
            Todos os planos incluem acesso imediato após a confirmação do pagamento.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
