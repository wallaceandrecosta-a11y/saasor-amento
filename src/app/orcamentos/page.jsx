'use client';
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useOrcamentosStore } from '@/lib/store';
import Link from 'next/link';
import { MdAdd, MdSearch, MdVisibility, MdDelete, MdFilterList } from 'react-icons/md';

const STATUS_OPTIONS = ['todos', 'pendente', 'aprovado', 'recusado', 'cancelado'];

export default function OrcamentosPage() {
  const { orcamentos, updateOrcamento, deleteOrcamento } = useOrcamentosStore();
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('todos');
  const [confirmDel, setConfirmDel] = useState(null);

  const filtered = orcamentos.filter((o) => {
    const matchStatus = status === 'todos' || o.status === status;
    const matchSearch = [o.numero, o.clienteNome].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    );
    return matchStatus && matchSearch;
  });

  const handleDelete = (id) => { deleteOrcamento(id); setConfirmDel(null); };

  const handleStatusChange = (id, novoStatus) => {
    updateOrcamento(id, { status: novoStatus });
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1>Orçamentos</h1>
          <p className="page-subtitle">{orcamentos.length} orçamento(s) no total</p>
        </div>
        <Link href="/orcamentos/novo" className="btn btn-primary" id="btn-novo-orcamento">
          <MdAdd /> Novo Orçamento
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters-bar">
        <div className="search-input-wrapper">
          <MdSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por número ou cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-orcamentos"
          />
        </div>
        <MdFilterList style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            id={`filter-${s}`}
            className={`btn btn-sm ${status === s ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setStatus(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>{orcamentos.length === 0 ? 'Nenhum orçamento ainda' : 'Nenhum resultado encontrado'}</h3>
            <p>
              {orcamentos.length === 0
                ? 'Crie seu primeiro orçamento agora!'
                : 'Tente outros filtros ou termos de busca.'}
            </p>
            {orcamentos.length === 0 && (
              <Link href="/orcamentos/novo" className="btn btn-primary" style={{ marginTop: 16 }}>
                <MdAdd /> Criar orçamento
              </Link>
            )}
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Número</th>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th>Total</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.numero}</strong></td>
                    <td>{o.clienteNome}</td>
                    <td style={{ color: 'var(--gray-500)' }}>{o.itens?.length ?? 0} item(s)</td>
                    <td>
                      <strong style={{ color: 'var(--primary-600)' }}>
                        R$ {Number(o.total).toFixed(2).replace('.', ',')}
                      </strong>
                    </td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>
                      {new Date(o.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        id={`status-orc-${o.id}`}
                      >
                        {['pendente', 'aprovado', 'recusado', 'cancelado'].map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/orcamentos/${o.id}`} className="btn btn-secondary btn-sm btn-icon" title="Ver orçamento">
                          <MdVisibility />
                        </Link>
                        <button
                          className="btn btn-danger btn-sm btn-icon"
                          title="Excluir"
                          onClick={() => setConfirmDel(o)}
                          id={`del-orc-${o.id}`}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmação de exclusão inline */}
      {confirmDel && (
        <div className="modal-overlay" onClick={() => setConfirmDel(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirmar exclusão</h2>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--gray-600)', fontSize: 14 }}>
                Deseja excluir o orçamento <strong>{confirmDel.numero}</strong>? Esta ação não pode ser desfeita.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDel.id)} id="btn-confirmar-excluir-orc">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
