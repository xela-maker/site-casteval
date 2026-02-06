import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Check, X, RefreshCw, AlertCircle } from 'lucide-react';
import { slugify, isValidSlug } from '@/lib/slugify';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';

interface SlugFieldProps {
  value: string;
  onChange: (value: string) => void;
  basedOn?: string;
  table: string;
  currentId?: string;
  label?: string;
  required?: boolean;
  description?: string;
}

export function SlugField({
  value,
  onChange,
  basedOn,
  table,
  currentId,
  label = 'Slug',
  required = false,
  description = 'URL amigável para a página',
}: SlugFieldProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [manualEdit, setManualEdit] = useState(false);

  const debouncedSlug = useDebounce(value, 500);

  // Gerar slug automaticamente baseado em outro campo
  useEffect(() => {
    if (basedOn && !manualEdit && !value) {
      const generated = slugify(basedOn);
      if (generated) {
        onChange(generated);
      }
    }
  }, [basedOn, manualEdit, value, onChange]);

  // Verificar disponibilidade do slug
  useEffect(() => {
    const checkAvailability = async () => {
      if (!debouncedSlug || !isValidSlug(debouncedSlug)) {
        setIsAvailable(null);
        return;
      }

      setIsChecking(true);
      try {
        const query = supabase
          .from(table as any)
          .select('id')
          .eq('slug', debouncedSlug);

        // Se estiver editando, excluir o registro atual da verificação
        const finalQuery = currentId ? query.neq('id', currentId) : query;

        const { data, error } = await finalQuery.maybeSingle();

        if (error) throw error;

        setIsAvailable(data === null);
      } catch (error) {
        console.error('Erro ao verificar slug:', error);
        setIsAvailable(null);
      } finally {
        setIsChecking(false);
      }
    };

    checkAvailability();
  }, [debouncedSlug, table, currentId]);

  const handleChange = (newValue: string) => {
    setManualEdit(true);
    onChange(newValue.toLowerCase());
  };

  const handleRegenerate = () => {
    if (basedOn) {
      const generated = slugify(basedOn);
      onChange(generated);
      setManualEdit(false);
    }
  };

  const isValid = value && isValidSlug(value);
  const showStatus = isValid && !isChecking && isAvailable !== null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        {basedOn && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRegenerate}
            className="h-auto py-1 px-2"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Regenerar
          </Button>
        )}
      </div>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div className="relative">
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="meu-slug-personalizado"
          required={required}
          className={cn(
            'pr-10 font-mono',
            showStatus && (isAvailable ? 'border-green-500' : 'border-destructive')
          )}
        />

        {/* Status Indicator */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isChecking && (
            <RefreshCw className="h-4 w-4 text-muted-foreground animate-spin" />
          )}
          {showStatus && isAvailable && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          {showStatus && !isAvailable && (
            <X className="h-4 w-4 text-destructive" />
          )}
        </div>
      </div>

      {/* Mensagens de Validação */}
      {value && !isValid && (
        <div className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <span>Use apenas letras minúsculas, números e hífens</span>
        </div>
      )}

      {showStatus && !isAvailable && (
        <div className="flex items-start gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <span>Este slug já está em uso. Escolha outro.</span>
        </div>
      )}

      {showStatus && isAvailable && (
        <div className="flex items-start gap-2 text-sm text-green-600">
          <Check className="h-4 w-4 mt-0.5" />
          <span>Slug disponível!</span>
        </div>
      )}
    </div>
  );
}
