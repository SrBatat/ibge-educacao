import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { supabase } from '@/lib/supabase';

/**
 * Helper: verify that the request comes from an admin user.
 */
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { error: 'Não autorizado', status: 401 };
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);

  if (authError || !user) {
    return { error: 'Token inválido', status: 401 };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('tb_users')
    .select('id, role, is_banned, username')
    .eq('auth_id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'ADMIN') {
    return { error: 'Acesso restrito a administradores', status: 403 };
  }

  if (profile.is_banned) {
    return { error: 'Conta banida', status: 403 };
  }

  return { adminProfile: profile };
}

/**
 * GET /api/admin/ranking — List all ranking entries (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(request);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    let query = supabaseAdmin
      .from('tb_ranking')
      .select('*')
      .order('pontuacao', { ascending: false });

    if (search) {
      query = query.ilike('username', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Erro ao buscar ranking' }, { status: 500 });
    }

    return NextResponse.json({ ranking: data });
  } catch (err) {
    console.error('[API] Erro ao listar ranking:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
