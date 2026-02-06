import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogContent } from "@/components/BlogContent";

export default function Blog() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <BlogContent />
      </main>
      <Footer />
    </div>
  );
}