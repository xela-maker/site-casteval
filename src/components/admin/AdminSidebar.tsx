import { NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Building2,
  FileText,
  Users,
  Settings,
  Home,
  Briefcase,
  Star,
  Mail,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Code,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { title: "Banners Home", icon: FileText, path: "/admin/banners" },
  { title: "Empreendimentos", icon: Building2, path: "/admin/empreendimentos" },
  { title: "Casas", icon: Home, path: "/admin/casas" },
  { title: "Blog", icon: FileText, path: "/admin/blog" },
  { title: "Contatos", icon: Mail, path: "/admin/contatos" },
  { title: "Select", icon: Star, path: "/admin/select" },
  { title: "Business", icon: Briefcase, path: "/admin/business" },
  { title: "Sobre Nós", icon: Users, path: "/admin/sobre-nos" },
  { title: "Usuários", icon: Users, path: "/admin/usuarios" },
  { title: "SEO & Scripts", icon: Code, path: "/admin/seo-scripts" },
  { title: "Configurações", icon: Settings, path: "/admin/configuracoes" },
];

export const AdminSidebar = () => {
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const theme = document.documentElement.getAttribute("data-admin-theme") || "dark";
  const isDark = theme === "dark";
  const bg = isDark ? "#111315" : "#ffffff";
  const surface = isDark ? "#181a1b" : "#f9fafb";
  const surface2 = isDark ? "#1f2325" : "#f1f3f5";
  const text = isDark ? "#f8fafc" : "#111";
  const muted = isDark ? "#9ca3af" : "#555";
  const border = isDark ? "#1f2937" : "#e5e7eb";
  const brand = "#f6c90e";

  const handleSignOut = async () => await signOut();

  return (
    <aside
      style={{
        width: collapsed ? "80px" : "260px",
        transition: "width 0.3s ease",
        borderRight: `1px solid ${border}`,
        display: "flex",
        flexDirection: "column",
        backgroundColor: bg,
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: "64px",
          padding: "0 16px",
          borderBottom: `1px solid ${border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        {!collapsed && <h2 style={{ color: brand, fontWeight: 700, fontSize: "18px" }}>Casteval</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none",
            border: "none",
            color: muted,
            cursor: "pointer",
            borderRadius: "8px",
            padding: "6px",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = surface2)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav
        style={{
          flex: 1,
          padding: "12px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "4px",
        }}
      >
        <NavLink
          to="/"
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "8px",
            fontSize: "14px",
            textDecoration: "none",
            color: isActive ? "#000" : muted,
            backgroundColor: isActive ? brand : "transparent",
            fontWeight: 500,
            transition: "all 0.2s",
          })}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = surface2;
            e.currentTarget.style.color = text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = muted;
          }}
        >
          <Home size={18} />
          {!collapsed && <span>Ver Site</span>}
        </NavLink>

        <div style={{ height: "1px", backgroundColor: border, margin: "8px 0" }} />

        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "14px",
                textDecoration: "none",
                backgroundColor: isActive ? brand : "transparent",
                color: isActive ? "#000" : muted,
                fontWeight: 500,
                transition: "all 0.2s",
              })}
              onMouseEnter={(e) => {
                const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = surface2;
                  e.currentTarget.style.color = text;
                }
              }}
              onMouseLeave={(e) => {
                const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = muted;
                }
              }}
            >
              <Icon size={18} />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        style={{
          padding: "12px",
          borderTop: `1px solid ${border}`,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {!collapsed && user && (
          <div
            style={{
              fontSize: "12px",
              color: muted,
              backgroundColor: surface2,
              padding: "6px 8px",
              borderRadius: "6px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user.email}
          </div>
        )}

        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            gap: "8px",
            borderRadius: "8px",
            border: `1px solid ${border}`,
            color: muted,
            background: "transparent",
            padding: "8px 12px",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = surface2;
            e.currentTarget.style.color = text;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = muted;
          }}
        >
          <LogOut size={16} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};
