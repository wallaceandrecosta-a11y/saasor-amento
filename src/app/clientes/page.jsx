'use client';
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import Modal from '@/components/Modal';
import { useToast } from '@/components/Toast';
import { useClientesStore } from '@/lib/store';
import { MdAdd, MdEdit, MdDelete, MdSearch, MdPerson } from 'react-icons/md';

const EMPTY = { nome: '', email: '', telefone: '', cpfCnpj: '', endereco: '' };

export default function ClientesPage() {
  const { clientes, addCliente, updateCliente, deleteCliente } = useClientesStore();
  const toast = useToast();

  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const [form, setForm]           = useState(EMPTY);
  const [editId, setEditId]       = useState(null);

  const filtered = clientes.filter((c) =>
    [c.nome, c.email, c.telefone, c.cpfCnpj].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal(true); };
  const openEdit = (c) => { setForm({ nome: c.nome, email: c.email, telefone: c.telefone, cpfCnpj: c.cpfCnpj, endereco: c.endereco }); setEditId(c.id); setModal(true); };

  const handleSave = () => {
    if (!form.nome.trim()) { toast('Nome é obrigatório.', 'error'); return; }
    if (editId) {
      updateCliente(editId, form);
      toast('Cliente atualizado com sucesso!', 'success');
    } else {
      addCliente(form);
      toast('Cliente cadastrado com sucesso!', 'success');
    }
    setModal(false);
  };

  const handleDelete = (id) => {
    deleteCliente(id);
    setConfirmDel(null);
    toast('Cliente removido.', 'info');
  };

  const field = (key, label, placeholder = '', type = 'text') => (
    <div className="form-group">
      <label className="form-label" htmlFor={`cl-${key}`}>{label}</label>
      <input
        id={`cl-${key}`}
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1>Clientes</h1>
          <p className="page-subtitle">{clientes.length} cliente(s) cadastrado(s)</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="btn-novo-cliente">
          <MdAdd /> Novo Cliente
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-input-wrapper">
          <MdSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar por nome, e-mail, telefone ou CPF/CNPJ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-clientes"
          />
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><MdPerson /></div>
            <h3>{search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}</h3>
            <p>{search ? 'Tente outros termos de busca.' : 'Comece adicionando seu primeiro cliente.'}</p>
            {!search && (
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={openAdd}>
                <MdAdd /> Adicionar Cliente
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>CPF / CNPJ</th>
                  <th>Cadastro</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td><strong>{c.nome}</strong></td>
                    <td>{c.email || '—'}</td>
                    <td>{c.telefone || '—'}</td>
                    <td>{c.cpfCnpj || '—'}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm btn-icon" title="Editar" onClick={() => openEdit(c)}>
                          <MdEdit />
                        </button>
                        <button className="btn btn-danger btn-sm btn-icon" title="Excluir" onClick={() => setConfirmDel(c)}>
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

      {/* Modal de Cadastro/Edição */}
      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={editId ? 'Editar Cliente' : 'Novo Cliente'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave} id="btn-salvar-cliente">
              {editId ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </button>
          </>
        }
      >
        {field('nome', 'Nome completo *', 'João Silva')}
        <div className="form-row form-row-2">
          {field('email', 'E-mail', 'joao@email.com', 'email')}
          {field('telefone', 'Telefone', '(11) 99999-0000')}
        </div>
        {field('cpfCnpj', 'CPF / CNPJ', '000.000.000-00 ou 00.000.000/0001-00')}
        <div className="form-group">
          <label className="form-label" htmlFor="cl-endereco">Endereço</label>
          <textarea
            id="cl-endereco"
            className="form-control"
            placeholder="Rua, número, bairro, cidade/UF"
            rows={2}
            value={form.endereco}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          />
        </div>
      </Modal>

      {/* Modal de Confirmação */}
      <Modal
        isOpen={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        title="Confirmar exclusão"
        size="modal-sm"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Cancelar</button>
            <button className="btn btn-danger" onClick={() => handleDelete(confirmDel?.id)} id="btn-confirmar-excluir-cliente">
              Excluir
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--gray-600)', fontSize: 14 }}>
          Tem certeza que deseja excluir o cliente <strong>{confirmDel?.nome}</strong>? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </AppLayout>
  );
}
