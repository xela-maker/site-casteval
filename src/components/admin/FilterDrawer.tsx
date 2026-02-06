import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  onApply: () => void;
  onClear: () => void;
}

export const FilterDrawer = ({
  open,
  onOpenChange,
  children,
  onApply,
  onClear,
}: FilterDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>
            Configure os filtros para refinar os resultados
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6 pb-20">
          {children}
        </div>

        <div 
          className="absolute bottom-0 left-0 right-0 p-6 border-t flex gap-3"
          style={{
            background: 'hsl(var(--admin-surface))',
            borderColor: 'hsl(var(--admin-line))',
          }}
        >
          <Button variant="outline" className="flex-1" onClick={onClear}>
            Limpar
          </Button>
          <Button className="flex-1 admin-btn-primary" onClick={onApply}>
            Aplicar
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
