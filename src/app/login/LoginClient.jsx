'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MdEmail, MdLock, MdLogin, MdPersonAdd, MdSecurity } from 'react-icons/md';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    };
    checkSession();
  }, [router, supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (signUpError) throw signUpError;
        
        if (data?.session) {
          router.push('/dashboard');
        } else {
          setError('Conta criada! Verifique seu e-mail para confirmar ou tente fazer login.');
          setIsSignUp(false);
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        if (data.session) {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erro ao processar requisição.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle at 50% -20%, #0c1a40 0%, #050816 70%)' }}>
      {/* Background Glowing Orbs */}
      <div className="w-[500px] h-[500px] rounded-full bg-primary-500/5 blur-3xl absolute -top-48 -left-48 animate-pulse duration-10000"></div>
      <div className="w-[500px] h-[500px] rounded-full bg-primary-600/5 blur-3xl absolute -bottom-48 -right-48 animate-pulse duration-7000"></div>

      {/* Main Glassmorphic Form Box */}
      <div className="max-w-md w-full bg-[#071A3D]/30 backdrop-blur-xl rounded-[24px] border border-blue-900/20 shadow-premium p-8 relative z-10 animate-fade-in hover:shadow-glow hover:border-primary-500/25 transition-all duration-500">
        {/* Header Block */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#071A3D]/40 border border-blue-900/20 flex items-center justify-center shadow-glow mb-4 mx-auto hover:scale-105 transition-transform duration-300 p-2.5">
            <img src="/icon.svg" alt="Orven Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">ORVEN</h1>
          <p className="text-sm text-[#8B95A7] mt-1.5 font-medium">
            {isSignUp ? 'Crie sua conta para começar' : 'Acesse o sistema de orçamentos'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-semibold rounded-xl p-4 mb-6 leading-relaxed flex items-start gap-2.5 animate-slide-up">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* E-mail Input */}
          <div>
            <label className="block text-xs font-bold text-[#8B95A7] uppercase tracking-wider mb-2" htmlFor="email">
              E-mail
            </label>
            <div className="relative">
              <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
              <input
                id="email"
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

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-[#8B95A7] uppercase tracking-wider mb-2" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
              <input
                id="password"
                type="password"
                className="input-modern pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full btn-primary py-3.5 shadow-glow uppercase tracking-wider text-xs"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : isSignUp ? (
              <>
                <MdPersonAdd className="text-base" /> Criar minha conta
              </>
            ) : (
              <>
                <MdLogin className="text-base" /> Entrar no sistema
              </>
            )}
          </button>
        </form>

        {/* Trust Badge */}
        <div className="mt-6 pt-6 border-t border-blue-900/10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-emerald-400/90 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <MdSecurity className="text-sm" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Ambiente 100% Seguro</span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium text-center px-4">
            Seus dados são protegidos com criptografia de ponta a ponta.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="text-center mt-6 pt-4 space-y-4">
          <button 
            type="button" 
            onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
            className="text-xs font-bold text-primary-400 hover:text-primary-300 transition-colors cursor-pointer block w-full"
          >
            {isSignUp ? 'Já possui uma conta? Faça Login' : 'Não possui uma conta? Cadastre-se grátis'}
          </button>
          
          <p className="text-[10px] text-slate-500 font-medium px-4">
            Ao continuar, você concorda com nossos{' '}
            <Link href="/termos" className="text-slate-400 hover:text-white underline transition-colors">Termos de Uso</Link>
            {' '}e{' '}
            <Link href="/privacidade" className="text-slate-400 hover:text-white underline transition-colors">Política de Privacidade</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
