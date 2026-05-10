'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { useClientesStore, useServicosStore, useOrcamentosStore } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { MdAdd, MdDelete, MdSave, MdArrowBack, MdSearch, MdPeople, MdBuild } from 'react-icons/md';
import Link from 'next/link';

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const toast = useToast();
  const { clientes } = useClientesStore();
  const { servicos } = useServicosStore();
  const { addOrcamento } = useOrcamentosStore();

  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState([]);
  const [desconto, setDesconto] = useState(0);
  const [validade, setValidade] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Estados para seleção de itens
  const [searchServico, setSearchServico] = useState('');
  const [showServicos, setShowServicos] = useState(false);

  // Totais calculados
  const subtotal = useMemo(() => {
    return itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0);
  }, [itens]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - (Number(desconto) || 0));
  }, [subtotal, desconto]);

  const selectedCliente = useMemo(() => {
    return clientes.find(c => c.id === clienteId);
  }, [clientes, clienteId]);

  const filteredServicos = useMemo(() => {
    if (!searchServico) return servicos;
    return servicos.filter(s => s.nome.toLowerCase().includes(searchServico.toLowerCase()));
  }, [servicos, searchServico]);

  const addItem = (servico) => {
    const exists = itens.find(i => i.servicoId === servico.id);
    if (exists) {
      updateItem(servico.id, 'quantidade', exists.quantidade + 1);
    } else {
      setItens([...itens, {
        id: Date.now(),
        servicoId: servico.id,
        nome: servico.nome,
        precoUnitario: servico.preco,
        quantidade: 1,
        unidade: servico.unidade
      }]);
    }
    setSearchServico('');
    setShowServicos(false);
  };

  const updateItem = (id, field, value) => {
    setItens(itens.map(item => {
      if (item.servicoId === id || item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setItens(itens.filter(item => item.id !== id && item.servicoId !== id));
  };

  const handleSave = () => {
    if (!clienteId) {
      toast('Selecione um cliente para o orçamento.', 'error');
      return;
    }
    if (itens.length === 0) {
      toast('Adicione pelo menos um item ao orçamento.', 'error');
      return;
    }

    const orcamentoData = {
      clienteId,
      clienteNome: selectedCliente.nome,
      clienteEmail: selectedCliente.email,
      clienteTelefone: selectedCliente.telefone,
      clienteEndereco: selectedCliente.endereco,
      itens,
      subtotal,
      desconto: Number(desconto) || 0,
      total,
      validade,
      observacoes,
      status: 'pendente'
    };

    const novo = addOrcamento(orcamentoData);
    toast('Orçamento criado com sucesso!', 'success');
    router.push(`/orcamentos/${novo.id}`);
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <Link href="/orcamentos" className="btn btn-secondary btn-sm" style={{ marginBottom: 8 }}>
            <MdArrowBack /> Voltar para lista
          </Link>
          <h1>Criar Novo Orçamento</h1>
          <p className="page-subtitle">Preencha os dados abaixo para gerar um orçamento profissional.</p>
        </div>
        <button className="btn btn-primary" onClick={handleSave}>
          <MdSave /> Salvar Orçamento
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Seleção de Cliente */}
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>1. Dados do Cliente</h2>
            </div>
            <div className="card-body">
              <div className="form-group">
                <label className="form-label">Selecionar Cliente *</label>
                <select 
                  className="form-control" 
                  value={clienteId} 
                  onChange={(e) => setClienteId(e.target.value)}
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome} {c.cpfCnpj ? `(${c.cpfCnpj})` : ''}</option>
                  ))}
                </select>
              </div>

              {selectedCliente && (
                <div style={{ 
                  marginTop: 16, 
                  padding: 16, 
                  background: 'var(--gray-50)', 
                  borderRadius: 'var(--radius-md)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                  fontSize: 13
                }}>
                  <div>
                    <p style={{ color: 'var(--gray-500)', marginBottom: 2 }}>E-mail:</p>
                    <p style={{ fontWeight: 500 }}>{selectedCliente.email || '—'}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--gray-500)', marginBottom: 2 }}>Telefone:</p>
                    <p style={{ fontWeight: 500 }}>{selectedCliente.telefone || '—'}</p>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <p style={{ color: 'var(--gray-500)', marginBottom: 2 }}>Endereço:</p>
                    <p style={{ fontWeight: 500 }}>{selectedCliente.endereco || '—'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Itens do Orçamento */}
          <div className="card">
            <div className="card-header" style={{ justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>2. Itens do Orçamento</h2>
              <div style={{ position: 'relative' }}>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowServicos(!showServicos)}
                >
                  <MdAdd /> Adicionar Item
                </button>

                {showServicos && (
                  <div className="card" style={{ 
                    position: 'absolute', 
                    top: 'calc(100% + 8px)', 
                    right: 0, 
                    width: 350, 
                    zIndex: 10,
                    boxShadow: 'var(--shadow-lg)'
                  }}>
                    <div className="card-body" style={{ padding: 12 }}>
                      <div className="search-input-wrapper" style={{ marginBottom: 12 }}>
                        <MdSearch className="search-icon" />
                        <input 
                          type="text" 
                          className="search-input" 
                          placeholder="Buscar serviço..."
                          autoFocus
                          value={searchServico}
                          onChange={(e) => setSearchServico(e.target.value)}
                        />
                      </div>
                      <div style={{ maxHeight: 250, overflowY: 'auto' }}>
                        {filteredServicos.length === 0 ? (
                          <p style={{ textAlign: 'center', padding: 12, fontSize: 13, color: 'var(--gray-500)' }}>
                            Nenhum serviço encontrado.
                          </p>
                        ) : (
                          filteredServicos.map(s => (
                            <button
                              key={s.id}
                              className="nav-item"
                              style={{ 
                                width: '100%', 
                                textAlign: 'left', 
                                border: 'none', 
                                background: 'transparent',
                                color: 'var(--gray-700)',
                                padding: '8px 12px'
                              }}
                              onClick={() => addItem(s)}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span style={{ fontWeight: 600 }}>{s.nome}</span>
                                <span style={{ color: 'var(--primary-600)' }}>R$ {s.preco.toFixed(2)}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="card-body">
              {itens.length === 0 ? (
                <div className="empty-state" style={{ padding: '40px 0' }}>
                  <MdBuild className="empty-icon" />
                  <h3>Carrinho vazio</h3>
                  <p>Adicione produtos ou serviços ao seu orçamento clicando no botão acima.</p>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 12, display: 'grid', gridTemplateColumns: '2fr 80px 120px 120px 40px', gap: 12, padding: '0 12px', color: 'var(--gray-500)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                    <div>Descrição do Item</div>
                    <div style={{ textAlign: 'center' }}>Qtd.</div>
                    <div style={{ textAlign: 'right' }}>Vl. Unitário</div>
                    <div style={{ textAlign: 'right' }}>Total Item</div>
                    <div></div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {itens.map((item) => (
                      <div key={item.id} className="orcamento-item-row" style={{ gridTemplateColumns: '2fr 80px 120px 120px 40px' }}>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 14 }}>{item.nome}</p>
                          <p style={{ fontSize: 12, color: 'var(--gray-500)' }}>Unidade: {item.unidade}</p>
                        </div>
                        <input 
                          type="number" 
                          className="form-control" 
                          style={{ textAlign: 'center', padding: '6px' }}
                          value={item.quantidade}
                          min="1"
                          onChange={(e) => updateItem(item.id, 'quantidade', Number(e.target.value))}
                        />
                        <input 
                          type="number" 
                          className="form-control" 
                          style={{ textAlign: 'right', padding: '6px' }}
                          value={item.precoUnitario}
                          step="0.01"
                          onChange={(e) => updateItem(item.id, 'precoUnitario', Number(e.target.value))}
                        />
                        <div style={{ textAlign: 'right', padding: '6px', fontWeight: 700, alignSelf: 'center' }}>
                          R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}
                        </div>
                        <button 
                          className="btn btn-danger btn-sm btn-icon" 
                          onClick={() => removeItem(item.id)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>3. Observações Adicionais</h2>
            </div>
            <div className="card-body">
              <textarea 
                className="form-control" 
                rows={4} 
                placeholder="Ex: Prazo de entrega, condições de pagamento, validade das peças, etc."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Resumo e Totais */}
        <div style={{ position: 'sticky', top: 24 }}>
          <div className="card">
            <div className="card-header">
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Resumo Financeiro</h2>
            </div>
            <div className="card-body">
              <div className="totals-box" style={{ border: 'none', background: 'transparent', padding: 0 }}>
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                
                <div className="form-group" style={{ margin: '12px 0' }}>
                  <label className="form-label" style={{ fontSize: 12 }}>Desconto Aplicado (R$)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={desconto}
                    onChange={(e) => setDesconto(Number(e.target.value))}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="form-group" style={{ margin: '12px 0' }}>
                  <label className="form-label" style={{ fontSize: 12 }}>Validade do Orçamento</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={validade}
                    onChange={(e) => setValidade(e.target.value)}
                  />
                </div>

                <div className="total-row grand">
                  <span>VALOR TOTAL:</span>
                  <span style={{ color: 'var(--primary-600)' }}>
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              <button 
                className="btn btn-primary btn-full btn-lg" 
                style={{ marginTop: 24 }}
                onClick={handleSave}
              >
                <MdSave /> Finalizar Orçamento
              </button>
            </div>
          </div>
          
          <div className="card" style={{ marginTop: 16, background: 'var(--primary-50)', borderColor: 'var(--primary-200)' }}>
            <div className="card-body" style={{ fontSize: 12, color: 'var(--primary-800)' }}>
              <p><strong>Dica:</strong> Após salvar, você poderá visualizar a visualização completa e baixar o arquivo em PDF para enviar ao cliente.</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
