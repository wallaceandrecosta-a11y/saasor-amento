import Link from 'next/link';
import { MdArrowBack } from 'react-icons/md';

export const metadata = {
  title: 'Termos de Uso - Orven',
  description: 'Termos e Condições de Uso da Plataforma Orven.',
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-[#0B0D12] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-[#071A3D]/30 border border-blue-900/20 shadow-premium p-8 rounded-[24px]">
        <Link href="/" className="inline-flex items-center text-sm font-semibold text-[#8B95A7] hover:text-white mb-6 transition-colors">
          <MdArrowBack className="mr-1" /> Voltar
        </Link>
        
        <h1 className="text-3xl font-extrabold text-white mb-6">Termos e Condições de Uso</h1>
        <p className="text-sm text-[#8B95A7] mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

        <div className="space-y-6 text-[#8B95A7] text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Aceitação dos Termos</h2>
            <p>Ao acessar e utilizar a plataforma Orven ("Nós", "Plataforma" ou "Sistema"), você concorda em cumprir e ser regido pelos presentes Termos de Uso. Se você não concorda com qualquer parte destes termos, não deve utilizar nossos serviços.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Descrição do Serviço</h2>
            <p>O Orven é uma plataforma de Software como Serviço (SaaS) que permite a profissionais e empresas criarem, gerenciarem e enviarem propostas e orçamentos digitais interativos aos seus respectivos clientes.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Isenção de Responsabilidade sobre o Conteúdo</h2>
            <p>
              <strong>O Orven atua exclusivamente como uma ferramenta tecnológica e facilitadora.</strong> Nós não somos parte envolvida, intermediadora ou garantidora de nenhum negócio, contrato, prestação de serviços ou transação financeira celebrada entre você (o Usuário) e seus clientes finais por meio dos orçamentos gerados na plataforma.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Você é o único responsável legal pela veracidade, exatidão e cumprimento dos orçamentos, valores e propostas que emite.</li>
              <li>O Orven não se responsabiliza por disputas legais, processos, perdas e danos decorrentes do não cumprimento de contratos ou problemas na prestação de serviço entre você e seu cliente.</li>
              <li>A plataforma é fornecida "no estado em que se encontra" (as-is), não garantindo disponibilidade ininterrupta (100% de uptime) em casos de força maior ou manutenção técnica.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Planos e Assinaturas</h2>
            <p>Os serviços premium são oferecidos mediante assinatura mensal ou anual. O não pagamento acarretará no rebaixamento automático para a versão gratuita, limitando a criação de novos orçamentos, mas sem apagar os dados do histórico, que permanecerão acessíveis por tempo determinado.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Encerramento de Conta</h2>
            <p>Você pode encerrar sua conta a qualquer momento. O Orven também se reserva o direito de suspender ou encerrar contas que violem estes Termos de Uso, utilizem a plataforma para fins ilícitos, spam ou fraudes, sem aviso prévio.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Alterações nos Termos</h2>
            <p>Estes termos podem ser atualizados periodicamente. Notificaremos os usuários sobre mudanças significativas. O uso contínuo da plataforma após alterações constitui sua aceitação dos novos termos.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
