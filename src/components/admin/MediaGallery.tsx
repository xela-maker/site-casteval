import { useState } from 'react';
import { ImageUploader } from './ImageUploader';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Star, GripVertical } from 'lucide-react';

interface MediaItem {
  url: string;
  alt?: string;
  isCover?: boolean;
}

interface MediaGalleryProps {
  label?: string;
  description?: string;
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2';
}

export const MediaGallery = ({
  label = 'Galeria de Imagens',
  description,
  value = [],
  onChange,
  maxFiles = 30,
  aspectRatio,
}: MediaGalleryProps) => {
  const [altTexts, setAltTexts] = useState<Record<string, string>>({});
  const [coverIndex, setCoverIndex] = useState(0);

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
    
    // Adjust cover index if needed
    if (coverIndex === index) {
      setCoverIndex(0);
    } else if (coverIndex > index) {
      setCoverIndex(coverIndex - 1);
    }
  };

  const handleSetCover = (index: number) => {
    setCoverIndex(index);
  };

  const handleAltChange = (url: string, alt: string) => {
    setAltTexts(prev => ({ ...prev, [url]: alt }));
  };

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      {description && (
        <p className="text-sm" style={{ color: 'hsl(var(--admin-muted))' }}>
          {description}
        </p>
      )}

      <ImageUploader
        value={value}
        onChange={onChange}
        multiple
        maxFiles={maxFiles}
        aspectRatio={aspectRatio}
      />

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {value.map((url, index) => (
            <div
              key={index}
              className="admin-card relative group"
              style={{ padding: 'var(--admin-space-sm)' }}
            >
              {/* Drag Handle */}
              <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="admin-icon-sm" style={{ color: 'hsl(var(--admin-text))' }} />
              </div>

              {/* Cover Badge */}
              {index === coverIndex && (
                <div 
                  className="absolute top-2 right-2 z-10 admin-badge admin-badge-warning"
                >
                  <Star className="admin-icon-sm" />
                  Capa
                </div>
              )}

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full"
                style={{ background: 'hsl(var(--admin-danger))' }}
              >
                <X className="admin-icon-sm" style={{ color: 'white' }} />
              </button>

              {/* Image */}
              <div className="aspect-video rounded-lg overflow-hidden mb-2">
                <img
                  src={url}
                  alt={altTexts[url] || `Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Alt Text Input */}
              <Input
                placeholder="Texto alternativo (alt)"
                value={altTexts[url] || ''}
                onChange={(e) => handleAltChange(url, e.target.value)}
                className="text-xs mb-2"
              />

              {/* Set as Cover Button */}
              {index !== coverIndex && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleSetCover(index)}
                >
                  Definir como Capa
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <p className="text-xs" style={{ color: 'hsl(var(--admin-muted))' }}>
          {value.length} / {maxFiles} imagens • Conversão automática para WebP • Tamanhos: 600px, 1280px, 1920px
        </p>
      )}
    </div>
  );
};
