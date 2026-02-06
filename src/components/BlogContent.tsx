import contatoHero from "@/assets/contato-hero.png";
import { BlogGrid } from "@/components/BlogGrid";

export const BlogContent = () => {
  return (
    <>
      {/* Hero Section */}
      <section style={{
        position: "relative",
        background: "#000",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "96px 20px 72px 20px",
        textAlign: "center"
      }}>
        <img 
          src={contatoHero} 
          alt="Blog Casteval" 
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.8,
            pointerEvents: "none"
          }} 
        />
        <div style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto"
        }}>
          <p style={{
            color: "#C5A139",
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            margin: "0 0 10px 0",
            fontSize: 12
          }}>
            Blog
          </p>
          <h1 style={{
            color: "#fff",
            margin: "0 0 10px 0",
            fontWeight: 800,
            fontSize: 40,
            lineHeight: 1.15
          }}>
            Insights e <span style={{ color: "#F5B321" }}>Novidades</span>
          </h1>
          <p style={{
            color: "rgba(255,255,255,.9)",
            margin: "0 auto",
            maxWidth: 760,
            lineHeight: 1.6,
            fontSize: 18
          }} className="text-slate-50 mx-[43px] my-0 px-0">
            Fique por dentro das últimas tendências do mercado imobiliário, dicas exclusivas e novidades sobre os empreendimentos Casteval.
          </p>
        </div>

        {/* indicador de scroll */}
        <div style={{
          position: "absolute",
          left: "50%",
          bottom: 18,
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,.6)"
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <BlogGrid />
    </>
  );
};
