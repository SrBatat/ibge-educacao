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
 * PATCH /api/admin/users/[id] — Toggle ban or role for a user
 * Body: { action: 'ban' | 'unban' | 'toggle_role' }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await verifyAdmin(request);
    if ('error' in adminCheck) {
      return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
    }

    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    // Get target user
    const { data: targetUser, error: targetError } = await supabaseAdmin
      .from('tb_users')
      .select('id, role, is_banned, username, auth_id')
      .eq('id', id)
      .single();

    if (targetError || !targetUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Prevent self-modification
    if (targetUser.id === adminCheck.adminProfile.id) {
      return NextResponse.json({ error: 'Você não pode modificar sua própria conta' }, { status: 400 });
    }

    let updateData: Record<string, any> = {};

    switch (action) {
      case 'ban':
        if (targetUser.is_banned) {
          return NextResponse.json({ error: 'Usuário já está banido' }, { status: 400 });
        }
        updateData = { is_banned: true };
        break;

      case 'unban':
        if (!targetUser.is_banned) {
          return NextResponse.json({ error: 'Usuário não está banido' }, { status: 400 });
        }
        updateData = { is_banned: false };
        break;

      case 'toggle_role':
        updateData = { role: targetUser.role === 'ADMIN' ? 'USER' : 'ADMIN' };
        break;

      default:
        return NextResponse.json({ error: 'Ação inválida. Use: ban, unban, toggle_role' }, { status: 400 });
    }

    // Apply update
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('tb_users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('[API] Erro ao atualizar usuário:', updateError);
      return NextResponse.json({ error: 'Erro ao atualizar usuário' }, { status: 500 });
    }

    // If banning, also sign out the user from Supabase Auth
    if (action === 'ban' && targetUser.auth_id) {
      try {
        await supabaseAdmin.auth.admin.signOutUser(targetUser.auth_id);
      } catch (signOutErr) {
        console.warn('[API] Não foi possível deslogar o usuário banido:', signOutErr);
        // Non-critical — the user is banned in tb_users regardless
      }
    }

    // Log admin action
    await supabaseAdmin.from('tb_access_logs').insert({
      user_id: adminCheck.adminProfile.id,
      username: adminCheck.adminProfile.username,
      acao: 'ADMIN_ACTION',
      detalhes: {
        action,
        target_user: targetUser.username,
        target_id: targetUser.id,
        changes: updateData,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error('[API] Erro ao modificar usuário:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users/[id] — Delete a user and their ranking entries
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

    // Get target user
    const { data: targetUser, error: targetError } = await supabaseAdmin
      .from('tb_users')
      .select('id, username, auth_id')
      .eq('id', id)
      .single();

    if (targetError || !targetUser) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    // Prevent self-deletion
    if (targetUser.id === adminCheck.adminProfile.id) {
      return NextResponse.json({ error: 'Você não pode excluir sua própria conta' }, { status: 400 });
    }

    // Delete ranking entries for this user
    const { error: rankingError } = await supabaseAdmin
      .from('tb_ranking')
      .delete()
      .eq('user_id', id);

    if (rankingError) {
      console.error('[API] Erro ao deletar ranking do usuário:', rankingError);
      // Continue even if ranking deletion fails
    }

    // Delete access logs for this user
    await supabaseAdmin
      .from('tb_access_logs')
      .delete()
      .eq('user_id', id);

    // Delete from tb_users
    const { error: deleteError } = await supabaseAdmin
      .from('tb_users')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('[API] Erro ao deletar usuário:', deleteError);
      return NextResponse.json({ error: 'Erro ao excluir usuário' }, { status: 500 });
    }

    // Delete from Supabase Auth
    if (targetUser.auth_id) {
      try {
        const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(targetUser.auth_id);
        if (authDeleteError) {
          console.warn('[API] Erro ao deletar usuário do Auth:', authDeleteError);
        }
      } catch (authErr) {
        console.warn('[API] Erro ao deletar usuário do Auth:', authErr);
      }
    }

    // Log admin action
    await supabaseAdmin.from('tb_access_logs').insert({
      user_id: adminCheck.adminProfile.id,
      username: adminCheck.adminProfile.username,
      acao: 'ADMIN_ACTION',
      detalhes: {
        action: 'delete_user',
        target_user: targetUser.username,
        target_id: targetUser.id,
      },
    });

    return NextResponse.json({ success: true, message: `Usuário "${targetUser.username}" excluído com sucesso` });
  } catch (err) {
    console.error('[API] Erro ao deletar usuário:', err);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
