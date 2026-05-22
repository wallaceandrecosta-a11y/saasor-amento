// src/lib/niches.js

export const AI_AUTOCOMPLETE_DATABASE = {
  'social media': { nicho: 'social_media', template: 'tech', preco: 1500.0, unidade: 'mês', descricao: 'Gestão completa de redes sociais, incluindo planejamento editorial e métricas.' },
  'ar condicionado': { nicho: 'eletricista', template: 'engineering', preco: 350.0, unidade: 'unidade', descricao: 'Instalação com furação técnica e testes de pressão.' },
  'fisioterapia': { nicho: 'fisioterapia', template: 'health', preco: 120.0, unidade: 'sessão', descricao: 'Sessão individual de reabilitação fisioterapêutica.' },
  'limpeza de pele': { nicho: 'salao_beleza', template: 'beauty', preco: 180.0, unidade: 'sessão', descricao: 'Higienização com extração de cravos e máscara calmante.' },
  'contrato': { nicho: 'advogado', template: 'legal', preco: 800.0, unidade: 'contrato', descricao: 'Redação sob medida de instrumento contratual comercial.' },
  'consultoria': { nicho: 'consultoria', template: 'corporate', preco: 180.0, unidade: 'hora', descricao: 'Diagnóstico empresarial aprofundado e plano estratégico.' },
  'logotipo': { nicho: 'designer_grafico', template: 'creative', preco: 1200.0, unidade: 'projeto', descricao: 'Criação de identidade visual, tipografia e manual da marca.' },
  'personal': { nicho: 'personal_trainer', template: 'fitness', preco: 800.0, unidade: 'mês', descricao: 'Acompanhamento de treino presencial focado no objetivo.' },
  'reforma': { nicho: 'pedreiro', template: 'engineering', preco: 3000.0, unidade: 'obra', descricao: 'Mão de obra para execução de reforma geral conforme projeto.' },
  'foto': { nicho: 'fotografo', template: 'creative', preco: 800.0, unidade: 'ensaio', descricao: 'Ensaio fotográfico com entrega de 50 fotos tratadas.' }
};

export const SUGESTOES_SERVICOS = {
  'limpeza de pele': 'Limpeza profunda com extração de comedões, esfoliação ultrassônica e máscara calmante.',
  'sessão de fisioterapia': 'Atendimento fisioterapêutico personalizado com foco em recuperação funcional.',
  'instalação de ar condicionado': 'Instalação completa com avaliação técnica, montagem e testes de funcionamento.',
  'gestão de redes sociais': 'Criação de cronograma de posts, design de artes, redação e análise de tráfego orgânico.',
  'consultoria jurídica': 'Análise de contratos, elaboração de pareceres e reuniões consultivas preventivas.',
  'elaboração de contrato': 'Redação de instrumento contratual sob medida visando segurança jurídica.',
  'identidade visual': 'Desenvolvimento de logotipo exclusivo, paleta de cores e tipografia.',
  'manutenção preventiva': 'Inspeção técnica e limpeza para garantir a vida útil do equipamento.',
  'troca de tela': 'Substituição da tela quebrada por peça original com garantia.',
  'projeto arquitetônico': 'Planta baixa, cortes, fachadas e renderizações 3D.',
  'tatuagem fine line': 'Traços finos e delicados, design exclusivo em preto e cinza.',
};

