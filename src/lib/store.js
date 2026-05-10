'use client';
// src/lib/store.js
// Gerenciamento de estado global com Zustand + persistência em localStorage
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

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
      addOrcamento: (data) => {
        const numero = `ORC-${String(get().orcamentos.length + 1).padStart(4, '0')}`;
        const novo = { id: uuidv4(), numero, ...data, createdAt: new Date().toISOString() };
        set((state) => ({ orcamentos: [novo, ...state.orcamentos] }));
        return novo;
      },
      updateOrcamento: (id, data) =>
        set((state) => ({
          orcamentos: state.orcamentos.map((o) => (o.id === id ? { ...o, ...data } : o)),
        })),
      deleteOrcamento: (id) =>
        set((state) => ({ orcamentos: state.orcamentos.filter((o) => o.id !== id) })),
      getOrcamento: (id) => get().orcamentos.find((o) => o.id === id),
    }),
    { name: 'ws-orcamentos' }
  )
);
