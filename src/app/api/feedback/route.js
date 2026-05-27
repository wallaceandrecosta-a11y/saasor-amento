import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req) {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, description } = body;

    if (!type || !description) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('feedbacks')
      .insert({
        user_id: user.id,
        type,
        description
      });

    if (error) {
      console.error('Database Error Saving Feedback:', error);
      return NextResponse.json({ error: 'Erro ao salvar feedback' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