export const NICHOS_PRESETS = {
  // --- HEALTH & FITNESS ---
  fisioterapia: {
    nome: 'Fisioterapia',
    template: 'health',
    introducao: 'Plano de reabilitação e cuidado terapêutico planejado de forma humanizada e focado na sua plena recuperação.',
    observacoes: 'Orçamento válido por 15 dias.\nPagamento por pacote mensal à vista tem 10% de desconto ou em até 3x no cartão.\nAs sessões desmarcadas sem 24h de aviso prévio serão contabilizadas.',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Sessão de Fisioterapia Traumato-Ortopédica', preco: 150.0, unidade: 'sessão', descricao: 'Atendimento fisioterapêutico com foco em recuperação funcional, mobilidade e analgesia.' },
      { nome: 'Pacote Mensal Fisioterapia (2x na semana)', preco: 980.0, unidade: 'pacote', descricao: 'Acompanhamento contínuo duas vezes na semana com reavaliação periódica.' },
      { nome: 'Avaliação Postural Completa', preco: 200.0, unidade: 'avaliação', descricao: 'Análise biomecânica detalhada para elaboração do plano de tratamento.' },
      { nome: 'Sessão de Pilates Clínico', preco: 130.0, unidade: 'sessão', descricao: 'Exercícios supervisionados para fortalecimento do core, postura e flexibilidade.' }
    ]
  },
  personal_trainer: {
    nome: 'Personal Trainer',
    template: 'fitness',
    introducao: 'Proposta de acompanhamento físico personalizado focado nos seus objetivos de performance e saúde.',
    observacoes: 'Orçamento válido por 7 dias.\nO plano mensal contempla 12 aulas (3x por semana).\nReposições devem ser agendadas na mesma semana.',
    isPremium: true,
    servicosFrequentes: [
      { nome: 'Acompanhamento Presencial Mensal (3x/sem)', preco: 1200.0, unidade: 'mês', descricao: 'Treinos focados em hipertrofia e emagrecimento com acompanhamento presencial.' },
      { nome: 'Consultoria Online Mensal', preco: 250.0, unidade: 'mês', descricao: 'Montagem de planilhas de treino e suporte via WhatsApp.' },
      { nome: 'Avaliação Física', preco: 150.0, unidade: 'avaliação', descricao: 'Avaliação de bioimpedância e medidas antropométricas.' }
    ]
  },

  // --- CREATIVE & TECH ---
  designer_grafico: {
    nome: 'Designer Gráfico',
    template: 'creative',
    introducao: 'Construímos o posicionamento visual da sua marca com um design estratégico e alinhado aos seus objetivos de mercado.',
    observacoes: 'Orçamento válido por 10 dias úteis.\nForma de pagamento: 50% para iniciar o projeto e 50% na entrega final.\nEstão inclusas até 3 revisões gratuitas. Revisões extras: R$ 50 cada.',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Identidade Visual Completa', preco: 1800.0, unidade: 'projeto', descricao: 'Criação de logotipo, paleta de cores, tipografia, aplicações e manual da marca.' },
      { nome: 'Design para Social Media (12 posts)', preco: 900.0, unidade: 'pacote', descricao: 'Criação de artes estáticas e carrosséis para Instagram/Facebook, entregues em PNG.' },
      { nome: 'Criação de Apresentação Comercial', preco: 1200.0, unidade: 'projeto', descricao: 'Design de apresentação PDF de alto impacto com até 15 slides.' }
    ]
  },
  social_media: {
    nome: 'Social Media',
    template: 'tech',
    introducao: 'Estratégia completa de posicionamento digital para engajar seu público e transformar seguidores em clientes.',
    observacoes: 'Contrato de recorrência mínima de 3 meses.\nPagamento mensal todo dia 10.\nNão inclui taxa de impulsionamento (Ads).',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Gestão de Instagram Mensal', preco: 1500.0, unidade: 'mês', descricao: 'Planejamento editorial, 15 posts no feed, interação diária nos stories e relatório de métricas.' },
      { nome: 'Consultoria de Posicionamento Digital', preco: 800.0, unidade: 'projeto', descricao: 'Análise de perfil, definição de linha editorial e estratégia de crescimento.' },
      { nome: 'Roteirização para Reels/TikTok', preco: 600.0, unidade: 'pacote', descricao: 'Criação de 8 roteiros originais focados em alcance orgânico e conversão.' }
    ]
  },
  marketing_digital: {
    nome: 'Marketing Digital',
    template: 'tech',
    introducao: 'Proposta estratégica de marketing focada em performance, captação de leads e escalabilidade de vendas.',
    observacoes: 'Orçamento válido por 7 dias.\nA verba de mídia paga (anúncios) não está inclusa neste orçamento e deve ser paga diretamente às plataformas.',
    isPremium: true,
    servicosFrequentes: [
      { nome: 'Gestão de Tráfego Pago (Meta e Google Ads)', preco: 2000.0, unidade: 'mês', descricao: 'Criação de campanhas, testes A/B, otimização de Custo Por Lead (CPL) e relatório gerencial.' },
      { nome: 'Criação de Landing Page de Alta Conversão', preco: 1800.0, unidade: 'projeto', descricao: 'Desenvolvimento de página de vendas focada em copywriting e performance.' },
      { nome: 'Configuração de Automação de E-mails', preco: 1200.0, unidade: 'projeto', descricao: 'Criação de funil de vendas, integração com CRM e sequências de e-mail marketing.' }
    ]
  },
  fotografo: {
    nome: 'Fotógrafo',
    template: 'creative',
    introducao: 'Capturamos a essência e os melhores momentos através de um olhar artístico e equipamento profissional.',
    observacoes: 'Orçamento válido por 7 dias.\nDeslocamento acima de 30km terá taxa adicional de R$ 2,00 por km.\nPrazo de entrega das fotos editadas: 15 dias úteis após a seleção.',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Ensaio Fotográfico Externo (2h)', preco: 650.0, unidade: 'ensaio', descricao: 'Sessão com duração de 2 horas. Entrega de 40 fotos em alta resolução editadas.' },
      { nome: 'Cobertura de Evento (4h)', preco: 1200.0, unidade: 'evento', descricao: 'Fotografia documental do evento. Entrega de no mínimo 150 fotos tratadas.' },
      { nome: 'Fotografia de Produtos (E-commerce)', preco: 45.0, unidade: 'foto', descricao: 'Fotos em fundo branco padrão estúdio, tratadas e prontas para catálogo/site.' }
    ]
  },
  videomaker: {
    nome: 'Videomaker',
    template: 'creative',
    introducao: 'Produção audiovisual completa, unindo captação cinematográfica e edição dinâmica para contar a sua história.',
    observacoes: 'Orçamento válido por 10 dias úteis.\nPagamento de 40% na reserva da data e 60% na entrega final.\nEstão inclusas 2 rodadas de alteração na edição.',
    isPremium: true,
    servicosFrequentes: [
      { nome: 'Vídeo Institucional Completo', preco: 3500.0, unidade: 'projeto', descricao: 'Roteiro, 1 diária de captação (4K) com drone e edição profissional com motion graphics.' },
      { nome: 'Pacote de Vídeos para Reels (10 vídeos)', preco: 1800.0, unidade: 'pacote', descricao: 'Captação (meia diária) e edição dinâmica otimizada para retenção no Instagram/TikTok.' },
      { nome: 'Cobertura Audiovisual de Evento', preco: 1500.0, unidade: 'diária', descricao: 'Captação do evento e entrega de teaser de 1 minuto (aftermovie).' }
    ]
  },

  // --- BEAUTY & AESTHETICS ---
  barbeiro: {
    nome: 'Barbeiro / Barbearia',
    template: 'beauty',
    introducao: 'Experiência premium de cuidados masculinos. Visual impecável com atendimento de excelência.',
    observacoes: 'Orçamento/Pacote válido por 15 dias.\nCancelamentos devem ser feitos com no mínimo 4 horas de antecedência.',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Corte de Cabelo + Barboterapia', preco: 85.0, unidade: 'serviço', descricao: 'Corte tesoura/máquina, toalha quente, massagem facial e finalização premium.' },
      { nome: 'Pacote Mensal (4 Cortes + 2 Barbas)', preco: 250.0, unidade: 'pacote', descricao: 'Manutenção semanal do visual com produtos de alta performance.' },
      { nome: 'Camuflagem de Fios Brancos', preco: 60.0, unidade: 'serviço', descricao: 'Pigmentação natural para disfarce de fios grisalhos.' }
    ]
  },
  salao_beleza: {
    nome: 'Salão de Beleza',
    template: 'beauty',
    introducao: 'É um privilégio cuidar do seu bem-estar. Preparamos uma jornada estética de transformação para você.',
    observacoes: 'Orçamento de química válido por 7 dias (sujeito a teste de mecha no dia).\nForma de pagamento: PIX ou cartão em até 3x sem juros para pacotes.',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Mechas / Iluminação + Tratamento', preco: 450.0, unidade: 'serviço', descricao: 'Técnica de morena iluminada ou loiro global, incluindo reconstrução capilar.' },
      { nome: 'Corte Feminino com Visagismo', preco: 120.0, unidade: 'serviço', descricao: 'Avaliação visagista, lavagem terapêutica, corte e finalização.' },
      { nome: 'Escova Progressiva Orgânica', preco: 250.0, unidade: 'serviço', descricao: 'Alisamento sem formol com hidratação de brilho extremo.' }
    ]
  },
  manicure: {
    nome: 'Manicure & Nail Design',
    template: 'beauty',
    introducao: 'Arte e cuidado em cada detalhe. Alongamentos e unhas perfeitas com biossegurança rigorosa.',
    observacoes: 'Garantia de 5 dias contra descolamento natural do alongamento.\nPagamento em PIX ou dinheiro.',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Alongamento em Fibra de Vidro', preco: 180.0, unidade: 'serviço', descricao: 'Extensão durável com acabamento natural, incluindo cutilagem e esmaltação.' },
      { nome: 'Manutenção de Fibra (Até 25 dias)', preco: 90.0, unidade: 'serviço', descricao: 'Reposição do gel, correção da curvatura e troca de cor.' },
      { nome: 'Spa dos Pés e Mãos', preco: 70.0, unidade: 'serviço', descricao: 'Cutilagem, esfoliação, hidratação profunda e esmaltação clássica.' }
    ]
  },
  tatuador: {
    nome: 'Tatuador(a)',
    template: 'creative',
    introducao: 'Proposta de arte exclusiva para a pele. Estudo minucioso de anatomia e traços únicos.',
    observacoes: 'Orçamento válido por 15 dias.\nAgendamento confirmado apenas mediante pagamento do sinal de 30%.\nO sinal não é reembolsável em caso de desistência (cobre o custo do desenho).',
    isPremium: true,
    servicosFrequentes: [
      { nome: 'Tatuagem Fine Line (Até 10cm)', preco: 250.0, unidade: 'tattoo', descricao: 'Traços finos e delicados, design exclusivo em preto e cinza.' },
      { nome: 'Fechamento de Braço (Sessão de 4h)', preco: 1200.0, unidade: 'sessão', descricao: 'Sessão extensa para projetos grandes (Realismo / Blackwork).' },
      { nome: 'Criação de Arte / Projeto Exclusivo', preco: 150.0, unidade: 'arte', descricao: 'Desenvolvimento do decalque original adaptado para a anatomia do cliente.' }
    ]
  },

  // --- ENGINEERING, MAINTENANCE & TRADES ---
  eletricista: {
    nome: 'Eletricista Predial/Residencial',
    template: 'engineering',
    introducao: 'Soluções elétricas com foco na segurança patrimonial e conformidade com as normas NBR 5410.',
    observacoes: 'Prazo de execução: a confirmar no aceite.\nOrçamento válido por 10 dias úteis.\nGarantia de mão de obra de 90 dias.',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Visita Técnica e Diagnóstico', preco: 150.0, unidade: 'visita', descricao: 'Avaliação presencial para localização de curto-circuito e fuga de energia.' },
      { nome: 'Troca de Quadro de Distribuição (QDC)', preco: 800.0, unidade: 'serviço', descricao: 'Substituição do quadro antigo por novo com disjuntores DIN, DPS e DR.' },
      { nome: 'Instalação de Tomadas/Interruptores', preco: 35.0, unidade: 'ponto', descricao: 'Fixação de espelho, ligação dos fios e testes (materiais fornecidos pelo cliente).' }
    ]
  },
  encanador: {
    nome: 'Encanador / Hidráulica',
    template: 'engineering',
    introducao: 'Manutenção hidráulica especializada, mitigando infiltrações e perdas estruturais com eficiência.',
    observacoes: 'Orçamento válido por 7 dias.\nGarantia de serviço contra vazamentos de 90 dias após a conclusão.\nQuebra de parede por conta do cliente (salvo descrito o contrário).',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Caça Vazamento com Geofone', preco: 250.0, unidade: 'serviço', descricao: 'Localização de vazamentos ocultos sem necessidade de quebrar pisos.' },
      { nome: 'Troca de Reparo de Válvula Hydra', preco: 180.0, unidade: 'serviço', descricao: 'Substituição do reparo interno e vedação de válvula de descarga.' },
      { nome: 'Instalação de Ponto de Água/Esgoto', preco: 200.0, unidade: 'ponto', descricao: 'Execução de tubulação PVC soldável para nova pia ou vaso sanitário.' }
    ]
  },
  pedreiro: {
    nome: 'Pedreiro / Reformas',
    template: 'engineering',
    introducao: 'Execução de obra civil com rigor técnico, pontualidade no cronograma e qualidade no acabamento.',
    observacoes: 'Orçamento válido por 15 dias.\nOs valores referentes a materiais não estão inclusos e são de responsabilidade do cliente.\nPagamento semanal conforme medição de avanço da obra.',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Assentamento de Porcelanato', preco: 85.0, unidade: 'm²', descricao: 'Mão de obra para regularização, assentamento, rejunte e nivelamento com cunhas.' },
      { nome: 'Reboco / Emboço de Parede', preco: 40.0, unidade: 'm²', descricao: 'Aplicação de argamassa de revestimento para nivelamento e prumo.' },
      { nome: 'Construção de Muro de Alvenaria', preco: 120.0, unidade: 'm²', descricao: 'Fundação simples, levantamento de blocos cerâmicos e cintamento de concreto.' }
    ]
  },
  manutencao: {
    nome: 'Manutenção / Marido de Aluguel',
    template: 'engineering',
    introducao: 'Reparos rápidos e manutenções diversas para manter sua casa ou escritório sempre funcionais.',
    observacoes: 'Orçamento válido por 5 dias.\nPagamento à vista (PIX ou dinheiro) ao finalizar o serviço.',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Instalação de Suporte de TV', preco: 120.0, unidade: 'serviço', descricao: 'Furação na parede, buchas específicas e fixação nivelada.' },
      { nome: 'Montagem de Móvel Padrão', preco: 150.0, unidade: 'serviço', descricao: 'Montagem de móveis comprados em lojas de departamento (ex: guarda-roupa médio).' },
      { nome: 'Troca de Resistência de Chuveiro', preco: 80.0, unidade: 'serviço', descricao: 'Troca segura da resistência com verificação de fios derretidos.' }
    ]
  },
  assistencia_tecnica: {
    nome: 'Assistência Técnica Eletrônica',
    template: 'tech',
    introducao: 'Diagnóstico preciso e reparo avançado em equipamentos eletrônicos, prezando pela durabilidade.',
    observacoes: 'Orçamento válido por 5 dias devido a oscilação do preço de peças.\nGarantia legal de 90 dias nas peças substituídas.',
    isPremium: true,
    servicosFrequentes: [
      { nome: 'Troca de Tela / Display (Smartphone)', preco: 450.0, unidade: 'serviço', descricao: 'Substituição de display quebrado por peça original ou equivalente premium.' },
      { nome: 'Formatação e Instalação de SSD (Notebook)', preco: 350.0, unidade: 'serviço', descricao: 'Backup, instalação do SSD, Windows 11 e pacote Office (inclui valor da peça de 240GB).' },
      { nome: 'Reparo em Placa Mãe (Micro soldagem)', preco: 600.0, unidade: 'serviço', descricao: 'Análise de esquema elétrico, substituição de capacitores/cis em curto.' }
    ]
  },
  engenharia: {
    nome: 'Engenharia & Arquitetura',
    template: 'engineering',
    introducao: 'Memorial técnico comercial detalhado, prezando pela segurança estrutural e conformidade com as normas ABNT.',
    observacoes: 'Prazo de execução: Conforme cronograma anexo.\nOrçamento válido por 15 dias.\nRecolhimento de ART/RRT de responsabilidade da contratada.',
    isPremium: true,
    servicosFrequentes: [
      { nome: 'Projeto Arquitetônico Residencial', preco: 65.0, unidade: 'm²', descricao: 'Planta baixa, cortes, fachadas, modelo 3D e pranchas executivas.' },
      { nome: 'Projeto Estrutural de Concreto Armado', preco: 45.0, unidade: 'm²', descricao: 'Dimensionamento das fundações, pilares, vigas e lajes com detalhamento de armaduras.' },
      { nome: 'Laudo Técnico de Reforma (NBR 16280)', preco: 1500.0, unidade: 'laudo', descricao: 'Vistoria presencial, análise de impacto e emissão de laudo liberatório para o condomínio.' }
    ]
  },

  // --- CORPORATE & LEGAL ---
  advogado: {
    nome: 'Advogado / Advocacia',
    template: 'legal',
    introducao: 'Apresentamos a V. Sa. a competente proposta de honorários, alinhada à excelência jurídica e proteção de seus interesses.',
    observacoes: 'Orçamento válido por 7 dias úteis.\nForma de pagamento: Boleto bancário ou PIX.\nAs custas judiciais e despesas processuais não estão inclusas e são por conta do Contratante.',
    isPremium: false,
    servicosFrequentes: [
      { nome: 'Ação Cível / Defesa do Consumidor', preco: 3500.0, unidade: 'processo', descricao: 'Representação em 1ª instância até a sentença de mérito, com pedido liminar.' },
      { nome: 'Elaboração de Contrato Sob Medida', preco: 1200.0, unidade: 'contrato', descricao: 'Redação de instrumento contratual comercial com cláusulas protetivas.' },
      { nome: 'Consultoria Jurídica / Parecer', preco: 400.0, unidade: 'hora', descricao: 'Reunião de análise estratégica, estudo do caso e emissão de parecer por escrito.' }
    ]
  },
  consultoria: {
    nome: 'Consultoria & B2B',
    template: 'corporate',
    introducao: 'Agradecemos pela oportunidade. Apresentamos esta solução estratégica para otimizar os resultados da sua organização.',
    observacoes: 'Prazo de execução: 30 dias úteis a partir da assinatura do contrato.\nOrçamento válido por 10 dias úteis.\nForma de pagamento: 50% no aceite e 50% na entrega do relatório executivo.',
    isPremium: true,
    servicosFrequentes: [
      { nome: 'Diagnóstico Empresarial Completo', preco: 4500.0, unidade: 'projeto', descricao: 'Análise DRE, mapeamento de processos críticos e estruturação de plano de ação.' },
      { nome: 'Treinamento In-Company (Vendas)', preco: 2800.0, unidade: 'diária', descricao: 'Treinamento imersivo de 8h para a equipe comercial sobre técnicas de negociação.' },
      { nome: 'Consultoria Financeira (Mensalidade)', preco: 2000.0, unidade: 'mês', descricao: 'Reuniões quinzenais, acompanhamento de fluxo de caixa e reestruturação de dívidas.' }
    ]
  }
};
