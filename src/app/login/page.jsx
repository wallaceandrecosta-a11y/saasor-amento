// src/app/login/page.jsx
import dynamic from 'next/dynamic';

const LoginClient = dynamic(() => import('./LoginClient'), {
  ssr: false,
  loading: () => (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <p>Carregando sistema...</p>
      </div>
    </div>
  ),
});

export default function LoginPage() {
  return <LoginClient />;
}
