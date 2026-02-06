import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const BlogNewsletter = () => {
  return (
    <section className="mobile:py-40 desktop:py-56 bg-primary-50">
      <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-h2 font-bold text-ink-800 mb-6">
            Receba nossas novidades
          </h2>
          <p className="text-body-l text-ink-600 mb-8">
            Assine nossa newsletter e seja o primeiro a receber dicas exclusivas, 
            lançamentos e conteúdos sobre o mercado imobiliário.
          </p>
          
          <form className="flex mobile:flex-col desktop:flex-row mobile:space-y-4 desktop:space-y-0 desktop:space-x-4 max-w-md mx-auto">
            <Input 
              type="email" 
              placeholder="Seu e-mail"
              className="flex-1"
            />
            <Button 
              type="submit"
              size="default"
              className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-body-s tracking-button px-8 py-3 rounded-pill mobile:w-full desktop:w-auto"
            >
              ASSINAR
            </Button>
          </form>
          
          <p className="text-caption text-ink-500 mt-4">
            Não enviamos spam. Cancele a qualquer momento.
          </p>
        </div>
      </div>
    </section>
  );
};