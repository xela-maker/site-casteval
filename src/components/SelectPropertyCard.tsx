import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/LazyImage";
import { SelectCasaWithEmpreendimento } from "@/hooks/useSelectCasas";
import { BusinessCasaWithEmpreendimento } from "@/hooks/useBusinessCasas";
import { Bed, Bath, Square, Car, MapPin, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/lib/imageUtils";
interface SelectPropertyCardProps {
  casa: SelectCasaWithEmpreendimento | BusinessCasaWithEmpreendimento;
  contextType?: 'select' | 'business';
}
export const SelectPropertyCard = ({
  casa,
  contextType = 'select'
}: SelectPropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };
  const getStatusBadge = () => {
    const statusMap: Record<string, {
      label: string;
      variant: "default" | "secondary" | "destructive" | "outline";
    }> = {
      'disponivel': {
        label: 'Disponível',
        variant: 'default'
      },
      'vendido': {
        label: 'Vendido',
        variant: 'secondary'
      },
      'reservado': {
        label: 'Reservado',
        variant: 'outline'
      }
    };
    return statusMap[casa.status || 'disponivel'] || statusMap['disponivel'];
  };
  const status = getStatusBadge();
  const location = [casa.empreendimento.endereco_bairro, casa.empreendimento.endereco_cidade, casa.empreendimento.endereco_uf].filter(Boolean).join(', ');
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/casas/${casa.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <LazyImage
            src={getImageUrl(casa.foto_capa)}
            alt={casa.nome}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 right-4 z-10">
            <Badge variant={status.variant} className="shadow-md">
              {status.label}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-5">
        <Link to={`/casas/${casa.slug}`} className="block">
          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-brand-gold transition-colors line-clamp-2">
            {casa.nome}
          </h3>
          
          <div className="flex items-center text-sm text-gray-600 mb-5 gap-1.5">
            <MapPin className="w-4 h-4 flex-shrink-0 text-brand-gold" strokeWidth={2} />
            <span className="truncate font-medium">{location}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-5 text-sm text-gray-700">
            {casa.quartos > 0 && (
              <div className="flex items-center gap-2.5">
                <Bed className="w-5 h-5 text-brand-gold flex-shrink-0" strokeWidth={2} />
                <span className="font-medium">{casa.quartos} {casa.quartos === 1 ? 'quarto' : 'quartos'}</span>
              </div>
            )}
            {casa.banheiros > 0 && (
              <div className="flex items-center gap-2.5">
                <Bath className="w-5 h-5 text-brand-gold flex-shrink-0" strokeWidth={2} />
                <span className="font-medium">{casa.banheiros} {casa.banheiros === 1 ? 'banheiro' : 'banheiros'}</span>
              </div>
            )}
            {casa.metragem > 0 && (
              <div className="flex items-center gap-2.5">
                <Square className="w-5 h-5 text-brand-gold flex-shrink-0" strokeWidth={2} />
                <span className="font-medium">{casa.metragem}m²</span>
              </div>
            )}
            {casa.vagas > 0 && (
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-brand-gold flex-shrink-0" strokeWidth={2} />
                <span className="font-medium">{casa.vagas} {casa.vagas === 1 ? 'vaga' : 'vagas'}</span>
              </div>
            )}
          </div>

          {casa.preco > 0 && (
            <div className="text-3xl font-extrabold text-brand-gold mb-5 tracking-tight">
              {formatPrice(casa.preco)}
            </div>
          )}
        </Link>

        <Button asChild className="w-full h-12 bg-brand-gold hover:bg-brand-gold-700 text-white font-bold shadow-md transition-all hover:shadow-lg">
          <Link to={`/casas/${casa.slug}`}>
            Ver Detalhes
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};