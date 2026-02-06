import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Filter } from "lucide-react";
import { UseSelectCasasOptions } from "@/hooks/useSelectCasas";

interface SelectFiltersProps {
  filters: UseSelectCasasOptions;
  onFiltersChange: (filters: UseSelectCasasOptions) => void;
  onApply: () => void;
  onClear: () => void;
}

const TIPOS_IMOVEL = [
  { value: "Casa", label: "Casa" },
  { value: "Apartamento", label: "Apartamento" },
  { value: "Cobertura", label: "Cobertura" },
  { value: "Terreno", label: "Terreno" },
];

const QUARTOS_OPTIONS = [1, 2, 3, 4, 5];
const BANHEIROS_OPTIONS = [1, 2, 3, 4, 5];
const VAGAS_OPTIONS = [1, 2, 3, 4, 5];

export const SelectFilters = ({
  filters,
  onFiltersChange,
  onApply,
  onClear,
}: SelectFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleTipoChange = (tipo: string, checked: boolean) => {
    const currentTipos = localFilters.tipo || [];
    const newTipos = checked
      ? [...currentTipos, tipo]
      : currentTipos.filter((t) => t !== tipo);
    
    setLocalFilters({ ...localFilters, tipo: newTipos });
  };

  const handleQuartosChange = (quartos: number, checked: boolean) => {
    const currentQuartos = localFilters.quartos || [];
    const newQuartos = checked
      ? [...currentQuartos, quartos]
      : currentQuartos.filter((q) => q !== quartos);
    
    setLocalFilters({ ...localFilters, quartos: newQuartos });
  };

  const handleBanheirosChange = (banheiros: number, checked: boolean) => {
    const currentBanheiros = localFilters.banheiros || [];
    const newBanheiros = checked
      ? [...currentBanheiros, banheiros]
      : currentBanheiros.filter((b) => b !== banheiros);
    
    setLocalFilters({ ...localFilters, banheiros: newBanheiros });
  };

  const handleVagasChange = (vagas: number, checked: boolean) => {
    const currentVagas = localFilters.vagas || [];
    const newVagas = checked
      ? [...currentVagas, vagas]
      : currentVagas.filter((v) => v !== vagas);
    
    setLocalFilters({ ...localFilters, vagas: newVagas });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onApply();
  };

  const handleClear = () => {
    const clearedFilters = {};
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
      
      <Accordion type="multiple" defaultValue={["tipo", "metragem", "quartos"]} className="w-full">
        {/* Tipo de Imóvel */}
        <AccordionItem value="tipo">
          <AccordionTrigger className="text-sm font-semibold">
            Tipo de Imóvel
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {TIPOS_IMOVEL.map((tipo) => (
                <div key={tipo.value} className="flex items-center space-x-2.5">
                  <Checkbox
                    id={`tipo-${tipo.value}`}
                    checked={(localFilters.tipo || []).includes(tipo.value)}
                    onCheckedChange={(checked) =>
                      handleTipoChange(tipo.value, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`tipo-${tipo.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {tipo.label}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Metragem */}
        <AccordionItem value="metragem">
          <AccordionTrigger className="text-sm font-semibold">
            Metragem (m²)
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              <div>
                <Label htmlFor="metragemMin" className="text-xs">Mínimo</Label>
                <Input
                  id="metragemMin"
                  type="number"
                  placeholder="0"
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
                <Label htmlFor="metragemMax" className="text-xs">Máximo</Label>
                <Input
                  id="metragemMax"
                  type="number"
                  placeholder="Sem limite"
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
            Quartos
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {QUARTOS_OPTIONS.map((num) => (
                <div key={num} className="flex items-center space-x-2.5">
                  <Checkbox
                    id={`quartos-${num}`}
                    checked={(localFilters.quartos || []).includes(num)}
                    onCheckedChange={(checked) =>
                      handleQuartosChange(num, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`quartos-${num}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {num === 5 ? "5+" : num} {num === 1 ? "quarto" : "quartos"}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Banheiros */}
        <AccordionItem value="banheiros">
          <AccordionTrigger className="text-sm font-semibold">
            Banheiros
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {BANHEIROS_OPTIONS.map((num) => (
                <div key={num} className="flex items-center space-x-2.5">
                  <Checkbox
                    id={`banheiros-${num}`}
                    checked={(localFilters.banheiros || []).includes(num)}
                    onCheckedChange={(checked) =>
                      handleBanheirosChange(num, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`banheiros-${num}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {num === 5 ? "5+" : num} {num === 1 ? "banheiro" : "banheiros"}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Vagas */}
        <AccordionItem value="vagas">
          <AccordionTrigger className="text-sm font-semibold">
            Vagas de Garagem
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {VAGAS_OPTIONS.map((num) => (
                <div key={num} className="flex items-center space-x-2.5">
                  <Checkbox
                    id={`vagas-${num}`}
                    checked={(localFilters.vagas || []).includes(num)}
                    onCheckedChange={(checked) =>
                      handleVagasChange(num, checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`vagas-${num}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {num === 5 ? "5+" : num} {num === 1 ? "vaga" : "vagas"}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Botões de Ação */}
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
