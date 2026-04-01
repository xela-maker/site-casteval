import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, Edit2, Search, RefreshCw, Trash2, FolderOpen } from "lucide-react";
import { UserInviteModal } from "@/components/admin/UserInviteModal";
import { UserRolesModal } from "@/components/admin/UserRolesModal";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DIRECTORY_MEMBER_PROFILE_ROLE } from "@/constants/directoryRoles";
import { cn } from "@/lib/utils";

type UserRole = {
  user_id: string;
  role: 'admin' | 'editor' | 'user';
};

type UserWithRoles = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  email_confirmed_at: string | null;
  roles: ('admin' | 'editor' | 'user')[];
  /** Role em `profiles` (ex.: directory_member). */
  profile_role: string | null;
  /** Cadastro pelo app do drive (metadata ou perfil). */
  is_directory_member: boolean;
};

type ProfileRow = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  role: string | null;
};

async function getFunctionsErrorMessage(error: unknown): Promise<string> {
  if (error && typeof error === "object" && "context" in error) {
    const ctx = (error as { context?: Response }).context;
    if (ctx && typeof ctx.clone === "function" && typeof ctx.json === "function") {
      try {
        const body = await ctx.clone().json();
        if (body && typeof body === "object" && "error" in body && body.error != null) {
          return String(body.error);
        }
      } catch {
        /* ignore */
      }
    }
  }
  if (error instanceof Error) return error.message;
  return "Erro ao chamar função manage-users";
}

function parseManageUsersResponse(raw: unknown): { users?: unknown[]; error?: string } {
  if (raw == null) return {};
  if (typeof raw === "string") {
    try {
      return parseManageUsersResponse(JSON.parse(raw));
    } catch {
      return {};
    }
  }
  if (typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    return {
      users: Array.isArray(o.users) ? o.users : undefined,
      error: o.error != null ? String(o.error) : undefined,
    };
  }
  return {};
}

