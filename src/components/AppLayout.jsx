'use client';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !user) {
      router.push('/login');
    }
  }, [isMounted, user, router]);

  // Durante o SSR e no primeiro render do cliente (antes do useEffect),
  // renderizamos um shell vazio ou o children sem depender do 'user' do store
  // para evitar mismatch. Mas como AppLayout protege a rota, se não estamos 
  // montados ainda, não podemos ter certeza do 'user'.
  
  if (!isMounted) {
    return (
      <div className="app-layout" style={{ opacity: 0 }}>
        <div className="main-content">
          <div className="page-container">{children}</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-container">{children}</div>
      </div>
    </div>
  );
}
