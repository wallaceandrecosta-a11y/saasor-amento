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
  const openEdit = (c) => { 
    setForm({ 
      nome: c.nome, 
      email: c.email || '', 
      telefone: c.telefone || '', 
      cpfCnpj: c.cpfCnpj || '', 
      endereco: c.endereco || '' 
    }); 
    setEditId(c.id); 
    setModal(true); 
  };

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
    <div className="mb-4">
      <label className="label-modern" htmlFor={`cl-${key}`}>{label}</label>
      <input
        id={`cl-${key}`}
        type={type}
        className="input-modern"
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <AppLayout>
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Clientes</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">{clientes.length} cliente(s) cadastrado(s)</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openAdd} id="btn-novo-cliente">
          <MdAdd className="text-lg" /> Novo Cliente
        </button>
      </div>

      {/* Filters & Search */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            className="input-modern pl-10"
            placeholder="Buscar por nome, e-mail, telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-clientes"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 text-3xl mb-4 shadow-inner">
              <MdPerson />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              {search ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-xs text-slate-450 mb-6 max-w-xs px-4 leading-relaxed">
              {search ? 'Tente outros termos de busca.' : 'Comece adicionando seu primeiro cliente para gerar orçamentos.'}
            </p>
            {!search && (
              <button className="btn-primary" onClick={openAdd}>
                <MdAdd className="text-lg" /> Adicionar Cliente
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">E-mail</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">CPF / CNPJ</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-200">{c.nome}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{c.email || '—'}</td>
                    <td className="px-6 py-4 text-sm text-slate-400">{c.telefone || '—'}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{c.cpfCnpj || '—'}</td>
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-slate-450 hover:text-primary-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-800 cursor-pointer" 
                          title="Editar" 
                          onClick={() => openEdit(c)}
                        >
                          <MdEdit className="text-base" />
                        </button>
                        <button 
                          className="p-2 text-slate-450 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/10 cursor-pointer" 
                          title="Excluir" 
                          onClick={() => setConfirmDel(c)}
                        >
                          <MdDelete className="text-base" />
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
          <div className="flex gap-2 w-full justify-end">
            <button className="px-4 py-2.5 bg-[#121620] hover:bg-slate-800/80 border border-slate-800/80 text-slate-350 font-bold rounded-xl transition-colors text-sm cursor-pointer" onClick={() => setModal(false)}>
              Cancelar
            </button>
            <button className="btn-primary text-sm px-6 py-2.5" onClick={handleSave} id="btn-salvar-cliente">
              {editId ? 'Salvar Alterações' : 'Cadastrar Cliente'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {field('nome', 'Nome completo *', 'João Silva')}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field('email', 'E-mail', 'joao@email.com', 'email')}
            {field('telefone', 'Telefone', '(11) 99999-0000')}
          </div>
          
          {field('cpfCnpj', 'CPF / CNPJ', '000.000.000-00 ou 00.000.000/0001-00')}
          
          <div>
            <label className="label-modern" htmlFor="cl-endereco">Endereço</label>
            <textarea
              id="cl-endereco"
              className="input-modern resize-none"
              placeholder="Rua, número, bairro, cidade/UF"
              rows={2}
              value={form.endereco}
              onChange={(e) => setForm({ ...form, endereco: e.target.value })}
            />
          </div>
        </div>
      </Modal>

      {/* Modal de Confirmação */}
      <Modal
        isOpen={!!confirmDel}
        onClose={() => setConfirmDel(null)}
        title="Confirmar exclusão"
        size="modal-sm"
        footer={
          <div className="flex gap-2 w-full justify-end">
            <button className="px-4 py-2.5 bg-[#121620] hover:bg-slate-800/80 border border-slate-800/80 text-slate-350 font-bold rounded-xl transition-colors text-sm cursor-pointer" onClick={() => setConfirmDel(null)}>
              Cancelar
            </button>
            <button className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors text-sm cursor-pointer" onClick={() => handleDelete(confirmDel?.id)} id="btn-confirmar-excluir-cliente">
              Excluir
            </button>
          </div>
        }
      >
        <p className="text-slate-400 text-sm leading-relaxed">
          Tem certeza que deseja excluir o cliente <strong className="text-white">{confirmDel?.nome}</strong>? Esta ação não pode ser desfeita e removerá seus registros associados.
        </p>
      </Modal>
    </AppLayout>
  );
}
