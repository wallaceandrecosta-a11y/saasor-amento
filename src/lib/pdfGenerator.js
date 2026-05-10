// src/lib/pdfGenerator.js
// Geração de PDF usando jsPDF + jspdf-autotable
// Importações dinâmicas para evitar erros de SSR (Server Side Rendering)

const EMPRESA = {
  nome: 'WS Solutions Tecnologia Ltda.',
  cnpj: '12.345.678/0001-90',
  endereco: 'Av. Paulista, 1000 - Sala 201 - São Paulo/SP - CEP 01310-100',
  telefone: '(11) 3000-5555',
  email: 'contato@wssolutions.com.br',
  site: 'www.wssolutions.com.br',
};

const CORES = {
  primaria: [26, 86, 219],      // Azul corporativo
  secundaria: [30, 41, 59],     // Azul escuro
  texto: [30, 41, 59],
  cinzaClaro: [248, 250, 252],
  cinzaMedio: [100, 116, 139],
  branco: [255, 255, 255],
};

export async function gerarPDFOrcamento(orcamento, clienteNome) {
  // Importação dinâmica para garantir que só rode no cliente
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // ... (resto do código permanece o mesmo)
  // [Copiando o resto do código do pdfGenerator anterior para manter a funcionalidade]
  
  // Cabeçalho
  doc.setFillColor(...CORES.secundaria);
  doc.rect(0, 0, pageW, 45, 'F');
  doc.setTextColor(...CORES.branco);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('WS Solutions', 14, 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Tecnologia & Soluções Digitais', 14, 24);
  doc.setFontSize(7.5);
  doc.setTextColor(200, 210, 230);
  doc.text(EMPRESA.telefone, pageW - 14, 14, { align: 'right' });
  doc.text(EMPRESA.email, pageW - 14, 19, { align: 'right' });
  doc.text(EMPRESA.site, pageW - 14, 24, { align: 'right' });
  doc.text(`CNPJ: ${EMPRESA.cnpj}`, pageW - 14, 29, { align: 'right' });

  doc.setFillColor(...CORES.primaria);
  doc.roundedRect(14, 32, 65, 10, 2, 2, 'F');
  doc.setTextColor(...CORES.branco);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`ORÇAMENTO  ${orcamento.numero}`, 46.5, 38.5, { align: 'center' });

  let y = 55;
  doc.setFillColor(...CORES.cinzaClaro);
  doc.roundedRect(14, y, 85, 38, 2, 2, 'F');
  doc.setDrawColor(220, 230, 240);
  doc.roundedRect(14, y, 85, 38, 2, 2, 'S');
  doc.setTextColor(...CORES.primaria);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO CLIENTE', 18, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...CORES.texto);
  doc.setFontSize(8.5);
  doc.text(clienteNome || '—', 18, y + 14);
  if (orcamento.clienteEmail) {
    doc.setFontSize(7.5);
    doc.setTextColor(...CORES.cinzaMedio);
    doc.text(orcamento.clienteEmail, 18, y + 20);
  }
  if (orcamento.clienteTelefone) {
    doc.text(orcamento.clienteTelefone, 18, y + 26);
  }
  if (orcamento.clienteEndereco) {
    doc.text(orcamento.clienteEndereco, 18, y + 32, { maxWidth: 78 });
  }

  doc.setFillColor(...CORES.cinzaClaro);
  doc.roundedRect(104, y, 92, 38, 2, 2, 'F');
  doc.setDrawColor(220, 230, 240);
  doc.roundedRect(104, y, 92, 38, 2, 2, 'S');
  doc.setTextColor(...CORES.primaria);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALHES DO ORÇAMENTO', 108, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...CORES.texto);
  const dataEmissao = new Date(orcamento.createdAt).toLocaleDateString('pt-BR');
  const dataValidade = orcamento.validade ? new Date(orcamento.validade).toLocaleDateString('pt-BR') : '—';
  const statusMap = { pendente: 'Pendente', aprovado: 'Aprovado', recusado: 'Recusado', cancelado: 'Cancelado' };
  const statusLabel = statusMap[orcamento.status] || orcamento.status;
  const infoRows = [['Emissão:', dataEmissao], ['Validade:', dataValidade], ['Status:', statusLabel], ['Número:', orcamento.numero]];
  infoRows.forEach(([label, value], i) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 108, y + 14 + i * 7);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 130, y + 14 + i * 7);
  });

  y += 48;
  doc.setTextColor(...CORES.secundaria);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ITENS DO ORÇAMENTO', 14, y);
  y += 4;

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
    head: [['Item / Serviço', 'Descrição', 'Qtd.', 'Unid.', 'Valor Unit.', 'Subtotal']],
    body: tableRows,
    margin: { left: 14, right: 14 },
    styles: { fontSize: 8, cellPadding: 3, textColor: CORES.texto },
    headStyles: { fillColor: CORES.primaria, textColor: CORES.branco, fontStyle: 'bold', fontSize: 8 },
    alternateRowStyles: { fillColor: CORES.cinzaClaro },
    columnStyles: { 0: { cellWidth: 45 }, 1: { cellWidth: 52 }, 2: { cellWidth: 12, halign: 'center' }, 3: { cellWidth: 12, halign: 'center' }, 4: { cellWidth: 25, halign: 'right' }, 5: { cellWidth: 25, halign: 'right' } },
  });

  const finalY = doc.lastAutoTable.finalY + 6;
  const boxX = pageW - 14 - 75;
  let ty = finalY;
  doc.setFillColor(...CORES.cinzaClaro);
  doc.roundedRect(boxX, ty, 75, orcamento.desconto > 0 ? 30 : 22, 2, 2, 'F');
  doc.setFontSize(8.5);
  doc.setTextColor(...CORES.cinzaMedio);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal:', boxX + 5, ty + 8);
  doc.text(`R$ ${Number(orcamento.subtotal).toFixed(2).replace('.', ',')}`, boxX + 70, ty + 8, { align: 'right' });
  if (orcamento.desconto > 0) {
    doc.text('Desconto:', boxX + 5, ty + 16);
    doc.setTextColor(220, 50, 50);
    doc.text(`- R$ ${Number(orcamento.desconto).toFixed(2).replace('.', ',')}`, boxX + 70, ty + 16, { align: 'right' });
    doc.setDrawColor(210, 215, 220);
    doc.line(boxX + 5, ty + 21, boxX + 70, ty + 21);
    doc.setTextColor(...CORES.secundaria);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', boxX + 5, ty + 29);
    doc.setTextColor(...CORES.primaria);
    doc.text(`R$ ${Number(orcamento.total).toFixed(2).replace('.', ',')}`, boxX + 70, ty + 29, { align: 'right' });
  } else {
    doc.setDrawColor(210, 215, 220);
    doc.line(boxX + 5, ty + 13, boxX + 70, ty + 13);
    doc.setTextColor(...CORES.secundaria);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', boxX + 5, ty + 21);
    doc.setTextColor(...CORES.primaria);
    doc.text(`R$ ${Number(orcamento.total).toFixed(2).replace('.', ',')}`, boxX + 70, ty + 21, { align: 'right' });
  }

  if (orcamento.observacoes) {
    const obsY = finalY + (orcamento.desconto > 0 ? 38 : 30);
    doc.setFillColor(254, 252, 232);
    doc.setDrawColor(234, 179, 8);
    doc.roundedRect(14, obsY, pageW - 28, 22, 2, 2, 'FD');
    doc.setTextColor(113, 63, 18);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text('OBSERVAÇÕES:', 18, obsY + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(orcamento.observacoes, 18, obsY + 13, { maxWidth: pageW - 36 });
  }

  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...CORES.secundaria);
  doc.rect(0, pageH - 18, pageW, 18, 'F');
  doc.setTextColor(160, 175, 200);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(EMPRESA.endereco, pageW / 2, pageH - 11, { align: 'center' });
  doc.text(`${EMPRESA.telefone}  |  ${EMPRESA.email}  |  ${EMPRESA.site}`, pageW / 2, pageH - 5, { align: 'center' });

  doc.save(`Orcamento_${orcamento.numero}.pdf`);
}
