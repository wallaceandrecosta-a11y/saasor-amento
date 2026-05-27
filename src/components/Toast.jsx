'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import { MdCheckCircle, MdError, MdInfo } from 'react-icons/md';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const icons = { success: <MdCheckCircle />, error: <MdError />, info: <MdInfo /> };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-premium border backdrop-blur-md pointer-events-auto animate-fade-in ${
            t.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
            t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
            'bg-blue-500/10 border-blue-500/20 text-blue-400'
          }`}>
            <span className="text-xl">{icons[t.type]}</span>
            <span className="text-sm font-bold text-white tracking-wide">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    console.warn('useToast was called outside of ToastProvider');
    return () => {}; // No-op function
  }
  return ctx;
};
