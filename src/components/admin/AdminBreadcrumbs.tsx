import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbMap: Record<string, string> = {
  admin: 'Dashboard',
  empreendimentos: 'Empreendimentos',
  casas: 'Casas',
  blog: 'Blog',
  contatos: 'Contatos',
  select: 'Select',
  business: 'Business',
  'sobre-nos': 'Sobre Nós',
  configuracoes: 'Configurações',
  new: 'Novo',
  edit: 'Editar',
};

export const AdminBreadcrumbs = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = breadcrumbMap[segment] || segment;
    return { path, label };
  });

  return (
    <div 
      className="flex items-center gap-2 px-6 py-3 border-b"
      style={{ 
        background: 'hsl(var(--admin-bg))',
        borderColor: 'hsl(var(--admin-line))',
      }}
    >
      <Link 
        to="/" 
        className="transition-colors"
        style={{ color: 'hsl(var(--admin-muted))' }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--admin-text))'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--admin-muted))'}
      >
        <Home className="admin-icon-sm" />
      </Link>
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-2">
          <ChevronRight className="admin-icon-sm" style={{ color: 'hsl(var(--admin-muted))' }} />
          {index === breadcrumbs.length - 1 ? (
            <span style={{ color: 'hsl(var(--admin-text))', fontSize: '14px' }}>
              {crumb.label}
            </span>
          ) : (
            <Link 
              to={crumb.path}
              className="transition-colors"
              style={{ color: 'hsl(var(--admin-muted))', fontSize: '14px' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(var(--admin-text))'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'hsl(var(--admin-muted))'}
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};
