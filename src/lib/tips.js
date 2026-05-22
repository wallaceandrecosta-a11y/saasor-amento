// src/lib/tips.js
// Dicas diárias para freelancers e autônomos — exibidas para usuários Premium e Pro
// Rotaciona automaticamente com base no dia do ano

const TIPS = [
  {
    category: 'vendas',
    title: 'Frase para fechar',
    content: '"O que falta para você tomar a decisão hoje?" — Perguntar diretamente ao cliente economiza dias de follow-up.',
    icon: '💬',
  },
  {
    category: 'produtividade',
    title: 'Regra dos 2 minutos',
    content: 'Se uma tarefa leva menos de 2 minutos, faça agora. Respostas rápidas a clientes aumentam a taxa de aprovação de propostas.',
    icon: '⏱️',
  },
  {
    category: 'vendas',
    title: 'Ancoragem de preço',
    content: 'Apresente sempre 3 opções de escopo. O cliente tende a escolher o meio. Isso aumenta o ticket médio naturalmente.',
    icon: '🎯',
  },
  {
    category: 'negócios',
    title: 'Follow-up certo',
    content: 'Envie um follow-up 48h após o orçamento. Diga: "Fiquei à disposição para ajustar qualquer ponto antes de fecharmos."',
    icon: '📩',
  },
  {
    category: 'produtividade',
    title: 'Bloqueie seu tempo',
    content: 'Reserve 1h por dia só para novos clientes. Freelancers que prospectam diariamente têm 3x mais estabilidade de renda.',
    icon: '🗓️',
  },
  {
    category: 'vendas',
    title: 'Valor, não preço',
    content: 'Substitua "custa R$X" por "o investimento é R$X". A percepção de valor muda o posicionamento.',
    icon: '💡',
  },
  {
    category: 'negócios',
    title: 'Depoimento ativo',
    content: 'Após entregar um projeto, peça o depoimento em 24h. Quanto mais fresco está o resultado, mais genuíno o feedback.',
    icon: '⭐',
  },
  {
    category: 'produtividade',
    title: 'Batche suas tarefas',
    content: 'Agrupe orçamentos similares e crie todos de uma vez. A repetição aumenta a velocidade e reduz erros.',
    icon: '⚡',
  },
  {
    category: 'vendas',
    title: 'Gatilho de escassez',
    content: '"Tenho apenas 2 vagas abertas este mês." — Quando verdadeiro, cria senso de urgência real e valoriza seu tempo.',
    icon: '🔒',
  },
  {
    category: 'negócios',
    title: 'Preço e reajuste',
    content: 'Revise seus preços a cada 6 meses. A inflação come sua margem silenciosamente. 10% ao ano é seguro e raramente perde clientes.',
    icon: '📈',
  },
  {
    category: 'produtividade',
    title: 'Template salvo vale dinheiro',
    content: 'Cada template que você salva economiza entre 15 a 30 minutos por orçamento. Em 20 orçamentos, são 10 horas a mais.',
    icon: '🗂️',
  },
  {
    category: 'vendas',
    title: 'Proposta visual convence mais',
    content: 'Clientes aprovam mais rápido propostas com layout profissional. A percepção de qualidade começa antes de ler o preço.',
    icon: '🎨',
  },
  {
    category: 'negócios',
    title: 'Cobre o retorno',
    content: 'Aprenda a colocar na proposta o ROI esperado: "Esse site pode gerar X em vendas no primeiro mês." Isso justifica qualquer preço.',
    icon: '💰',
  },
  {
    category: 'produtividade',
    title: 'Resposta rápida = mais contratos',
    content: 'Responder um potencial cliente em até 1 hora aumenta em 7x a chance de fechar. Configure notificações.',
    icon: '🚀',
  },
  {
    category: 'vendas',
    title: 'Peça indicações',
    content: '"Conhece alguém que poderia se beneficiar do meu trabalho?" — Feche um projeto e peça indicação. É o canal mais barato de aquisição.',
    icon: '🤝',
  },
  {
    category: 'negócios',
    title: 'Margem de segurança',
    content: 'Adicione 15% de margem a cada orçamento para imprevistos. Se não usar, fica como bônus. Se usar, você não fica no vermelho.',
    icon: '🛡️',
  },
  {
    category: 'produtividade',
    title: 'Checklist antes de enviar',
    content: 'Crie um checklist de 5 itens antes de enviar qualquer proposta. Erros no orçamento custam credibilidade — e dinheiro.',
    icon: '✅',
  },
  {
    category: 'vendas',
    title: 'Silêncio estratégico',
    content: 'Após apresentar o preço, fique em silêncio. Quem fala primeiro, perde a vantagem. O cliente sente a firmeza do profissional.',
    icon: '🤫',
  },
  {
    category: 'negócios',
    title: 'Receita recorrente é rei',
    content: 'Crie pelo menos 1 serviço de manutenção ou retainer mensal. Receita previsível protege você em meses ruins.',
    icon: '🔄',
  },
  {
    category: 'produtividade',
    title: 'Automatize o follow-up',
    content: 'Use um modelo de mensagem de follow-up e mande em 48h, 5 dias e 10 dias após o orçamento. Só isso pode recuperar 30% dos negócios perdidos.',
    icon: '📬',
  },
  {
    category: 'vendas',
    title: 'Reduza o risco do cliente',
    content: 'Ofereça uma garantia ou primeira entrega parcial. Quando o cliente sente menos risco, decide mais rápido.',
    icon: '🔐',
  },
  {
    category: 'negócios',
    title: 'Conheça seu custo hora',
    content: 'Calcule quanto você custa por hora (despesas ÷ horas trabalhadas). Sem isso, qualquer desconto pode gerar prejuízo real.',
    icon: '🧮',
  },
  {
    category: 'produtividade',
    title: 'Nome do arquivo importa',
    content: 'Envie PDFs com nome profissional: "Proposta_ClienteX_2024.pdf". Evita que sua proposta se perca entre arquivos genéricos.',
    icon: '📄',
  },
  {
    category: 'vendas',
    title: 'Urgência com data',
    content: 'Coloque sempre a validade da proposta. "Válida por 7 dias" cria urgência real e limita negociações eternas.',
    icon: '📅',
  },
  {
    category: 'negócios',
    title: 'Diversifique clientes',
    content: 'Evite que um único cliente represente mais de 40% da sua renda. Dependência de um cliente é o maior risco do freelancer.',
    icon: '🌐',
  },
  {
    category: 'produtividade',
    title: 'Revise no mobile',
    content: 'Antes de enviar, abra o PDF no celular. Se ficar legível, o cliente consegue ler em qualquer dispositivo.',
    icon: '📱',
  },
  {
    category: 'vendas',
    title: 'Prova social visual',
    content: 'Adicione "Mais de X clientes atendidos" ou cases rápidos no rodapé da proposta. Prova social reduz objeções.',
    icon: '🏆',
  },
  {
    category: 'negócios',
    title: 'Tenha uma proposta de entrada',
    content: 'Crie um serviço de baixo custo para novos clientes. Depois de confiar em você, o upsell vem naturalmente.',
    icon: '🚪',
  },
  {
    category: 'produtividade',
    title: 'Descanso é produtivo',
    content: 'Freelancers que tiram folga semanal têm 22% mais produtividade. Trabalhar sem parar não é eficiente — é desgaste.',
    icon: '😌',
  },
  {
    category: 'vendas',
    title: 'Apresente o processo',
    content: 'Descreva brevemente como você trabalha dentro do orçamento. Clientes compram profissional que tem método, não só resultado.',
    icon: '🗺️',
  },
];

/**
 * Retorna a dica do dia baseada no dia do ano.
 * Mesmo resultado para todos os usuários no mesmo dia.
 */
export function getDailyTip() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % TIPS.length;
  return TIPS[index];
}

/**
 * Retorna uma dica aleatória.
 */
export function getRandomTip() {
  return TIPS[Math.floor(Math.random() * TIPS.length)];
}

export default TIPS;
