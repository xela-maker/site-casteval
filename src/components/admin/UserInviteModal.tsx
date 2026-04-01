import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X, Mail, UserPlus, Loader2, Eye, EyeOff, LayoutDashboard, FolderOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

interface UserInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UserInviteModal = ({ isOpen, onClose, onSuccess }: UserInviteModalProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(['user']);
  const [inviteKind, setInviteKind] = useState<'site' | 'directory'>('site');
  const [loading, setLoading] = useState(false);

  const theme = document.documentElement.getAttribute("data-admin-theme") || "dark";
  const isDark = theme === "dark";
  const surface = isDark ? "#1a1d21" : "#ffffff";
  const text = isDark ? "#ffffff" : "#1a1a1a";
  const muted = isDark ? "#94a3b8" : "#64748b";
  const border = isDark ? "#2a2e36" : "#e2e8f0";
  const overlay = isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.5)";

  if (!isOpen) return null;

  const handleRoleToggle = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || password.length < 6) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha email e senha (mínimo 6 caracteres)",
        variant: "destructive",
      });
      return;
    }

    if (inviteKind === 'site' && selectedRoles.length === 0) {
      toast({
        title: "Permissões",
        description: "Selecione ao menos uma permissão do site ou escolha “Apenas diretório”",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const body =
        inviteKind === 'directory'
          ? {
              action: 'invite',
              email,
              fullName,
              password,
              inviteKind: 'directory',
            }
          : {
              action: 'invite',
              email,
              fullName,
              password,
              roles: selectedRoles,
            };

      const { error } = await supabase.functions.invoke('manage-users', {
        body,
      });

      if (error) throw error;

      toast({
        title: inviteKind === 'directory' ? "Acesso ao drive criado" : "Usuário criado!",
        description:
          inviteKind === 'directory'
            ? `${email} pode entrar no drive com esta senha. Sem acesso ao painel do site.`
            : `Usuário ${email} criado com sucesso. Ele já pode fazer login com a senha definida.`,
      });

      setEmail("");
      setFullName("");
      setPassword("");
      setSelectedRoles(['user']);
      setInviteKind('site');
      
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário",
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
                background: "linear-gradient(135deg, #FFB000, #FFCC4D)",
              }}
            >
              <UserPlus size={20} color="#000" />
            </div>
            <h2 style={{ color: text, fontSize: "20px", fontWeight: 700, margin: 0 }}>
              Convidar / criar usuário
            </h2>
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
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: text, fontSize: "14px", fontWeight: 600, marginBottom: "10px" }}>
              Tipo de acesso *
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setInviteKind("site")}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "14px",
                  borderRadius: "12px",
                  border: `2px solid ${inviteKind === "site" ? "#FFB000" : border}`,
                  backgroundColor: isDark ? "#0f1113" : "#f8f9fa",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <LayoutDashboard size={22} style={{ color: "#FFB000", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ color: text, fontSize: "14px", fontWeight: 700 }}>Equipe do site (painel)</div>
                  <div style={{ color: muted, fontSize: "12px", marginTop: "4px", lineHeight: 1.4 }}>
                    Admin, editor ou usuário no painel administrativo e no site conforme as permissões abaixo.
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setInviteKind("directory")}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "14px",
                  borderRadius: "12px",
                  border: `2px solid ${inviteKind === "directory" ? "#FFB000" : border}`,
                  backgroundColor: isDark ? "#0f1113" : "#f8f9fa",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <FolderOpen size={22} style={{ color: "#FFB000", marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ color: text, fontSize: "14px", fontWeight: 700 }}>Apenas diretório (drive)</div>
                  <div style={{ color: muted, fontSize: "12px", marginTop: "4px", lineHeight: 1.4 }}>
                    Só acesso ao Drive Casteval. Não entra no painel deste site.
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", color: text, fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
              Email *
            </label>
            <div style={{ position: "relative" }}>
              <Mail
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="usuario@email.com"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px 12px 48px",
                  borderRadius: "10px",
                  border: `1px solid ${border}`,
                  backgroundColor: isDark ? "#0f1113" : "#f8f9fa",
                  color: text,
                  fontSize: "14px",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: text, fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
              {inviteKind === "directory" ? "Nome no drive (recomendado)" : "Nome completo (opcional)"}
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={inviteKind === "directory" ? "Como aparecerá no drive" : "João da Silva"}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "10px",
                border: `1px solid ${border}`,
                backgroundColor: isDark ? "#0f1113" : "#f8f9fa",
                color: text,
                fontSize: "14px",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", color: text, fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>
              Senha *
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
                style={{
                  width: "100%",
                  padding: "12px 48px 12px 16px",
                  borderRadius: "10px",
                  border: `1px solid ${border}`,
                  backgroundColor: isDark ? "#0f1113" : "#f8f9fa",
                  color: text,
                  fontSize: "14px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: muted,
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div style={{ color: muted, fontSize: "12px", marginTop: "4px" }}>
              A senha deve ter no mínimo 6 caracteres
            </div>
          </div>

          {inviteKind === "site" && (
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", color: text, fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>
                Permissões do painel *
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
                    cursor: "pointer",
                  }}
                >
                  <Checkbox
                    checked={selectedRoles.includes('admin')}
                    onCheckedChange={() => handleRoleToggle('admin')}
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
          )}

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
                background: "linear-gradient(135deg, #FFB000, #FFCC4D)",
                color: "#000",
                fontSize: "14px",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Criando..." : inviteKind === "directory" ? "Criar acesso ao drive" : "Criar usuário"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
