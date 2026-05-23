import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req) {
  try {
    const supabase = createClient();
    const body = await req.json();
    const { cpfCnpj } = body;

    if (!cpfCnpj) {
      return NextResponse.json({ error: 'CPF/CNPJ é obrigatório' }, { status: 400 });
    }

    const cleanCpf = cpfCnpj.replace(/[^\d]/g, '');

    // Verifica se já usou o desconto
    const { data: usage, error } = await supabase
      .from('discount_usage')
      .select('cpf_cnpj')
      .eq('cpf_cnpj', cleanCpf)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return NextResponse.json({ 
      eligible: !usage,
      message: usage ? 'Desconto já utilizado por este CPF' : 'Elegível ao desconto de 50% no primeiro mês'
    });

  } catch (error) {
    console.error('Validate Discount Error:', error);
    return NextResponse.json({ error: 'Erro ao validar desconto' }, { status: 500 });
  }
}
