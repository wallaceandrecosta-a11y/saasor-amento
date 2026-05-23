'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { MdCheckCircle, MdError, MdDownload, MdSignature, MdCheck, MdClose, MdRefresh } from 'react-icons/md';
import { gerarPDFOrcamento } from '@/lib/pdfGenerator';

export default function PublicProposalPage() {
  const params = useParams();
  const [orcamento, setOrcamento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados dos modais de ação
  const [modalApprove, setModalApprove] = useState(false);
  const [modalReject, setModalReject] = useState(false);
  const [modalChanges, setModalChanges] = useState(false);

  // Formulário de resposta
  const [clientName, setClientName] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBudget();
    }
  }, [params.id]);

  const fetchBudget = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orcamentos/${params.id}`);
      if (!res.ok) {
        throw new Error('Não foi possível carregar a proposta.');
      }
      const data = await res.json();
      setOrcamento(data);
    } catch (err) {
      setError(err.message || 'Erro ao carregar orçamento.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action) => {
    setSubmitting(true);
    try {
      let finalFeedback = feedbackText;
      if (action === 'approve') {
        finalFeedback = `Assinado digitalmente por: ${clientName}. ${feedbackText}`.trim();
      }

      const res = await fetch(`/api/orcamentos/${params.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, feedback: finalFeedback })
      });

      if (!res.ok) {
        let errMsg = 'Erro ao processar sua ação.';
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch (e) {}
        throw new Error(errMsg);
      }
      
      const updated = await res.json();
      setOrcamento(updated);
      
      // Fecha modais e limpa formulário
      setModalApprove(false);
      setModalReject(false);
      setModalChanges(false);
      setFeedbackText('');
      setClientName('');
      
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!orcamento) return;
    try {
      // Reconstrói estrutura compatível com pdfGenerator
      const pdfData = {
        ...orcamento,
        clienteNome: orcamento.cliente_nome || orcamento.clienteNome || orcamento.data?.clienteNome,
        clienteEmail: orcamento.cliente_email || orcamento.clienteEmail || orcamento.data?.clienteEmail,
        clienteTelefone: orcamento.cliente_telefone || orcamento.clienteTelefone || orcamento.data?.clienteTelefone,
        clienteEndereco: orcamento.cliente_endereco || orcamento.clienteEndereco || orcamento.data?.clienteEndereco,
        itens: orcamento.itens || orcamento.data?.itens || [],
        subtotal: orcamento.subtotal || orcamento.data?.subtotal || 0,
        desconto: orcamento.desconto || orcamento.data?.desconto || 0,
        total: orcamento.total || orcamento.data?.total || 0,
        validade: orcamento.validade || orcamento.data?.validade,
        observacoes: orcamento.observacoes || orcamento.data?.observacoes,
        template: orcamento.template || orcamento.data?.template || 'design'
      };
      gerarPDFOrcamento(pdfData, pdfData.clienteNome);
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar o PDF.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Preparando sua proposta digital premium...</p>
      </div>
    );
  }

  if (error || !orcamento) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-soft max-w-md w-full text-center">
          <MdError className="text-red-500 text-5xl mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-900 mb-2">Ops! Proposta não encontrada</h1>
          <p className="text-sm text-slate-500 mb-6">O link que você acessou pode ter expirado ou o orçamento foi removido.</p>
          <a href="/" className="btn-primary block w-full">Ir para a Home</a>
        </div>
      </div>
    );
  }

  // Extração segura de campos do banco ou do payload legada
  const dataDetails = orcamento.data || {};
  const numero = orcamento.number || orcamento.numero || dataDetails.numero || 'ORC-0000';
  const clienteNome = orcamento.cliente_nome || orcamento.clienteNome || dataDetails.clienteNome || 'Cliente';
  const clienteEmail = orcamento.cliente_email || orcamento.clienteEmail || dataDetails.clienteEmail || '—';
  const clienteTelefone = orcamento.cliente_telefone || orcamento.clienteTelefone || dataDetails.clienteTelefone || '—';
  const clienteEndereco = orcamento.cliente_endereco || orcamento.clienteEndereco || dataDetails.clienteEndereco || '—';
  const itens = orcamento.itens || dataDetails.itens || [];
  const subtotal = Number(orcamento.total_amount || orcamento.subtotal || dataDetails.subtotal || 0);
  const desconto = Number(orcamento.desconto || dataDetails.desconto || 0);
  const total = Number(orcamento.total_amount || orcamento.total || dataDetails.total || 0);
  const validade = orcamento.validade || dataDetails.validade;
  const observacoes = orcamento.observacoes || dataDetails.observacoes;
  
  const users = orcamento.users || {};
  const companyName = users.company_name || 'Sua Empresa';
  const companyCnpj = users.company_cnpj ? `CNPJ: ${users.company_cnpj}` : '';
  const companyEmail = users.company_email || 'contato@suaempresa.com.br';
  const isPremiumUser = users.remove_watermark !== undefined ? users.remove_watermark : (orcamento.remove_watermark !== false); 
  const brandColor = users.brand_color || orcamento.brand_color || '#2563eb';
  const brandLogoUrl = users.brand_logo_url || orcamento.brand_logo_url || null;
  const removeWatermark = users.remove_watermark !== undefined ? users.remove_watermark : (orcamento.remove_watermark || false);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Top Banner (Status) */}
      {orcamento.status === 'aprovado' && (
        <div className="bg-emerald-500 text-white py-3.5 px-4 text-center font-semibold text-sm shadow-sm flex items-center justify-center gap-2 animate-fade-in">
          <MdCheckCircle className="text-xl" /> Proposta aprovada online em {new Date(orcamento.approved_at || orcamento.updated_at).toLocaleDateString('pt-BR')}!
        </div>
      )}
      {orcamento.status === 'recusado' && (
        <div className="bg-red-500 text-white py-3.5 px-4 text-center font-semibold text-sm shadow-sm flex items-center justify-center gap-2 animate-fade-in">
          <MdClose className="text-xl" /> Proposta recusada pelo cliente.
        </div>
      )}

      {/* Main Page Area */}
      <div className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* Header Options */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {brandLogoUrl ? (
              <img src={brandLogoUrl} alt="Logo" className="h-10 w-auto object-contain max-h-12" />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm" style={{ backgroundColor: brandColor }}>
                O
              </div>
            )}
            <div>
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">{companyName}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Proposta de Serviço</p>
            </div>
          </div>

          <button onClick={handleDownloadPDF} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl shadow-soft hover:bg-slate-50 hover:shadow transition-all duration-200">
            <MdDownload className="text-lg" /> Baixar PDF
          </button>
        </div>

        {/* Dynamic Theme Color Settings */}
        <style dangerouslySetInnerHTML={{__html: `
          .brand-accent-bg { background-color: ${brandColor} !important; }
          .brand-accent-text { color: ${brandColor} !important; }
          .brand-accent-border { border-color: ${brandColor} !important; }
          .brand-accent-ring:focus { --tw-ring-color: ${brandColor}50 !important; }
        `}} />

        {/* Invoice Page Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-premium p-5 sm:p-12 relative overflow-hidden">
          
          {/* Decorative side color band */}
          <div className="absolute top-0 left-0 w-2 h-full brand-accent-bg"></div>

          {/* Proposal Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Orçamento {numero}</h1>
              <p className="text-sm text-slate-500 font-semibold uppercase tracking-wide">Código Único: {orcamento.id}</p>
            </div>
            <div className="md:text-right">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-3
                ${orcamento.status === 'aprovado' ? 'bg-emerald-100 text-emerald-700' : 
                  orcamento.status === 'recusado' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                {orcamento.status}
              </span>
              <p className="text-xs text-slate-400 font-medium">Emissão: {new Date(orcamento.created_at || orcamento.createdAt).toLocaleDateString('pt-BR')}</p>
              {validade && <p className="text-xs text-slate-500 font-bold mt-1">Válido até: {new Date(validade).toLocaleDateString('pt-BR')}</p>}
            </div>
          </div>

          {/* Customer / Provider Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Emitente</h3>
              <p className="text-sm font-bold text-slate-800">{companyName}</p>
              {companyCnpj && <p className="text-xs text-slate-500 mt-1">{companyCnpj}</p>}
              <p className="text-xs text-slate-500">{companyEmail}</p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Cliente / Destinatário</h3>
              <p className="text-sm font-bold text-slate-800">{clienteNome}</p>
              <p className="text-xs text-slate-500 mt-1">{clienteEmail}</p>
              <p className="text-xs text-slate-500">{clienteTelefone}</p>
              <p className="text-xs text-slate-500 mt-1">{clienteEndereco}</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto -mx-8 sm:mx-0">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Descrição dos Serviços / Produtos</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Quantidade</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Preço Unitário</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {itens.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-800">{item.nome}</p>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-0.5">{item.unidade}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 text-center">{item.quantidade}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600 text-right">R$ {Number(item.precoUnitario).toFixed(2).replace('.', ',')}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 text-right">R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Proposal Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mt-10 border-t border-slate-100 pt-8">
            <div className="flex-1 max-w-md">
              {observacoes ? (
                <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/60">
                  <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Observações e Termos</h4>
                  <p className="text-xs text-amber-700 leading-relaxed whiteSpace-pre-wrap">{observacoes}</p>
                </div>
              ) : (
                <div className="h-4"></div>
              )}
            </div>

            <div className="w-full sm:w-80 p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex justify-between text-xs font-semibold text-slate-500">
                <span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              {desconto > 0 && (
                <div className="flex justify-between text-xs font-bold text-red-500">
                  <span>Desconto</span><span>- R$ {desconto.toFixed(2).replace('.', ',')}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-extrabold text-slate-900 pt-3 border-t border-slate-200">
                <span>Total</span><span className="brand-accent-text">R$ {total.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>

          {/* Watermark (PRO customizable) */}
          {!removeWatermark && (
            <div className="text-center mt-12 pt-6 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold">
              Gerado com <span className="text-slate-800 font-bold">ORVEN</span> • Sistema de Orçamentos SaaS
            </div>
          )}
        </div>

        {/* Client Interactive Action Bar */}
        {orcamento.status === 'pendente' && (
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 bg-white border border-slate-200 p-5 sm:p-6 rounded-2xl shadow-soft">
            <button onClick={() => setModalApprove(true)} className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center justify-center gap-2">
              <MdCheck className="text-lg" /> Aprovar Proposta
            </button>
            <button onClick={() => setModalChanges(true)} className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2">
              Solicitar Ajustes
            </button>
            <button onClick={() => setModalReject(true)} className="w-full sm:w-auto px-6 py-3.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 font-bold rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2">
              Recusar Orçamento
            </button>
          </div>
        )}
      </div>

      {/* MODAL 1: APPROVAL */}
      {modalApprove && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setModalApprove(false)}>
          <div className="bg-white rounded-2xl shadow-premium max-w-md w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mb-4">
              <MdCheck />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Aprovar orçamento online</h2>
            <p className="text-sm text-slate-500 mb-6">Ao assinar digitalmente, o emitente será notificado da sua aceitação e o projeto estará autorizado para início.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="label-modern">Seu Nome Completo (Assinatura)</label>
                <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Digite seu nome..." className="input-modern" />
              </div>
              <div>
                <label className="label-modern">Comentários (Opcional)</label>
                <textarea rows={2} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Ex: Aguardo o envio do contrato..." className="input-modern resize-none" />
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors" onClick={() => setModalApprove(false)}>Cancelar</button>
              <button disabled={submitting || !clientName.trim()} className="flex-1 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-soft" onClick={() => handleAction('approve')}>
                {submitting ? 'Confirmando...' : 'Confirmar e Assinar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ADJUSTMENTS */}
      {modalChanges && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setModalChanges(false)}>
          <div className="bg-white rounded-2xl shadow-premium max-w-md w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-2xl mb-4">
              <MdRefresh />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Solicitar alterações</h2>
            <p className="text-sm text-slate-500 mb-4">Explique de forma clara o que precisa ser ajustado no orçamento (itens, quantidades, prazos, etc.).</p>
            
            <div className="mb-6">
              <label className="label-modern">O que deseja ajustar? *</label>
              <textarea rows={4} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Descreva os ajustes solicitados..." className="input-modern resize-none" required />
            </div>

            <div className="flex gap-3 w-full">
              <button className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors" onClick={() => setModalChanges(false)}>Cancelar</button>
              <button disabled={submitting || !feedbackText.trim()} className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-soft" onClick={() => handleAction('request_changes')}>
                {submitting ? 'Enviando...' : 'Enviar Solicitação'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REJECTION */}
      {modalReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setModalReject(false)}>
          <div className="bg-white rounded-2xl shadow-premium max-w-md w-full p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-2xl mb-4">
              <MdClose />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Recusar proposta</h2>
            <p className="text-sm text-slate-500 mb-4">Lamentamos saber disso. Se puder, nos conte o motivo da recusa para podermos melhorar no futuro.</p>
            
            <div className="mb-6">
              <label className="label-modern">Motivo da Recusa *</label>
              <textarea rows={3} value={feedbackText} onChange={e => setFeedbackText(e.target.value)} placeholder="Ex: Limitações de orçamento, prazo muito longo..." className="input-modern resize-none" required />
            </div>

            <div className="flex gap-3 w-full">
              <button className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition-colors" onClick={() => setModalReject(false)}>Cancelar</button>
              <button disabled={submitting || !feedbackText.trim()} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors shadow-soft" onClick={() => handleAction('reject')}>
                {submitting ? 'Recusando...' : 'Confirmar Recusa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
