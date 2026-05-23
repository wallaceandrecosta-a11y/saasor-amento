'use client';
export const dynamic = 'force-dynamic';
import { useState, useMemo, useEffect, Suspense } from 'react';
import AppLayout from '@/components/AppLayout';
import { useRouter, useSearchParams } from 'next/navigation';
import { useClientesStore, useServicosStore, useOrcamentosStore } from '@/lib/store';
import { useToast } from '@/components/Toast';
import { usePlan } from '@/lib/planContext';
import UpgradeGate from '@/components/UpgradeGate';
import { 
  MdAdd, MdDelete, MdArrowBack, MdSearch, 
  MdContentPaste, MdOutlineInsertDriveFile, MdArrowForward,
  MdFlashOn, MdStar, MdStarBorder, MdSell, MdOutlineAutoAwesome, MdOfflineBolt,
  MdCheckCircle, MdInfo, MdSecurity, MdAutorenew, MdLock
} from 'react-icons/md';
import Link from 'next/link';

import { AI_AUTOCOMPLETE_DATABASE, SUGESTOES_SERVICOS, NICHOS_PRESETS } from '@/lib/niches';

// 4. Regras de Combos / Upsells Recomendados
const COMBO_RULES = {
  'manutenção de ar condicionado': {
    nome: 'Higienização + Recarga de Gás',
    preco: 250.0,
    unidade: 'serviço',
    descricao: 'Higienização química profunda e recarga completa preventiva de gás refrigerante R410A.'
  },
  'limpeza de pele': {
    nome: 'Peeling de Diamante',
    preco: 90.0,
    unidade: 'sessão',
    descricao: 'Microdermoabrasão física profunda para eliminação de células mortas e estímulo de colágeno.'
  },
  'gestão de redes sociais': {
    nome: 'Campanha de Tráfego Pago',
    preco: 700.0,
    unidade: 'mês',
    descricao: 'Configuração e veiculação de anúncios patrocinados no Instagram, Facebook e Google.'
  },
  'instalação elétrica predial': {
    nome: 'Laudo de Conformidade Técnica',
    preco: 450.0,
    unidade: 'serviço',
    descricao: 'Laudo de validação técnica das instalações e emissão de ART de conformidade civil.'
  }
};

// 5. Tags Rápidas de Observações
const QUICK_OBS_TAGS = [
  { label: 'Validade: 7 dias', text: 'Orçamento válido por 7 dias.' },
  { label: 'Validade: 15 dias', text: 'Orçamento válido por 15 dias.' },
  { label: 'Prazo: 3 dias', text: 'Prazo de execução: 3 dias úteis.' },
  { label: 'Prazo: 5 dias', text: 'Prazo de execução: 5 dias úteis.' },
  { label: 'Forma: PIX 5%', text: 'Forma de pagamento: PIX com 5% de desconto.' },
  { label: 'Forma: Cartão 3x', text: 'Forma de pagamento: Cartão em até 3x sem juros.' },
  { label: 'Entrada: 50/50', text: 'Condição: 50% de entrada e 50% na aprovação técnica.' }
];

