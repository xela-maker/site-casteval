/**
 * Regras do painel /admin: só contas com role `admin` ou `editor` em `st_user_roles`.
 * Role `user` ou ausência de linhas não liberam acesso.
 */
export function normalizeAppRole(role: string | null | undefined): string {
  return String(role ?? "").trim().toLowerCase();
}

export function computeStaffFlags(roles: { role: string }[]): {
  isAdmin: boolean;
  isEditor: boolean;
} {
  if (!roles.length) {
    return { isAdmin: false, isEditor: false };
  }

  const staff = roles.filter((r) => {
    const role = normalizeAppRole(r.role);
    return role === "admin" || role === "editor";
  });

  const isAdmin = staff.some((r) => normalizeAppRole(r.role) === "admin");
  const isEditor =
    staff.some((r) => normalizeAppRole(r.role) === "editor") || isAdmin;

  return { isAdmin, isEditor };
}

export function hasStaffPanelAccess(
  roles: { role: string }[] | null | undefined,
): boolean {
  if (!roles?.length) return false;
  const { isAdmin, isEditor } = computeStaffFlags(roles);
  return isAdmin || isEditor;
}
