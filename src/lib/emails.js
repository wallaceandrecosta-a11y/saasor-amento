// src/lib/emails.js

/**
 * Função utilitária para envio de emails (Mock/Simulação).
 * Em produção, pode ser substituída por Resend, SendGrid, Amazon SES, etc.
 */

const mockSendEmail = async (to, subject, html) => {
  console.log(`\n================= EMAIL ENVIADO =================`);
  console.log(`Para: ${to}`);
  console.log(`Assunto: ${subject}`);
  console.log(`Corpo:\n${html}`);
  console.log(`=================================================\n`);
  return true;
};

export const sendWelcomeEmail = async (email, name) => {
  return mockSendEmail(
    email,
    'Bem-vindo ao WS Orçamentos - Seu Trial de 7 Dias Começou!',
    `Olá ${name},\n\nSua conta foi criada com sucesso e seu trial de 7 dias do plano Premium já está ativo!\nAproveite todas as funcionalidades avançadas.`
  );
};

export const sendSubscriptionActivatedEmail = async (email, planName) => {
  return mockSendEmail(
    email,
    `Assinatura Confirmada: Plano ${planName}`,
    `Seu pagamento foi confirmado e seu plano ${planName} está ativado.\nObrigado por confiar no nosso sistema!`
  );
};

export const sendPaymentOverdueEmail = async (email) => {
  return mockSendEmail(
    email,
    'Aviso de Pagamento Atrasado',
    `Identificamos um atraso no pagamento da sua assinatura. Seus recursos premium foram temporariamente bloqueados.\nPor favor, atualize seus dados de faturamento para continuar gerando orçamentos ilimitados.`
  );
};

export const sendTrialExpiringEmail = async (email) => {
  return mockSendEmail(
    email,
    'Seu Trial está acabando!',
    `Faltam poucos dias para o fim do seu trial Premium. Assine agora para não perder o acesso a templates profissionais e orçamentos ilimitados.`
  );
};

export const sendSubscriptionCancelledEmail = async (email) => {
  return mockSendEmail(
    email,
    'Assinatura Cancelada',
    `Sua assinatura foi cancelada. Seu plano voltará para o pacote Gratuito ao final do ciclo atual.`
  );
};
