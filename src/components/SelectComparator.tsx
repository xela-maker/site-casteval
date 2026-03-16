import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSelectComparator } from "@/hooks/useSelectComparator";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";
import { trackWhatsAppClick } from "@/utils/analytics";

export const SelectComparator = () => {
  const { comparison, isOpen, closeComparator, clearComparison } = useSelectComparator();
  const { open } = useWhatsAppIntegration();

  const openWhatsApp = (projectName: string) => {
    trackWhatsAppClick("select_comparator_whatsapp");
    const message = `Tenho interesse no empreendimento ${projectName} da linha Casteval Select`;
    open(message);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeComparator()}>
      <DialogContent className="max-w-[1200px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-h3 font-bold text-ink-900 mb-16">
            Comparar Empreendimentos Select
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearComparison}
            className="absolute top-16 right-48 text-ink-500 hover:text-ink-700"
          >
            Limpar comparação
          </Button>
        </DialogHeader>

        {comparison.length >= 2 ? (
          <div className="grid grid-cols-1 desktop:grid-cols-2 gap-32">
            {comparison.map((project) => (
              <div key={project.id} className="bg-surface-50 rounded-card p-24">
                <div className="relative mb-16">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-[200px] object-cover rounded-card"
                  />
                  <span className="absolute top-12 left-12 bg-brand-gold text-black text-caption font-semibold px-8 py-4 rounded-pill uppercase tracking-overline">
                    {project.status}
                  </span>
                </div>

                <h3 className="text-h4 font-bold text-ink-900 mb-12">
                  {project.name}
                </h3>

                <div className="space-y-12 mb-20">
                  <div className="flex justify-between items-center py-8 border-b border-ink-200">
                    <span className="text-body-s font-medium text-ink-700">Área privativa</span>
                    <span className="text-body-s text-ink-900">{project.specs.area}</span>
                  </div>
                  <div className="flex justify-between items-center py-8 border-b border-ink-200">
                    <span className="text-body-s font-medium text-ink-700">Suítes</span>
                    <span className="text-body-s text-ink-900">{project.specs.suites}</span>
                  </div>
                  <div className="flex justify-between items-center py-8 border-b border-ink-200">
                    <span className="text-body-s font-medium text-ink-700">Vagas</span>
                    <span className="text-body-s text-ink-900">{project.specs.parking}</span>
                  </div>
                </div>

                <Button
                  onClick={() => openWhatsApp(project.name)}
                  className="w-full bg-brand-gold hover:bg-brand-gold-700 text-black font-semibold text-body-s tracking-button rounded-pill transition-smooth"
                >
                  Quero visitar este
                  <ArrowRight className="ml-8 h-16 w-16" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-48">
            <p className="text-body-l text-ink-600 mb-16">
              Selecione pelo menos 2 empreendimentos para comparar.
            </p>
            <Button
              onClick={closeComparator}
              variant="outline"
              className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black"
            >
              Voltar para seleção
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};