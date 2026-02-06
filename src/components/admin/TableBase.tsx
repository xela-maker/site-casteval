import { useState, ReactNode } from 'react';
import { Search, Filter, Columns, SlidersHorizontal, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  visible?: boolean;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalPages: number;
  count: number;
}

interface TableBaseProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  selectedRows?: string[];
  onSelectionChange?: (selected: string[]) => void;
  actions?: ReactNode;
  onShowFilters?: () => void;
  filterCount?: number;
  onExport?: () => void;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  isLoading?: boolean;
}

export function TableBase<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = 'Buscar...',
  searchValue = '',
  onSearchChange,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  actions,
  onShowFilters,
  filterCount = 0,
  onExport,
  pagination,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
}: TableBaseProps<T>) {
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.filter(c => c.visible !== false).map(c => c.key)
  );
  const [density, setDensity] = useState<'comfortable' | 'default' | 'compact'>('default');

  const densityPadding = {
    comfortable: '20px',
    default: '16px',
    compact: '12px',
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.(data.map(item => item.id));
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...selectedRows, id]);
    } else {
      onSelectionChange?.(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns(prev =>
      prev.includes(key)
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Search */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 admin-icon-sm" style={{ color: 'hsl(var(--admin-muted))' }} />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-10 admin-input"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onShowFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowFilters}
            >
              <Filter className="admin-icon-sm mr-2" />
              Filtros
              {filterCount > 0 && (
                <span className="admin-badge admin-badge-warning ml-2">
                  {filterCount}
                </span>
              )}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Columns className="admin-icon-sm mr-2" />
                Colunas
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {columns.map(col => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={visibleColumns.includes(col.key)}
                  onCheckedChange={() => toggleColumnVisibility(col.key)}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="admin-icon-sm mr-2" />
                Densidade
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setDensity('comfortable')}>
                Confortável
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDensity('default')}>
                Padrão
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDensity('compact')}>
                Densa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="admin-icon-sm mr-2" />
              Exportar
            </Button>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedRows.length > 0 && (
        <div 
          className="admin-card flex items-center justify-between"
          style={{ padding: 'var(--admin-space-md)' }}
        >
          <span style={{ color: 'hsl(var(--admin-text))' }}>
            {selectedRows.length} {selectedRows.length === 1 ? 'item selecionado' : 'itens selecionados'}
          </span>
          {actions}
        </div>
      )}

      {/* Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <div className="admin-skeleton" style={{ width: '100%', height: '200px' }} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  {selectable && (
                    <th style={{ width: '40px' }}>
                      <Checkbox
                        checked={selectedRows.length === data.length && data.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                  )}
                  {columns
                    .filter(c => visibleColumns.includes(c.key))
                    .map(col => (
                      <th key={col.key}>{col.label}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {data.map(item => (
                  <tr 
                    key={item.id}
                    onClick={() => onRowClick?.(item)}
                    style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <td>
                        <Checkbox
                          checked={selectedRows.includes(item.id)}
                          onCheckedChange={(checked) => handleSelectRow(item.id, checked as boolean)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                    )}
                    {columns
                      .filter(c => visibleColumns.includes(c.key))
                      .map(col => (
                        <td 
                          key={col.key}
                          style={{ padding: densityPadding[density] }}
                        >
                          {col.render ? col.render(item) : (item as any)[col.key]}
                        </td>
                      ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <div className="text-sm" style={{ color: 'hsl(var(--admin-muted))' }}>
            Mostrando {((pagination.page - 1) * pagination.pageSize) + 1} a {Math.min(pagination.page * pagination.pageSize, pagination.count)} de {pagination.count} resultados
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(value) => onPageSizeChange?.(Number(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange?.(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="admin-icon-sm" />
              </Button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum = i + 1;
                if (pagination.totalPages > 5) {
                  if (pagination.page > 3) {
                    pageNum = pagination.page - 2 + i;
                  }
                  if (pageNum > pagination.totalPages) {
                    pageNum = pagination.totalPages - 4 + i;
                  }
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pagination.page === pageNum ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => onPageChange?.(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange?.(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                <ChevronRight className="admin-icon-sm" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
