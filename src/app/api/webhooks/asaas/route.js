import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  sendSubscriptionActivatedEmail,
  sendPaymentOverdueEmail,
  sendSubscriptionCancelledEmail
} from '@/lib/emails';

export async function POST(req) {
  try {
    const supabase = createClient();
    
    // Validação do Token do Webhook (Proteção contra webhooks falsos)
    const asaasToken = req.headers.get('asaas-access-token');
    const EXPECTED_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN;
    
    if (EXPECTED_TOKEN && asaasToken !== EXPECTED_TOKEN) {
      // Registrar log de tentativa não autorizada (sem payload pra não sujar banco se for spam)
      await supabase.from('webhook_logs').insert({
        event_type: 'unauthorized_access',
        status: 'error',
        error_message: 'Invalid or missing Asaas token'
      });
      return NextResponse.json({ error: 'Unauthorized webhook' }, { status: 401 });
    }

    const body = await req.json();
    const { event, payment } = body;

    // Registrar o evento recebido para auditoria e log de pagamentos
    const { data: logEntry } = await supabase.from('webhook_logs').insert({
      event_type: event || 'unknown',
      payload: body,
      status: 'received'
    }).select().single();

    // Asaas envia o id da assinatura dentro do objeto payment (payment.subscription)
    const subscriptionId = payment?.subscription;
    if (!subscriptionId) {
      if (logEntry) await supabase.from('webhook_logs').update({ status: 'ignored', error_message: 'Not a subscription payment' }).eq('id', logEntry.id);
      return NextResponse.json({ received: true, note: 'Not a subscription payment' });
    }

    // Busca a assinatura no nosso banco
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*, users(email), plans(name)')
      .eq('external_subscription_id', subscriptionId)
      .single();

    if (subError || !subscription) {
      if (logEntry) await supabase.from('webhook_logs').update({ status: 'error', error_message: 'Subscription not found locally' }).eq('id', logEntry.id);
      return NextResponse.json({ error: 'Subscription not found locally' }, { status: 404 });
    }

    const userId = subscription.user_id;
    const userEmail = subscription.users.email;
    const planName = subscription.plans.name;

    switch (event) {
      case 'PAYMENT_RECEIVED':
      case 'PAYMENT_CONFIRMED': {
        // Confirmação de pagamento apenas via webhook e backend liberando
        const newExpiresAt = new Date();
        newExpiresAt.setMonth(newExpiresAt.getMonth() + 1);

        await supabase
          .from('subscriptions')
          .update({ 
            status: 'active', 
            expires_at: newExpiresAt.toISOString() 
          })
          .eq('id', subscription.id);

        await sendSubscriptionActivatedEmail(userEmail, planName);
        break;
      }
      
      case 'PAYMENT_OVERDUE':
      case 'PAYMENT_REPROVED': {
        // Bloqueio automático após vencimento
        await supabase
          .from('subscriptions')
          .update({ status: 'expired' })
          .eq('id', subscription.id);

        await sendPaymentOverdueEmail(userEmail);
        break;
      }

      case 'PAYMENT_DELETED':
      case 'SUBSCRIPTION_DELETED': {
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('id', subscription.id);
        
        await sendSubscriptionCancelledEmail(userEmail);
        break;
      }
    }

    if (logEntry) await supabase.from('webhook_logs').update({ status: 'processed' }).eq('id', logEntry.id);
    return NextResponse.json({ success: true, eventProcessed: event });

  } catch (error) {
    console.error('Webhook Error:', error);
    // Tenta logar o erro no banco se possível, ignorando falha de log
    try {
      const supabase = createClient();
      await supabase.from('system_logs').insert({
        action: 'webhook_processing_error',
        description: error.message || 'Unknown error'
      });
    } catch (e) {}

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
