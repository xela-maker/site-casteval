import React from "react";
import { Heart, Bed, Bath, Ruler, CarFront, MapPin, ChevronRight } from "lucide-react";

interface BusinessPropertyCardProps {
  casa: any;
  contextType?: string;
}

export const BusinessPropertyCard: React.FC<BusinessPropertyCardProps> = ({ casa, contextType = "business" }) => {
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const statusMap: Record<string, string> = {
    disponivel: "Disponível",
    vendido: "Vendido",
    reservado: "Reservado",
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 cursor-pointer flex flex-col h-full"
      style={{
        transform: isHovered ? "translateY(-4px)" : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagem com Badge e Favorito */}
      <div className="relative w-full pb-[66.67%] bg-gray-100 overflow-hidden">
        <img
          src={casa?.foto_capa || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80"}
          alt={casa?.nome || "Propriedade"}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />

        {/* Badge de Status */}
        {casa?.status && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold z-10">
            {statusMap[casa.status] || "Disponível"}
          </div>
        )}

        {/* Botão Favorito */}
        <button
          className="absolute top-3 left-3 bg-white/95 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 z-10 shadow-sm hover:scale-110"
          onClick={() => setIsFavorite(!isFavorite)}
          title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart
            size={20}
            color={isFavorite ? "#ff3b30" : "#9ca3af"}
            fill={isFavorite ? "#ff3b30" : "none"}
            strokeWidth={2}
          />
        </button>
      </div>

      {/* Conteúdo */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Localização */}
        {casa?.localizacao && (
          <div className="flex items-start gap-2 mb-2.5 text-xs text-gray-600">
            <MapPin size={18} className="flex-shrink-0 text-amber-600 mt-0.5" strokeWidth={2} />
            <span>{casa.localizacao}</span>
          </div>
        )}

        {/* Título */}
        <h3 className="text-base font-bold text-gray-900 mb-3 leading-snug">{casa?.nome || "Propriedade"}</h3>

        {/* Detalhes Grid */}
        <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-gray-200">
          {/* Quartos */}
          {casa?.quartos > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <Bed size={20} className="flex-shrink-0 text-amber-600" strokeWidth={2} />
              <span>
                {casa.quartos} quarto{casa.quartos !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Banheiros */}
          {casa?.banheiros > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <Bath size={20} className="flex-shrink-0 text-amber-600" strokeWidth={2} />
              <span>
                {casa.banheiros} banheiro{casa.banheiros !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Metragem */}
          {casa?.metragem > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <Ruler size={20} className="flex-shrink-0 text-amber-600" strokeWidth={2} />
              <span>{casa.metragem}m²</span>
            </div>
          )}

          {/* Vagas */}
          {casa?.vagas > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-gray-700">
              <CarFront size={20} className="flex-shrink-0 text-amber-600" strokeWidth={2} />
              <span>
                {casa.vagas} vaga{casa.vagas !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {/* Preço */}
        {casa?.preco > 0 && (
          <div className="text-lg font-extrabold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-3">
            {formatPrice(casa.preco)}
          </div>
        )}

        {/* Botão CTA */}
        <a
          href={`/business/${casa?.slug}`}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 text-white rounded-md text-sm font-semibold transition-all duration-200 mt-auto hover:shadow-lg"
        >
          Ver Detalhes
          <ChevronRight size={16} strokeWidth={2.5} />
        </a>
      </div>
    </div>
  );
};
