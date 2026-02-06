import { Link } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bed, Car, Square } from "lucide-react";
import type { Empreendimento } from "@/hooks/useEmpreendimentos";
import { getImageUrl } from "@/lib/imageUtils";

interface EmpreendimentoCardProps {
  empreendimento: Empreendimento;
}

export const EmpreendimentoCard = ({ empreendimento }: EmpreendimentoCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'lançamento':
      case 'lancamento':
        return 'default';
      case 'em obras':
      case 'em-obras':
        return 'secondary';
      case 'entregue':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'lançamento':
      case 'lancamento':
        return 'bg-brand-gold text-black';
      case 'em obras':
      case 'em-obras':
        return 'bg-ink-700 text-white';
      case 'entregue':
        return 'bg-surface-0 text-ink-900 border border-line-100';
      default:
        return 'bg-brand-gold text-black';
    }
  };

  const formatStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'lançamento':
      case 'lancamento':
        return 'LANÇAMENTO';
      case 'em obras':
      case 'em-obras':
        return 'EM OBRAS';
      case 'entregue':
        return 'ENTREGUE';
      default:
        return status.toUpperCase();
    }
  };

  const cardImage = getImageUrl(empreendimento.card_image) || 
                    getImageUrl(empreendimento.hero_image) || 
                    '/placeholder.jpg';
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatArea = (inicial?: number, final?: number) => {
    if (!inicial && !final) return undefined;
    if (inicial && final && inicial !== final) {
      return `${inicial}m² a ${final}m²`;
    }
    return `${inicial || final}m²`;
  };

  const formatQuartos = (min?: number, max?: number) => {
    if (!min && !max) return undefined;
    if (min && max && min !== max) {
      return max;
    }
    return min || max;
  };

  return (
    <Link to={`/empreendimentos/${empreendimento.slug}`}>
      <Card className="group overflow-hidden rounded-card bg-surface-0 shadow-card-rest hover:shadow-card-hover transition-smooth card-hover cursor-pointer">
      <div className="relative">
        {/* Property Image */}
        <div className="aspect-property overflow-hidden rounded-t-image">
          <img 
            src={cardImage} 
            alt={empreendimento.nome}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          />
        </div>
        
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 text-caption font-semibold tracking-overline rounded-pill backdrop-blur-sm ${getStatusColor(empreendimento.status)}`}>
          {formatStatus(empreendimento.status)}
        </div>
        
        {/* Arrow Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-smooth">
          <Button 
            size="icon"
            className="w-9 h-9 rounded-button bg-brand-gold hover:bg-brand-gold-700 text-black shadow-none"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Location */}
        <p className="text-caption text-ink-500 mb-1 font-medium">
          {empreendimento.endereco_bairro || empreendimento.localizacao}
        </p>

        {/* Title */}
        <h3 className="text-body-l font-bold text-ink-900 mb-2 line-clamp-2">
          {empreendimento.nome}
        </h3>

        {/* Price */}
        {empreendimento.preco_inicial && (
          <p className="text-body-s font-semibold text-ink-700 mb-4">
            A partir de {formatPrice(empreendimento.preco_inicial)}
          </p>
        )}

        {/* Features - Horizontal Layout */}
        <div className="flex items-center gap-4 text-body-s text-ink-500 border-t border-line-100 pt-3">
          {formatArea(empreendimento.metragem_inicial, empreendimento.metragem_final) && (
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{formatArea(empreendimento.metragem_inicial, empreendimento.metragem_final)}</span>
            </div>
          )}
          {formatQuartos(empreendimento.quartos_min, empreendimento.quartos_max) && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{formatQuartos(empreendimento.quartos_min, empreendimento.quartos_max)} Quartos</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </Link>
  );
};