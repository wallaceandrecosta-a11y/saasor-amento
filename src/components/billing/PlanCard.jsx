'use client';
// src/components/billing/PlanCard.jsx — Reestilizado no padrão dark ORVEN

import React from 'react';
import Link from 'next/link';
import { MdCheckCircle, MdLock, MdStar } from 'react-icons/md';

export default function PlanCard({ plan, isCurrent, onUpgrade }) {
  const { name, description, price, features, badge, badgeColor, tagline, ctaLink } = plan;

  return (
    <div className={`relative flex flex-col rounded-[20px] border p-7 transition-all duration-500 ${
      plan.isPopular
        ? 'bg-primary-500/10 border-primary-500/50 shadow-glow'
        : 'bg-[#071A3D]/30 backdrop-blur-xl border-blue-900/20 hover:border-primary-500/20 hover:shadow-glow'
    }`}>
      {/* Badge */}
      {badge && (
        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest whitespace-nowrap flex items-center gap-1 ${badgeColor}`}>
          {plan.isPopular && <MdStar className="text-xs" />}
          {badge}
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-base font-extrabold text-white tracking-tight">{name}</h3>
        {tagline && <p className="text-[11px] text-slate-400 mt-0.5 italic leading-snug">{tagline}</p>}
        {description && !tagline && <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>}
      </div>

      <div className="mb-6">
        <span className="text-4xl font-black text-white">{price === 0 ? 'R$ 0' : `R$ ${typeof price === 'number' ? price.toFixed(2).replace('.', ',') : price}`}</span>
        {price > 0 && <span className="text-sm text-slate-500 font-medium">/mês</span>}
      </div>

      {/* CTA Button */}
      {isCurrent ? (
        <div className="w-full text-center py-3 px-4 bg-[#050816]/60 border border-blue-900/20 text-slate-600 text-xs font-bold rounded-xl mb-6">
          Plano Atual
        </div>
      ) : onUpgrade ? (
        <button
          onClick={() => onUpgrade(plan.id)}
          className={`w-full py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 mb-6 ${
            plan.isPopular
              ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-glow hover:-translate-y-0.5'
              : 'bg-[#071A3D]/60 border border-blue-900/25 text-slate-300 hover:text-white hover:border-primary-500/30'
          }`}
        >
          Fazer Upgrade
        </button>
      ) : ctaLink ? (
        <Link
          href={ctaLink}
          className={`w-full text-center py-3 px-4 text-sm font-bold rounded-xl transition-all duration-300 mb-6 block ${
            plan.isPopular
              ? 'bg-primary-500 text-white hover:bg-primary-600 shadow-glow hover:-translate-y-0.5'
              : 'bg-[#071A3D]/60 border border-blue-900/25 text-slate-300 hover:text-white hover:border-primary-500/30'
          }`}
        >
          Assinar
        </Link>
      ) : null}

      {/* Features */}
      <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-widest mb-3">O que está incluso</p>
      <ul className="space-y-2.5 flex-1">
        {(features || []).map((feature, idx) => {
          const text = typeof feature === 'string' ? feature : feature.text;
          const included = typeof feature === 'string' ? true : feature.included !== false;
          return (
            <li key={idx} className="flex items-center gap-2.5 text-xs">
              {included
                ? <MdCheckCircle className="text-emerald-400 shrink-0 text-base" />
                : <MdLock className="text-slate-600 shrink-0 text-base" />
              }
              <span className={included ? 'text-slate-300' : 'text-slate-600'}>{text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
