'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { MdEmail, MdLock, MdLogin } from 'react-icons/md';

export default function LoginPage() {
  const [email, setEmail]       = useState('admin@wssolutions.com.br');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { login, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && user) {
      router.push('/dashboard');
    }
  }, [isMounted, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const ok = login(email, password);
    setLoading(false);
    if (ok) {
      router.push('/dashboard');
    } else {
      setError('E-mail ou senha incorretos. Verifique os dados e tente novamente.');
    }
  };

  // Importante: No primeiro render, retornamos o UI completo para bater com o SSR do servidor.
  // Não podemos retornar null aqui, senão dá hydration mismatch.

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-box">WS</div>
          <h1>WS Solutions</h1>
          <p>Acesse o sistema de orçamentos</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <MdEmail style={{ verticalAlign: 'middle', marginRight: 4 }} />
              E-mail
            </label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wssolutions.com.br"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <MdLock style={{ verticalAlign: 'middle', marginRight: 4 }} />
              Senha
            </label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full btn-lg"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Verificando...' : <><MdLogin /> Entrar no sistema</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 22, fontSize: 12, color: 'var(--gray-400)' }}>
          Credenciais de demo: <strong>admin@wssolutions.com.br</strong> / <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}
