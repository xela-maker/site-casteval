import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter } from "lucide-react";
import { UseBusinessCasasOptions } from "@/hooks/useBusinessCasas";

interface BusinessFiltersProps {
  filters: UseBusinessCasasOptions;
  onFiltersChange: (filters: UseBusinessCasasOptions) => void;
  onApply: () => void;
  onClear: () => void;
}

const TIPOS_IMOVEL = [
  { value: "Casa", label: "Casa" },
  { value: "Apartamento", label: "Apartamento" },
  { value: "Cobertura", label: "Cobertura" },
  { value: "Terreno", label: "Terreno" },
  { value: "Comercial", label: "Comercial" },
  { value: "Sala Comercial", label: "Sala Comercial" },
  { value: "Galpão", label: "Galpão" },
];

export const BusinessFilters = ({
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: BusinessFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply();
  };

  const handleClear = () => {
    const clearedFilters = { page: localFilters.page, pageSize: localFilters.pageSize };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClear();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-2">
        <Filter className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
        <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
      </div>
      
      <Accordion type="multiple" defaultValue={["tipo", "metragem"]} className="w-full">
        {/* Tipo de Imóvel */}
        <AccordionItem value="tipo">
          <AccordionTrigger className="text-sm font-semibold">
            Tipo de Imóvel
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <Select
                value={localFilters.tipo || ""}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, tipo: value || undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_IMOVEL.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Localização */}
        <AccordionItem value="localizacao">
          <AccordionTrigger className="text-sm font-semibold">
            Localização
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div>
                <Label htmlFor="cidade" className="text-xs text-muted-foreground">
                  Cidade
                </Label>
                <Input
                  id="cidade"
                  type="text"
                  placeholder="Ex: Curitiba"
                  value={localFilters.cidade || ""}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, cidade: e.target.value || undefined })
                  }
                />
              </div>
              <div>
                <Label htmlFor="bairro" className="text-xs text-muted-foreground">
                  Bairro
                </Label>
                <Input
                  id="bairro"
                  type="text"
                  placeholder="Ex: Batel"
                  value={localFilters.bairro || ""}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, bairro: e.target.value || undefined })
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Metragem */}
        <AccordionItem value="metragem">
          <AccordionTrigger className="text-sm font-semibold">
            Área (m²)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div>
                <Label htmlFor="metragemMin" className="text-xs text-muted-foreground">
                  Área mínima
                </Label>
                <Input
                  id="metragemMin"
                  type="number"
                  placeholder="Ex: 50"
                  value={localFilters.metragemMin || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      metragemMin: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="metragemMax" className="text-xs text-muted-foreground">
                  Área máxima
                </Label>
                <Input
                  id="metragemMax"
                  type="number"
                  placeholder="Ex: 500"
                  value={localFilters.metragemMax || ""}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      metragemMax: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Quartos */}
        <AccordionItem value="quartos">
          <AccordionTrigger className="text-sm font-semibold">
            Quartos Mínimos
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <Select
                value={localFilters.quartosMin?.toString() || ""}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    quartosMin: value ? Number(value) : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}+ {num === 1 ? 'quarto' : 'quartos'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Banheiros */}
        <AccordionItem value="banheiros">
          <AccordionTrigger className="text-sm font-semibold">
            Banheiros Mínimos
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <Select
                value={localFilters.banheirosMin?.toString() || ""}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    banheirosMin: value ? Number(value) : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}+ {num === 1 ? 'banheiro' : 'banheiros'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Vagas */}
        <AccordionItem value="vagas">
          <AccordionTrigger className="text-sm font-semibold">
            Vagas Mínimas
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2">
              <Select
                value={localFilters.vagasMin?.toString() || ""}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    vagasMin: value ? Number(value) : undefined,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}+ {num === 1 ? 'vaga' : 'vagas'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
        <Button
          onClick={handleApply}
          className="w-full bg-brand-gold hover:bg-brand-gold-700 text-white font-semibold shadow-md"
        >
          Aplicar Filtros
        </Button>
        <Button 
          onClick={handleClear} 
          variant="outline" 
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Limpar
        </Button>
      </div>
    </div>
  );
};
