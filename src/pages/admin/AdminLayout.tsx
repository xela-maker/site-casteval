import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminLayout() {
  return (
    <ProtectedRoute requireAdmin>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          width: "100%",
          background: "hsl(var(--admin-bg))",
        }}
      >
        <AdminSidebar />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <AdminHeader />

          {/* Breadcrumbs */}
          <div
            style={{
              borderBottom: "1px solid hsl(var(--admin-line))",
              background: "hsl(var(--admin-surface))",
            }}
          >
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "10px 16px",
              }}
            >
              <AdminBreadcrumbs />
            </div>
          </div>

          {/* Main content */}
          <main
            role="main"
            style={{
              flex: 1,
              overflow: "auto",
              background: "hsl(var(--admin-bg))",
            }}
          >
            <div
              style={{
                maxWidth: "1440px",
                margin: "0 auto",
                padding: "24px 16px",
              }}
            >
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
