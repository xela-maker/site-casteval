import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
}

export const KPICard = ({ title, value, icon: Icon, trend, onClick }: KPICardProps) => {
  return (
    <div 
      className="admin-card cursor-pointer"
      onClick={onClick}
      style={{ padding: 'var(--admin-space-lg)' }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm" style={{ color: 'hsl(var(--admin-muted))' }}>
            {title}
          </p>
          <h3 className="text-3xl font-bold mt-2" style={{ color: 'hsl(var(--admin-text))' }}>
            {value.toLocaleString('pt-BR')}
          </h3>
        </div>
        <div 
          className="p-3 rounded-lg"
          style={{ background: 'hsla(var(--admin-brand), 0.1)' }}
        >
          <Icon className="admin-icon-lg" style={{ color: 'hsl(var(--admin-brand))' }} />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1 text-sm">
          {trend.direction === 'up' ? (
            <TrendingUp className="admin-icon-sm" style={{ color: 'hsl(var(--admin-success))' }} />
          ) : (
            <TrendingDown className="admin-icon-sm" style={{ color: 'hsl(var(--admin-danger))' }} />
          )}
          <span style={{ 
            color: trend.direction === 'up' ? 'hsl(var(--admin-success))' : 'hsl(var(--admin-danger))' 
          }}>
            {trend.value}%
          </span>
          <span style={{ color: 'hsl(var(--admin-muted))' }}>vs. mês anterior</span>
        </div>
      )}
    </div>
  );
};
