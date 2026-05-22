import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createCustomer, createSubscription } from '@/lib/asaas/client';

export async function POST(req) {
  try {
    const supabase = createClient();
    // Em um cenário real de auth completo:
    // const { data: { session } } = await supabase.auth.getSession();
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // const userId = session.user.id;
    // const userEmail = session.user.email;
    
    // Para simplificar na demo, vamos assumir que o userId vem no body (ou pegar do primeiro user mockado)
    const body = await req.json();
    const { planId, name, cpfCnpj, phone, email, userId } = body;

    // 1. Busca os detalhes do plano
    const { data: plan, error: planError } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: 'Plano inválido' }, { status: 400 });
    }

    // 2. Busca ou cria o cliente no Asaas
    // Idealmente você salvaria o asaas_customer_id na tabela users
    let asaasCustomerId;
    const { data: user } = await supabase.from('users').select('asaas_customer_id').eq('id', userId).single();
    
    if (user?.asaas_customer_id) {
      asaasCustomerId = user.asaas_customer_id;
    } else {
      const asaasCustomer = await createCustomer({ name, email, cpfCnpj, phone });
      asaasCustomerId = asaasCustomer.id;
      // Atualiza o usuário no banco com o customer ID
      await supabase.from('users').update({ asaas_customer_id: asaasCustomerId }).eq('id', userId);
    }

    // 3. Cria a assinatura no Asaas
    const nextDueDate = new Date();
    nextDueDate.setDate(nextDueDate.getDate() + 1); // Vence amanha
    const dueDateStr = nextDueDate.toISOString().split('T')[0];

    const subscription = await createSubscription({
      customerId: asaasCustomerId,
      value: plan.price,
      nextDueDate: dueDateStr,
      description: `Assinatura ${plan.name} - WS Orçamentos`
    });

    // 4. Salva no nosso banco (status pending)
    await supabase.from('subscriptions').upsert({
      user_id: userId,
      plan_id: plan.id,
      status: 'pending',
      external_subscription_id: subscription.id,
    }, { onConflict: 'user_id' });

    // Pega o link da fatura/checkout
    // Quando criamos uma subscription UNDEFINED, o Asaas não retorna link de pagamento direto nela.
    // O Asaas gera um 'payment' derivado da assinatura. Mas se usarmos a URL da fatura base...
    // O Asaas geralmente retorna a subscription com id 'sub_xxxx'. 
    // Para redirecionar para a tela de pagamento do Asaas, o ideal é pegar o pagamento gerado.
    
    return NextResponse.json({ 
      success: true, 
      subscriptionId: subscription.id,
      message: 'Assinatura criada. Redirecionando para pagamento...' 
    });

  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
