// src/components/Providers.jsx
'use client';
import { useEffect } from 'react';
import { ToastProvider } from './Toast';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, useOrcamentosStore } from '@/lib/store';
import { PlanProvider } from '@/lib/planContext';

export default function Providers({ children }) {
  useEffect(() => {
    const supabase = createClient();
    
    // Configura ouvinte de estado de autenticação do Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Atualiza a store global com os dados do usuário autenticado
        useAuthStore.setState({
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email.split('@')[0],
          }
        });
        
        // Dispara a sincronização de orçamentos da nuvem
        useOrcamentosStore.getState().syncWithSupabase();
      } else {
        // Limpa a store caso deslogado
        useAuthStore.setState({ user: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <ToastProvider>
      <PlanProvider>
        {children}
      </PlanProvider>
    </ToastProvider>
  );
}
