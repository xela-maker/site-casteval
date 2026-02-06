import { useState, useMemo } from 'react';
import { useEmpreendimentos, type Empreendimento as DbEmpreendimento } from './useEmpreendimentos';

export interface EmpreendimentoFilters {
  status: string;
  regiao: string;
  quartos: string;
  search: string;
  metragem: [number, number];
}

export const useEmpreendimentosFilters = (page: number = 1, pageSize: number = 12) => {
  const [filters, setFilters] = useState<EmpreendimentoFilters>({
    status: '',
    regiao: '',
    quartos: '',
    search: '',
    metragem: [30, 1000]
  });

  const [isLoading, setIsLoading] = useState(false);

  const updateFilter = (key: keyof EmpreendimentoFilters, value: any) => {
    setIsLoading(true);
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const clearFilters = () => {
    setIsLoading(true);
    setFilters({
      status: '',
      regiao: '',
      quartos: '',
      search: '',
      metragem: [30, 1000]
    });
    
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const { data: response, isLoading: dbLoading } = useEmpreendimentos({ page, pageSize });

  const filteredEmpreendimentos = useMemo(() => {
    if (!response?.data) return [];
    
    return response.data.filter(emp => {
      // Status filter
      if (filters.status && emp.status !== filters.status) {
        return false;
      }

      // Região filter (usando bairro como região)
      if (filters.regiao && emp.endereco_bairro !== filters.regiao) {
        return false;
      }

      // Quartos filter
      if (filters.quartos) {
        const quartosNum = parseInt(filters.quartos);
        if (quartosNum === 4) {
          // 4+ quartos
          if (!emp.quartos_max || emp.quartos_max < 4) return false;
        } else {
          // Verifica se o número está no range min-max
          if (!emp.quartos_min || !emp.quartos_max) return false;
          if (emp.quartos_min > quartosNum || emp.quartos_max < quartosNum) return false;
        }
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!emp.nome.toLowerCase().includes(searchLower) && 
            !emp.localizacao?.toLowerCase().includes(searchLower) &&
            !emp.endereco_bairro?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Metragem filter
      const metragemMin = emp.metragem_inicial || 0;
      const metragemMax = emp.metragem_final || 0;
      if (metragemMax < filters.metragem[0] || metragemMin > filters.metragem[1]) {
        return false;
      }

      return true;
    });
  }, [response, filters]);

  return {
    filters,
    filteredEmpreendimentos,
    updateFilter,
    clearFilters,
    isLoading: isLoading || dbLoading,
    pagination: {
      page: response?.page || 1,
      pageSize: response?.pageSize || pageSize,
      totalPages: response?.totalPages || 0,
      totalCount: response?.count || 0
    }
  };
};