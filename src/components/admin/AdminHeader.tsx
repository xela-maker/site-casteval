import { Search, Plus, Sun, Moon, User, Settings, LogOut, Building2, Home, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AdminHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("admin-theme") as "dark" | "light" | null;
    const preferDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = saved ?? (preferDark ? "dark" : "light");
    setTheme(initial);
    document.documentElement.setAttribute("data-admin-theme", initial);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-admin-theme", next);
    localStorage.setItem("admin-theme", next);
  };

  const placeholder = location.pathname.includes("/admin/blog")
    ? "Buscar posts do blog…"
    : location.pathname.includes("/admin/empreendimentos")
      ? "Buscar empreendimentos…"
      : "Buscar em todo o painel…";

  const bg = theme === "dark" ? "#111315" : "#ffffff";
  const text = theme === "dark" ? "#f7f7f7" : "#111";
  const muted = theme === "dark" ? "#9ca3af" : "#555";
  const border = theme === "dark" ? "#1f2937" : "#e5e7eb";
  const surface = theme === "dark" ? "#181a1b" : "#f9fafb";
  const accent = "#f6c90e";

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: "64px",
        backgroundColor: bg,
        borderBottom: `1px solid ${border}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          padding: "0 24px",
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        {/* Busca */}
        <div style={{ flex: 1, maxWidth: "500px", position: "relative" }}>
          <Search
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              height: "18px",
              width: "18px",
              color: muted,
            }}
          />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            style={{
              width: "100%",
              height: "40px",
              paddingLeft: "36px",
              paddingRight: "12px",
              borderRadius: "8px",
              border: `1px solid ${border}`,
              backgroundColor: surface,
              color: text,
              fontSize: "14px",
            }}
          />
        </div>

        {/* Ações */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  backgroundColor: accent,
                  border: "none",
                  color: "#111",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Plus size={16} />
                Novo
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/admin/empreendimentos/new")}>
                <Building2 size={16} style={{ marginRight: "6px" }} />
                Novo Empreendimento
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/casas/new")}>
                <Home size={16} style={{ marginRight: "6px" }} />
                Nova Casa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/blog/new")}>
                <FileText size={16} style={{ marginRight: "6px" }} />
                Novo Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={toggleTheme}
            style={{
              border: "none",
              background: surface,
              borderRadius: "8px",
              height: "40px",
              width: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {theme === "dark" ? <Sun color={text} size={18} /> : <Moon color={text} size={18} />}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                style={{
                  border: "none",
                  background: surface,
                  borderRadius: "8px",
                  height: "40px",
                  width: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <User color={muted} size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" style={{ width: "220px" }}>
              <div style={{ padding: "8px 12px" }}>
                <p style={{ color: text, fontSize: "14px", fontWeight: 500 }}>{user?.email}</p>
                <p style={{ color: muted, fontSize: "12px" }}>Administrador</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/admin/perfil')}>
                <User size={16} style={{ marginRight: "6px" }} />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/admin/preferencias')}>
                <Settings size={16} style={{ marginRight: "6px" }} />
                Preferências
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut size={16} style={{ marginRight: "6px" }} />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
