import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'muted';
  className?: string;
}

const statusConfig: Record<string, { label: string; cssClass: string }> = {
  novo: { label: 'Novo', cssClass: 'admin-badge-info' },
  'em-atendimento': { label: 'Em Atendimento', cssClass: 'admin-badge-warning' },
  resolvido: { label: 'Resolvido', cssClass: 'admin-badge-success' },
  arquivado: { label: 'Arquivado', cssClass: 'admin-badge-muted' },
  'em-breve': { label: 'Em Breve', cssClass: 'admin-badge-info' },
  'em-construcao': { label: 'Em Construção', cssClass: 'admin-badge-warning' },
  pronto: { label: 'Pronto', cssClass: 'admin-badge-success' },
  publicado: { label: 'Publicado', cssClass: 'admin-badge-success' },
  rascunho: { label: 'Rascunho', cssClass: 'admin-badge-muted' },
  disponivel: { label: 'Disponível', cssClass: 'admin-badge-success' },
  reservada: { label: 'Reservada', cssClass: 'admin-badge-warning' },
  vendida: { label: 'Vendida', cssClass: 'admin-badge-danger' },
  oculta: { label: 'Oculta', cssClass: 'admin-badge-muted' },
};

const variantMap: Record<string, string> = {
  success: 'admin-badge-success',
  warning: 'admin-badge-warning',
  danger: 'admin-badge-danger',
  info: 'admin-badge-info',
  muted: 'admin-badge-muted',
};

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, cssClass: 'admin-badge-muted' };
  const cssClass = variant ? variantMap[variant] : config.cssClass;
  
  return (
    <span className={cn('admin-badge', cssClass, className)}>
      {config.label}
    </span>
  );
}
