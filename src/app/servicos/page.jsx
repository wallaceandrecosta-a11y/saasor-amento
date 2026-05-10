'use client';
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { useServicosStore } from '@/lib/store';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdBuild } from 'react-icons/md';

const EMPTY = { nome: '', descricao: '', preco: '', unidade: 'projeto' };
const UNIDADES = ['projeto', 'hora', 'mês', 'unidade', 'pacote', 'diária'];

export default function ServicosPage() {
  const { servicos, addServico, updateServico, deleteServico } = useServicosStore();
  const toast = useToast();

  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [editId, setEditId]       = useState(null);

  const filtered = servicos.filter((s) =>
    [s.nome, s.descricao].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const openAdd  = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (s) => {
    setForm({ nome: s.nome, descricao: s.descricao || '', preco: String(s.preco), unidade: s.unidade || 'projeto' });
    setEditId(s.id); setModal(true);
  };

  const handleSave = () => {
    if (!form.nome.trim()) { toast('Nome é obrigatório.', 'error'); return; }
    if (!form.preco || isNaN(Number(form.preco))) { toast('Informe um preço válido.', 'error'); return; }
    const data = { ...form, preco: Number(form.preco) };
    if (editId) { updateServico(editId, data); toast('Serviço atualizado!', 'success'); }
    else        { addServico(data);            toast('Serviço cadastrado!', 'success'); }
    setModal(false);
  };

  const handleDelete = (id) => {
    deleteServico(id);
    setConfirmDel(null);
    toast('Serviço removido.', 'info');
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1>Serviços / Produtos</h1>
          <p className="page-subtitle">{servicos.length} item(ns) cadastrado(s)</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="btn-novo-servico">
          <MdAdd /> Novo Serviço
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <MdSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nome ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-servicos"
          />
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><MdBuild /></div>
            <h3>{search ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}</h3>
            <p>{search ? 'Tente outros termos de busca.' : 'Adicione serviços ou produtos para incluir nos orçamentos.'}</p>
            {!search && (
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}>
                <MdAdd /> Adicionar Serviço
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                  <th>Unidade</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.nome}</strong></td>
                    <td style={{ color: 'var(--gray-500)', fontSize: 13 }}>{s.descricao || '—'}</td>
                    <td>
                      <strong style={{ color: 'var(--primary-600)' }}>
                        R$ {Number(s.preco).toFixed(2).replace('.', ',')}
                      </strong>
                    </td>
                    <td>
                      <span style={{ background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 99, fontSize: 12, color: 'var(--gray-600)' }}>
                        {s.unidade}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm btn-icon" title="Editar" onClick={() => openEdit(s)}>
                          <MdEdit />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" title="Excluir" onClick={() => setConfirmDel(s)}>
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

      {/* Modal Cadastro/Edição */}
      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={editId ? 'Editar Serviço' : 'Novo Serviço'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} id="btn-salvar-servico">
              {editId ? 'Salvar Alterações' : 'Cadastrar Serviço'}
            </button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label" htmlFor="sv-nome">Nome do serviço / produto *</label>
          <input id="sv-nome" type="text" className="form-control" placeholder="Ex: Desenvolvimento de Site" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="sv-descricao">Descrição</label>
          <textarea id="sv-descricao" className="form-control" placeholder="Descrição detalhada do serviço..." rows={2} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
        </div>
        <div className="form-row form-row-2">
          <div className="form-group">
            <label className="form-label" htmlFor="sv-preco">Preço (R$) *</label>
            <input id="sv-preco" type="number" min="0" step="0.01" className="form-control" placeholder="0,00" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="sv-unidade">Unidade</label>
            <select id="sv-unidade" className="form-control" value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })}>
              {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      </Modal>

      {/* Modal Confirmação */}
      <Modal
        isOpen={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        title="Confirmar exclusão"
        size="modal-sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDel?.id)} id="btn-confirmar-excluir-servico">
              Excluir
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--gray-600)', fontSize: 14 }}>
          Deseja excluir o serviço <strong>{confirmDel?.nome}</strong>?
        </p>
      </Modal>
    </AppLayout>
  );
}
