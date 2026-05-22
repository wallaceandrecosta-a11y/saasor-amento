// src/lib/asaas/client.js

const ASAAS_URL = process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_KEY = process.env.ASAAS_API_KEY;

const asaasRequest = async (endpoint, options = {}) => {
  const url = `${ASAAS_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'access_token': ASAAS_KEY,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Asaas API Error:', errorBody);
    throw new Error(`Asaas API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const createCustomer = async ({ name, email, cpfCnpj, phone }) => {
  return asaasRequest('/customers', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      cpfCnpj,
      phone,
    }),
  });
};

export const createSubscription = async ({ customerId, value, nextDueDate, cycle = 'MONTHLY', description }) => {
  return asaasRequest('/subscriptions', {
    method: 'POST',
    body: JSON.stringify({
      customer: customerId,
      billingType: 'UNDEFINED', // Deixa em aberto para pagar via BOLETO, CREDIT_CARD ou PIX no checkout Asaas
      value,
      nextDueDate,
      cycle,
      description,
    }),
  });
};

export const getSubscription = async (subscriptionId) => {
  return asaasRequest(`/subscriptions/${subscriptionId}`, {
    method: 'GET',
  });
};

// Quando criamos uma assinatura UNDEFINED, o Asaas retorna um invoiceUrl e um id. 
// A assinatura gera cobranças (payments) mensais.
export const getPaymentsBySubscription = async (subscriptionId) => {
  return asaasRequest(`/payments?subscription=${subscriptionId}`, {
    method: 'GET',
  });
};
