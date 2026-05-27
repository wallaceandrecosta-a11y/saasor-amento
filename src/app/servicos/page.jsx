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
    setEditId(s.id); 
    setModal(true);
  };

  const handleSave = () => {
    if (!form.nome.trim()) { toast('Nome é obrigatório.', 'error'); return; }
    if (!form.preco || isNaN(Number(form.preco))) { toast('Informe um preço válido.', 'error'); return; }
    const data = { ...form, preco: Number(form.preco) };
    if (editId) { 
      updateServico(editId, data); 
      toast('Serviço atualizado com sucesso!', 'success'); 
    } else { 
      addServico(data);            
      toast('Serviço cadastrado com sucesso!', 'success'); 
    }
    setModal(false);
  };

  const handleDelete = (id) => {
    deleteServico(id);
    setConfirmDel(null);
    toast('Serviço removido.', 'info');
  };

  return (
    <AppLayout>
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Serviços / Produtos</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">{servicos.length} item(ns) cadastrado(s)</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openAdd} id="btn-novo-servico">
          <MdAdd className="text-lg" /> Novo Serviço
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-4 animate-fade-in">
        <div className="relative flex-1 max-w-md">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
          <input
            type="text"
            className="input-modern pl-10"
            placeholder="Buscar por nome ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="search-servicos"
          />
        </div>
      </div>

      {/* Grid List */}
      <div className="card overflow-hidden animate-fade-in">
        {filtered.length === 0 ? (
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 text-3xl mb-4 shadow-inner">
              <MdBuild />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">
              {search ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
            </h3>
            <p className="text-xs text-slate-450 mb-6 max-w-xs px-4 leading-relaxed">
              {search ? 'Tente outros termos de busca.' : 'Adicione serviços ou produtos para incluir nos seus orçamentos.'}
            </p>
            {!search && (
              <button className="btn-primary" onClick={openAdd}>
                <MdAdd className="text-lg" /> Adicionar Serviço
              </button>
            )}
          </div>
        ) : (
          <div className="w-full">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 bg-slate-900/40">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Unidade</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-200">{s.nome}</td>
                    <td className="px-6 py-4 text-sm text-slate-400 max-w-xs truncate">{s.descricao || '—'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary-400">
                      R$ {Number(s.preco).toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 border border-slate-700 text-slate-300 capitalize">
                        {s.unidade}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-slate-450 hover:text-primary-400 hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-800 cursor-pointer" 
                          title="Editar" 
                          onClick={() => openEdit(s)}
                        >
                          <MdEdit className="text-base" />
                        </button>
                        <button 
                          className="p-2 text-slate-450 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/10 cursor-pointer" 
                          title="Excluir" 
                          onClick={() => setConfirmDel(s)}
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

            {/* Mobile Cards */}
            <div className="md:hidden flex flex-col divide-y divide-slate-800/40">
              {filtered.map((s) => (
                <div key={s.id} className="p-4 flex flex-col gap-3 hover:bg-slate-800/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="pr-2">
                      <h4 className="font-bold text-slate-200 text-sm">{s.nome}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{s.descricao || 'Sem descrição'}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button 
                        className="p-1.5 text-slate-450 hover:text-primary-400 hover:bg-slate-800 rounded-md transition-colors"
                        onClick={() => openEdit(s)}
                      >
                        <MdEdit className="text-sm" />
                      </button>
                      <button 
                        className="p-1.5 text-slate-450 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        onClick={() => setConfirmDel(s)}
                      >
                        <MdDelete className="text-sm" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-primary-400">
                      R$ {Number(s.preco).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-slate-300 capitalize">
                      {s.unidade}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Cadastro/Edição */}
      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={editId ? 'Editar Serviço' : 'Novo Serviço'}
        footer={
          <div className="flex gap-2 w-full justify-end">
            <button className="px-4 py-2.5 bg-[#121620] hover:bg-slate-800/80 border border-slate-800/80 text-slate-350 font-bold rounded-xl transition-colors text-sm cursor-pointer" onClick={() => setModal(false)}>
              Cancelar
            </button>
            <button className="btn-primary text-sm px-6 py-2.5" onClick={handleSave} id="btn-salvar-servico">
              {editId ? 'Salvar Alterações' : 'Cadastrar Serviço'}
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label-modern" htmlFor="sv-nome">Nome do serviço / produto *</label>
            <input id="sv-nome" type="text" className="input-modern" placeholder="Ex: Desenvolvimento de Site" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          </div>
          <div>
            <label className="label-modern" htmlFor="sv-descricao">Descrição</label>
            <textarea id="sv-descricao" className="input-modern resize-none" placeholder="Descrição detalhada do serviço..." rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-modern" htmlFor="sv-preco">Preço (R$) *</label>
              <input id="sv-preco" type="number" min="0" step="0.01" className="input-modern" placeholder="0,00" value={form.preco} onChange={(e) => setForm({ ...form, preco: e.target.value })} />
            </div>
            <div>
              <label className="label-modern" htmlFor="sv-unidade">Unidade</label>
              <div className="relative">
                <select id="sv-unidade" className="input-modern appearance-none cursor-pointer bg-[#11131a]" value={form.unidade} onChange={(e) => setForm({ ...form, unidade: e.target.value })} style={{ paddingRight: '2rem', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em' }}>
                  {UNIDADES.map((u) => <option key={u} value={u} className="bg-[#11131a]">{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
                </select>
              </div>
            </div>
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
          <div className="flex gap-2 w-full justify-end">
            <button className="px-4 py-2.5 bg-[#121620] hover:bg-slate-800/80 border border-slate-800/80 text-slate-350 font-bold rounded-xl transition-colors text-sm cursor-pointer" onClick={() => setConfirmDel(null)}>
              Cancelar
            </button>
            <button className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors text-sm cursor-pointer" onClick={() => handleDelete(confirmDel?.id)} id="btn-confirmar-excluir-servico">
              Excluir
            </button>
          </div>
        }
      >
        <p className="text-slate-400 text-sm leading-relaxed">
          Tem certeza que deseja excluir o serviço <strong className="text-white">{confirmDel?.nome}</strong>? Esta ação não pode ser desfeita e removerá seus registros associados.
        </p>
      </Modal>
    </AppLayout>
  );
}
