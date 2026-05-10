// src/app/layout.js
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'WS Solutions | Sistema de Orçamentos',
  description: 'Sistema interno para cadastro de clientes e geração de orçamentos profissionais.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.variable} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