// COMPONENTE INTERNO: Contém toda a sua lógica que usa o useSearchParams
function NovoOrcamentoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const { clientes } = useClientesStore();
  const { servicos } = useServicosStore();
  const { addOrcamento, getOrcamento, orcamentos } = useOrcamentosStore();
  const { canCreate, isFree, isLoading: planLoading } = usePlan();
  const [showUpgradeGate, setShowUpgradeGate] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState('limit_reached');

  // Estados principais
  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState([]);
  const [desconto, setDesconto] = useState(0);
  const [validade, setValidade] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [template, setTemplate] = useState('design');
  const [searchServico, setSearchServico] = useState('');
  const [showServicos, setShowServicos] = useState(false);

  // Novos estados inteligentes, Favoritos e Modo Express
  const [expressMode, setExpressMode] = useState(false);
  const [activeNicho, setActiveNicho] = useState('designer_grafico');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [clientVipType, setClientVipType] = useState('vip'); // vip, recorrente, premium, comum

  // Favoritos persistentes locais
  const [favoritedServices, setFavoritedServices] = useState([]);
  const [favoritedTemplates, setFavoritedTemplates] = useState([]);

  // Animação de Geração
  const [generating, setGenerating] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);

  // Inicializa favoritos locais
  useEffect(() => {
    const cachedServices = localStorage.getItem('orv-fav-services');
    const cachedTemplates = localStorage.getItem('orv-fav-templates');
    if (cachedServices) setFavoritedServices(JSON.parse(cachedServices));
    if (cachedTemplates) setFavoritedTemplates(JSON.parse(cachedTemplates));
  }, []);

  // Dados do Item Customizado
  const [customItem, setCustomItem] = useState({
    nome: '',
    descricao: '',
    quantidade: 1,
    precoUnitario: 0,
    unidade: 'sessão'
  });

  // Sugestões inteligentes e AUTOCOMPLETAR IA
  const [smartSuggestion, setSmartSuggestion] = useState(null);
  const [recurrentPriceSuggestion, setRecurrentPriceSuggestion] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [pendingCombo, setPendingCombo] = useState(null);

  // Calcula número de orçamento bonito
  const proposalNumber = useMemo(() => {
    return `ORV-${2000 + orcamentos.length + 1}`;
  }, [orcamentos]);

  // SCORE VISUAL DO ORÇAMENTO (Visual Health Score)
  const visualScore = useMemo(() => {
    let score = 70; // Pontuação base
    const feedbacks = [];

    // 1. Análise de Itens (quantidade)
    if (itens.length === 0) {
      score = 40;
      feedbacks.push('Adicione itens de escopo para iniciar análise.');
    } else if (itens.length <= 4) {
      score += 15;
      feedbacks.push('Excelente controle de página única.');
    } else {
      score += 5;
      feedbacks.push('Conteúdo denso (pode aproximar-se do rodapé).');
    }

    // 2. Análise de observações (tamanho)
    if (observacoes.length > 10 && observacoes.length < 250) {
      score += 15;
      feedbacks.push('Observações comerciais claras e objetivas.');
    } else if (observacoes.length >= 250) {
      score -= 5;
      feedbacks.push('Texto de termos longo (pode afetar o minimalismo).');
    } else {
      score += 5;
      feedbacks.push('Termos concisos.');
    }

    // 3. Escolha do Nicho / Contraste
    if (template !== 'design') {
      score += 10;
      feedbacks.push('Paleta de contraste customizada por nicho ativa.');
    } else {
      score += 5;
      feedbacks.push('Estilo clássico padrão.');
    }

    // 4. Seleção de Cliente VIP
    if (clienteId) {
      score += 10;
      feedbacks.push('Cliente e contatos técnicos vinculados.');
    }

    return {
      points: Math.min(100, score),
      label: score >= 90 ? 'Excelente' : score >= 75 ? 'Muito Bom' : 'Regular',
      colorClass: score >= 90 ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : score >= 75 ? 'text-amber-400 border-amber-500/20 bg-amber-500/5' : 'text-red-400 border-red-500/20 bg-red-500/5',
      barColor: score >= 90 ? 'bg-emerald-500' : score >= 75 ? 'bg-amber-500' : 'bg-red-500',
      feedbacks
    };
  }, [itens, observacoes, template, clienteId]);

  // Carrega orçamentos copiados ou parâmetros de templates
  useEffect(() => {
    const cloneId = searchParams.get('clone');
    if (cloneId) {
      const original = getOrcamento(cloneId);
      if (original) {
        setClienteId(original.clienteId || '');
        setItens(original.itens.map(i => ({ ...i, id: Date.now() + Math.random() })) || []);
        setDesconto(original.desconto || 0);
        setValidade(original.validade || '');
        setObservacoes(original.observacoes || '');
        setTemplate(original.template || 'design');
        toast('Orçamento copiado! Edite os dados antes de salvar.', 'info');
      }
    } else {
      const templateParam = searchParams.get('template');
      if (templateParam) {
        setTemplate(templateParam);
        const matchNicho = Object.keys(NICHOS_PRESETS).find(k => NICHOS_PRESETS[k].template === templateParam);
        if (matchNicho) {
          setActiveNicho(matchNicho);
          setObservacoes(NICHOS_PRESETS[matchNicho].observacoes);
        }
      }
    }
  }, [searchParams, getOrcamento, toast]);

  const subtotal = useMemo(() => itens.reduce((acc, item) => acc + (item.precoUnitario * item.quantidade), 0), [itens]);
  const total = useMemo(() => Math.max(0, subtotal - (Number(desconto) || 0)), [subtotal, desconto]);
  const selectedCliente = useMemo(() => clientes.find(c => c.id === clienteId), [clientes, clienteId]);
  
  // TEMPLATES “MAIS USADOS” ORDENAÇÃO INTELIGENTE AUTOMÁTICA
  const sortedTemplates = useMemo(() => {
    const baseTemplates = [
      { id: 'design', name: 'Clássico / Padrão ORVEN' },
      { id: 'creative', name: 'Criativo & Fotografia (Minimalista)' },
      { id: 'beauty', name: 'Beleza & Estética (Rosé & Gold)' },
      { id: 'health', name: 'Clínicas & Bem-Estar (Teal & Clinical)' },
      { id: 'fitness', name: 'Personal & Fitness (Dark Sport)' },
      { id: 'corporate', name: 'Corporativo & Consultoria (Slate & Navy)' },
      { id: 'tech', name: 'Tech & Digital (Electric & Purple Glow)' },
      { id: 'engineering', name: 'Manutenção & Engenharia (Rust & Industrial)' },
      { id: 'legal', name: 'Advocacia Premium (Burgundy & Gold Seal)' }
    ];

    return [...baseTemplates].sort((a, b) => {
      const aFav = favoritedTemplates.includes(a.id);
      const bFav = favoritedTemplates.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
  }, [favoritedTemplates]);

  const filteredServicos = useMemo(() => {
    const sorted = [...servicos].sort((a, b) => {
      const aFav = favoritedServices.includes(a.id);
      const bFav = favoritedServices.includes(b.id);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return 0;
    });
    if (!searchServico) return sorted;
    return sorted.filter(s => s.nome.toLowerCase().includes(searchServico.toLowerCase()));
  }, [servicos, searchServico, favoritedServices]);

  // Métodos de Favoritos
  const toggleFavoriteService = (id, e) => {
    e.stopPropagation();
    const updated = favoritedServices.includes(id) 
      ? favoritedServices.filter(f => f !== id)
      : [...favoritedServices, id];
    setFavoritedServices(updated);
    localStorage.setItem('orv-fav-services', JSON.stringify(updated));
    toast(favoritedServices.includes(id) ? 'Removido dos favoritos!' : 'Adicionado aos favoritos!', 'success');
  };

  const toggleFavoriteTemplate = (id, e) => {
    e.stopPropagation();
    const updated = favoritedTemplates.includes(id)
      ? favoritedTemplates.filter(f => f !== id)
      : [...favoritedTemplates, id];
    setFavoritedTemplates(updated);
    localStorage.setItem('orv-fav-templates', JSON.stringify(updated));
    toast(favoritedTemplates.includes(id) ? 'Template removido dos mais usados!' : 'Template favoritado para o topo!', 'success');
  };

  // Métodos de adição
  const addItem = (servico) => {
    const exists = itens.find(i => i.nome === servico.nome);
    if (exists) {
      updateItem(exists.id, 'quantidade', exists.quantidade + 1);
    } else {
      setItens([...itens, {
        id: Date.now() + Math.random(),
        nome: servico.nome,
        precoUnitario: servico.preco,
        quantidade: 1,
        unidade: servico.unidade || 'un',
        descricao: servico.descricao || ''
      }]);
      checkForCombo(servico.nome);
    }
    setSearchServico('');
    setShowServicos(false);
  };

  const addFrequentItem = (s) => {
    const exists = itens.find(i => i.nome === s.nome);
    if (exists) {
      updateItem(exists.id, 'quantidade', exists.quantidade + 1);
    } else {
      setItens([...itens, {
        id: Date.now() + Math.random(),
        nome: s.nome,
        precoUnitario: s.preco,
        quantidade: 1,
        unidade: s.unidade,
        descricao: s.descricao
      }]);
      checkForCombo(s.nome);
    }
    toast(`Item "${s.nome}" adicionado!`, 'success');
  };

  const checkForCombo = (nome) => {
    const cleanName = nome.toLowerCase().trim();
    if (COMBO_RULES[cleanName]) {
      setPendingCombo({
        origin: nome,
        sugestao: COMBO_RULES[cleanName].nome,
        preco: COMBO_RULES[cleanName].preco,
        unidade: COMBO_RULES[cleanName].unidade,
        descricao: COMBO_RULES[cleanName].descricao
      });
    }
  };

  const addComboItem = () => {
    if (!pendingCombo) return;
    setItens([...itens, {
      id: Date.now() + Math.random(),
      nome: pendingCombo.sugestao,
      precoUnitario: pendingCombo.preco,
      shadowPreco: pendingCombo.preco,
      quantidade: 1,
      unidade: pendingCombo.unidade,
      descricao: pendingCombo.descricao
    }]);
    setPendingCombo(null);
    toast('Combo promocional anexado com sucesso!', 'success');
  };

  const updateItem = (id, field, value) => {
    setItens(itens.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id) => setItens(itens.filter(item => item.id !== id));

  // AUTO PREENCHIMENTO POR NICHO
  const handleNichoSelect = (nicho) => {
    const preset = NICHOS_PRESETS[nicho];
    if (preset.isPremium && isFree) {
      setUpgradeReason('premium_niche');
      setShowUpgradeGate(true);
      return;
    }

    setActiveNicho(nicho);
    if (preset) {
      setTemplate(preset.template);
      setObservacoes(preset.observacoes);
      toast(`Layout e configurações de ${preset.nome} aplicados!`, 'info');
    }
  };

  // Monitora digitação do formulário customizado
  const handleCustomItemNameChange = (val) => {
    setCustomItem(prev => ({ ...prev, nome: val }));
    
    const cleanVal = val.toLowerCase().trim();

    // 11. AUTO COMPLETAR POR IA SUGGESTION DETECTOR
    const matchedAiKey = Object.keys(AI_AUTOCOMPLETE_DATABASE).find(k => k.includes(cleanVal) || cleanVal.includes(k));
    if (val.length > 3 && matchedAiKey) {
      setAiSuggestion(AI_AUTOCOMPLETE_DATABASE[matchedAiKey]);
    } else {
      setAiSuggestion(null);
    }

    // Traditional descriptions suggestion
    const foundDesc = Object.keys(SUGESTOES_SERVICOS).find(k => k.includes(cleanVal) || cleanVal.includes(k));
    if (val.length > 3 && foundDesc) {
      setSmartSuggestion(SUGESTOES_SERVICOS[foundDesc]);
    } else {
      setSmartSuggestion(null);
    }

    let suggestedPrice = null;
    const currentPreset = NICHOS_PRESETS[activeNicho];
    const matchFreq = currentPreset?.servicosFrequentes?.find(s => s.nome.toLowerCase().includes(cleanVal));
    if (matchFreq) {
      suggestedPrice = matchFreq.preco;
    } else {
      const matchSrv = servicos.find(s => s.nome.toLowerCase().includes(cleanVal));
      if (matchSrv) suggestedPrice = matchSrv.preco;
    }
    
    if (val.length > 3 && suggestedPrice) {
      setRecurrentPriceSuggestion(suggestedPrice);
    } else {
      setRecurrentPriceSuggestion(null);
    }
  };

  // Apply complete AI suggestion bundle
  const applyAiSuggestion = () => {
    if (!aiSuggestion) return;
    setCustomItem(prev => ({
      ...prev,
      descricao: aiSuggestion.descricao,
      precoUnitario: aiSuggestion.preco,
      unidade: aiSuggestion.unidade
    }));
    setActiveNicho(aiSuggestion.nicho);
    setTemplate(aiSuggestion.template);
    setObservacoes(NICHOS_PRESETS[aiSuggestion.nicho].observacoes);
    setAiSuggestion(null);
    toast('Autocompletar Inteligente da IA ORVEN aplicado!', 'success');
  };

  const applySmartDescription = () => {
    if (!smartSuggestion) return;
    setCustomItem(prev => ({ ...prev, descricao: smartSuggestion }));
    setSmartSuggestion(null);
    toast('Descrição sugerida aplicada!', 'success');
  };

  const applySmartPrice = () => {
    if (!recurrentPriceSuggestion) return;
    setCustomItem(prev => ({ ...prev, precoUnitario: recurrentPriceSuggestion }));
    setRecurrentPriceSuggestion(null);
    toast('Preço sugerido aplicado!', 'success');
  };

  const addCustomItem = () => {
    if (!customItem.nome) return toast('Insira o nome do serviço personalizado.', 'error');
    if (!customItem.precoUnitario) return toast('Insira o preço do serviço.', 'error');

    setItens([...itens, {
      id: Date.now() + Math.random(),
      nome: customItem.nome,
      descricao: customItem.descricao,
      precoUnitario: Number(customItem.precoUnitario) || 0,
      quantidade: Number(customItem.quantidade) || 1,
      unidade: customItem.unidade
    }]);

    checkForCombo(customItem.nome);
    setCustomItem({ nome: '', descricao: '', quantidade: 1, precoUnitario: 0, unidade: 'sessão' });
    setSmartSuggestion(null);
    setRecurrentPriceSuggestion(null);
    setAiSuggestion(null);
    setShowCustomForm(false);
    toast('Item personalizado anexado!', 'success');
  };

  const appendQuickObs = (text) => {
    setObservacoes(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return text;
      if (trimmed.endsWith('.')) return `${trimmed} ${text}`;
      return `${trimmed}. ${text}`;
    });
  };

  // Aciona Animação de Geração Sofisticada de PDF
  const triggerSophisticatedGeneration = () => {
    if (!clienteId) return toast('Selecione um cliente para o orçamento.', 'error');
    if (itens.length === 0) return toast('Adicione pelo menos um item ao orçamento.', 'error');
    
    // Verifica limite do plano Free
    if (!canCreate) {
      setShowUpgradeGate(true);
      return;
    }

    setGenerating(true);
    setAnimationStep(0);

    const steps = [
      () => setAnimationStep(1),
      () => setAnimationStep(2),
      () => setAnimationStep(3),
      () => {
        executeSave();
      }
    ];

    steps.forEach((stepFn, index) => {
      setTimeout(stepFn, (index + 1) * 950);
    });
  };

  const executeSave = async () => {
    const orcamentoData = {
      numero: proposalNumber,
      clienteId,
      clienteNome: selectedCliente.nome,
      clienteEmail: selectedCliente.email,
      clienteTelefone: selectedCliente.telefone,
      clienteEndereco: selectedCliente.endereco,
      itens, subtotal, desconto: Number(desconto) || 0, total, validade, observacoes, template, status: 'pendente'
    };

    const novo = await addOrcamento(orcamentoData);
    setGenerating(false);
    toast('Orçamento gerado com sucesso!', 'success');
    router.push(`/orcamentos/${novo.id}`);
  };

  return (
    <AppLayout>
      
      {/* Upgrade Gate para usuários Free que atingiram o limite ou tentaram usar nicho premium */}
      <UpgradeGate
        isOpen={showUpgradeGate}
        onClose={() => setShowUpgradeGate(false)}
        reason={upgradeReason}
      />

      {/* GLOWING FULL-SCREEN GENERATING OVERLAY */}
      {generating && (
        <div className="fixed inset-0 bg-[#050816]/98 backdrop-blur-2xl z-50 flex flex-col items-center justify-center p-6 transition-all animate-fade-in animate-duration-300">
          <div className="relative w-80 h-96 bg-[#071A3D]/40 border border-blue-900/35 rounded-3xl p-6 flex flex-col justify-between overflow-hidden shadow-[0_0_80px_rgba(10,77,255,0.15)]">
            
            {/* Holographic Glowing Lines Drawing Perimeter */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary-500 to-transparent animate-pulse"></div>
            <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse"></div>
            <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse"></div>

            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black uppercase text-[#8B95A7] tracking-widest">Geração Premium</span>
                <h2 className="text-xl font-extrabold text-white tracking-tight mt-1">{proposalNumber}</h2>
              </div>
              <MdSecurity className="text-2xl text-primary-400 animate-pulse" />
            </div>

            <div className="flex flex-col items-center justify-center my-8 relative">
              <div className="w-20 h-20 rounded-full border border-blue-900/10 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary-500 animate-spin" style={{ animationDuration: '6s' }}></div>
                <div className="absolute w-16 h-16 rounded-full bg-primary-500/10 border border-primary-500/25 flex items-center justify-center text-white">
                  <MdOutlineAutoAwesome className="text-2xl text-primary-400 animate-bounce" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className={`flex items-center gap-2 text-xs font-bold transition-all duration-300 ${animationStep >= 1 ? 'text-white' : 'text-slate-500'}`}>
                  <MdCheckCircle className={`text-base ${animationStep >= 1 ? 'text-emerald-400' : 'text-slate-700'}`} />
                  Ajustando tipografia do nicho...
                </div>
                <div className={`flex items-center gap-2 text-xs font-bold transition-all duration-300 ${animationStep >= 2 ? 'text-white' : 'text-slate-500'}`}>
                  <MdCheckCircle className={`text-base ${animationStep >= 2 ? 'text-emerald-400' : 'text-slate-700'}`} />
                  Validando contrastes executivos...
                </div>
                <div className={`flex items-center gap-2 text-xs font-bold transition-all duration-300 ${animationStep >= 3 ? 'text-white' : 'text-slate-500'}`}>
                  <MdCheckCircle className={`text-base ${animationStep >= 3 ? 'text-emerald-400' : 'text-slate-700'}`} />
                  Finalizando selo de segurança ORVEN...
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Express Mode Banner Toggle */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4.5 bg-[#071A3D]/40 border border-blue-900/20 backdrop-blur-xl rounded-[20px] mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400">
            <MdOfflineBolt className="text-2xl animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              Modo de Geração Express
              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 uppercase tracking-widest shadow-glow">⚡ Express</span>
            </h3>
            <p className="text-[10px] text-[#8B95A7] font-semibold mt-0.5 leading-relaxed">Simplifique a interface e envie orçamentos profissionais em menos de 10 segundos.</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input 
            type="checkbox" 
            checked={expressMode}
            onChange={e => setExpressMode(e.target.checked)}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-350 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 pb-16 min-h-[calc(100vh-8rem)]">
        
        {/* Left Column: Form Fields */}
        <div className="flex-1 space-y-8 max-w-3xl">
          <div className="mb-2 flex flex-wrap justify-between items-start gap-4">
            <div>
              <Link href="/orcamentos" className="inline-flex items-center text-xs font-bold text-[#8B95A7] hover:text-white mb-4 transition-colors uppercase tracking-wider">
                <MdArrowBack className="mr-1 text-sm" /> Voltar
              </Link>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Criar Orçamento
                <span className="text-sm text-primary-400 font-bold px-3 py-1 bg-primary-500/10 border border-primary-500/25 rounded-xl uppercase tracking-wider">{proposalNumber}</span>
              </h1>
              <p className="text-sm text-[#8B95A7] mt-1.5 font-medium">Preencha as especificações técnicas e comerciais para gerar uma proposta executiva.</p>
            </div>

            {/* SCORE VISUAL DO ORÇAMENTO (Health Score) CARD */}
            <div className={`p-4 rounded-2xl border flex flex-col gap-2 w-full sm:w-60 shrink-0 ${visualScore.colorClass} backdrop-blur-xl animate-fade-in`}>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black uppercase tracking-widest opacity-80">Qualidade Visual PDF</span>
                <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{visualScore.points}/100</span>
              </div>
              <div className="h-2 w-full bg-slate-900/50 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-500 ${visualScore.barColor}`} style={{ width: `${visualScore.points}%` }}></div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-tight">{visualScore.label}</p>
              <p className="text-[9px] leading-relaxed opacity-90">{visualScore.feedbacks[0] || 'Tudo pronto para gerar!'}</p>
            </div>
          </div>

          {/* AUTO PREENCHIMENTO POR NICHO */}
          {!expressMode && (
            <section className="card p-6">
              <h2 className="text-xs font-black text-white uppercase tracking-widest mb-4.5 flex items-center gap-2">
                <MdOutlineAutoAwesome className="text-base text-primary-400" />
                Nicho de Atuação & Autopreenchimento
              </h2>
              <p className="text-xs text-[#8B95A7] mb-5 leading-relaxed">Escolha seu nicho para carregar imediatamente a linguagem, observações contratuais e layout visual correspondentes.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.keys(NICHOS_PRESETS).map((key) => {
                  const item = NICHOS_PRESETS[key];
                  const isActive = activeNicho === key;
                  const isLocked = item.isPremium && isFree;
                  
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleNichoSelect(key)}
                      className={`relative p-3.5 rounded-xl border text-center transition-all duration-350 cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        isActive 
                          ? 'bg-primary-500/10 border-primary-500 text-white shadow-glow' 
                          : 'bg-[#050816]/40 border-blue-900/15 text-[#8B95A7] hover:bg-[#050816] hover:text-slate-200'
                      } ${isLocked ? 'opacity-70 hover:opacity-100 hover:border-amber-500/50' : ''}`}
                    >
                      {isLocked && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                          <MdLock className="text-xs" />
                        </div>
                      )}
                      <span className="text-xs font-black tracking-tight">{item.nome}</span>
                      <span className="text-[9px] uppercase tracking-widest opacity-60">
                        {isLocked ? 'PRO / PREMIUM' : `Visual ${item.template}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* 1. Cliente & MODO CLIENTE VIP */}
          <section className="card p-6 space-y-5">
            <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary-500/10 border border-primary-500/25 text-primary-400 flex items-center justify-center text-[10px] font-black">1</span>
              Cliente da Proposta
            </h2>
            <div className="relative">
              <select 
                className="w-full px-4 py-3 bg-[#050816] border border-blue-900/20 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl text-sm font-semibold text-slate-200 outline-none transition-all cursor-pointer appearance-none"
                value={clienteId} 
                onChange={(e) => setClienteId(e.target.value)}
              >
                <option value="" className="bg-[#050816] text-[#8B95A7]">Selecione o cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#050816] text-slate-250">
                    {c.nome} {c.cpfCnpj ? `(${c.cpfCnpj})` : ''}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
            </div>

            {/* MODO CLIENTE VIP - Pill Selector */}
            {clienteId && (
              <div className="pt-3 border-t border-blue-900/10 flex flex-col gap-2.5">
                <p className="text-[9px] uppercase font-black tracking-widest text-[#8B95A7]">Categoria do Cliente (Badge VIP)</p>
                <div className="flex gap-2">
                  {['vip', 'recorrente', 'premium', 'comum'].map((type) => {
                    const isActive = clientVipType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setClientVipType(type)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-amber-500/15 border-amber-500 text-amber-400' 
                            : 'bg-[#050816]/40 border-blue-900/10 text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {selectedCliente && (
              <div className="mt-5 p-4 rounded-xl bg-[#050816]/65 border border-blue-900/10 flex flex-wrap gap-x-8 gap-y-3 animate-fade-in">
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-[#8B95A7]">E-mail corporativo</p>
                  <p className="text-xs font-bold text-slate-350 mt-1">{selectedCliente.email || '—'}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-[#8B95A7]">Telefone / Contato</p>
                  <p className="text-xs font-bold text-slate-350 mt-1">{selectedCliente.telefone || '—'}</p>
                </div>
              </div>
            )}
          </section>

          {/* SERVIÇOS FREQUENTES (Quick-add) */}
          <section className="card p-6">
            <h2 className="text-xs font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <MdStar className="text-base text-amber-400 animate-bounce" />
              Serviços Frequentes (Mais Usados)
            </h2>

            <p className="text-xs text-[#8B95A7] mb-5 leading-relaxed">
              Selecione rapidamente os serviços mais utilizados.
            </p>

            <div className="flex flex-wrap gap-2">
              {(NICHOS_PRESETS[activeNicho]?.servicosFrequentes || []).map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => addFrequentItem(s)}
                  className="px-3 py-2 rounded-xl bg-[#050816]/60 border border-blue-900/15 hover:border-primary-500/40 hover:bg-primary-500/10 text-xs font-bold text-slate-200 transition-all"
                >
                  {s.nome}
                </button>
              ))}
            </div>
          </section>

          {/* 2. Itens & Escopo */}
          <section className="card p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-blue-900/10 pb-4">
              <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-primary-500/10 border border-primary-500/25 text-primary-400 flex items-center justify-center text-[10px] font-black">2</span>
                Itens & Escopo do Serviço
              </h2>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCustomForm(!showCustomForm)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black rounded-xl text-[10.5px] uppercase tracking-wider transition-all cursor-pointer"
                >
                  + Personalizar Item
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setShowServicos(!showServicos)} 
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0A4DFF]/15 border border-primary-500/30 hover:bg-primary-500 hover:text-white text-primary-400 font-bold rounded-xl text-xs shadow-sm transition-all duration-350 cursor-pointer"
                  >
                    <MdAdd className="text-sm" /> Biblioteca
                  </button>
                  
                  {showServicos && (
                    <div className="absolute right-0 top-full mt-2.5 w-80 bg-[#071A3D] border border-blue-900/25 rounded-2xl shadow-2xl z-20 overflow-hidden animate-slide-up">
                      <div className="p-3 border-b border-blue-900/10 bg-[#050816]/40">
                        <div className="relative">
                          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B95A7] text-base" />
                          <input 
                            type="text" 
                            autoFocus 
                            placeholder="Buscar serviço..." 
                            value={searchServico} 
                            onChange={e => setSearchServico(e.target.value)} 
                            className="w-full pl-9 pr-3 py-2 text-xs bg-[#050816] border border-blue-900/20 rounded-lg outline-none focus:border-primary-500 text-slate-200" 
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto p-1 divide-y divide-blue-900/10">
                        {filteredServicos.length === 0 ? (
                          <p className="text-xs text-center py-5 text-[#8B95A7] font-semibold">Nenhum serviço disponível</p>
                        ) : (
                          filteredServicos.map(s => {
                            const isFav = favoritedServices.includes(s.id);
                            return (
                              <div 
                                key={s.id} 
                                onClick={() => addItem(s)} 
                                className="w-full text-left px-3 py-3 hover:bg-[#071A3D]/45 flex justify-between items-center transition-all cursor-pointer group/item"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <button onClick={(e) => toggleFavoriteService(s.id, e)} className="text-slate-500 hover:text-amber-400 shrink-0">
                                    {isFav ? <MdStar className="text-amber-400 text-base" /> : <MdStarBorder className="text-base" />}
                                  </button>
                                  <span className="text-xs font-bold text-white truncate max-w-[140px]">{s.nome}</span>
                                </div>
                                <span className="text-xs font-black text-primary-400 shrink-0">R$ {Number(s.preco || 0).toFixed(2)}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FORMULÁRIO DE ITEM CUSTOMIZADO INTELIGENTE */}
            {showCustomForm && (
              <div className="p-5 rounded-2xl bg-[#050816]/65 border border-amber-500/25 space-y-4 animate-fade-in">
                <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                  <MdOutlineAutoAwesome className="text-sm text-amber-400 animate-pulse" />
                  Item Customizado Inteligente
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-modern">Nome do Serviço / Produto</label>
                    <input 
                      type="text"
                      value={customItem.nome}
                      onChange={e => handleCustomItemNameChange(e.target.value)}
                      placeholder="Ex: social media, ar condicionado..."
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="label-modern">Tipo de Unidade</label>
                    <select 
                      value={customItem.unidade}
                      onChange={e => setCustomItem({ ...customItem, unidade: e.target.value })}
                      className="input-modern bg-[#050816] rounded-xl text-slate-200 outline-none transition-all cursor-pointer appearance-none border border-blue-900/20"
                    >
                      <option value="sessão">Sessão</option>
                      <option value="projeto">Projeto</option>
                      <option value="hora">Hora</option>
                      <option value="mês">Mês</option>
                      <option value="unidade">Unidade</option>
                    </select>
                  </div>
                </div>

                {/* 11. AUTO COMPLETAR POR IA SUGGESTION CARD */}
                {aiSuggestion && (
                  <div className="p-4 rounded-xl bg-gradient-to-r from-primary-500/10 via-purple-500/10 to-[#050816] border border-primary-500/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 animate-pulse shadow-[0_0_20px_rgba(10,77,255,0.15)]">
                    <div>
                      <p className="text-[9px] uppercase font-black tracking-widest text-primary-400 flex items-center gap-1">
                        <MdOutlineAutoAwesome className="text-xs text-purple-400 animate-spin" style={{ animationDuration: '4s' }} /> 
                        Sugestão Completa da IA ORVEN
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2 text-[9px] font-bold">
                        <span className="bg-primary-500/15 border border-primary-500/25 text-primary-400 px-2 py-0.5 rounded-md">
                          Nicho: {NICHOS_PRESETS[aiSuggestion.nicho].nome}
                        </span>
                        <span className="bg-amber-500/15 border border-amber-500/25 text-amber-400 px-2 py-0.5 rounded-md">
                          Preço Médio: R$ {aiSuggestion.preco.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-250 mt-2 font-medium italic">
                        "{aiSuggestion.descricao}"
                      </p>
                    </div>
                    <button 
                      onClick={applyAiSuggestion}
                      className="shrink-0 px-3.5 py-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <MdOfflineBolt /> Aplicar Tudo ⚡
                    </button>
                  </div>
                )}

                {/* TRADITIONAL DESCRIPTION & PRICE SUGGESTIONS */}
                {!aiSuggestion && smartSuggestion && (
                  <div className="p-3 bg-primary-500/10 border border-primary-500/25 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-2.5 animate-slide-up">
                    <div className="flex-1">
                      <p className="text-[9px] uppercase font-black tracking-widest text-primary-400 flex items-center gap-1">💡 Sugestão de descrição profissional</p>
                      <p className="text-xs font-medium text-slate-250 mt-1 italic">"{smartSuggestion}"</p>
                    </div>
                    <button 
                      onClick={applySmartDescription}
                      className="shrink-0 px-2.5 py-1 bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                    >
                      Aplicar
                    </button>
                  </div>
                )}

                {!aiSuggestion && recurrentPriceSuggestion && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex justify-between items-center gap-2.5 animate-slide-up">
                    <div>
                      <p className="text-[9px] uppercase font-black tracking-widest text-amber-400 flex items-center gap-1">💰 Último valor utilizado</p>
                      <p className="text-xs font-bold text-slate-250 mt-1">Preço recorrente estimado: R$ {recurrentPriceSuggestion.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={applySmartPrice}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-[#050816] text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                    >
                      Aplicar
                    </button>
                  </div>
                )}

                <div>
                  <label className="label-modern">Descrição Detalhada do Serviço</label>
                  <textarea 
                    rows={2}
                    value={customItem.descricao}
                    onChange={e => setCustomItem({ ...customItem, descricao: e.target.value })}
                    placeholder="Descrição para aparecer no PDF..."
                    className="input-modern resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label-modern">Quantidade</label>
                    <input 
                      type="number"
                      min="1"
                      value={customItem.quantidade}
                      onChange={e => setCustomItem({ ...customItem, quantidade: Number(e.target.value) || 1 })}
                      className="input-modern"
                    />
                  </div>
                  <div>
                    <label className="label-modern">Preço Unitário (R$)</label>
                    <input 
                      type="number"
                      step="0.01"
                      value={customItem.precoUnitario || ''}
                      onChange={e => setCustomItem({ ...customItem, precoUnitario: Number(e.target.value) || 0 })}
                      placeholder="0,00"
                      className="input-modern"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={() => setShowCustomForm(false)}
                    className="px-4 py-2 border border-blue-900/10 text-slate-400 font-bold rounded-xl text-xs"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={addCustomItem}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-[#050816] font-black rounded-xl text-xs uppercase tracking-wider"
                  >
                    Anexar Item
                  </button>
                </div>
              </div>
            )}

            {itens.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#8B95A7] border-2 border-dashed border-blue-900/15 rounded-2xl bg-[#050816]/25">
                <MdContentPaste className="text-4xl mb-2 opacity-35" />
                <p className="text-xs font-bold uppercase tracking-wider">Nenhum serviço anexado</p>
              </div>
            ) : (
              <div className="space-y-3">
                {itens.map((item) => (
                  <div key={item.id} className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-blue-900/10 bg-[#050816]/30 hover:border-primary-500/20 transition-all duration-300 animate-fade-in">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{item.nome}</p>
                      <p className="text-[9px] text-[#8B95A7] font-black uppercase tracking-wider mt-0.5">{item.unidade || 'Unidade'}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantidade} 
                        onChange={(e) => updateItem(item.id, 'quantidade', Number(e.target.value))} 
                        className="w-16 text-center px-2 py-2 text-xs bg-[#050816] border border-blue-900/20 rounded-lg outline-none focus:border-primary-500 text-white font-bold" 
                      />
                      <span className="text-[#8B95A7] text-xs font-semibold">x</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        value={item.precoUnitario} 
                        onChange={(e) => updateItem(item.id, 'precoUnitario', Number(e.target.value))} 
                        className="w-24 text-right px-2.5 py-2 text-xs bg-[#050816] border border-blue-900/20 rounded-lg outline-none focus:border-primary-500 text-white font-bold" 
                      />
                      <div className="w-24 text-right font-black text-white text-xs">
                        R$ {(item.precoUnitario * item.quantidade).toFixed(2).replace('.', ',')}
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)} 
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg opacity-85 group-hover:opacity-100 transition-all cursor-pointer"
                      >
                        <MdDelete className="text-lg" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* COMBOS AUTOMÁTICOS UPSELL POPUP */}
            {pendingCombo && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-4 animate-fade-in mt-4">
                <div className="space-y-1">
                  <p className="text-[9px] uppercase font-black tracking-widest text-amber-400 flex items-center gap-1">
                    <MdSell className="text-xs" /> Combo Recomendado (Upsell Inteligente)
                  </p>
                  <p className="text-xs font-bold text-slate-200 mt-1">
                    Gostaria de complementar com <span className="text-amber-300 font-extrabold">{pendingCombo.sugestao}</span> por apenas <span className="text-white font-extrabold">R$ {pendingCombo.preco.toFixed(2)}</span>?
                  </p>
                </div>
                <button 
                  onClick={addComboItem} 
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-[#050816] font-black rounded-lg text-[10px] uppercase tracking-wider transition-all cursor-pointer shrink-0"
                >
                  + Anexar Combo
                </button>
              </div>
            )}
          </section>

          {/* HIDE COMPLEX SECTIONS IF EXPRESS MODE IS ACTIVE */}
          {!expressMode ? (
            <>
              {/* 3. Ajustes Finais */}
              <section className="card p-6 flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <label className="label-modern">Desconto Especial (R$)</label>
                  <input 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={desconto} 
                    onChange={(e) => setDesconto(Number(e.target.value))} 
                    className="input-modern" 
                    placeholder="0,00"
                  />
                </div>
                <div className="flex-1">
                  <label className="label-modern">Data Limite de Validade</label>
                  <input 
                    type="date" 
                    value={validade} 
                    onChange={(e) => setValidade(e.target.value)} 
                    className="input-modern" 
                  />
                </div>
              </section>

              {/* 4. Template do PDF - SMART SORTED TEMPLATES */}
              <section className="card p-6">
                <h2 className="text-xs font-black text-white uppercase tracking-widest mb-5 flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-500/10 border border-primary-500/25 text-primary-400 flex items-center justify-center text-[10px] font-black">4</span>
                  Template de Design do PDF (Ordenados por Mais Usados)
                </h2>
                <div className="relative mb-4">
                  <select 
                    className="w-full px-4 py-3 bg-[#050816] border border-blue-900/20 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 rounded-xl text-sm font-semibold text-slate-200 outline-none transition-all cursor-pointer appearance-none"
                    value={template} 
                    onChange={(e) => setTemplate(e.target.value)}
                  >
                    {sortedTemplates.map((t) => (
                      <option key={t.id} value={t.id} className="bg-[#050816] text-slate-200">
                        {favoritedTemplates.includes(t.id) ? '⭐ ' : ''}{t.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                </div>
                
                <div className="p-4 rounded-xl bg-[#050816]/65 border border-blue-900/10 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase font-black tracking-widest text-[#8B95A7]">Atmosfera Estratégica & Ação Rápida</p>
                    <p className="text-xs font-bold text-slate-350 mt-1">
                      {template === 'design' && 'Design clean com detalhes sutis em azul royal elétrico.'}
                      {template === 'beauty' && 'Luxo feminino sofisticado, delicadeza premium e estética instagramável.'}
                      {template === 'health' && 'Confiança, segurança, assepsia clínica e acolhimento humanizado.'}
                      {template === 'corporate' && 'Composição institucional, grades rígidas e autoridade executiva.'}
                      {template === 'tech' && 'Glow tecnológico moderno inspirado em SaaS de classe mundial.'}
                      {template === 'engineering' && 'Sólido, estruturado e focado em confiabilidade técnica e operacional.'}
                      {template === 'legal' && 'Autoridade clássica com tons nobres, vinho e dourado fosco.'}
                    </p>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={(e) => toggleFavoriteTemplate(template, e)}
                    className="shrink-0 p-2 bg-[#050816]/90 hover:bg-[#050816] rounded-xl border border-blue-900/15 text-slate-450 hover:text-amber-400 flex items-center gap-1.5 transition-all cursor-pointer font-bold text-xs"
                  >
                    {favoritedTemplates.includes(template) ? (
                      <>
                        <MdStar className="text-amber-400 text-base" /> Pinned
                      </>
                    ) : (
                      <>
                        <MdStarBorder className="text-base" /> Pin no Topo
                      </>
                    )}
                  </button>
                </div>
              </section>

              {/* 5. Observações */}
              <section className="card p-6 space-y-4">
                <label className="label-modern flex items-center gap-1.5">Observações Comerciais & Prazos</label>
                <textarea 
                  rows={3} 
                  value={observacoes} 
                  onChange={(e) => setObservacoes(e.target.value)} 
                  className="input-modern resize-none" 
                  placeholder="Ex: Faturamento 50% de entrada e 50% na aprovação técnica..." 
                />
                
                {/* TEXTO AUTOMÁTICO CURTO (QUICK OBSERVATIONS) */}
                <div>
                  <p className="text-[9px] uppercase font-black tracking-widest text-[#8B95A7] mb-2.5">Anexar termos rápidos (Clique para inserir)</p>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_OBS_TAGS.map((tag, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => appendQuickObs(tag.text)}
                        className="px-2.5 py-1.5 bg-[#050816]/60 hover:bg-primary-500 hover:text-white border border-blue-900/15 rounded-lg text-[10px] font-black text-[#8B95A7] transition-all cursor-pointer"
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </>
          ) : null}
        </div>

 {/* Right Column */}
        <div className="w-full lg:w-[400px] xl:w-[460px] shrink-0">
          <div className="sticky top-24 space-y-6">

            <div className="bg-[#071A3D]/40 backdrop-blur-xl border border-blue-900/20 rounded-[24px] shadow-2xl overflow-hidden flex flex-col h-[500px]">
              {/* Rendered Mockup Paper inside Cockpit screen */}
              <div className="flex-1 p-5 overflow-y-auto bg-[#050816]/65 relative">
                <div className="absolute inset-0 p-5">
                  <div className="w-full bg-white h-full shadow-2xl rounded-xl border border-slate-200/50 p-5 flex flex-col justify-between text-slate-800 transition-all">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-3">
                      <div>
                        <div className="w-7 h-7 flex items-center justify-center bg-primary-500 rounded-lg text-white font-extrabold text-[9px] shadow-sm mb-1">O</div>
                        <p className="text-[7.5px] font-black uppercase tracking-wide text-slate-850">ORVEN PROPOSTA</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-800 tracking-tight leading-none">{proposalNumber}</p>
                        <p className="text-[7.5px] text-[#8B95A7] mt-1 font-semibold">{new Date().toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    
                    {/* Client info & VIP BADGE */}
                    <div className="mb-3.5 flex justify-between items-start">
                      <div>
                        <p className="text-[7.5px] font-black uppercase text-slate-400 mb-0.5">Preparado para:</p>
                        <p className="text-[10px] font-black text-slate-850">{selectedCliente?.nome || 'Nome do Cliente Exemplo'}</p>
                        <p className="text-[8px] text-slate-500 font-semibold">{selectedCliente?.email || 'contato@cliente.com'}</p>
                      </div>
                      
                      {clienteId && (
                        <span className="px-2 py-0.5 text-[7.5px] font-black uppercase bg-amber-500/10 border border-amber-500/25 text-amber-500 rounded-lg animate-pulse">
                          {clientVipType}
                        </span>
                      )}
                    </div>

                    {/* FRASES AUTOMÁTICAS INTELIGENTES (Intro phrase custom per niche) */}
                    <div className="mb-3 p-2 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-[7.5px] text-slate-500 leading-normal italic">
                        "{NICHOS_PRESETS[activeNicho]?.introducao || ''}"
                      </p>
                    </div>

                    {/* Miniature scope rows */}
                    <div className="flex-1 space-y-1 overflow-hidden">
                      {itens.length === 0 ? (
                        <div className="h-full flex items-center justify-center py-4">
                          <p className="text-[8px] text-[#8B95A7] italic font-semibold">Anexe itens para visualizar no preview...</p>
                        </div>
                      ) : (
                        itens.slice(0, 3).map(i => (
                          <div key={i.id} className="flex justify-between text-[8px] border-b border-slate-100 py-1">
                            <span className="font-semibold text-slate-700 max-w-[180px] truncate">{i.nome} <span className="text-slate-400 font-bold">x{i.quantidade}</span></span>
                            <span className="font-black text-slate-850">R$ {(i.precoUnitario * i.quantidade).toFixed(2).replace('.', ',')}</span>
                          </div>
                        ))
                      )}
                      {itens.length > 3 && (
                        <p className="text-[7.5px] text-primary-500 font-bold text-center mt-1.5">+ {itens.length - 3} itens adicionais no escopo</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={triggerSophisticatedGeneration}
              className="w-full btn-primary py-4 text-base shadow-glow uppercase tracking-wider flex items-center justify-center gap-2"
            >
              Finalizar e Gerar Proposta
              <MdArrowForward className="text-xl" />
            </button>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}

export default function NovoOrcamentoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050816]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-4 border-t-primary-500 border-r-primary-500 border-b-blue-900 border-l-blue-900 animate-spin mb-4" />

            <p className="text-sm font-bold text-[#8B95A7] tracking-widest uppercase">
              Carregando Módulo...
            </p>
          </div>
        </div>
      }
    >
      <NovoOrcamentoContent />
    </Suspense>
  );
}