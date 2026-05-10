'use client';
import AppLayout from '@/components/AppLayout';
import { useClientesStore, useServicosStore, useOrcamentosStore } from '@/lib/store';
import Link from 'next/link';
import { MdPeople, MdBuild, MdDescription, MdAddCircle, MdTrendingUp } from 'react-icons/md';

const STATUS_COLOR = {
  pendente:  '#f59e0b',
  aprovado:  '#22c55e',
  recusado:  '#ef4444',
  cancelado: '#94a3b8',
};

export default function DashboardPage() {
  const { clientes }    = useClientesStore();
  const { servicos }    = useServicosStore();
  const { orcamentos }  = useOrcamentosStore();

  const aprovados  = orcamentos.filter((o) => o.status === 'aprovado');
  const pendentes  = orcamentos.filter((o) => o.status === 'pendente');
  const totalFaturado = aprovados.reduce((acc, o) => acc + Number(o.total), 0);

  const recentes = orcamentos.slice(0, 6);

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Visão geral do sistema de orçamentos</p>
        </div>
        <Link href="/orcamentos/novo" className="btn btn-primary">
          <MdAddCircle /> Novo Orçamento
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-value">{clientes.length}</div>
            <div className="stat-label">Clientes cadastrados</div>
          </div>
          <div className="stat-icon blue"><MdPeople /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-value">{servicos.length}</div>
            <div className="stat-label">Serviços/Produtos</div>
          </div>
          <div className="stat-icon yellow"><MdBuild /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-value">{orcamentos.length}</div>
            <div className="stat-label">Orçamentos gerados</div>
          </div>
          <div className="stat-icon blue"><MdDescription /></div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-value">
              R$ {totalFaturado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="stat-label">Total aprovado</div>
          </div>
          <div className="stat-icon green"><MdTrendingUp /></div>
        </div>
      </div>

      {/* Orçamentos recentes */}
      <div className="card">
        <div className="card-header">
          <h2 style={{ fontSize: 15, fontWeight: 700 }}>Orçamentos Recentes</h2>
          <Link href="/orcamentos" className="btn btn-secondary btn-sm">Ver todos</Link>
        </div>
        {recentes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>Nenhum orçamento ainda</h3>
            <p>Crie seu primeiro orçamento agora mesmo!</p>
            <Link href="/orcamentos/novo" className="btn btn-primary" style={{ marginTop: 16 }}>
              <MdAddCircle /> Criar orçamento
            </Link>
          </div>
        ) : (
          <div className="table-wrapper" style={{ borderRadius: '0 0 10px 10px', border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {recentes.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.numero}</strong></td>
                    <td>{o.clienteNome}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td><strong>R$ {Number(o.total).toFixed(2).replace('.', ',')}</strong></td>
                    <td>
                      <span className={`badge badge-${o.status}`}>
                        {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <Link href={`/orcamentos/${o.id}`} className="btn btn-secondary btn-sm">
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
