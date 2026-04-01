import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const APP_ROLES = new Set(['admin', 'editor', 'user']);

function normalizeEmail(raw: unknown): string {
  const s = typeof raw === 'string' ? raw.trim().toLowerCase() : '';
  return s;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Roles válidas para enum `app_role` (dedupe + ordem estável). */
function normalizeAppRoles(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of raw) {
    const v = String(r ?? '').trim().toLowerCase();
    if (!APP_ROLES.has(v) || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Criar cliente Supabase com Service Role Key para operações admin
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Verificar autenticação do usuário que fez a requisição
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Não autorizado');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      throw new Error('Não autorizado');
    }

    // Verificar se o usuário tem role admin
    const { data: userRoles, error: rolesError } = await supabaseAdmin
      .from('st_user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (rolesError) throw rolesError;

    const normRole = (role: string | null | undefined) =>
      String(role ?? '').trim().toLowerCase();

    const isAdmin = userRoles?.some((r) => normRole(r.role) === 'admin') ?? false;
    const isEditor = userRoles?.some((r) => normRole(r.role) === 'editor') ?? false;

    // Processar requisição
    const body = await req.json();
    const { action } = body;

    console.log('Action:', action);

    // Listagem: admin ou editor (mesmo critério do painel). Demais ações: só admin.
    if (action === 'list') {
      if (!isAdmin && !isEditor) {
        throw new Error(
          'Acesso negado. Apenas administradores ou editores podem ver a lista de usuários.',
        );
      }
    } else if (!isAdmin) {
      throw new Error('Acesso negado. Apenas administradores podem gerenciar usuários.');
    }

    switch (action) {
      case 'invite': {
        const { email: rawEmail, fullName, password, roles, inviteKind } = body;
        const directoryOnly = inviteKind === 'directory';
        const email = normalizeEmail(rawEmail);

        console.log('Criando usuário:', email, directoryOnly ? '(somente diretório)' : '(site)');

        if (!email || !isValidEmail(email)) {
          throw new Error('Informe um e-mail válido');
        }

        if (!password || password.length < 6) {
          throw new Error('A senha deve ter no mínimo 6 caracteres');
        }

        const normalizedRoles = normalizeAppRoles(roles);

        if (!directoryOnly && normalizedRoles.length === 0) {
          throw new Error('Selecione ao menos uma permissão do site (admin, editor ou user)');
        }

        const displayName = (typeof fullName === 'string' && fullName.trim())
          ? fullName.trim()
          : (email.split('@')[0] || 'Usuário');

        const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: directoryOnly
            ? {
                display_name: displayName,
                signup_origin: 'diretorio',
                full_name: displayName,
              }
            : {
                full_name: fullName || null,
              },
        });

        if (createError) {
          console.error('Erro ao criar usuário:', createError);
          throw new Error(`Erro ao criar usuário: ${createError.message}`);
        }

        const userId = userData.user.id;
        console.log('Usuário criado:', userId);

        if (directoryOnly) {
          // Não gravar profiles.role = 'directory_member': o CHECK profiles_role_check no projeto
          // costuma permitir só valores do site (ex. user). Quem é do drive fica marcado por
          // user_metadata.signup_origin = 'diretorio' (já enviado no createUser acima).
          const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
            {
              id: userId,
              full_name: displayName,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' },
          );

          if (profileError) {
            console.error('Erro ao gravar perfil (diretório):', profileError);
            await supabaseAdmin.auth.admin.deleteUser(userId);
            throw new Error(`Erro ao criar perfil do drive: ${profileError.message}`);
          }

          return new Response(
            JSON.stringify({
              success: true,
              user: userData.user,
              message:
                'Usuário do diretório criado. Acesso apenas ao drive, sem painel do site.',
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }

        // Trigger do banco pode já ter inserido roles — evita violação de unique
        const { error: clearRolesError } = await supabaseAdmin
          .from('st_user_roles')
          .delete()
          .eq('user_id', userId);

        if (clearRolesError) {
          console.error('Erro ao limpar roles antes do insert:', clearRolesError);
          await supabaseAdmin.auth.admin.deleteUser(userId);
          throw new Error(`Erro ao preparar permissões: ${clearRolesError.message}`);
        }

        const roleInserts = normalizedRoles.map((role: string) => ({
          user_id: userId,
          role,
          created_by: user.id,
        }));

        const { error: rolesError } = await supabaseAdmin
          .from('st_user_roles')
          .insert(roleInserts);

        if (rolesError) {
          console.error('Erro ao atribuir roles:', rolesError);
          await supabaseAdmin.auth.admin.deleteUser(userId);
          throw new Error(`Erro ao atribuir roles: ${rolesError.message}`);
        }

        return new Response(
          JSON.stringify({
            success: true,
            user: userData.user,
            message: 'Usuário criado com sucesso! O usuário pode fazer login imediatamente.',
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      case 'update-roles': {
        const { userId, roles } = body;

        const normalizedUpdateRoles = normalizeAppRoles(roles);
        if (normalizedUpdateRoles.length === 0) {
          throw new Error('Informe ao menos uma permissão válida (admin, editor ou user)');
        }

        // Remover roles antigas
        const { error: deleteError } = await supabaseAdmin
          .from('st_user_roles')
          .delete()
          .eq('user_id', userId);

        if (deleteError) throw deleteError;

        // Inserir novas roles
        const roleInserts = normalizedUpdateRoles.map((role: string) => ({
          user_id: userId,
          role,
          created_by: user.id,
        }));

        const { error: insertError } = await supabaseAdmin
          .from('st_user_roles')
          .insert(roleInserts);

        if (insertError) throw insertError;

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'list': {
        // Buscar todos os usuários via Admin API (paginado — uma página por requisição)
        const allUsers: Record<string, unknown>[] = [];
        let page = 1;
        const perPage = 200;

        for (;;) {
          const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
            page,
            perPage,
          });

          if (authError) throw authError;

          const batch = authData?.users ?? [];
          if (!Array.isArray(batch) || batch.length === 0) {
            break;
          }

          allUsers.push(...batch);

          if (batch.length < perPage) {
            break;
          }

          page += 1;
        }

        return new Response(
          JSON.stringify({
            success: true,
            users: allUsers,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'delete': {
        const { userId } = body;

        // Deletar usuário da autenticação (cascade delete vai remover de outras tabelas)
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
          console.error('Erro ao deletar usuário:', deleteError);
          throw new Error(`Erro ao deletar usuário: ${deleteError.message}`);
        }

        console.log('Usuário deletado com sucesso:', userId);

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Usuário deletado com sucesso'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'resend-invite': {
        const { email } = body;

        // Reenviar email de convite
        const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${Deno.env.get('SUPABASE_URL')}/auth/v1/verify`
        });

        if (inviteError) {
          console.error('Erro ao reenviar convite:', inviteError);
          throw new Error(`Erro ao reenviar convite: ${inviteError.message}`);
        }

        console.log('Convite reenviado com sucesso para:', email);

        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Convite reenviado com sucesso'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      default:
        throw new Error('Ação inválida');
    }
  } catch (error: any) {
    console.error('Erro na função manage-users:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
