import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X, GripVertical, Upload } from 'lucide-react';
import { toast } from 'sonner';

// Tipo para item da galeria (suporta string ou objeto)
type GalleryItem = string | { url: string; alt?: string };

interface DraggableGalleryProps {
  label?: string;
  description?: string;
  value: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
  maxFiles?: number;
  bucket?: string;
  path?: string;
}

export const DraggableGallery = ({
  label = 'Galeria de Imagens',
  description = 'Arraste para reordenar as imagens da galeria.',
  value = [],
  onChange,
  maxFiles = 50,
  bucket = 'empreendimentos',
  path = '',
}: DraggableGalleryProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Helper: Extrai URL seja string ou objeto
  const getUrl = (item: GalleryItem): string => {
    if (typeof item === 'string') return item;
    return item?.url || '';
  };

  // Helper: Gera ID único para draggable
  const getDraggableId = (item: GalleryItem, index: number): string => {
    const url = getUrl(item);
    return url || `item-${index}`;
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - value.length;
    if (remainingSlots <= 0) {
      toast.error(`Máximo de ${maxFiles} imagens atingido`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    setUploading(true);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // Validação
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} não é uma imagem válida`);
        }

        if (file.size > 10 * 1024 * 1024) {
          throw new Error(`${file.name} excede 10MB`);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = path ? `${path}/${fileName}` : fileName;

        const { error: uploadError, data } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      // Criar objetos {url, alt} para manter consistência
      const newItems: GalleryItem[] = urls.map(url => ({ url, alt: '' }));
      onChange([...value, ...newItems]);
      toast.success(`${urls.length} ${urls.length === 1 ? 'imagem enviada' : 'imagens enviadas'}`);
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error(error.message || 'Erro ao fazer upload');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const newValue = value.filter((_, i) => i !== index);
    onChange(newValue);
    toast.success('Imagem removida');
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      {description && (
        <p className="text-sm" style={{ color: 'hsl(var(--admin-muted))' }}>
          {description}
        </p>
      )}

      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input
          type="file"
          id="gallery-upload"
          multiple
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
          disabled={uploading || value.length >= maxFiles}
        />
        <label
          htmlFor="gallery-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <Upload className="w-8 h-8" style={{ color: 'hsl(var(--admin-muted))' }} />
          <div>
            <p className="font-medium" style={{ color: 'hsl(var(--admin-text))' }}>
              {uploading ? 'Enviando...' : 'Clique ou arraste arquivos'}
            </p>
            <p className="text-xs" style={{ color: 'hsl(var(--admin-muted))' }}>
              PNG, JPG, WEBP até 10MB • Máx. {maxFiles} imagens
            </p>
          </div>
        </label>
      </div>

      {/* Draggable Gallery Grid */}
      {value.length > 0 && (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="gallery" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${
                    snapshot.isDraggingOver ? 'bg-primary/5 rounded-lg p-2' : ''
                  }`}
                >
                  {value.map((item, index) => {
                    const url = getUrl(item);
                    const draggableId = getDraggableId(item, index);
                    
                    return (
                      <Draggable key={draggableId} draggableId={draggableId} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`admin-card relative group transition-all ${
                              snapshot.isDragging
                                ? 'shadow-lg scale-105 rotate-2 z-50'
                                : ''
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                              padding: 'var(--admin-space-sm)',
                            }}
                          >
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 rounded"
                              style={{ background: 'hsl(var(--admin-surface))' }}
                            >
                              <GripVertical
                                className="admin-icon-sm"
                                style={{ color: 'hsl(var(--admin-text))' }}
                              />
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => handleRemove(index)}
                              className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:scale-110"
                              style={{ background: 'hsl(var(--admin-danger))' }}
                            >
                              <X className="admin-icon-sm" style={{ color: 'white' }} />
                            </button>

                            {/* Image */}
                            <div className="aspect-video rounded-lg overflow-hidden">
                              <img
                                src={url}
                                alt={typeof item === 'object' && item.alt ? item.alt : `Imagem ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Image Number */}
                            <p className="text-xs text-center mt-2" style={{ color: 'hsl(var(--admin-muted))' }}>
                              Imagem {index + 1}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Counter */}
          <p className="text-xs" style={{ color: 'hsl(var(--admin-muted))' }}>
            {value.length} / {maxFiles} imagens • Arraste para reordenar
          </p>
        </>
      )}
    </div>
  );
};
