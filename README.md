# WS Solutions - Sistema de Orçamentos

Este é um sistema web profissional para gestão de clientes, serviços e geração de orçamentos em PDF, desenvolvido com **Next.js**, **Zustand** e **jsPDF**.

## 🚀 Funcionalidades

- **Login Administrativo:** Acesso restrito ao painel.
- **Gestão de Clientes:** CRUD completo (Criar, Ler, Atualizar, Excluir) de clientes com persistência local.
- **Catálogo de Serviços/Produtos:** Gestão de itens para inclusão rápida nos orçamentos.
- **Gerador de Orçamentos:** Tela interativa para montagem de orçamentos com cálculos automáticos de subtotal, desconto e total.
- **Exportação em PDF:** Geração de documentos profissionais com identidade visual da empresa, prontos para envio.
- **Dashboard:** Resumo financeiro e métricas de desempenho.
- **Filtros Avançados:** Busca e filtragem de orçamentos por status e nome.

## 🛠️ Tecnologias Utilizadas

- **Framework:** Next.js 14 (App Router)
- **Estado:** Zustand com persistência em `localStorage` (sem necessidade de configurar banco de dados externo para teste).
- **Estilo:** CSS Vanilla (Globals + Design System customizado).
- **PDF:** jsPDF & jsPDF-AutoTable.
- **Ícones:** React Icons (Material Design).

## 🏃 Como rodar o projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000)

### 🔐 Credenciais de Acesso (Demo)
- **E-mail:** `admin@wssolutions.com.br`
- **Senha:** `admin123`

## 📦 Como fazer o Deploy (Vercel)

Este projeto foi preparado para deploy instantâneo na **Vercel**:

1. Crie um repositório no seu GitHub e suba os arquivos da pasta `App`.
2. Acesse [vercel.com](https://vercel.com) e conecte seu repositório.
3. Clique em **Deploy**.
4. Como o sistema utiliza `localStorage`, ele funcionará perfeitamente em qualquer ambiente estático ou serverless sem configurações adicionais de banco de dados.

---
Desenvolvido como projeto de teste para WS Solutions.
