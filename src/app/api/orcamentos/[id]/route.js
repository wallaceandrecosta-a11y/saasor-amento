import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/orcamentos/[id]
// Carrega o orçamento publicamente (sem autenticação) e registra o tracking de visualização
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const supabase = createClient();

    // 1. Busca o orçamento no banco
    const { data: orcamento, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !orcamento) {
      return NextResponse.json({ error: 'Orçamento não encontrado.' }, { status: 404 });
    }

    // 2. Captura informações do visitante (IP e User-Agent)
    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const userAgent = req.headers.get('user-agent') || 'Desconhecido';
    const now = new Date().toISOString();

    // 3. Atualiza dados de tracking
    const currentViewCount = (orcamento.view_count || 0) + 1;
    const firstView = orcamento.first_viewed_at || now;
    const history = orcamento.tracking_history || [];
    
    // Mantém histórico dos últimos 20 acessos para não estourar a coluna jsonb
    const newHistory = [
      { timestamp: now, ip, userAgent },
      ...history
    ].slice(0, 20);

    const { error: updateError } = await supabase
      .from('budgets')
      .update({
        view_count: currentViewCount,
        first_viewed_at: firstView,
        last_viewed_at: now,
        tracking_history: newHistory
      })
      .eq('id', id);

    if (updateError) {
      console.error('Erro ao atualizar tracking:', updateError);
    }

    // Retorna o orçamento com os dados atualizados
    return NextResponse.json({
      ...orcamento,
      view_count: currentViewCount,
      first_viewed_at: firstView,
      last_viewed_at: now,
      tracking_history: newHistory
    });

  } catch (error) {
    console.error('Erro na API de orçamento:', error);
    return NextResponse.json({ error: 'Erro interno no servidor.' }, { status: 500 });
  }
}

// POST /api/orcamentos/[id]
// Registra ações do cliente: aprovação, rejeição ou pedido de alterações
export async function POST(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { action, feedback } = body; // action: 'approve' | 'reject' | 'request_changes'
    
    const supabase = createClient();

    // 1. Busca o orçamento atual
    const { data: orcamento, error: fetchError } = await supabase
      .from('budgets')
      .eq('id', id)
      .single();

    if (fetchError || !orcamento) {
      return NextResponse.json({ error: 'Orçamento não encontrado.' }, { status: 404 });
    }

    // 2. Captura metadados
    const ip = req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1';
    const now = new Date().toISOString();
    
    let updateFields = {};

    if (action === 'approve') {
      updateFields = {
        status: 'aprovado',
        approved_at: now,
        approved_ip: ip,
        client_feedback: feedback || 'Aprovado pelo cliente online.'
      };
    } else if (action === 'reject') {
      updateFields = {
        status: 'recusado',
        client_feedback: feedback || 'Recusado pelo cliente.'
      };
    } else if (action === 'request_changes') {
      updateFields = {
        status: 'pendente', // Volta a pendente para ajustes do usuário
        client_feedback: feedback || 'Alterações solicitadas pelo cliente.'
      };
    } else {
      return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
    }

    // Adiciona evento no histórico
    const history = orcamento.tracking_history || [];
    const newHistory = [
      { timestamp: now, ip, event: `Ação: ${action}`, feedback: feedback || '' },
      ...history
    ].slice(0, 20);

    updateFields.tracking_history = newHistory;

    // 3. Atualiza no banco
    const { data: updated, error: updateError } = await supabase
      .from('budgets')
      .update(updateFields)
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json(updated);

  } catch (error) {
    console.error('Erro ao processar ação no orçamento:', error);
    return NextResponse.json({ error: 'Erro interno ao processar ação.' }, { status: 500 });
  }
}
