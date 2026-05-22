import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { canCreateBudget, logUsage } from '@/lib/permissions/limits';

export async function POST(req) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      // Log de erro de autenticação
      await supabase.from('system_logs').insert({
        action: 'unauthorized_budget_creation',
        description: 'Tentativa de criar orçamento sem usuário autenticado.',
      });
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    // --- 1. Verificação de Limites do Plano (Backend Enforcement) ---
    const permission = await canCreateBudget(user.id);
    
    if (!permission.allowed) {
      // Log tentativa de abuso ou plano excedido
      await supabase.from('system_logs').insert({
        user_id: user.id,
        action: 'plan_limit_exceeded',
        description: `Usuário tentou criar orçamento, mas excedeu o limite do plano. Motivo: ${permission.reason}`,
      });
      return NextResponse.json(
        { error: 'Plan limit reached or subscription locked', reason: permission.reason },
        { status: 403 }
      );
    }

    // Recebe dados do frontend
    const body = await req.json();
    const { 
      id, 
      numero, 
      total_amount, 
      status, 
      data, 
      brand_color, 
      brand_logo_url, 
      remove_watermark 
    } = body;

    // --- 2. Inserção Segura no Banco ---
    const { data: insertedData, error: insertError } = await supabase
      .from('budgets')
      .insert({
        id,
        user_id: user.id,
        number: numero,
        total_amount: Number(total_amount || 0),
        status: status || 'pendente',
        data: data || {},
        brand_color: brand_color || '#2563eb',
        brand_logo_url: brand_logo_url || null,
        remove_watermark: remove_watermark || false
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database Error:', insertError);
      return NextResponse.json({ error: 'Erro ao salvar no banco de dados.' }, { status: 500 });
    }

    // --- 3. Log de Uso do Recurso ---
    await logUsage(user.id, 'budget_creation', 1);

    return NextResponse.json(insertedData, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
