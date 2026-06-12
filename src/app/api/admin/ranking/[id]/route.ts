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
 * DELETE /api/admin/ranking/[id] — Remove a ranking entry
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await verifyAdmin(request);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;

    // Get the ranking entry first for logging
    const { data: entry, error: fetchError } = await supabaseAdmin
      .from('tb_ranking')
      .select('id, username, pontuacao')
      .eq('id', id)
      .single();

    if (fetchError || !entry) {
      return NextResponse.json({ error: 'Entrada do ranking não encontrada' }, { status: 404 });
    }

    // Delete the ranking entry
    const { error: deleteError } = await supabaseAdmin
      .from('tb_ranking')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('[API] Erro ao deletar entrada do ranking:', deleteError);
      return NextResponse.json({ error: 'Erro ao remover entrada do ranking' }, { status: 500 });
    }

    // Log admin action
    await supabaseAdmin.from('tb_access_logs').insert({
      user_id: adminCheck.adminProfile.id,
      username: adminCheck.adminProfile.username,
      acao: 'ADMIN_ACTION',
      detalhes: {
        action: 'delete_ranking_entry',
        target_username: entry.username,
        target_score: entry.pontuacao,
        target_id: entry.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Entrada de "${entry.username}" (${entry.pontuacao} pts) removida do ranking`,
    });
  } catch (err) {
    console.error('[API] Erro ao deletar entrada do ranking:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
