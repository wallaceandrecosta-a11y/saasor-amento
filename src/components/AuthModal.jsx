'use client';
// src/components/AuthModal.jsx
// Modal de autenticação disparado ao tentar usar qualquer funcionalidade sem login

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { MdClose, MdEmail, MdLock, MdPersonAdd, MdLogin, MdAutoAwesome } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';

export default function AuthModal({ isOpen, onClose, message }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
      setEmail('');
      setPassword('');
      setMode('login');
    }
  }, [isOpen]);

  // Bloqueia scroll do body quando aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        if (data?.session) {
          onClose();
          router.push('/dashboard');
        } else {
          setSuccess('Conta criada! Verifique seu e-mail para confirmar e depois faça login.');
          setMode('login');
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        if (data.session) {
          onClose();
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message || 'Erro ao processar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/dashboard` },
      });
    } catch (err) {
      setError('Erro ao conectar com Google.');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(5, 8, 22, 0.85)', backdropFilter: 'blur(12px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-[#071A3D]/60 backdrop-blur-2xl border border-blue-900/30 rounded-[24px] shadow-[0_30px_80px_rgba(0,0,0,0.6)] animate-slide-up overflow-hidden">
        {/* Ambient glow top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="relative p-8 pb-6 text-center border-b border-blue-900/15">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <MdClose className="text-lg" />
          </button>

          {/* Icon */}
          <div className="w-14 h-14 bg-primary-500/10 border border-primary-500/25 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <MdAutoAwesome className="text-primary-400 text-2xl" />
          </div>

          {/* Mensagem estratégica */}
          <h2 className="text-xl font-extrabold text-white tracking-tight mb-1">
            {message || 'Torne seus orçamentos mais profissionais em segundos.'}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            {mode === 'login' ? 'Acesse sua conta para continuar' : 'Crie sua conta gratuitamente e comece agora'}
          </p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-5">
          {/* Google OAuth */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white font-bold text-sm rounded-xl transition-all duration-300"
          >
            <FcGoogle className="text-xl" />
            Continuar com Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-blue-900/20" />
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">ou</span>
            <div className="flex-1 h-px bg-blue-900/20" />
          </div>

          {/* Error/Success messages */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1" />
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold rounded-xl px-4 py-3">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">E-mail</label>
              <div className="relative">
                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input
                  type="email"
                  className="input-modern pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-2">Senha</label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
                <input
                  type="password"
                  className="input-modern pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  minLength={6}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 text-sm shadow-glow"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processando...
                </span>
              ) : mode === 'login' ? (
                <span className="flex items-center justify-center gap-2"><MdLogin className="text-base" /> Entrar</span>
              ) : (
                <span className="flex items-center justify-center gap-2"><MdPersonAdd className="text-base" /> Criar conta grátis</span>
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-xs text-slate-500">
            {mode === 'login' ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
              className="text-primary-400 font-bold hover:text-primary-300 transition-colors"
            >
              {mode === 'login' ? 'Cadastre-se grátis' : 'Fazer login'}
            </button>
          </p>

          {/* Garantia */}
          <p className="text-center text-[10px] text-slate-600 leading-relaxed">
            Grátis para sempre no plano básico · Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </div>
    </div>
  );
}
