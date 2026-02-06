import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const galleryItems = [
  {
    id: 1,
    type: "image",
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2070",
    title: "Residencial Aurora - Fachada",
    project: "Aurora"
  },
  {
    id: 2,
    type: "image", 
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070",
    title: "Edifício Platinum - Vista externa",
    project: "Platinum"
  },
  {
    id: 3,
    type: "image",
    src: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070",
    title: "Residencial Essence - Interior",
    project: "Essence"
  },
  {
    id: 4,
    type: "image",
    src: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070",
    title: "Acabamentos premium",
    project: "Select"
  },
  {
    id: 5,
    type: "image",
    src: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?q=80&w=2070",
    title: "Área de lazer exclusiva",
    project: "Select"
  },
  {
    id: 6,
    type: "image",
    src: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070",
    title: "Vista panorâmica",
    project: "Select"
  }
];

interface SelectGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export const SelectGallery = ({ isOpen = false, onClose = () => {}, initialIndex = 0 }: SelectGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const nextItem = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const prevItem = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const currentItem = galleryItems[currentIndex];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-16 right-16 z-50 text-white hover:bg-white/10 rounded-full w-40 h-40"
          >
            <X className="w-20 h-20" />
          </Button>

          {/* Navigation */}
          <Button
            variant="ghost"
            size="icon"
            onClick={prevItem}
            className="absolute left-16 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 rounded-full w-48 h-48"
          >
            <ChevronLeft className="w-24 h-24" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextItem}
            className="absolute right-16 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/10 rounded-full w-48 h-48"
          >
            <ChevronRight className="w-24 h-24" />
          </Button>

          {/* Main Content */}
          <div className="w-full h-full flex items-center justify-center p-32">
            <div className="relative max-w-[80vw] max-h-[80vh]">
              <img
                src={currentItem.src}
                alt={currentItem.title}
                className="max-w-full max-h-full object-contain rounded-card"
              />
            </div>
          </div>

          {/* Info Bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-24">
            <div className="text-center text-white">
              <h3 className="text-h4 font-semibold mb-8">
                {currentItem.title}
              </h3>
              <p className="text-body-s text-white/80 mb-8">
                {currentItem.project}
              </p>
              <p className="text-caption text-white/60">
                {currentIndex + 1} de {galleryItems.length}
              </p>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="absolute bottom-80 left-1/2 -translate-x-1/2 flex gap-8 bg-black/50 rounded-pill p-8">
            {galleryItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-8 h-8 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-brand-gold' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Export a trigger component for easy use
export const SelectGalleryTrigger = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="fixed bottom-80 right-24 z-40 bg-white border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black shadow-card-rest rounded-pill px-16 py-8"
      >
        <Expand className="w-16 h-16 mr-8" />
        Explorar em tela cheia
      </Button>
      <SelectGallery isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};