export default function Usuarios() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [userTab, setUserTab] = useState<"site" | "directory">("site");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithRoles | null>(null);

  const theme = document.documentElement.getAttribute("data-admin-theme") || "dark";
  const isDark = theme === "dark";
  const bg = isDark ? "#0f1113" : "#f8f9fa";
  const surface = isDark ? "#1a1d21" : "#ffffff";
  const text = isDark ? "#ffffff" : "#1a1a1a";
  const muted = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#2a2e36" : "#e2e8f0";

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredSiteUsers = useMemo(() => {
    let filtered = users.filter((u) => !u.is_directory_member);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(term) ||
          (user.full_name && user.full_name.toLowerCase().includes(term))
      );
    }
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.roles.includes(roleFilter as any));
    }
    return filtered;
  }, [users, searchTerm, roleFilter]);

  const filteredDirectoryUsers = useMemo(() => {
    let filtered = users.filter((u) => u.is_directory_member);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(term) ||
          (user.full_name && user.full_name.toLowerCase().includes(term))
      );
    }
    return filtered;
  }, [users, searchTerm]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Buscar perfis dos usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const profileList: ProfileRow[] = Array.isArray(profiles) ? (profiles as ProfileRow[]) : [];

      // Buscar roles de todos os usuários
      const { data: roles, error: rolesError } = await supabase
        .from('st_user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const rolesList: UserRole[] = Array.isArray(roles) ? (roles as UserRole[]) : [];

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("Sessão expirada. Faça login novamente.");
      }

      // JWT é enviado automaticamente pelo client (fetchWithAuth); evita token stale ao forçar header manual
      const { data: authResponse, error: authError } = await supabase.functions.invoke("manage-users", {
        body: { action: "list" },
      });

      if (authError) {
        throw new Error(await getFunctionsErrorMessage(authError));
      }

      const parsed = parseManageUsersResponse(authResponse);
      if (parsed.error) {
        throw new Error(parsed.error);
      }

      const authUsers: any[] = Array.isArray(parsed.users) ? parsed.users : [];

      const profileById = new Map(profileList.map((p) => [p.id, p]));

      // Fonte da lista: Auth (completo); perfil e roles vêm das tabelas auxiliares
      const usersWithRoles: UserWithRoles[] = authUsers.map((authUser) => {
        const profile = profileById.get(authUser.id);
        const userRoles = rolesList
          .filter((r) => r.user_id === authUser.id)
          .map((r) => r.role) as UserWithRoles["roles"];

        const meta = authUser.user_metadata && typeof authUser.user_metadata === "object"
          ? authUser.user_metadata as Record<string, unknown>
          : {};
        const metaName =
          (typeof meta.full_name === "string" && meta.full_name.trim()) ||
          (typeof meta.display_name === "string" && meta.display_name.trim()) ||
          null;
        const signupOrigin =
          typeof meta.signup_origin === "string" ? meta.signup_origin : null;
        const profileRole = profile?.role ?? null;
        const isDirectoryMember =
          profileRole === DIRECTORY_MEMBER_PROFILE_ROLE ||
          signupOrigin === "diretorio";

        return {
          id: authUser.id,
          email: authUser.email ?? "",
          full_name: profile?.full_name?.trim() || metaName || null,
          avatar_url: profile?.avatar_url ?? null,
          created_at: profile?.created_at ?? authUser.created_at ?? new Date().toISOString(),
          email_confirmed_at: authUser.email_confirmed_at ?? null,
          roles: userRoles.length > 0 ? userRoles : ["user"],
          profile_role: profileRole,
          is_directory_member: isDirectoryMember,
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error?.message ? String(error.message) : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (user: UserWithRoles) => {
    if (!confirm(`Tem certeza que deseja excluir o usuário ${user.email}?`)) {
      return;
    }

    try {
      const { error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'delete',
          userId: user.id,
        },
      });

      if (error) throw error;

      toast({
        title: "Usuário excluído",
        description: `${user.email} foi removido com sucesso`,
      });

      loadUsers();
    } catch (error: any) {
      toast({
        title: "Erro ao excluir usuário",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'editor':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'editor':
        return 'Editor';
      default:
        return 'Usuário';
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  const filtersRow = (showRoleFilter: boolean) => (
    <div
      style={{
        display: "flex",
        gap: "16px",
        marginBottom: "24px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
        <Search
          size={18}
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            color: muted,
          }}
        />
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px 12px 48px",
            borderRadius: "12px",
            border: `1px solid ${border}`,
            backgroundColor: surface,
            color: text,
            fontSize: "14px",
          }}
        />
      </div>

      {showRoleFilter && (
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: "12px",
            border: `1px solid ${border}`,
            backgroundColor: surface,
            color: text,
            fontSize: "14px",
            minWidth: "180px",
          }}
        >
          <option value="all">Todas as Roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="user">Usuário</option>
        </select>
      )}

      <button
        onClick={loadUsers}
        disabled={loading}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 20px",
          borderRadius: "12px",
          border: `1px solid ${border}`,
          backgroundColor: surface,
          color: text,
          fontSize: "14px",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
        }}
      >
        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        Atualizar
      </button>
    </div>
  );

  const renderUserCard = (user: UserWithRoles, tab: "site" | "directory") => (
    <div
      key={user.id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        padding: "24px",
        backgroundColor: surface,
        borderRadius: "16px",
        border: `1px solid ${border}`,
        transition: "all 0.2s ease",
      }}
    >
      <Avatar style={{ width: "56px", height: "56px" }}>
        <AvatarImage src={user.avatar_url || undefined} />
        <AvatarFallback style={{ fontSize: "18px", fontWeight: 600 }}>
          {getInitials(user.full_name, user.email)}
        </AvatarFallback>
      </Avatar>

      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
          <h3 style={{ color: text, fontSize: "16px", fontWeight: 600, margin: 0 }}>
            {user.full_name?.trim() || user.email || "Sem nome"}
          </h3>
          {user.email_confirmed_at ? (
            <Badge variant="outline" style={{ fontSize: "11px", fontWeight: 500 }}>
              ✓ Ativo
            </Badge>
          ) : (
            <Badge variant="secondary" style={{ fontSize: "11px", fontWeight: 500 }}>
              ⏳ Pendente
            </Badge>
          )}
        </div>
        <p style={{ color: muted, fontSize: "14px", margin: "0 0 12px 0" }}>{user.email}</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {tab === "directory" && (
            <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400">
              Membro do diretório
            </Badge>
          )}
          {(tab === "site"
            ? user.roles
            : user.roles.filter((r) => r === "admin" || r === "editor")
          ).map((role, idx) => (
            <Badge key={`${user.id}-${role}-${idx}`} variant={getRoleBadgeColor(role)}>
              {role === "admin" && "🔴"} {role === "editor" && "🟡"} {role === "user" && "⚪"}{" "}
              {getRoleLabel(role)}
            </Badge>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          type="button"
          onClick={() => setEditingUser(user)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "10px",
            border: `1px solid ${border}`,
            backgroundColor: surface,
            color: text,
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <Edit2 size={16} />
          Editar
        </button>

        <button
          type="button"
          onClick={() => handleDeleteUser(user)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #ef4444",
            backgroundColor: "transparent",
            color: "#ef4444",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          title="Excluir usuário"
        >
          <Trash2 size={16} />
          Excluir
        </button>
      </div>
    </div>
  );

  const renderUserList = (list: UserWithRoles[], tab: "site" | "directory", emptyHint: string) => {
    if (loading) {
      return (
        <div style={{ textAlign: "center", padding: "60px", color: muted }}>
          <RefreshCw size={32} className="animate-spin" style={{ margin: "0 auto 16px" }} />
          <p>Carregando usuários...</p>
        </div>
      );
    }
    if (list.length === 0) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            backgroundColor: surface,
            borderRadius: "20px",
            border: `1px solid ${border}`,
          }}
        >
          <Users size={48} style={{ color: muted, margin: "0 auto 16px", opacity: 0.3 }} />
          <h3 style={{ color: text, fontSize: "18px", marginBottom: "8px" }}>Nenhum usuário encontrado</h3>
          <p style={{ color: muted, fontSize: "14px" }}>{emptyHint}</p>
        </div>
      );
    }
    return <div style={{ display: "grid", gap: "16px" }}>{list.map((u) => renderUserCard(u, tab))}</div>;
  };

  return (
    <div style={{ background: bg, minHeight: "100vh", padding: "32px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "4px",
                  height: "32px",
                  background: "linear-gradient(180deg, #FFB000, #FFCC4D)",
                  borderRadius: "2px",
                }}
              />
              <h1 style={{ color: text, fontSize: "32px", fontWeight: 800, margin: 0 }}>
                Gerenciar Usuários
              </h1>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "linear-gradient(135deg, #FFB000, #FFCC4D)",
                color: "#000",
                border: "none",
                padding: "12px 24px",
                borderRadius: "12px",
                fontWeight: 600,
                fontSize: "14px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 4px 14px 0 rgba(255, 176, 0, 0.3)",
              }}
            >
              <UserPlus size={18} />
              Convidar Usuário
            </button>
          </div>
          <p style={{ color: muted, marginLeft: "20px", fontSize: "15px" }}>
            Gerencie usuários, permissões e convites da equipe
          </p>
        </div>

        <Tabs
          value={userTab}
          onValueChange={(v) => setUserTab(v as "site" | "directory")}
          style={{ marginBottom: "8px" }}
        >
          <TabsList
            className="mb-6 grid h-auto w-full max-w-xl grid-cols-2 gap-1 p-1"
            style={{
              background: surface,
              border: `1px solid ${border}`,
            }}
          >
            <TabsTrigger
              value="site"
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-semibold shadow-none transition-colors",
                "data-[state=active]:bg-[#FFB000] data-[state=active]:text-black data-[state=active]:shadow-sm",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-400",
                "hover:data-[state=inactive]:text-slate-200",
                !isDark &&
                  "data-[state=inactive]:text-gray-600 hover:data-[state=inactive]:text-gray-900"
              )}
            >
              Equipe do site
            </TabsTrigger>
            <TabsTrigger
              value="directory"
              className={cn(
                "group gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold shadow-none transition-colors",
                "data-[state=active]:bg-[#FFB000] data-[state=active]:text-black data-[state=active]:shadow-sm",
                "data-[state=inactive]:bg-transparent data-[state=inactive]:text-slate-400",
                "hover:data-[state=inactive]:text-slate-200",
                !isDark &&
                  "data-[state=inactive]:text-gray-600 hover:data-[state=inactive]:text-gray-900"
              )}
            >
              <FolderOpen size={16} className="shrink-0 opacity-90" />
              <span className="truncate">Membros do diretório</span>
              <span
                className={cn(
                  "ml-0.5 shrink-0 rounded-md px-1.5 py-0.5 text-xs font-bold tabular-nums",
                  "group-data-[state=active]:bg-black/20 group-data-[state=active]:text-black",
                  "group-data-[state=inactive]:bg-white/10 group-data-[state=inactive]:text-slate-200",
                  !isDark &&
                    "group-data-[state=inactive]:bg-gray-200/80 group-data-[state=inactive]:text-gray-700"
                )}
              >
                {users.filter((u) => u.is_directory_member).length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="site" className="mt-0 space-y-6">
            {filtersRow(true)}
            {renderUserList(
              filteredSiteUsers,
              "site",
              searchTerm || roleFilter !== "all"
                ? "Tente ajustar os filtros"
                : "Comece convidando um usuário"
            )}
          </TabsContent>

          <TabsContent value="directory" className="mt-0 space-y-6">
            {filtersRow(false)}
            <p style={{ color: muted, fontSize: "13px", marginTop: "-12px" }}>
              Contas criadas pelo drive; o nome usa o perfil ou o metadata de cadastro (display_name).
            </p>
            {renderUserList(
              filteredDirectoryUsers,
              "directory",
              searchTerm ? "Tente outro termo de busca" : "Nenhum cadastro pelo drive ainda"
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showInviteModal && (
        <UserInviteModal
          isOpen={showInviteModal}
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            loadUsers();
          }}
        />
      )}

      {editingUser && (
        <UserRolesModal
          user={editingUser}
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            loadUsers();
          }}
        />
      )}
    </div>
  );
}
