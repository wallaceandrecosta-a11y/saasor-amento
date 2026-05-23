import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Após trocar o código com sucesso, redireciona para o dashboard
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Se houver erro ou não tiver código, volta pro login
  return NextResponse.redirect(`${origin}/login?error=Falha+na+autenticacao`);
}
