import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContatoContent } from "@/components/ContatoContent";

export default function Contato() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <ContatoContent />
      </main>
      <Footer />
    </div>
  );
}