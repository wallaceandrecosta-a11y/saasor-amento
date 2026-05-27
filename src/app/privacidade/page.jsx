import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export const metadata = {
  title: 'Política de Privacidade - Orven',
  description: 'Política de Privacidade e Proteção de Dados da Plataforma Orven.',
};

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-[#0B0D12] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-[#071A3D]/30 border border-blue-900/20 shadow-premium p-8 rounded-[24px]">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-[#8B95A7] hover:text-white mb-6 transition-colors">
          <MdArrowBack className="mr-1" /> Voltar
        </Link>
        
        <h1 className="text-3xl font-extrabold text-white mb-6">Política de Privacidade</h1>
        <p className="text-sm text-[#8B95A7] mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <div className="space-y-6 text-[#8B95A7] text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Compromisso com a Privacidade</h2>
            <p>O Orven preza pela privacidade e segurança dos seus dados e dos dados dos seus clientes. Esta Política explica como coletamos, usamos e protegemos as informações fornecidas em nossa plataforma, em conformidade com a Lei Geral de Proteção de Dados (LGPD).</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Dados que Coletamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dados de Conta:</strong> Nome, e-mail, senha criptografada e dados de faturamento (quando aplicável).</li>
              <li><strong>Dados de Orçamentos:</strong> Informações sobre seus clientes, valores e serviços, inseridas ativamente por você na plataforma.</li>
              <li><strong>Dados de Navegação:</strong> Informações analíticas, IPs de aprovação e métricas de visualização para rastreamento dos orçamentos enviados.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Como Usamos os Dados</h2>
            <p>
              Os dados coletados são usados exclusivamente para:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Permitir o funcionamento e a entrega da plataforma Orven (criação e envio de propostas).</li>
              <li>Melhorar a experiência do usuário e corrigir bugs.</li>
              <li>Processar pagamentos e assinaturas através de gateways terceirizados de confiança.</li>
            </ul>
            <p className="mt-2 text-primary-400 font-bold">Nós nunca vendemos ou comercializamos seus dados ou os dados dos seus clientes com terceiros.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Proteção e Segurança (Criptografia)</h2>
            <p>Utilizamos infraestrutura em nuvem segura e criptografia de ponta a ponta (SSL/TLS) para tráfego de dados. As informações sensíveis de autenticação são gerenciadas de forma robusta. Todas as propostas abertas pelos seus clientes são feitas através de links seguros protegidos.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Retenção e Exclusão</h2>
            <p>Seus dados permanecerão conosco enquanto sua conta estiver ativa. Você tem o direito de solicitar a exclusão permanente de todos os seus dados e histórico de orçamentos a qualquer momento, acessando as configurações ou contatando o suporte.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Contato</h2>
            <p>Para dúvidas sobre privacidade ou solicitações LGPD, entre em contato através dos nossos canais oficiais de suporte.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
