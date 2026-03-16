import { useState } from "react";
import { X, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSelectWishlist } from "@/hooks/useSelectWishlist";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";
import { trackWhatsAppClick } from "@/utils/analytics";

export const SelectWishlist = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { wishlist, removeFromWishlist } = useSelectWishlist();
  const { open } = useWhatsAppIntegration();

  const openWhatsApp = (projectName: string) => {
    trackWhatsAppClick("select_wishlist_whatsapp");
    const message = `Tenho interesse no empreendimento ${projectName} da linha Casteval Select`;
    open(message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed top-80 right-24 z-40 bg-white border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black shadow-card-rest rounded-pill px-16 py-8"
        >
          <Heart className="w-16 h-16 mr-8" />
          Minha Lista Select ({wishlist.length})
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-h3 font-bold text-ink-900 mb-16">
            Minha Lista Select
          </DialogTitle>
        </DialogHeader>

        {wishlist.length > 0 ? (
          <div className="space-y-16">
            {wishlist.map((project) => (
              <div key={project.id} className="flex gap-16 p-16 bg-surface-50 rounded-card">
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-[120px] h-[80px] object-cover rounded-card flex-shrink-0"
                />
                
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-8">
                    <h3 className="text-h5 font-semibold text-ink-900">
                      {project.name}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromWishlist(project.id)}
                      className="text-ink-500 hover:text-red-500 p-4"
                    >
                      <X className="w-16 h-16" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-16 text-caption text-ink-600 mb-12">
                    <span>{project.specs.area}</span>
                    <span>•</span>
                    <span>{project.specs.suites}</span>
                    <span>•</span>
                    <span>{project.specs.parking}</span>
                  </div>
                  
                  <Button
                    onClick={() => openWhatsApp(project.name)}
                    size="sm"
                    className="bg-brand-gold hover:bg-brand-gold-700 text-black font-semibold text-caption rounded-pill"
                  >
                    Quero saber mais
                    <ArrowRight className="ml-4 h-12 w-12" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-48">
            <Heart className="w-48 h-48 text-ink-300 mx-auto mb-16" />
            <p className="text-body-l text-ink-600 mb-16">
              Sua lista está vazia. Explore nossos empreendimentos Select e adicione seus favoritos.
            </p>
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black"
            >
              Explorar empreendimentos
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};