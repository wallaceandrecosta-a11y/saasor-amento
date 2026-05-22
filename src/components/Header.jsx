'use client';
import { MdSearch, MdNotificationsNone } from 'react-icons/md';

export default function Header() {
  return (
    <header className="h-16 border-b border-blue-900/10 bg-[#050816]/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-30">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B95A7] text-lg group-focus-within:text-primary-500 transition-colors" />
          <input
            type="text"
            placeholder="Buscar clientes, orçamentos..."
            className="w-full bg-[#071A3D]/30 border border-blue-900/15 rounded-xl py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-200 placeholder-slate-500 focus:bg-[#071A3D]/50 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block border border-blue-900/20 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-500 bg-[#03050F]">⌘</kbd>
            <kbd className="hidden sm:inline-block border border-blue-900/20 rounded px-1.5 py-0.5 text-[9px] font-bold text-slate-500 bg-[#03050F]">K</kbd>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-4">
        <button className="relative p-2.5 text-[#8B95A7] hover:text-white hover:bg-[#071A3D]/30 rounded-xl border border-transparent hover:border-blue-900/15 transition-all outline-none focus:ring-2 focus:ring-primary-500/50 cursor-pointer">
          <MdNotificationsNone className="text-xl" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full border-2 border-[#050816] shadow-glow"></span>
        </button>
      </div>
    </header>
  );
}
