'use client';
export const dynamic = 'force-dynamic';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import AppLayout from '@/components/AppLayout';
import { MdCreditCard, MdQrCode, MdReceipt, MdLock } from 'react-icons/md';
import { useToast } from '@/components/Toast';
import { createClient } from '@/lib/supabase/client'; 

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'premium';
  const toast = useToast();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('PIX');
  const [sessionUser, setSessionUser] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpfCnpj: '',
    phone: '',
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSessionUser(session.user);
        setFormData(prev => ({
          ...prev,
          email: session.user.email
        }));
      }
    };
    fetchUser();
  }, [supabase]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic input sanitization
      const sanitizedData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        cpfCnpj: formData.cpfCnpj.replace(/[^\d]/g, ''),
        phone: formData.phone.replace(/[^\d]/g, '')
      };

      // Basic validations
      if (!sanitizedData.email.includes('@')) {
        throw new Error('E-mail inválido');
      }
      if (sanitizedData.cpfCnpj.length !== 11 && sanitizedData.cpfCnpj.length !== 14) {
        throw new Error('CPF/CNPJ inválido. Digite 11 ou 14 números.');
      }

      // Simulando planId que deve existir no banco
      const payload = {
        ...sanitizedData,
        userId: sessionUser?.id,
        planId: plan === 'premium' ? 'b7a3a9de-e161-427c-9b16-41f39121d5a7' : 'pro-plan-uuid',
        method
      };

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar checkout');
      }

      toast('Redirecionando para pagamento seguro...', 'success');
      
      // Simula redirecionamento (Como não criamos split real aqui, finge sucesso via Asaas Link)
      // O Asaas Checkout url padrão é: https://sandbox.asaas.com/c/ + subscription_invoice_id
      // Aqui só finalizamos o processo para a UI
      setTimeout(() => {
        alert('Aqui você seria redirecionado para: https://sandbox.asaas.com/c/' + data.subscriptionId);
        window.location.href = '/settings/billing'; // Volta pro painel
      }, 2000);

    } catch (error) {
      toast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 350px', gap: 32 }}>
        
        {/* Formulário de Dados */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <MdLock style={{ color: 'var(--success)' }} />
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Pagamento Seguro (Asaas)</h2>
          </div>
          <div className="card-body">
            <form onSubmit={handleCheckout}>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>1. Dados do Titular</h3>
              
              <div className="form-group">
                <label className="form-label">Nome Completo / Razão Social</label>
                <input required type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
              </div>
              
              <div className="form-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label className="form-label">E-mail</label>
                  <input required type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                  <label className="form-label">Telefone (WhatsApp)</label>
                  <input required type="text" className="form-control" name="phone" placeholder="(11) 99999-9999" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 32 }}>
                <label className="form-label">CPF ou CNPJ</label>
                <input required type="text" className="form-control" name="cpfCnpj" placeholder="000.000.000-00" value={formData.cpfCnpj} onChange={handleChange} />
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>2. Forma de Pagamento</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
                {[
                  { id: 'PIX', label: 'PIX', icon: <MdQrCode /> },
                  { id: 'CREDIT_CARD', label: 'Cartão', icon: <MdCreditCard /> },
                  { id: 'BOLETO', label: 'Boleto', icon: <MdReceipt /> }
                ].map(m => (
                  <div 
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    style={{
                      border: `2px solid ${method === m.id ? 'var(--primary-600)' : 'var(--gray-200)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      background: method === m.id ? 'var(--primary-50)' : '#fff',
                      color: method === m.id ? 'var(--primary-700)' : 'var(--gray-600)',
                      fontWeight: method === m.id ? 700 : 500,
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{m.icon}</span>
                    <span style={{ fontSize: 13 }}>{m.label}</span>
                  </div>
                ))}
              </div>

              <button disabled={loading} type="submit" className="btn btn-primary btn-full btn-lg">
                {loading ? 'Processando...' : 'Assinar Agora'}
              </button>
            </form>
          </div>
        </div>

        {/* Resumo do Pedido */}
        <div>
          <div className="card" style={{ position: 'sticky', top: 24 }}>
            <div className="card-header">
              <h2 style={{ fontSize: 15, fontWeight: 700 }}>Resumo da Assinatura</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 600 }}>Plano Premium</span>
                <span style={{ fontWeight: 600 }}>R$ 49,90</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', borderBottom: '1px solid var(--gray-200)', paddingBottom: 16, marginBottom: 16 }}>
                Ciclo de faturamento: Mensal<br/>
                Cancelamento grátis a qualquer momento.
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 800 }}>
                <span>Total Hoje</span>
                <span style={{ color: 'var(--primary-600)' }}>R$ 49,90</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
