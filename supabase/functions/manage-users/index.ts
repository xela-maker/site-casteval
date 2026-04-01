import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
        const { email, fullName, password, roles } = body;

        console.log('Criando usuário diretamente:', email);

        // Validar senha (mínimo 6 caracteres)
        if (!password || password.length < 6) {
          throw new Error('A senha deve ter no mínimo 6 caracteres');
        }

        // Criar usuário diretamente com senha e email confirmado
        const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Email já confirmado - usuário pode fazer login imediatamente
          user_metadata: {
            full_name: fullName || null,
          }
        });

        if (createError) {
          console.error('Erro ao criar usuário:', createError);
          throw new Error(`Erro ao criar usuário: ${createError.message}`);
        }

        const userId = userData.user.id;
        console.log('Usuário criado com sucesso:', userId);

        // Atribuir roles (perfil será criado automaticamente pelo trigger)
        const roleInserts = roles.map((role: string) => ({
          user_id: userId,
          role,
          created_by: user.id,
        }));

        const { error: rolesError } = await supabaseAdmin
          .from('st_user_roles')
          .insert(roleInserts);

        if (rolesError) {
          console.error('Erro ao atribuir roles:', rolesError);
          // Reverter criação do usuário se falhar ao atribuir roles
          await supabaseAdmin.auth.admin.deleteUser(userId);
          throw new Error(`Erro ao atribuir roles: ${rolesError.message}`);
        }

        console.log('Roles atribuídas com sucesso');

        return new Response(
          JSON.stringify({ 
            success: true, 
            user: userData.user,
            message: 'Usuário criado com sucesso! O usuário pode fazer login imediatamente.'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      case 'update-roles': {
        const { userId, roles } = body;

        // Remover roles antigas
        const { error: deleteError } = await supabaseAdmin
          .from('st_user_roles')
          .delete()
          .eq('user_id', userId);

        if (deleteError) throw deleteError;

        // Inserir novas roles
        const roleInserts = roles.map((role: string) => ({
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
