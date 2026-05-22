'use client';
// src/components/DailyTip.jsx

import { useState } from 'react';
import { getDailyTip, getRandomTip } from '@/lib/tips';
import { usePlan } from '@/lib/planContext';
import { MdLightbulb, MdRefresh } from 'react-icons/md';

const CATEGORY_COLORS = {
  vendas: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-400', badge: 'Vendas' },
  produtividade: { bg: 'bg-primary-500/10', border: 'border-primary-500/25', text: 'text-primary-400', badge: 'Produtividade' },
  negócios: { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-400', badge: 'Negócios' },
};

export default function DailyTip() {
  const { isPaid, isLoading } = usePlan();
  const [tip, setTip] = useState(() => getDailyTip());

  if (isLoading || !isPaid) return null;

  const colors = CATEGORY_COLORS[tip.category] || CATEGORY_COLORS['negócios'];

  const refreshTip = () => {
    setTip(getRandomTip());
  };

  return (
    <div className={`card p-5 border ${colors.border} ${colors.bg} transition-all duration-500`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{tip.icon}</span>
          <div>
            <span className={`text-[9px] font-black uppercase tracking-widest ${colors.text}`}>{colors.badge}</span>
            <p className="text-xs font-extrabold text-white leading-tight">{tip.title}</p>
          </div>
        </div>
        <button
          onClick={refreshTip}
          title="Ver outra dica"
          className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-300 hover:bg-white/5 transition-all shrink-0"
        >
          <MdRefresh className="text-base" />
        </button>
      </div>
      <p className="text-xs text-slate-400 leading-relaxed">{tip.content}</p>
      <div className="mt-3 pt-3 border-t border-blue-900/10">
        <p className="text-[10px] text-slate-600 flex items-center gap-1">
          <MdLightbulb className="text-amber-500/60 text-xs" />
          Dica do dia · Exclusiva para assinantes
        </p>
      </div>
    </div>
  );
}
