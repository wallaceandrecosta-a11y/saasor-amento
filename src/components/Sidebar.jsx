'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MdDashboard, MdPeople, MdBuild, MdDescription,
  MdAddCircle, MdLogout, MdSettings, MdPerson, MdOutlineSpaceDashboard,
  MdRocketLaunch, MdStar
} from 'react-icons/md';
import { FiLayout } from 'react-icons/fi';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { usePlan } from '@/lib/planContext';

const navItems = [
  { label: 'Dashboard',    href: '/dashboard',         icon: <MdOutlineSpaceDashboard /> },
  { label: 'Orçamentos',   href: '/orcamentos',        icon: <MdDescription /> },
  { label: 'Clientes',     href: '/clientes',          icon: <MdPeople /> },
  { label: 'Serviços',     href: '/servicos',          icon: <MdBuild /> },
  { label: 'Templates',    href: '/templates',         icon: <FiLayout /> },
];

const bottomNavItems = [
  { label: 'Assinatura',   href: '/settings/billing',  icon: <MdSettings /> },
  { label: 'Configurações',href: '/settings/profile',  icon: <MdPerson /> },
];

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState('');
  const { plan, isFree, used, limit, isUnlimited, usagePercentage, isLoading: planLoading } = usePlan();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email);
      }
    });
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const initial = userEmail ? userEmail[0].toUpperCase() : 'U';

  // Badge de plano
  const planBadge = planLoading ? null : plan.name;
  const planBadgeStyle = isFree
    ? 'bg-slate-500/10 border-slate-500/25 text-slate-500'
    : plan.name === 'Pro'
    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    : 'bg-primary-500/10 border-primary-500/25 text-primary-400';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`w-64 bg-[#03050F] border-r border-blue-900/10 h-screen fixed left-0 top-0 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand Logo Header */}
        <div className="px-7 py-7 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center bg-[#071A3D]/40 border border-blue-900/20 rounded-lg shadow-glow hover:scale-105 transition-all duration-300 p-1">
              <img src="/icon.svg" alt="Orven Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-xs font-black text-white tracking-widest leading-none uppercase">ORVEN</h2>
              <p className="text-[9px] text-[#8B95A7] font-bold uppercase tracking-widest mt-1">
                {planLoading ? '...' : `${plan.name} Cockpit`}
              </p>
            </div>
          </div>
          {/* Close button on mobile */}
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

      {/* Quick Action Button */}
      <div className="px-5 mb-6">
        <Link 
          href="/orcamentos/novo" 
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#0A4DFF]/15 border border-primary-500/25 text-primary-400 text-xs font-bold rounded-xl hover:bg-primary-500 hover:text-white hover:shadow-glow-intense transition-all duration-350 cursor-pointer"
        >
          <MdAddCircle className="text-base" />
          Novo Orçamento
        </Link>
      </div>

      {/* Usage Progress (só Free) */}
      {!planLoading && isFree && (
        <div className="px-5 mb-4">
          <div className="bg-[#071A3D]/30 border border-blue-900/15 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Uso mensal</span>
              <span className={`text-[9px] font-black ${usagePercentage >= 100 ? 'text-red-400' : usagePercentage >= 66 ? 'text-amber-400' : 'text-slate-500'}`}>
                {used}/{limit}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#050816] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  usagePercentage >= 100 ? 'bg-red-500' : usagePercentage >= 66 ? 'bg-amber-500' : 'bg-primary-500'
                }`}
                style={{ width: `${usagePercentage}%` }}
              />
            </div>
            {usagePercentage >= 66 && (
              <Link href="/pricing" className="mt-2 flex items-center gap-1 text-[9px] font-bold text-primary-400 hover:text-primary-300 transition-colors">
                <MdRocketLaunch className="text-[10px]" />
                {usagePercentage >= 100 ? 'Limite atingido — upgrade' : 'Upgrade para ilimitado'}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        <p className="px-3 text-[9px] font-black text-[#8B95A7] uppercase tracking-widest mb-3 mt-2">Principal</p>
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                isActive 
                  ? 'bg-primary-500/10 text-primary-400 border-l-[3px] border-primary-500 pl-2.5 shadow-[inset_4px_0_15px_-4px_rgba(10,77,255,0.15)] font-bold' 
                  : 'text-[#8B95A7] hover:bg-[#071A3D]/30 hover:text-white'
              }`}
            >
              <span className={`text-[17px] transition-colors ${isActive ? 'text-primary-400' : 'text-slate-500'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        <p className="px-3 text-[9px] font-black text-[#8B95A7] uppercase tracking-widest mb-3 mt-8">Ajustes</p>
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                isActive 
                  ? 'bg-primary-500/10 text-primary-400 border-l-[3px] border-primary-500 pl-2.5 shadow-[inset_4px_0_15px_-4px_rgba(10,77,255,0.15)] font-bold' 
                  : 'text-[#8B95A7] hover:bg-[#071A3D]/30 hover:text-white'
              }`}
            >
              <span className={`text-[17px] transition-colors ${isActive ? 'text-primary-400' : 'text-slate-500'}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}

        {/* Upgrade CTA no sidebar (só Free) */}
        {!planLoading && isFree && (
          <div className="mt-4">
            <Link
              href="/pricing"
              className="flex items-center gap-2 w-full px-3 py-2.5 bg-primary-500/8 border border-primary-500/20 text-primary-400 hover:bg-primary-500/15 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300"
            >
              <MdRocketLaunch className="text-sm shrink-0" />
              <span>Premium — R$11,90/mês</span>
            </Link>
          </div>
        )}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-5 mt-auto border-t border-blue-900/10 bg-[#02030A]/40">
        <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#071A3D]/30 border border-transparent hover:border-blue-900/15 transition-all duration-300 cursor-pointer mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-400 font-extrabold text-xs shrink-0">
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{userEmail || 'Carregando...'}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {planBadge && (
                <span className={`text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded border ${planBadgeStyle}`}>
                  {planBadge}
                </span>
              )}
              <p className="text-[9px] text-[#8B95A7] font-semibold uppercase tracking-wider">Meu Perfil</p>
            </div>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#8B95A7] hover:text-red-400 transition-all rounded-lg hover:bg-red-500/5 cursor-pointer"
        >
          <MdLogout className="text-sm" /> Sair
        </button>
      </div>
    </aside>
    </>
  );
}
