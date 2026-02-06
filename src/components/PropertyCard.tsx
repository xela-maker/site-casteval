import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bed, Bath, Car, Square, MapPin, Building } from "lucide-react";
import { getImageUrl } from "@/lib/imageUtils";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  status?: string;
  features: {
    bedrooms?: number | string;
    bathrooms?: number | string;
    parking?: number;
    area?: string;
  };
  description?: string;
  variant?: 'default' | 'business';
}

export const PropertyCard = ({ 
  image, 
  title, 
  location, 
  price, 
  status = "LANÇAMENTO", 
  features,
  description,
  variant = 'default'
}: PropertyCardProps) => {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'lançamento':
        return 'default';
      case 'em obras':
        return 'secondary';
      case 'pronto':
        return 'outline';
      case 'business':
        return 'secondary';
      default:
        return 'default';
    }
  };

  if (variant === 'business') {
    return (
      <Card className="group overflow-hidden rounded-card bg-surface-0 shadow-card-rest hover:shadow-card-hover transition-smooth card-hover cursor-pointer">
        <div className="relative">
          {/* Property Image */}
          <div className="aspect-property overflow-hidden rounded-t-image">
            <img 
              src={getImageUrl(image) || '/placeholder.svg'} 
              alt={title}
              className="w-full h-full object-cover transition-smooth group-hover:scale-105"
            />
          </div>
          
          {/* Status Badge */}
          <Badge 
            variant={getStatusVariant(status)}
            className="absolute top-3 left-3 px-3 py-1 text-caption font-semibold tracking-overline bg-surface-0/90 text-ink-900 border border-line-100 backdrop-blur-sm"
          >
            {status}
          </Badge>
          
          {/* Arrow Button */}
          <div className="absolute top-3 right-3">
            <Button 
              variant="icon" 
              size="icon"
              className="w-6 h-6 rounded-button bg-brand-gold hover:bg-brand-gold-700 text-black shadow-none"
            >
              <ArrowUpRight className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Location */}
          <p className="text-caption text-ink-500 mb-1 font-medium">
            {location}
          </p>

          {/* Title */}
          <h3 className="text-body-l font-bold text-ink-900 mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-body-s text-ink-500 mb-3 leading-relaxed">
              {description}
            </p>
          )}

          {/* Features - Horizontal with Icons */}
          <div className="flex items-center gap-4 text-body-s text-ink-500">
            <div className="flex items-center gap-1">
              <Building className="w-4 h-4" />
              <span>{price}</span>
            </div>
            {features.area && (
              <div className="flex items-center gap-1">
                <Square className="w-4 h-4" />
                <span>{features.area}</span>
              </div>
            )}
            {features.bedrooms && Number(features.bedrooms) > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{features.bedrooms} Suítes</span>
              </div>
            )}
            {features.parking && Number(features.parking) > 0 && (
              <div className="flex items-center gap-1">
                <Car className="w-4 h-4" />
                <span>{features.parking} Vagas</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group overflow-hidden rounded-card bg-surface-0 shadow-card-rest hover:shadow-card-hover transition-smooth card-hover cursor-pointer">
      <div className="relative">
        {/* Property Image */}
        <div className="aspect-property overflow-hidden rounded-t-image">
          <img 
            src={getImageUrl(image) || '/placeholder.svg'} 
            alt={title}
            className="w-full h-full object-cover transition-smooth group-hover:scale-105"
          />
        </div>
        
        {/* Status Badge */}
        <Badge 
          variant={getStatusVariant(status)}
          className="absolute top-3 left-3 px-3 py-1 text-caption font-semibold tracking-overline bg-surface-0/90 text-ink-900 border border-line-100 backdrop-blur-sm"
        >
          {status}
        </Badge>
        
        {/* Arrow Button */}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-smooth">
          <Button 
            variant="icon" 
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
          {location}
        </p>

        {/* Title */}
        <h3 className="text-body-l font-bold text-ink-900 mb-2 line-clamp-2">
          {title}
        </h3>

        {/* Price */}
        <p className="text-body-s font-semibold text-ink-700 mb-4">
          {price}
        </p>

        {/* Features - Horizontal Layout */}
        <div className="flex items-center gap-4 text-body-s text-ink-500 border-t border-line-100 pt-3">
          {features.area && (
            <div className="flex items-center gap-1">
              <Square className="w-4 h-4" />
              <span>{features.area}</span>
            </div>
          )}
          {features.bedrooms && Number(features.bedrooms) > 0 && (
            <div className="flex items-center gap-1">
              <Bed className="w-4 h-4" />
              <span>{features.bedrooms} Suítes</span>
            </div>
          )}
          {features.parking && Number(features.parking) > 0 && (
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4" />
              <span>{features.parking} vagas</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};