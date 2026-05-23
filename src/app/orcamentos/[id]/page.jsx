'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useOrcamentosStore } from '@/lib/store';
import { downloadPDFOrcamento, gerarPDFDataURL } from '@/lib/pdfGenerator';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/Toast';
import { 
  MdDownload, MdArrowBack, MdDelete, MdPrint, MdEmail, 
  MdCheckCircle, MdContentCopy, MdOutlineRemoveRedEye, 
  MdOutlineAccessTime, MdInfoOutline, MdHistory, MdShare
} from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

export default function VisualizarOrcamentoPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { getOrcamento, deleteOrcamento, updateOrcamento, syncWithSupabase } = useOrcamentosStore();
  
  const [orcamento, setOrcamento] = useState(null);
  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [profile, setProfile] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    // 1. Carrega do cache local imediatamente para o usuário não ver tela em branco
    if (params.id) {
      const cached = getOrcamento(params.id);
      if (cached) {
        setOrcamento(cached);
      }
    }

    // 2. Sincroniza em segundo plano com a nuvem
    syncWithSupabase().then(() => {
      if (params.id) {
        const data = getOrcamento(params.id);
        if (data) {
          setOrcamento(data);
        } else {
          toast('Orçamento não encontrado.', 'error');
          router.push('/orcamentos');
        }
      }
    });

    // Buscar perfil
    async function fetchProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();
        setProfile(data);
      }
    }
    fetchProfile();
  }, [params.id, getOrcamento, router, toast, supabase]);

  useEffect(() => {
    if (orcamento) {
      gerarPDFDataURL(orcamento, orcamento.clienteNome).then(url => {
        setPdfDataUrl(url);
      });
    }
  }, [orcamento]);

  if (!orcamento) return null;

  const handleDownloadPDF = async () => {
    try {
      await downloadPDFOrcamento(orcamento, orcamento.clienteNome);
      toast('PDF gerado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      toast('Erro ao gerar PDF.', 'error');
    }
  };

  const handleStatusChange = async (novoStatus) => {
    await updateOrcamento(orcamento.id, { status: novoStatus });
    setOrcamento({ ...orcamento, status: novoStatus });
    toast(`Status alterado para ${novoStatus}!`, 'info');
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      await deleteOrcamento(orcamento.id);
      toast('Orçamento excluído.', 'info');
      router.push('/orcamentos');
    }
  };

  const publicLink = typeof window !== 'undefined' ? `${window.location.origin}/proposta/${orcamento.id}` : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicLink);
    toast('Link copiado para a área de transferência!', 'success');
  };

  const handleWhatsApp = () => {
    const msg = `Olá ${orcamento.clienteNome || 'Cliente'}, seu orçamento ${orcamento.numero} já está pronto! Acesse o link para conferir a proposta interativa e assinar online: ${publicLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const templateColors = {
    design: '#2563eb', // Royal Blue
    saude: '#0d9488', // Teal
    visual: '#1e293b', // Slate dark
    digital: '#9333ea', // Purple
    beauty: '#db2777', // Pink
    servicos: '#ea580c' // Orange
  };

  const activeColor = templateColors[orcamento.template || 'design'] || templateColors.design;

  return (
    <AppLayout>
      {/* Alerta de perfil incompleto */}
      {profile && (!profile.company_name || !profile.company_email) && (
        <div className="bg-amber-500 text-amber-950 px-4 py-3 rounded-xl mb-6 flex items-center justify-between shadow-sm animate-fade-in border border-amber-600/20">
          <div className="flex items-center gap-3">
            <MdInfoOutline className="text-xl" />
            <span className="text-sm font-semibold">Os dados da sua empresa (Nome e E-mail) estão incompletos.</span>
          </div>
          <Link href="/settings/profile" className="text-xs font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
            Completar Cadastro
          </Link>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <Link href="/orcamentos" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-primary-600 mb-2 transition-colors">
            <MdArrowBack className="mr-1" /> Voltar para a lista
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Orçamento {orcamento.numero}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider
              ${orcamento.status === 'aprovado' ? 'bg-emerald-100 text-emerald-800' : 
                orcamento.status === 'recusado' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
              {orcamento.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">Criado em {new Date(orcamento.createdAt).toLocaleDateString('pt-BR')} às {new Date(orcamento.createdAt).toLocaleTimeString('pt-BR')}</p>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button className="btn-secondary py-2 text-red-600 border-red-100 hover:bg-red-50 flex items-center gap-1.5" onClick={handleDelete}>
            <MdDelete /> Excluir
          </button>
          <Link href={`/orcamentos/novo?clone=${orcamento.id}`} className="btn-secondary py-2 flex items-center gap-1.5">
            <MdContentCopy /> Duplicar
          </Link>
          <button className="btn-primary py-2 flex items-center gap-1.5" onClick={handleDownloadPDF} style={{ background: activeColor, borderColor: activeColor }}>
            <MdDownload /> Baixar PDF
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        
        {/* Left Side: Proposal Doc Mock */}
        <div className="bg-slate-200/50 rounded-3xl border border-slate-200 shadow-inner p-2 relative overflow-hidden flex flex-col min-h-[850px]">
          {pdfDataUrl ? (
            <iframe 
              src={`${pdfDataUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
              className="w-full h-full rounded-2xl flex-1 bg-white" 
              title="Prévia do Orçamento"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-4 flex-1">
              <div className="w-10 h-10 border-4 border-slate-300 border-t-primary-500 rounded-full animate-spin"></div>
              <p className="text-sm font-bold uppercase tracking-wider">Gerando visualização...</p>
            </div>
          )}
        </div>

        {/* Right Side: Shared Tools, Revisions & Tracking */}
        <div className="space-y-6">
          
          {/* Share & Public Link Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MdShare className="text-lg text-primary-500" /> Link de Envio Online
            </h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2 overflow-hidden">
                <span className="text-xs text-slate-500 truncate select-all font-mono">{publicLink}</span>
                <button onClick={handleCopyLink} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 shadow-sm transition-all" title="Copiar Link">
                  <MdContentCopy className="text-base" />
                </button>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={handleWhatsApp} 
                  className="flex-1 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <FaWhatsapp className="text-base" /> WhatsApp
                </button>
                
                <button 
                  onClick={handleCopyLink} 
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  <MdContentCopy className="text-base" /> Copiar Link
                </button>
              </div>
            </div>
          </div>

          {/* Quick Status Control */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4">Mudar Status Manual</h3>
            <div className="flex flex-col gap-2">
              <button onClick={() => handleStatusChange('aprovado')} className={`btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 ${orcamento.status === 'aprovado' ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-50' : ''}`}>
                <MdCheckCircle className="text-base text-emerald-600" /> Marcar como Aprovado
              </button>
              <button onClick={() => handleStatusChange('recusado')} className={`btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 ${orcamento.status === 'recusado' ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-50' : ''}`}>
                Marcar como Recusado
              </button>
              <button onClick={() => handleStatusChange('pendente')} className={`btn-secondary text-xs py-2.5 flex items-center justify-center gap-1.5 ${orcamento.status === 'pendente' ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-50' : ''}`}>
                Marcar como Pendente (Ajustes)
              </button>
            </div>
          </div>

          {/* Tracking & Analytics Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MdOutlineRemoveRedEye className="text-lg text-primary-500" /> Analytics do Cliente
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Visualizações</p>
                <p className="text-2xl font-extrabold text-slate-800">{orcamento.view_count || 0}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center flex flex-col justify-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status Link</p>
                <span className="text-xs font-bold text-emerald-600">Online</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Primeiro acesso</span>
                <span className="text-slate-700 font-bold">
                  {orcamento.first_viewed_at ? new Date(orcamento.first_viewed_at).toLocaleDateString('pt-BR') : '—'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400 font-medium">Último acesso</span>
                <span className="text-slate-700 font-bold">
                  {orcamento.last_viewed_at ? new Date(orcamento.last_viewed_at).toLocaleDateString('pt-BR') : '—'}
                </span>
              </div>
              {orcamento.approved_at && (
                <>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">Data Aprovação</span>
                    <span className="text-slate-700 font-bold">{new Date(orcamento.approved_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-400 font-medium">IP Assinatura</span>
                    <span className="text-slate-700 font-mono font-bold text-[10px]">{orcamento.approved_ip || '—'}</span>
                  </div>
                </>
              )}
            </div>

            {/* Client Signature / Feedback banner */}
            {orcamento.client_feedback && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <span className="font-extrabold text-slate-700 block mb-1">Feedback do Cliente</span>
                <p className="text-slate-600 italic">"{orcamento.client_feedback}"</p>
              </div>
            )}
          </div>

          {/* Access Logs History */}
          {orcamento.tracking_history && orcamento.tracking_history.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <MdHistory className="text-lg text-primary-500" /> Histórico de Eventos
              </h3>

              <div className="space-y-3 max-h-48 overflow-y-auto pr-1 text-xs">
                {orcamento.tracking_history.map((log, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-1 transition-colors">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-700">{log.event || 'Acesso Link'}</span>
                      <span className="text-slate-400 text-[10px]">
                        {new Date(log.timestamp).toLocaleDateString('pt-BR')} {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>IP: {log.ip}</span>
                      {log.feedback && <span className="font-medium italic truncate max-w-[150px]">"{log.feedback}"</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </AppLayout>
  );
}
