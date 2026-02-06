import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SobreNosContent } from "@/components/SobreNosContent";

export default function SobreNos() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <SobreNosContent />
      </main>
      <Footer />
    </div>
  );
}