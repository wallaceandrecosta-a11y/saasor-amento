'use client';
// src/lib/store.js
// Gerenciamento de estado global com Zustand + persistência em localStorage + sincronização com Supabase
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from './supabase/client';

// ─── Auth Store ──────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      login: (email, password) => {
        if (email === 'admin@wssolutions.com.br' && password === 'admin123') {
          set({ user: { email, name: 'Administrador' } });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
    }),
    { name: 'ws-auth' }
  )
);

// ─── Clientes Store ───────────────────────────────────────────────────────────
export const useClientesStore = create(
  persist(
    (set, get) => ({
      clientes: [
        {
          id: 'cli-1',
          nome: 'João Silva',
          email: 'joao@exemplo.com',
          telefone: '(11) 99999-0001',
          cpfCnpj: '123.456.789-00',
          endereco: 'Rua das Flores, 100 - São Paulo/SP',
          createdAt: '2024-05-10T12:00:00Z',
        },
        {
          id: 'cli-2',
          nome: 'Empresa Exemplo Ltda.',
          email: 'contato@exemplo.com',
          telefone: '(11) 3333-0002',
          cpfCnpj: '12.345.678/0001-99',
          endereco: 'Av. Principal, 500 - São Paulo/SP',
          createdAt: '2024-05-10T12:00:00Z',
        },
      ],
      addCliente: (data) =>
        set((state) => ({
          clientes: [...state.clientes, { id: uuidv4(), ...data, createdAt: new Date().toISOString() }],
        })),
      updateCliente: (id, data) =>
        set((state) => ({
          clientes: state.clientes.map((c) => (c.id === id ? { ...c, ...data } : c)),
        })),
      deleteCliente: (id) =>
        set((state) => ({ clientes: state.clientes.filter((c) => c.id !== id) })),
      getCliente: (id) => get().clientes.find((c) => c.id === id),
    }),
    { name: 'ws-clientes' }
  )
);

// ─── Serviços Store ───────────────────────────────────────────────────────────
export const useServicosStore = create(
  persist(
    (set, get) => ({
      servicos: [
        { id: 'srv-1', nome: 'Desenvolvimento de Site', descricao: 'Criação de site responsivo completo', preco: 2500.0, unidade: 'projeto', createdAt: '2024-05-10T12:00:00Z' },
        { id: 'srv-2', nome: 'Manutenção Mensal', descricao: 'Suporte técnico e atualizações mensais', preco: 350.0, unidade: 'mês', createdAt: '2024-05-10T12:00:00Z' },
        { id: 'srv-3', nome: 'Identidade Visual', descricao: 'Criação de logo e manual de marca', preco: 1200.0, unidade: 'projeto', createdAt: '2024-05-10T12:00:00Z' },
        { id: 'srv-4', nome: 'Consultoria em TI', descricao: 'Hora de consultoria técnica especializada', preco: 180.0, unidade: 'hora', createdAt: '2024-05-10T12:00:00Z' },
      ],
      addServico: (data) =>
        set((state) => ({
          servicos: [...state.servicos, { id: uuidv4(), ...data, createdAt: new Date().toISOString() }],
        })),
      updateServico: (id, data) =>
        set((state) => ({
          servicos: state.servicos.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),
      deleteServico: (id) =>
        set((state) => ({ servicos: state.servicos.filter((s) => s.id !== id) })),
      getServico: (id) => get().servicos.find((s) => s.id === id),
    }),
    { name: 'ws-servicos' }
  )
);

// ─── Orçamentos Store ─────────────────────────────────────────────────────────
export const useOrcamentosStore = create(
  persist(
    (set, get) => ({
      orcamentos: [],
      
      // Sincroniza dados do Supabase
      syncWithSupabase: async () => {
        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data, error } = await supabase
              .from('budgets')
              .select('*')
              .order('created_at', { ascending: false });
              
            if (!error && data) {
              const mapped = data.map(b => ({
                id: b.id,
                numero: b.number,
                status: b.status,
                view_count: b.view_count,
                first_viewed_at: b.first_viewed_at,
                last_viewed_at: b.last_viewed_at,
                approved_at: b.approved_at,
                approved_ip: b.approved_ip,
                client_feedback: b.client_feedback,
                tracking_history: b.tracking_history,
                brand_color: b.brand_color,
                brand_logo_url: b.brand_logo_url,
                remove_watermark: b.remove_watermark,
                ...b.data
              }));
              
              // Mescla orçamentos locais que ainda não foram sincronizados com o Supabase
              const localBudgets = get().orcamentos || [];
              const merged = [...mapped];
              
              localBudgets.forEach(local => {
                if (local && local.id && !merged.some(remote => remote.id === local.id)) {
                  merged.push(local);
                }
              });
              
              set({ orcamentos: merged });
            }
          }
        } catch (err) {
          console.error('Falha ao sincronizar com Supabase:', err);
        }
      },

      addOrcamento: async (data) => {
        const id = uuidv4();
        const numero = data.numero || `ORV-${2000 + get().orcamentos.length + 1}`;
        const novo = { id, numero, ...data, createdAt: new Date().toISOString() };
        
        // Salva localmente primeiro (Optimistic UI)
        set((state) => ({ orcamentos: [novo, ...state.orcamentos] }));

        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const response = await fetch('/api/orcamentos', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id,
                numero,
                total_amount: Number(data.total || 0),
                status: data.status || 'pendente',
                data: novo,
                brand_color: data.brand_color || '#2563eb',
                brand_logo_url: data.brand_logo_url || null,
                remove_watermark: data.remove_watermark || false
              })
            });

            if (!response.ok) {
              const errData = await response.json();
              console.error('Erro na API ao salvar orçamento:', errData);
              // Reverte no frontend em caso de falha de segurança (ex: plano excedido)
              set((state) => ({ orcamentos: state.orcamentos.filter((o) => o.id !== id) }));
              throw new Error(errData.error || 'Falha ao criar orçamento no backend');
            }
          }
        } catch (err) {
          console.error('Erro ao salvar no backend:', err);
        }
        
        return novo;
      },

      updateOrcamento: async (id, data) => {
        // Atualiza localmente
        set((state) => ({
          orcamentos: state.orcamentos.map((o) => (o.id === id ? { ...o, ...data } : o)),
        }));

        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Busca o payload existente para atualizar sem sobrescrever dados extras
            const { data: existing } = await supabase.from('budgets').select('data').eq('id', id).single();
            const updatedPayload = { ...(existing?.data || {}), ...data };
            
            await supabase.from('budgets').update({
              total_amount: Number(data.total !== undefined ? data.total : (updatedPayload.total || 0)),
              status: data.status || updatedPayload.status || 'pendente',
              data: updatedPayload,
              brand_color: data.brand_color || updatedPayload.brand_color || '#2563eb',
              brand_logo_url: data.brand_logo_url || updatedPayload.brand_logo_url || null,
              remove_watermark: data.remove_watermark !== undefined ? data.remove_watermark : (updatedPayload.remove_watermark || false)
            }).eq('id', id);
          }
        } catch (err) {
          console.error('Erro ao atualizar no Supabase:', err);
        }
      },

      deleteOrcamento: async (id) => {
        // Remove localmente
        set((state) => ({ orcamentos: state.orcamentos.filter((o) => o.id !== id) }));

        try {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            await supabase.from('budgets').delete().eq('id', id);
          }
        } catch (err) {
          console.error('Erro ao deletar no Supabase:', err);
        }
      },

      getOrcamento: (id) => get().orcamentos.find((o) => o.id === id),
    }),
    { name: 'ws-orcamentos' }
  )
);
