import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <div className="admin-empty-state">
      <Icon style={{ color: 'hsl(var(--admin-muted))', opacity: 0.3, width: '80px', height: '80px' }} />
      <h3 
        className="text-lg font-semibold mb-2"
        style={{ color: 'hsl(var(--admin-text))' }}
      >
        {title}
      </h3>
      <p 
        className="text-sm mb-6"
        style={{ color: 'hsl(var(--admin-muted))' }}
      >
        {description}
      </p>
      {actionLabel && onAction && (
        <Button className="admin-btn-primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
