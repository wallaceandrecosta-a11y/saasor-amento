'use client';

import React from 'react';

export default function UsageProgress({ limit, used }) {
  const isUnlimited = limit === null;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const isNearLimit = !isUnlimited && percentage >= 80;

  return (
    <div className="card p-6 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-base font-extrabold text-white uppercase tracking-widest mb-1.5">Consumo do Plano</h3>
        <p className="text-xs text-[#8B95A7] font-semibold mb-6">Orçamentos gerados neste ciclo mensal</p>
        
        {isUnlimited ? (
          <div className="flex items-center text-emerald-400 font-extrabold text-sm uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/25 px-4 py-2.5 rounded-xl">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
            </svg>
            Uso Ilimitado Ativo
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[#8B95A7]">
              <span>{used} de {limit} Utilizados</span>
              <span className={isNearLimit ? 'text-red-400' : 'text-primary-400'}>
                {percentage.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-[#050816] border border-blue-900/15 rounded-full h-3 overflow-hidden p-[2px]">
              <div 
                className={`h-full rounded-full transition-all duration-700 shadow-glow ${isNearLimit ? 'bg-gradient-to-r from-red-500 to-rose-600' : 'bg-gradient-to-r from-primary-600 to-primary-400'}`} 
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            {isNearLimit && (
              <p className="text-[10px] text-red-400 font-bold uppercase tracking-wider mt-2.5">
                Alerta de limite: Recomendamos upgrade para evitar bloqueios.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
