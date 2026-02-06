import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Shield, Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

interface UserRolesModalProps {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    roles: string[];
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserRolesModal = ({ user, isOpen, onClose, onSuccess }: UserRolesModalProps) => {
  const { toast } = useToast();
  const { user: currentUser } = useAuth();
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles);
  const [loading, setLoading] = useState(false);

  const theme = document.documentElement.getAttribute("data-admin-theme") || "dark";
  const isDark = theme === "dark";
  const surface = isDark ? "#1a1d21" : "#ffffff";
  const text = isDark ? "#ffffff" : "#1a1a1a";
  const muted = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#2a2e36" : "#e2e8f0";
  const overlay = isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.5)";

  const isEditingSelf = currentUser?.id === user.id;

  useEffect(() => {
    setSelectedRoles(user.roles);
  }, [user.roles]);

  if (!isOpen) return null;

  const handleRoleToggle = (role: string) => {
    // Prevenir remover admin de si mesmo
    if (isEditingSelf && role === 'admin' && selectedRoles.includes('admin')) {
      toast({
        title: "Ação não permitida",
        description: "Você não pode remover sua própria permissão de Admin",
        variant: "destructive",
      });
      return;
    }

    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRoles.length === 0) {
      toast({
        title: "Selecione ao menos uma role",
        description: "O usuário precisa ter pelo menos uma permissão",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('manage-users', {
        body: {
          action: 'update-roles',
          userId: user.id,
          roles: selectedRoles,
        },
      });

      if (error) throw error;

      toast({
        title: "Permissões atualizadas!",
        description: `As permissões de ${user.full_name || user.email} foram atualizadas`,
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar permissões",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: overlay,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "500px",
          margin: "0 16px",
          backgroundColor: surface,
          borderRadius: "20px",
          border: `1px solid ${border}`,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "24px",
            borderBottom: `1px solid ${border}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
              }}
            >
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <h2 style={{ color: text, fontSize: "20px", fontWeight: 700, margin: 0 }}>
                Editar Permissões
              </h2>
              <p style={{ color: muted, fontSize: "13px", margin: 0 }}>
                {user.full_name || user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "transparent",
              color: muted,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px" }}>
          {isEditingSelf && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "10px",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                marginBottom: "20px",
              }}
            >
              <AlertTriangle size={20} color="#F59E0B" style={{ flexShrink: 0 }} />
              <p style={{ color: "#F59E0B", fontSize: "13px", margin: 0 }}>
                Você está editando suas próprias permissões. Não será possível remover sua role de Admin.
              </p>
            </div>
          )}

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: text, fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>
              Roles Atuais
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: `1px solid ${border}`,
                  backgroundColor: isDark ? "#0f1113" : "#f8f9fa",
                  cursor: isEditingSelf && selectedRoles.includes('admin') ? "not-allowed" : "pointer",
                  opacity: isEditingSelf && selectedRoles.includes('admin') && selectedRoles.length === 1 ? 0.6 : 1,
                }}
              >
                <Checkbox
                  checked={selectedRoles.includes('admin')}
                  onCheckedChange={() => handleRoleToggle('admin')}
                  disabled={isEditingSelf && selectedRoles.includes('admin')}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ color: text, fontSize: "14px", fontWeight: 600 }}>🔴 Admin</div>
                  <div style={{ color: muted, fontSize: "12px" }}>Acesso total ao sistema</div>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: `1px solid ${border}`,
                  backgroundColor: isDark ? "#0f1113" : "#f8f9fa",
                  cursor: "pointer",
                }}
              >
                <Checkbox
                  checked={selectedRoles.includes('editor')}
                  onCheckedChange={() => handleRoleToggle('editor')}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ color: text, fontSize: "14px", fontWeight: 600 }}>🟡 Editor</div>
                  <div style={{ color: muted, fontSize: "12px" }}>Pode criar e editar conteúdo</div>
                </div>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: `1px solid ${border}`,
                  backgroundColor: isDark ? "#0f1113" : "#f8f9fa",
                  cursor: "pointer",
                }}
              >
                <Checkbox
                  checked={selectedRoles.includes('user')}
                  onCheckedChange={() => handleRoleToggle('user')}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ color: text, fontSize: "14px", fontWeight: 600 }}>⚪ Usuário</div>
                  <div style={{ color: muted, fontSize: "12px" }}>Acesso básico</div>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "12px 24px",
                borderRadius: "10px",
                border: `1px solid ${border}`,
                backgroundColor: "transparent",
                color: text,
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "12px 24px",
                borderRadius: "10px",
                border: "none",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
