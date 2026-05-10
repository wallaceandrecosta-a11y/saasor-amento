'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useOrcamentosStore } from '@/lib/store';
import { gerarPDFOrcamento } from '@/lib/pdfGenerator';
import { useToast } from '@/components/Toast';
import { MdDownload, MdArrowBack, MdDelete, MdPrint, MdEmail, MdCheckCircle } from 'react-icons/md';
import Link from 'next/link';

export default function VisualizarOrcamentoPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { getOrcamento, deleteOrcamento, updateOrcamento } = useOrcamentosStore();
  
  const [orcamento, setOrcamento] = useState(null);

  useEffect(() => {
    if (params.id) {
      const data = getOrcamento(params.id);
      if (data) {
        setOrcamento(data);
      } else {
        toast('Orçamento não encontrado.', 'error');
        router.push('/orcamentos');
      }
    }
  }, [params.id, getOrcamento, router, toast]);

  if (!orcamento) return null;

  const handleDownloadPDF = () => {
    try {
      gerarPDFOrcamento(orcamento, orcamento.clienteNome);
      toast('PDF gerado com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      toast('Erro ao gerar PDF.', 'error');
    }
  };

  const handleStatusChange = (novoStatus) => {
    updateOrcamento(orcamento.id, { status: novoStatus });
    setOrcamento({ ...orcamento, status: novoStatus });
    toast(`Status alterado para ${novoStatus}!`, 'info');
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir este orçamento?')) {
      deleteOrcamento(orcamento.id);
      toast('Orçamento excluído.', 'info');
      router.push('/orcamentos');
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <Link href="/orcamentos" className="btn btn-secondary btn-sm" style={{ marginBottom: 8 }}>
            <MdArrowBack /> Voltar para lista
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1>Orçamento {orcamento.numero}</h1>
            <span className={`badge badge-${orcamento.status}`}>
              {orcamento.status.charAt(0).toUpperCase() + orcamento.status.slice(1)}
            </span>
          </div>
          <p className="page-subtitle">Criado em {new Date(orcamento.createdAt).toLocaleDateString('pt-BR')} às {new Date(orcamento.createdAt).toLocaleTimeString('pt-BR')}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-danger" onClick={handleDelete}>
            <MdDelete /> Excluir
          </button>
          <button className="btn btn-primary" onClick={handleDownloadPDF}>
            <MdDownload /> Baixar PDF
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Visualização dos Dados */}
          <div className="card">
            <div className="card-body" style={{ padding: '32px 40px' }}>
              {/* Header Visual no App */}
              <div style={{ borderBottom: '2px solid var(--gray-100)', paddingBottom: 20, marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ color: 'var(--primary-600)', marginBottom: 4 }}>WS Solutions Tecnologia</h3>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>CNPJ: 12.345.678/0001-90</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, fontSize: 16 }}>{orcamento.numero}</p>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>Emissão: {new Date(orcamento.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              {/* Cliente e Orçamento Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
                <div>
                  <h4 style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 8 }}>Dados do Cliente</h4>
                  <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{orcamento.clienteNome}</p>
                  <p style={{ fontSize: 13, color: 'var(--gray-600)' }}>{orcamento.clienteEmail}</p>
                  <p style={{ fontSize: 13, color: 'var(--gray-600)' }}>{orcamento.clienteTelefone}</p>
                  <p style={{ fontSize: 13, color: 'var(--gray-600)', marginTop: 4 }}>{orcamento.clienteEndereco}</p>
                </div>
                <div>
                  <h4 style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 8 }}>Validade e Status</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{ fontSize: 14 }}><strong>Validade:</strong> {orcamento.validade ? new Date(orcamento.validade).toLocaleDateString('pt-BR') : 'Não informada'}</p>
                    <p style={{ fontSize: 14 }}><strong>Status Atual:</strong> {orcamento.status}</p>
                  </div>
                </div>
              </div>

              {/* Tabela de Itens */}
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Serviço / Produto</th>
                      <th style={{ textAlign: 'center' }}>Qtd.</th>
                      <th style={{ textAlign: 'right' }}>Unitário</th>
                      <th style={{ textAlign: 'right' }}>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orcamento.itens.map((item, idx) => (
                      <tr key={idx}>
                        <td>
                          <p style={{ fontWeight: 600 }}>{item.nome}</p>
                          <p style={{ fontSize: 11, color: 'var(--gray-500)' }}>Unidade: {item.unidade}</p>
                        </td>
                        <td style={{ textAlign: 'center' }}>{item.quantidade}</td>
                        <td style={{ textAlign: 'right' }}>R$ {item.precoUnitario.toFixed(2).replace('.', ',')}</td>
                        <td style={{ textAlign: 'right', fontWeight: 600 }}>R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Resumo Final */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                <div style={{ width: 280, padding: 20, background: 'var(--gray-50)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--gray-600)' }}>
                    <span>Subtotal:</span>
                    <span>R$ {Number(orcamento.subtotal).toFixed(2).replace('.', ',')}</span>
                  </div>
                  {orcamento.desconto > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: 'var(--danger)' }}>
                      <span>Desconto:</span>
                      <span>- R$ {Number(orcamento.desconto).toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid var(--gray-200)', fontWeight: 700, fontSize: 18 }}>
                    <span>TOTAL:</span>
                    <span style={{ color: 'var(--primary-600)' }}>R$ {Number(orcamento.total).toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {orcamento.observacoes && (
                <div style={{ marginTop: 32, padding: 20, borderLeft: '4px solid var(--warning)', background: '#fffbeb', borderRadius: '0 8px 8px 0' }}>
                  <h4 style={{ fontSize: 11, color: '#92400e', textTransform: 'uppercase', marginBottom: 8 }}>Observações</h4>
                  <p style={{ fontSize: 13, color: '#92400e', whiteSpace: 'pre-wrap' }}>{orcamento.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar de Ações */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Gerenciar Status</h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button 
                className={`btn btn-full ${orcamento.status === 'aprovado' ? 'btn-success' : 'btn-secondary'}`}
                onClick={() => handleStatusChange('aprovado')}
              >
                <MdCheckCircle /> Marcar como Aprovado
              </button>
              <button 
                className={`btn btn-full ${orcamento.status === 'recusado' ? 'btn-danger' : 'btn-secondary'}`}
                onClick={() => handleStatusChange('recusado')}
              >
                Marcar como Recusado
              </button>
              <button 
                className={`btn btn-full ${orcamento.status === 'cancelado' ? 'btn-secondary' : 'btn-secondary'}`}
                onClick={() => handleStatusChange('cancelado')}
              >
                Cancelar Orçamento
              </button>
            </div>
          </div>

          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-header">
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Enviar Orçamento</h2>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-secondary btn-full" onClick={() => toast('Função de e-mail não disponível nesta demo.', 'info')}>
                <MdEmail /> Enviar por E-mail
              </button>
              <button className="btn btn-secondary btn-full" onClick={handleDownloadPDF}>
                <MdPrint /> Imprimir / PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
