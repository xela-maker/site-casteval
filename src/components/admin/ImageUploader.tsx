import { useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageData {
  url: string;
  alt: string;
}

interface ImageUploaderProps {
  value: string | string[] | ImageData[] | ImageData;
  onChange: (value: string | string[] | ImageData[] | ImageData) => void;
  multiple?: boolean;
  maxFiles?: number;
  bucket?: string;
  path?: string;
  aspectRatio?: string;
  required?: boolean;
  label?: string;
  description?: string;
}

export function ImageUploader({
  value,
  onChange,
  multiple = false,
  maxFiles = 10,
  bucket = 'empreendimentos',
  path = 'uploads',
  aspectRatio,
  required = false,
  label = 'Imagem',
  description,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const images = Array.isArray(value) ? value : value ? [value] : [];
  const imageData: ImageData[] = images.map(img => 
    typeof img === 'string' ? { url: img, alt: '' } : img
  );

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    // Validar número de arquivos
    if (multiple && imageData.length + fileArray.length > maxFiles) {
      toast.error(`Máximo de ${maxFiles} imagens permitidas`);
      return;
    }

    if (!multiple && fileArray.length > 1) {
      toast.error('Apenas uma imagem é permitida');
      return;
    }

    // Validar tipo e tamanho
    const validFiles = fileArray.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} não é uma imagem`);
        return false;
      }
      if (file.size > 4 * 1024 * 1024) {
        toast.error(`${file.name} excede 4MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Criar previews locais
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
    setUploading(true);

    try {
      const uploadedImages: ImageData[] = [];

      for (const file of validFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${path}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedImages.push({ url: publicUrl, alt: '' });
      }

      if (multiple) {
        const newImages = [...imageData, ...uploadedImages];
        onChange(newImages);
      } else {
        // Para upload único, retorna apenas a URL string
        onChange(uploadedImages[0].url);
      }

      toast.success(`${uploadedImages.length} imagem(ns) enviada(s) com sucesso`);
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao fazer upload da imagem');
    } finally {
      // Limpar previews
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    if (multiple) {
      const newImages = imageData.filter((_, i) => i !== index);
      onChange(newImages.length > 0 ? newImages : []);
    } else {
      onChange('');
    }
  };

  const handleAltChange = (index: number, alt: string) => {
    const newImages = [...imageData];
    newImages[index] = { ...newImages[index], alt };
    onChange(multiple ? newImages : newImages[0]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="flex items-center gap-2">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      {(multiple || imageData.length === 0) && (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            dragActive ? 'border-primary bg-primary/5' : 'border-border',
            uploading && 'opacity-50 pointer-events-none'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="image-upload"
            className="hidden"
            accept="image/*"
            multiple={multiple}
            onChange={(e) => handleUpload(e.target.files)}
            disabled={uploading}
          />
          
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            {uploading ? (
              <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-primary">Clique para enviar</span>
              {' '}ou arraste e solte
            </div>
            <div className="text-xs text-muted-foreground">
              PNG, JPG ou WEBP (max. 4MB)
              {aspectRatio && ` • Proporção recomendada: ${aspectRatio}`}
            </div>
          </label>
        </div>
      )}

      {/* Preview das Imagens */}
      {(imageData.length > 0 || previewUrls.length > 0) && (
        <div className={cn(
          'grid gap-4',
          multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'
        )}>
          {/* Preview durante upload */}
          {previewUrls.map((url, index) => (
            <div 
              key={`preview-${index}`}
              className="relative rounded-lg overflow-hidden border"
              style={{ 
                aspectRatio: aspectRatio || '16/9',
                borderColor: 'hsl(var(--admin-border))',
                backgroundColor: 'hsl(var(--admin-muted) / 0.3)'
              }}
            >
              <img 
                src={url} 
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
                <span className="text-xs text-white font-medium">Enviando...</span>
              </div>
            </div>
          ))}
          
          {/* Imagens já enviadas */}
          {imageData.map((img, index) => (
            <div key={index} className="space-y-2">
              <div className="relative group aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={img.url}
                  alt={img.alt || `Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <Label htmlFor={`alt-${index}`} className="text-xs">
                  Texto alternativo (Alt) {required && '*'}
                </Label>
                <Input
                  id={`alt-${index}`}
                  value={img.alt}
                  onChange={(e) => handleAltChange(index, e.target.value)}
                  placeholder="Descreva a imagem para acessibilidade e SEO"
                  required={required}
                  className="mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
