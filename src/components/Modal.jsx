'use client';
import { useEffect } from 'react';
import { MdClose } from 'react-icons/md';

export default function Modal({ isOpen, onClose, title, size = '', children, footer }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#050816]/80 backdrop-blur-sm animate-fade-in" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div 
        className={`w-full sm:max-w-lg ${size === 'modal-sm' ? 'sm:max-w-sm' : size === 'modal-lg' ? 'sm:max-w-3xl' : ''} bg-[#0B0D12] sm:rounded-2xl rounded-t-2xl sm:rounded-t-2xl border-t sm:border border-blue-900/20 shadow-[0_0_50px_-12px_rgba(10,77,255,0.2)] animate-slide-up flex flex-col max-h-[90vh]`}
        role="dialog" 
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-blue-900/10 shrink-0">
          <h2 className="text-lg font-bold text-white tracking-tight">{title}</h2>
          <button 
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#071A3D]/50 text-slate-400 hover:text-white hover:bg-red-500/20 transition-colors" 
            onClick={onClose} 
            aria-label="Fechar"
          >
            <MdClose className="text-xl" />
          </button>
        </div>
        <div className="p-5 sm:p-6 overflow-y-auto">
          {children}
        </div>
        {footer && (
          <div className="p-5 sm:p-6 border-t border-blue-900/10 shrink-0 bg-[#071A3D]/10 sm:rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
