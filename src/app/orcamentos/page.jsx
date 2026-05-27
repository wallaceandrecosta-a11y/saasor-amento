'use client';
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { useOrcamentosStore } from '@/lib/store';
import Link from 'next/link';
import { MdAdd, MdSearch, MdVisibility, MdDelete, MdFilterList, MdContentCopy, MdDescription } from 'react-icons/md';

const STATUS_OPTIONS = ['todos', 'pendente', 'aprovado', 'recusado', 'cancelado'];

export default function OrcamentosPage() {
  const { orcamentos, updateOrcamento, deleteOrcamento } = useOrcamentosStore();
  const [search, setSearch]   = useState('');
  const [status, setStatus]   = useState('todos');
  const [confirmDel, setConfirmDel] = useState(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 7;

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

  const paginatedData = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Orçamentos</h1>
            <p className="text-sm text-[#8B95A7] mt-1 font-medium">Gerencie suas propostas e acompanhe os status.</p>
          </div>
          <Link href="/orcamentos/novo" className="btn-primary shrink-0">
            <MdAdd className="text-lg mr-1" /> Novo Orçamento
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#071A3D]/25 border border-blue-900/15 backdrop-blur-xl shadow-2xl p-4 rounded-[20px] animate-fade-in">
          <div className="relative w-full md:max-w-md">
            <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B95A7] text-lg" />
            <input
              type="text"
              className="input-modern pl-10"
              placeholder="Buscar por número ou cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
            <div className="flex items-center gap-1.5 text-[#8B95A7] text-sm font-bold mr-2 shrink-0">
              <MdFilterList /> Status:
            </div>
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  status === s 
                    ? 'bg-primary-500 text-white shadow-glow' 
                    : 'bg-[#050816] border border-blue-900/20 text-[#8B95A7] hover:bg-[#071A3D]/40 hover:text-white'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table Card */}
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4 shadow-inner">
                <MdDescription className="text-4xl" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {orcamentos.length === 0 ? 'Nenhum orçamento ainda' : 'Nenhum resultado encontrado'}
              </h3>
              <p className="text-sm text-slate-450 mb-6 max-w-sm leading-relaxed">
                {orcamentos.length === 0
                  ? 'Você ainda não gerou nenhum orçamento. Comece agora mesmo e envie para seus clientes.'
                  : 'Tente ajustar os filtros ou os termos de busca para encontrar o que procura.'}
              </p>
              {orcamentos.length === 0 && (
                <Link href="/orcamentos/novo" className="btn-primary">
                  <MdAdd className="text-lg mr-1" /> Criar meu primeiro orçamento
                </Link>
              )}
            </div>
          ) : (
          <div className="w-full">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-900/40">
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Número</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Valor Total</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {paginatedData.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/20 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-200">#{o.numero}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-250 group-hover:text-primary-400 transition-colors">{o.clienteNome}</p>
                        <p className="text-xs text-slate-500 font-medium">{o.itens?.length ?? 0} item(s)</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-white">
                          R$ {Number(o.total).toFixed(2).replace('.', ',')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-400">
                        {new Date(o.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className={`text-xs font-bold uppercase tracking-wider rounded-full px-3 py-1 outline-none cursor-pointer border border-transparent hover:border-slate-700 transition-all appearance-none bg-[#11131a]
                            ${o.status === 'aprovado' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                              o.status === 'pendente' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                              o.status === 'recusado' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-850 border-slate-700 text-slate-400'}`}
                          value={o.status}
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          style={{ paddingRight: '1.5rem', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.2rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
                        >
                          {['pendente', 'aprovado', 'recusado', 'cancelado'].map((s) => (
                            <option key={s} value={s} className="bg-[#11131a] text-slate-200">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/orcamentos/${o.id}`} className="p-2 text-slate-450 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors" title="Visualizar">
                            <MdVisibility className="text-lg" />
                          </Link>
                          <Link href={`/orcamentos/novo?clone=${o.id}`} className="p-2 text-slate-450 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Duplicar">
                            <MdContentCopy className="text-lg" />
                          </Link>
                          <button
                            className="p-2 text-slate-450 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Excluir"
                            onClick={() => setConfirmDel(o)}
                          >
                            <MdDelete className="text-lg" />
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
              {paginatedData.map((o) => (
                <div key={o.id} className="p-4 flex flex-col gap-3 hover:bg-slate-800/20 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold text-slate-500 block mb-0.5">#{o.numero}</span>
                      <h4 className="font-bold text-slate-200 text-sm line-clamp-1">{o.clienteNome}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{o.itens?.length ?? 0} item(s) • {new Date(o.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <span className="text-sm font-bold text-white shrink-0">
                      R$ {Number(o.total).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <select
                      className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 py-1 outline-none cursor-pointer border border-transparent hover:border-slate-700 transition-all appearance-none bg-[#11131a]
                        ${o.status === 'aprovado' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                          o.status === 'pendente' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                          o.status === 'recusado' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-slate-850 border-slate-700 text-slate-400'}`}
                      value={o.status}
                      onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      style={{ paddingRight: '1.2rem', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.2rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1em 1em' }}
                    >
                      {['pendente', 'aprovado', 'recusado', 'cancelado'].map((s) => (
                        <option key={s} value={s} className="bg-[#11131a] text-slate-200">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>

                    <div className="flex gap-1 shrink-0">
                      <Link href={`/orcamentos/${o.id}`} className="p-1.5 text-slate-450 hover:text-primary-400 hover:bg-slate-800 rounded-md transition-colors">
                        <MdVisibility className="text-sm" />
                      </Link>
                      <Link href={`/orcamentos/novo?clone=${o.id}`} className="p-1.5 text-slate-450 hover:text-white hover:bg-slate-800 rounded-md transition-colors">
                        <MdContentCopy className="text-sm" />
                      </Link>
                      <button 
                        className="p-1.5 text-slate-450 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                        onClick={() => setConfirmDel(o)}
                      >
                        <MdDelete className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          )}
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/80 bg-slate-900/40">
              <span className="text-sm text-slate-405">
                Página <span className="font-bold text-white">{page}</span> de <span className="font-bold text-white">{totalPages}</span>
              </span>
              <div className="flex gap-2">
                <button 
                  className="px-3.5 py-2 text-sm font-bold text-slate-300 bg-[#121620] border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                >
                  Anterior
                </button>
                <button 
                  className="px-3.5 py-2 text-sm font-bold text-slate-300 bg-[#121620] border border-slate-800 rounded-xl hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in" onClick={() => setConfirmDel(null)}>
          <div className="bg-[#11131a] rounded-3xl border border-slate-800 shadow-premium max-w-sm w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-450 flex items-center justify-center text-2xl mb-4">
              <MdDelete />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Excluir orçamento?</h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              Deseja realmente excluir o orçamento <strong className="text-white">#{confirmDel.numero}</strong>? Esta ação não poderá ser desfeita.
            </p>
            <div className="flex gap-3 w-full">
              <button className="flex-1 px-4 py-2.5 bg-[#121620] hover:bg-slate-800/80 border border-slate-800/80 text-slate-350 font-bold rounded-xl transition-colors text-sm cursor-pointer" onClick={() => setConfirmDel(null)}>
                Cancelar
              </button>
              <button className="flex-1 px-4 py-2.5 bg-red-650 hover:bg-red-750 text-white font-bold rounded-xl transition-all text-sm cursor-pointer shadow-soft hover:shadow-lg hover:shadow-red-500/10" onClick={() => handleDelete(confirmDel.id)}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
