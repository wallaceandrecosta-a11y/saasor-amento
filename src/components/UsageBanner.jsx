'use client';
// src/components/UsageBanner.jsx

import Link from 'next/link';
import { usePlan } from '@/lib/planContext';
import { MdRocketLaunch, MdClose } from 'react-icons/md';
import { useState } from 'react';

export default function UsageBanner() {
  const { isFree, used, limit, isLoading, usagePercentage } = usePlan();
  const [dismissed, setDismissed] = useState(false);

  if (isLoading || !isFree || dismissed) return null;

  const remaining = limit - used;

  let message, subMessage, colorScheme, ctaText;

  if (used === 0) {
    message = `Você tem ${limit} orçamentos gratuitos disponíveis este mês.`;
    subMessage = 'Explore à vontade e conheça o poder da ORVEN.';
    colorScheme = 'border-blue-900/20 bg-[#071A3D]/30';
    ctaText = null;
  } else if (remaining >= 2) {
    message = `${used} de ${limit} orçamentos utilizados este mês.`;
    subMessage = 'Continue criando sem limites — assine o Premium.';
    colorScheme = 'border-blue-900/20 bg-[#071A3D]/30';
    ctaText = 'Ver planos';
  } else if (remaining === 1) {
    message = 'Último orçamento disponível este mês!';
    subMessage = 'Desbloqueie recursos premium e nunca fique sem criar.';
    colorScheme = 'border-amber-500/25 bg-amber-500/5';
    ctaText = 'Seja Premium por R$11,90/mês';
  } else {
    message = 'Limite gratuito atingido.';
    subMessage = 'Assine o Premium e gere orçamentos sem parar este mês.';
    colorScheme = 'border-red-500/25 bg-red-500/5';
    ctaText = 'Fazer upgrade agora →';
  }

  const barColor = usagePercentage >= 100
    ? 'bg-gradient-to-r from-red-600 to-rose-500'
    : usagePercentage >= 66
    ? 'bg-gradient-to-r from-amber-500 to-orange-400'
    : 'bg-gradient-to-r from-primary-600 to-primary-400';

  const iconColor = usagePercentage >= 100 ? 'text-red-400' : usagePercentage >= 66 ? 'text-amber-400' : 'text-primary-400';

  return (
    <div className={`relative flex items-center gap-4 px-5 py-3.5 rounded-2xl border backdrop-blur-sm transition-all duration-500 mb-6 ${colorScheme}`}>
      <MdRocketLaunch className={`text-lg shrink-0 ${iconColor}`} />

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <div className="flex-1">
            <p className="text-xs font-bold text-white">{message}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{subMessage}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-24 h-1.5 bg-[#050816]/60 rounded-full overflow-hidden border border-blue-900/10">
              <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${usagePercentage}%` }} />
            </div>
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider whitespace-nowrap">{used}/{limit}</span>
          </div>

          {ctaText && (
            <Link href="/pricing" className="shrink-0 px-3 py-1.5 bg-primary-500/15 border border-primary-500/30 text-primary-400 hover:bg-primary-500 hover:text-white text-[11px] font-bold rounded-xl transition-all duration-300 whitespace-nowrap">
              {ctaText}
            </Link>
          )}
        </div>
      </div>

      {usagePercentage < 100 && (
        <button onClick={() => setDismissed(true)} className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-400 transition-colors">
          <MdClose className="text-sm" />
        </button>
      )}
    </div>
  );
}
