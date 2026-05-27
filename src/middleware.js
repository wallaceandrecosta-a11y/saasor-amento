// src/middleware.js
import { NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

// Configuração de Rate Limit Simples em Memória (Atenção: em Serverless/Edge o estado não é global, mas mitiga parte)
const rateLimitMap = new Map();

export async function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown';

  // --- 1. Rate Limiting Básico (Proteção contra abusos / brute force) ---
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minuto
  const limit = 100; // 100 requests por minuto
  
  if (ip !== 'unknown') {
    const userRate = rateLimitMap.get(ip) || { count: 0, startTime: now };
    
    if (now - userRate.startTime > windowMs) {
      rateLimitMap.set(ip, { count: 1, startTime: now });
    } else {
      userRate.count += 1;
      rateLimitMap.set(ip, userRate);
      if (userRate.count > limit) {
        return new NextResponse('Too Many Requests. Rate limit exceeded.', { status: 429 });
      }
    }
  }
  
  // Limpar entradas velhas do Rate Limit periodicamente (ex: 1 em cada 100 requests)
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now - value.startTime > windowMs) {
        rateLimitMap.delete(key);
      }
    }
  }

  // --- 2. Atualização de Sessão Supabase (Autenticação Segura) ---
  const { supabaseResponse, user } = await updateSession(req);
  
  // --- 3. Proteção de Rotas (API Security e Frontend Security) ---
  const publicRoutes = ['/', '/login', '/pricing', '/proposta'];
  const isPublicRoute = publicRoutes.some(route => url.pathname === route || url.pathname.startsWith('/proposta/'));
  const isApiRoute = url.pathname.startsWith('/api/');
  const isWebhookRoute = url.pathname.startsWith('/api/webhooks/');

  // Se for rota de API interna (não webhook) e não tiver usuário logado -> Retorna 401
  if (isApiRoute && !isWebhookRoute && !user) {
    return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  // Se não for rota pública, nem API, e não tiver usuário -> Redireciona para o login
  if (!isPublicRoute && !isApiRoute && !user) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    return NextResponse.redirect(redirectUrl);
  }

  // --- 4. Roteamento Multi-tenant ---
  const MAIN_DOMAINS = [
    'localhost:3000',
    'orven.com.br',
    'ws-orcamentos.vercel.app',
    'orcamen.to'
  ];

  // Adicionamos hostname.endsWith('.vercel.app') para que qualquer domínio do Vercel seja tratado como principal
  const isMainDomain = MAIN_DOMAINS.some(domain => hostname.includes(domain)) || hostname.endsWith('.vercel.app');

  if (!isMainDomain) {
    let tenantKey = '';
    
    if (hostname.endsWith('.orcamen.to') || hostname.endsWith('.localhost:3000')) {
      tenantKey = hostname.split('.')[0];
    } else {
      tenantKey = hostname;
    }

    if (url.pathname === '/' || url.pathname === '') {
      return supabaseResponse;
    }

    const pathParts = url.pathname.split('/');
    if (pathParts.length === 2 && pathParts[1] !== '') {
      const budgetId = pathParts[1];
      
      if (!budgetId.includes('.') && budgetId !== 'api' && budgetId !== 'proposta') {
        url.pathname = `/proposta/${budgetId}`;
        const finalResponse = NextResponse.rewrite(url);
        // Garante que os cookies do supabase sejam aplicados no rewrite também
        supabaseResponse.cookies.getAll().forEach(cookie => {
          finalResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return finalResponse;
      }
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
