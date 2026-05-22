// src/lib/pdfGenerator.js
import { createClient } from './supabase/client';

const EMPRESA = {
  nome: 'Orven',
  cnpj: '',
  endereco: '',
  telefone: '',
  email: 'marketing@wsdesign.com.br',
  site: '',
};

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : null;
}

export async function gerarPDFOrcamento(orcamento, clienteNome) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  let isFreePlan = true;
  let userProfile = null;

  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('company_name, company_cnpj, brand_color, brand_logo_url, remove_watermark')
        .eq('id', session.user.id)
        .single();
      if (profile) userProfile = profile;

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*, plan:plans(*)')
        .eq('user_id', session.user.id)
        .in('status', ['active', 'trial'])
        .single();

      if (sub && sub.plan && sub.plan.name !== 'Free') {
        isFreePlan = false;
      }
    }
  } catch (err) {
    console.error('Erro ao consultar assinatura:', err);
  }

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  if (isFreePlan) {
    renderSinglePageFreePDF(doc, orcamento, clienteNome, pageW, pageH, autoTable);
    return;
  }

  renderSinglePagePremiumPDF(doc, orcamento, clienteNome, pageW, pageH, autoTable, userProfile);
}

// -----------------------------------------------------------------------------
// 1. MODELO GRATUITO
// -----------------------------------------------------------------------------
function renderSinglePageFreePDF(doc, orcamento, clienteNome, pageW, pageH, autoTable) {
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageW, pageH, 'F');

  doc.setFillColor(10, 77, 255);
  doc.rect(14, 10, pageW - 28, 1, 'F');

  let y = 22;

  doc.setTextColor(11, 13, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('ORÇAMENTO COMERCIAL', 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(126, 135, 153);
  doc.text(`Número: ${orcamento.numero}`, 14, y + 5.5);
  doc.text(`Emissão: ${new Date(orcamento.createdAt).toLocaleDateString('pt-BR')}`, pageW - 14, y + 5.5, { align: 'right' });

  y += 13;
  doc.setDrawColor(240, 243, 248);
  doc.setLineWidth(0.3);
  doc.line(14, y, pageW - 14, y);
  y += 8;

  doc.setTextColor(11, 13, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('EMISSOR', 14, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 90, 105);
  doc.text(EMPRESA.nome, 14, y + 5.5);
  doc.text(EMPRESA.cnpj ? `CNPJ: ${EMPRESA.cnpj}` : `E-mail: ${EMPRESA.email}`, 14, y + 10.5);

  doc.setTextColor(11, 13, 18);
  doc.setFont('helvetica', 'bold');
  doc.text('CLIENTE', pageW / 2 + 10, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 90, 105);
  doc.text(clienteNome || 'Cliente', pageW / 2 + 10, y + 5.5);
  if (orcamento.clienteEmail) doc.text(orcamento.clienteEmail, pageW / 2 + 10, y + 10.5);

  y += 18;
  doc.setDrawColor(240, 243, 248);
  doc.line(14, y, pageW - 14, y);
  y += 6;

  const tableRows = orcamento.itens.map((item) => [
    item.nome,
    item.quantidade,
    item.unidade || 'un',
    `R$ ${Number(item.precoUnitario).toFixed(2).replace('.', ',')}`,
    `R$ ${(Number(item.precoUnitario) * Number(item.quantidade)).toFixed(2).replace('.', ',')}`,
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Descrição do Serviço / Item de Escopo', 'Qtd.', 'Unid.', 'Preço Unitário', 'Subtotal']],
    body: tableRows,
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8, cellPadding: 2.5, textColor: [11, 13, 18], font: 'helvetica' },
    headStyles: { fillColor: [241, 245, 249], textColor: [11, 13, 18], fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: [252, 252, 252] },
    columnStyles: {
      0: { cellWidth: 95 },
      1: { cellWidth: 12, halign: 'center' },
      2: { cellWidth: 15, halign: 'center' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 30, halign: 'right' },
    },
  });

  let finalY = doc.lastAutoTable.finalY + 6;
  const boxX = pageW - 14 - 70;

  doc.setFontSize(8);
  doc.setTextColor(126, 135, 153);
  doc.text('Subtotal:', boxX, finalY);
  doc.text(`R$ ${Number(orcamento.subtotal).toFixed(2).replace('.', ',')}`, pageW - 14, finalY, { align: 'right' });

  if (Number(orcamento.desconto) > 0) {
    finalY += 5;
    doc.text('Desconto Aplicado:', boxX, finalY);
    doc.setTextColor(220, 50, 50);
    doc.text(`- R$ ${Number(orcamento.desconto).toFixed(2).replace('.', ',')}`, pageW - 14, finalY, { align: 'right' });
  }

  finalY += 7;
  doc.setDrawColor(10, 77, 255);
  doc.setLineWidth(0.4);
  doc.line(boxX, finalY - 2.5, pageW - 14, finalY - 2.5);

  doc.setTextColor(11, 13, 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('VALOR TOTAL:', boxX, finalY + 1.5);
  doc.setTextColor(10, 77, 255);
  doc.text(`R$ ${Number(orcamento.total).toFixed(2).replace('.', ',')}`, pageW - 14, finalY + 1.5, { align: 'right' });

  finalY += 12;

  if (orcamento.observacoes) {
    doc.setTextColor(11, 13, 18);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('OBSERVAÇÕES E PRAZOS:', 14, finalY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(80, 90, 105);
    doc.text(orcamento.observacoes, 14, finalY + 4, { maxWidth: pageW - 28 });
    finalY += 10;
  }

  if (orcamento.validade) {
    doc.setTextColor(126, 135, 153);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(`Validade: ${new Date(orcamento.validade).toLocaleDateString('pt-BR')}`, 14, finalY + 4);
  }

  doc.setDrawColor(240, 243, 248);
  doc.line(14, pageH - 15, pageW - 14, pageH - 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(126, 135, 153);
  doc.text('Este documento foi emitido através da plataforma ORVEN no plano gratuito.', 14, pageH - 10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(10, 77, 255);
  doc.text('ORVEN', pageW - 14, pageH - 10, { align: 'right' });

  doc.save(`Orcamento_${orcamento.numero}.pdf`);
}

// -----------------------------------------------------------------------------
// 2. MODELO PREMIUM
// -----------------------------------------------------------------------------
function renderSinglePagePremiumPDF(doc, orcamento, clienteNome, pageW, pageH, autoTable, userProfile) {
  const templateId = orcamento.template || 'corporate';

  const NICHOS = {
    creative: {
      bg:            [250, 250, 250],
      primary:       [17, 24, 39],
      secondary:     [31, 41, 55],
      accent:        [251, 146, 60],
      surface:       [255, 255, 255],
      surfaceBorder: [229, 231, 235],
      textMuted:     [107, 114, 128],
      divider:       [229, 231, 235],
      headFill:      [17, 24, 39],
      headText:      [255, 255, 255],
      rowAlt:        [249, 250, 251],
      rowBg:         [255, 255, 255],
      font:          'helvetica',
      title:         'PROPOSTA COMERCIAL PREMIUM',
      decorator:     'corporate',
      isDark:        false,
    },
    fitness: {
      bg:            [18, 18, 20],
      primary:       [185, 28, 28],
      secondary:     [229, 231, 235],
      accent:        [239, 68, 68],
      surface:       [24, 24, 27],
      surfaceBorder: [39, 39, 42],
      textMuted:     [156, 163, 175],
      divider:       [39, 39, 42],
      headFill:      [185, 28, 28],
      headText:      [255, 255, 255],
      rowAlt:        [28, 28, 31],
      rowBg:         [24, 24, 27],
      font:          'helvetica',
      title:         'PROPOSTA DE TREINAMENTO',
      decorator:     'tech',
      isDark:        true,
    },
    beauty: {
      bg:            [251, 249, 246],
      primary:       [139, 109, 92],
      secondary:     [61, 43, 32],
      accent:        [212, 175, 55],
      surface:       [253, 246, 239],
      surfaceBorder: [232, 221, 208],
      textMuted:     [158, 128, 112],
      divider:       [232, 221, 208],
      headFill:      [229, 197, 181],
      headText:      [61, 43, 32],
      rowAlt:        [250, 246, 242],
      rowBg:         [255, 252, 249],
      font:          'times',
      title:         'PROPOSTA ESTETICA PREMIUM',
      decorator:     'beauty',
      isDark:        false,
    },
    health: {
      bg:            [245, 248, 247],
      primary:       [13, 148, 136],
      secondary:     [7, 26, 61],
      accent:        [13, 148, 136],
      surface:       [235, 244, 244],
      surfaceBorder: [200, 220, 222],
      textMuted:     [90, 112, 128],
      divider:       [200, 221, 224],
      headFill:      [13, 148, 136],
      headText:      [255, 255, 255],
      rowAlt:        [238, 245, 245],
      rowBg:         [245, 248, 247],
      font:          'helvetica',
      title:         'PLANO TERAPEUTICO & BEM-ESTAR',
      decorator:     'health',
      isDark:        false,
    },
    corporate: {
      bg:            [255, 255, 255],
      primary:       [15, 23, 42],
      secondary:     [15, 23, 42],
      accent:        [10, 77, 255],
      surface:       [241, 245, 249],
      surfaceBorder: [210, 218, 230],
      textMuted:     [100, 116, 139],
      divider:       [226, 232, 240],
      headFill:      [15, 23, 42],
      headText:      [255, 255, 255],
      rowAlt:        [248, 250, 252],
      rowBg:         [255, 255, 255],
      font:          'helvetica',
      title:         'PROPOSTA COMERCIAL & ESCOPO',
      decorator:     'corporate',
      isDark:        false,
    },
    tech: {
      bg:            [5, 8, 22],
      primary:       [10, 77, 255],
      secondary:     [232, 238, 250],
      accent:        [124, 58, 237],
      surface:       [11, 21, 51],
      surfaceBorder: [30, 50, 100],
      textMuted:     [140, 150, 170],
      divider:       [30, 40, 65],
      headFill:      [10, 77, 255],
      headText:      [255, 255, 255],
      rowAlt:        [15, 20, 35],
      rowBg:         [5, 8, 22],
      font:          'helvetica',
      title:         'SaaS & TECH DIGITAL PROPOSAL',
      decorator:     'tech',
      isDark:        true,
    },
    engineering: {
      bg:            [248, 250, 252],
      primary:       [234, 88, 12],
      secondary:     [30, 41, 59],
      accent:        [234, 88, 12],
      surface:       [241, 245, 249],
      surfaceBorder: [203, 213, 225],
      textMuted:     [100, 116, 139],
      divider:       [203, 213, 225],
      headFill:      [30, 41, 59],
      headText:      [255, 255, 255],
      rowAlt:        [241, 245, 249],
      rowBg:         [248, 250, 252],
      font:          'helvetica',
      title:         'DIAGNOSTICO & MEMORIAL TECNICO',
      decorator:     'engineering',
      isDark:        false,
    },
    legal: {
      bg:            [252, 251, 249],
      primary:       [92, 29, 36],
      secondary:     [28, 28, 28],
      accent:        [197, 168, 128],
      surface:       [250, 246, 239],
      surfaceBorder: [216, 207, 196],
      textMuted:     [107, 98, 88],
      divider:       [216, 207, 196],
      headFill:      [92, 29, 36],
      headText:      [250, 243, 224],
      rowAlt:        [248, 245, 242],
      rowBg:         [252, 251, 249],
      font:          'times',
      title:         'PROPOSTA DE HONORARIOS ADVOCATICIOS',
      decorator:     'legal',
      isDark:        false,
    },
  };

  const estilo = { ...(NICHOS[templateId] || NICHOS.corporate) };
  const isDark = estilo.isDark;
  const f = estilo.font;

  // Cor customizada do usuário Pro
  if (userProfile?.brand_color) {
    const rgb = hexToRgb(userProfile.brand_color);
    if (rgb) {
      estilo.primary  = rgb;
      estilo.accent   = rgb;
      estilo.headFill = rgb;
    }
  }

  const isFramed = estilo.decorator === 'beauty' || estilo.decorator === 'legal';
  const hasSideBar = estilo.decorator === 'health' || estilo.decorator === 'engineering';
  const marginL = hasSideBar ? 20 : 14;
  const marginR = 14;
  const contentW = pageW - marginL - marginR;

  // ── FUNDO ──────────────────────────────────────────────────────────────────
  doc.setFillColor(...estilo.bg);
  doc.rect(0, 0, pageW, pageH, 'F');

  // ── DECORADORES ────────────────────────────────────────────────────────────
  if (estilo.decorator === 'beauty') {
    doc.setDrawColor(...estilo.accent);
    doc.setLineWidth(0.6);
    doc.rect(6, 6, pageW - 12, pageH - 12, 'S');
    doc.setLineWidth(0.2);
    doc.rect(8.5, 8.5, pageW - 17, pageH - 17, 'S');

  } else if (estilo.decorator === 'legal') {
    doc.setDrawColor(...estilo.primary);
    doc.setLineWidth(0.6);
    doc.rect(6, 6, pageW - 12, pageH - 12, 'S');
    doc.setDrawColor(...estilo.accent);
    doc.setLineWidth(0.25);
    doc.rect(8.5, 8.5, pageW - 17, pageH - 17, 'S');
    const cs = 2;
    [[7, 7], [pageW - 7 - cs, 7], [7, pageH - 7 - cs], [pageW - 7 - cs, pageH - 7 - cs]].forEach(([cx, cy]) => {
      doc.setFillColor(...estilo.accent);
      doc.rect(cx, cy, cs, cs, 'F');
    });

  } else if (estilo.decorator === 'health') {
    doc.setFillColor(...estilo.primary);
    doc.rect(0, 0, 5, pageH, 'F');

  } else if (estilo.decorator === 'engineering') {
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, 5, pageH, 'F');
    doc.setFillColor(...estilo.primary);
    doc.rect(5, 0, 2, pageH, 'F');
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageW, 3.5, 'F');

  } else if (estilo.decorator === 'tech') {
    doc.setFillColor(10, 77, 255);
    doc.rect(0, 0, pageW, 3, 'F');
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 3, pageW / 2, 1.2, 'F');
    doc.setFillColor(10, 77, 255);
    doc.rect(pageW / 2, 3, pageW / 2, 1.2, 'F');

  } else if (estilo.decorator === 'corporate') {
    doc.setFillColor(...estilo.accent);
    doc.rect(0, 0, pageW, 3, 'F');
  }

  let y = isFramed ? 20 : (estilo.decorator === 'engineering' ? 13 : 15);

  // ── CABEÇALHO ──────────────────────────────────────────────────────────────
  let logoDrawn = false;
  if (userProfile?.brand_logo_url) {
    try {
      let format = 'PNG';
      if (userProfile.brand_logo_url.startsWith('data:image/jpeg') ||
          userProfile.brand_logo_url.startsWith('data:image/jpg')) format = 'JPEG';
      doc.addImage(userProfile.brand_logo_url, format, marginL, y - 4, 32, 13, undefined, 'FAST');
      logoDrawn = true;
    } catch (e) {
      console.error('Erro ao renderizar logotipo:', e);
    }
  }

  if (!logoDrawn) {
    doc.setFont(f, 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...(isDark ? [255, 255, 255] : estilo.secondary));
    doc.text(userProfile?.company_name || EMPRESA.nome, marginL, y);
  }

  doc.setFont(f, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...estilo.textMuted);
  const cnpjLine = userProfile?.company_cnpj
    ? `CNPJ: ${userProfile.company_cnpj}`
    : (EMPRESA.cnpj ? `CNPJ: ${EMPRESA.cnpj}` : '');
  const subLine = cnpjLine ? `${cnpjLine}  ·  ${EMPRESA.email}` : EMPRESA.email;
  doc.text(subLine, marginL, y + (logoDrawn ? 10 : 5.5));

  // Título e número (direita)
  doc.setFont(f, 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(...(isDark ? [255, 255, 255] : estilo.primary));
  doc.text(estilo.title, pageW - marginR, y, { align: 'right' });

  doc.setFont(f, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...estilo.textMuted);
  doc.text(`Proposta: ${orcamento.numero}`, pageW - marginR, y + 5.5, { align: 'right' });
  doc.text(`Emissão: ${new Date(orcamento.createdAt).toLocaleDateString('pt-BR')}`, pageW - marginR, y + 10.5, { align: 'right' });

  y += 18;

  // ── DIVISOR ────────────────────────────────────────────────────────────────
  doc.setDrawColor(...estilo.divider);
  doc.setLineWidth(0.4);
  doc.line(marginL, y, pageW - marginR, y);
  y += 7;

  // ── BLOCO DO CLIENTE ───────────────────────────────────────────────────────
  const temContato = orcamento.clienteEmail || orcamento.clienteTelefone;
  const clienteH = temContato ? 24 : 20;

  doc.setFillColor(...estilo.surface);
  doc.setDrawColor(...estilo.surfaceBorder);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginL, y, contentW, clienteH, 2, 2, 'FD');

  doc.setFillColor(...estilo.accent);
  doc.rect(marginL, y, 3, clienteH, 'F');

  const cy = y + 5.5;
  doc.setFont(f, 'bold');
  doc.setFontSize(7);
  doc.setTextColor(...estilo.textMuted);
  doc.text('PREPARADO EXCLUSIVAMENTE PARA', marginL + 7, cy);

  doc.setFont(f, 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...(isDark ? [255, 255, 255] : estilo.secondary));
  doc.text(clienteNome || 'Cliente', marginL + 7, cy + 7.5);

  if (temContato) {
    doc.setFont(f, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...estilo.textMuted);
    const parts = [];
    if (orcamento.clienteEmail) parts.push(orcamento.clienteEmail);
    if (orcamento.clienteTelefone) parts.push(orcamento.clienteTelefone);
    doc.text(parts.join('  ·  '), marginL + 7, cy + 14);
  }

  y += clienteH + 8;

  // ── TABELA ─────────────────────────────────────────────────────────────────
  const tableRows = orcamento.itens.map((item) => [
    item.nome,
    item.descricao || '—',
    item.quantidade,
    item.unidade || 'un',
    `R$ ${Number(item.precoUnitario).toFixed(2).replace('.', ',')}`,
    `R$ ${(Number(item.precoUnitario) * Number(item.quantidade)).toFixed(2).replace('.', ',')}`,
  ]);

  autoTable(doc, {
    startY: y,
    head: [['Item / Servico', 'Descricao', 'Qtd.', 'Unid.', 'Preco Unit.', 'Subtotal']],
    body: tableRows,
    margin: { left: marginL, right: marginR },
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
      textColor: isDark ? [210, 220, 235] : estilo.secondary,
      font: f,
      lineColor: estilo.divider,
      lineWidth: 0.15,
    },
    headStyles: {
      fillColor: estilo.headFill,
      textColor: estilo.headText,
      fontStyle: 'bold',
      fontSize: 8,
      cellPadding: 3.5,
    },
    alternateRowStyles: { fillColor: estilo.rowAlt },
    bodyStyles: { fillColor: estilo.rowBg },
    columnStyles: {
      0: { cellWidth: 42, fontStyle: 'bold' },
      1: { cellWidth: 52 },
      2: { cellWidth: 12, halign: 'center' },
      3: { cellWidth: 14, halign: 'center' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
    },
  });

  let finalY = doc.lastAutoTable.finalY + 7;
  const boxX = pageW - marginR - 74;

  // ── RESUMO FINANCEIRO ──────────────────────────────────────────────────────
  doc.setDrawColor(...estilo.divider);
  doc.setLineWidth(0.3);
  doc.line(boxX, finalY, pageW - marginR, finalY);
  finalY += 6;

  doc.setFont(f, 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...estilo.textMuted);
  doc.text('Subtotal:', boxX, finalY);
  doc.text(`R$ ${Number(orcamento.subtotal).toFixed(2).replace('.', ',')}`, pageW - marginR, finalY, { align: 'right' });

  if (Number(orcamento.desconto) > 0) {
    finalY += 6;
    doc.text('Desconto:', boxX, finalY);
    doc.setTextColor(210, 50, 50);
    doc.text(`- R$ ${Number(orcamento.desconto).toFixed(2).replace('.', ',')}`, pageW - marginR, finalY, { align: 'right' });
  }

  finalY += 8;
  doc.setDrawColor(...estilo.accent);
  doc.setLineWidth(0.6);
  doc.line(boxX, finalY - 3, pageW - marginR, finalY - 3);

  doc.setFont(f, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...(isDark ? [255, 255, 255] : estilo.secondary));
  doc.text('TOTAL GERAL:', boxX, finalY + 1.5);
  doc.setTextColor(...estilo.accent);
  doc.text(`R$ ${Number(orcamento.total).toFixed(2).replace('.', ',')}`, pageW - marginR, finalY + 1.5, { align: 'right' });

  finalY += 13;

  // ── OBSERVAÇÕES ────────────────────────────────────────────────────────────
  if (orcamento.observacoes) {
    const obsLines = doc.splitTextToSize(orcamento.observacoes, contentW - 18);
    const obsH = obsLines.length * 4.8 + 16;

    doc.setFillColor(...estilo.surface);
    doc.setDrawColor(...estilo.surfaceBorder);
    doc.setLineWidth(0.2);
    doc.roundedRect(marginL, finalY, contentW, obsH, 2, 2, 'FD');

    doc.setFillColor(...estilo.accent);
    doc.rect(marginL, finalY, 3, obsH, 'F');

    doc.setFont(f, 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...(isDark ? [255, 255, 255] : estilo.primary));
    doc.text('CONDICOES COMERCIAIS & PRAZOS', marginL + 8, finalY + 7);

    doc.setFont(f, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...(isDark ? [160, 170, 185] : estilo.textMuted));
    doc.text(obsLines, marginL + 8, finalY + 13);

    finalY += obsH + 7;
  }

  // ── VALIDADE ───────────────────────────────────────────────────────────────
  if (orcamento.validade) {
    doc.setFont(f, 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...estilo.textMuted);
    doc.text(
      `Validade desta proposta: ${new Date(orcamento.validade).toLocaleDateString('pt-BR')}`,
      marginL, finalY + 4
    );
  }

  // ── RODAPÉ ─────────────────────────────────────────────────────────────────
  doc.setDrawColor(...estilo.divider);
  doc.setLineWidth(0.3);
  doc.line(marginL, pageH - 13, pageW - marginR, pageH - 13);

  doc.setFont(f, 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...estilo.textMuted);
  doc.text('Esta proposta e confidencial e destinada exclusivamente ao outorgado.', marginL, pageH - 7);

  doc.setFont(f, 'bold');
  doc.setTextColor(...estilo.primary);
  const rodapeNome = userProfile?.remove_watermark
    ? (userProfile.company_name || EMPRESA.nome)
    : 'Emitido por ORVEN';
  doc.text(rodapeNome, pageW - marginR, pageH - 7, { align: 'right' });

  doc.save(`Orcamento_Premium_${orcamento.numero}.pdf`);
}