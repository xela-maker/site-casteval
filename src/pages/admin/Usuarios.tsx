import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserPlus, Shield, Edit2, Search, RefreshCw, Trash2 } from "lucide-react";
import { UserInviteModal } from "@/components/admin/UserInviteModal";
import { UserRolesModal } from "@/components/admin/UserRolesModal";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
};

export default function Usuarios() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
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

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Buscar perfis dos usuários
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Buscar roles de todos os usuários
      const { data: roles, error: rolesError } = await supabase
        .from('st_user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Buscar informações de autenticação via Edge Function
      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;

      const { data: authResponse, error: authError } = await supabase.functions.invoke('manage-users', {
        body: { action: 'list' },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (authError) throw authError;

      const authUsers = authResponse?.users || [];

      // Combinar dados
      const usersWithRoles: UserWithRoles[] = profiles.map(profile => {
        const userRoles = (roles as UserRole[] || [])
          .filter((r) => r.user_id === profile.id)
          .map((r) => r.role);

        const authUser = authUsers.find((u: any) => u.id === profile.id);

        return {
          id: profile.id,
          email: authUser?.email || '',
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          created_at: profile.created_at,
          email_confirmed_at: authUser?.email_confirmed_at || null,
          roles: userRoles.length > 0 ? userRoles : ['user'],
        };
      });

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar usuários",
        description: error.message,
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

  const filterUsers = () => {
    let filtered = [...users];

    // Filtro de busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.email.toLowerCase().includes(term) ||
          (user.full_name && user.full_name.toLowerCase().includes(term))
      );
    }

    // Filtro de role
    if (roleFilter !== "all") {
      filtered = filtered.filter(user => user.roles.includes(roleFilter as any));
    }

    setFilteredUsers(filtered);
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

        {/* Filters */}
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

        {/* Users List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: muted }}>
            <RefreshCw size={32} className="animate-spin" style={{ margin: "0 auto 16px" }} />
            <p>Carregando usuários...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
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
            <p style={{ color: muted, fontSize: "14px" }}>
              {searchTerm || roleFilter !== "all" ? "Tente ajustar os filtros" : "Comece convidando um usuário"}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {filteredUsers.map((user) => (
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
                      {user.full_name || "Sem nome"}
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
                    {user.roles.map((role) => (
                      <Badge key={role} variant={getRoleBadgeColor(role)}>
                        {role === 'admin' && '🔴'} {role === 'editor' && '🟡'} {role === 'user' && '⚪'}{' '}
                        {getRoleLabel(role)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button
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
            ))}
          </div>
        )}
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
