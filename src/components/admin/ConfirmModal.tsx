import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  variant?: 'delete' | 'archive' | 'publish';
  countdown?: number;
}

export const ConfirmModal = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  variant = 'delete',
  countdown = 2,
}: ConfirmModalProps) => {
  const [secondsLeft, setSecondsLeft] = useState(countdown);
  const [canConfirm, setCanConfirm] = useState(false);

  useEffect(() => {
    if (open) {
      setSecondsLeft(countdown);
      setCanConfirm(false);

      const interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setCanConfirm(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [open, countdown]);

  const variantStyles = {
    delete: {
      icon: <AlertTriangle className="h-6 w-6" style={{ color: 'hsl(var(--admin-danger))' }} />,
      confirmClass: 'bg-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))] text-white',
    },
    archive: {
      icon: <AlertTriangle className="h-6 w-6" style={{ color: 'hsl(var(--admin-warning))' }} />,
      confirmClass: 'bg-[hsl(var(--admin-warning))] hover:bg-[hsl(var(--admin-warning))] text-black',
    },
    publish: {
      icon: <AlertTriangle className="h-6 w-6" style={{ color: 'hsl(var(--admin-success))' }} />,
      confirmClass: 'bg-[hsl(var(--admin-success))] hover:bg-[hsl(var(--admin-success))] text-white',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            {currentVariant.icon}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={currentVariant.confirmClass}
            disabled={!canConfirm}
            onClick={onConfirm}
          >
            {!canConfirm ? `Aguarde ${secondsLeft}s...` : 'Confirmar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
