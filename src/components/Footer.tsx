import { MessageCircle, Facebook, Twitter, Youtube, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/casteval-logo-new.webp";
import { useConfig } from "@/hooks/useConfig";

// Helper para validar URLs
const isValidUrl = (url: string | undefined | null): boolean => {
  return !!url && typeof url === 'string' && url.trim() !== '' && url.startsWith('http');
};

export const Footer = () => {
  const { data: config, isLoading } = useConfig();
  
  // Verificar se há pelo menos uma rede social válida
  const hasSocialMedia = 
    isValidUrl(config?.facebook_url) ||
    isValidUrl(config?.instagram_url) ||
    isValidUrl(config?.linkedin_url) ||
    isValidUrl(config?.youtube_url) ||
    isValidUrl(config?.twitter_url);
  const shell: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "50px 1rem",
  };

  const cols: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr 1fr 1fr",
    gap: "3rem",
    alignItems: "start",
  };

  const ulReset: React.CSSProperties = { listStyle: "none", margin: 0, padding: 0 };

  const bottomShell: React.CSSProperties = { maxWidth: 1200, margin: "0 auto", padding: "1rem" };

  const responsive = `
    @media (max-width: 768px) {
      .cv-cols { 
        grid-template-columns: 1fr !important; 
        gap: 2rem !important; 
        text-align: center !important; 
      }
      .cv-logo { 
        display: flex !important;
        justify-content: center !important;
      }
      .cv-social { justify-content: center !important; }
      .cv-fale   { justify-content: center !important; }
      .cv-fale .cv-fale-inner { 
        margin-left: auto !important; 
        margin-right: auto !important; 
        text-align: left !important;  
        max-width: 320px !important;
      }
    }
  `;

  return (
    <footer className="bg-secondary text-white">
      <style>{responsive}</style>

      <div style={shell}>
        <div className="cv-cols" style={cols}>
          {/* COLUNA 1: Logo + redes sociais */}
          <div>
            <Link to="/admin" className="cv-logo" style={{ display: "inline-block" }}>
              <img src={logo} alt="Casteval" style={{ height: 65, width: "auto", cursor: "pointer" }} />
            </Link>

            {hasSocialMedia && (
              <div
                className="cv-social"
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: 24,
                  justifyContent: "flex-start",
                }}
              >
                {isValidUrl(config?.facebook_url) && (
                  <a
                    href={config.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="rounded-full flex items-center justify-center transition-smooth"
                    style={{
                      background: "#fff",
                      width: 44,
                      height: 44,
                    }}
                  >
                    <Facebook className="w-5 h-5" style={{ color: "#0b0b0b" }} />
                  </a>
                )}
                {isValidUrl(config?.instagram_url) && (
                  <a
                    href={config.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="rounded-full flex items-center justify-center transition-smooth"
                    style={{
                      background: "#fff",
                      width: 44,
                      height: 44,
                    }}
                  >
                    <Instagram className="w-5 h-5" style={{ color: "#0b0b0b" }} />
                  </a>
                )}
                {isValidUrl(config?.linkedin_url) && (
                  <a
                    href={config.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="rounded-full flex items-center justify-center transition-smooth"
                    style={{
                      background: "#fff",
                      width: 44,
                      height: 44,
                    }}
                  >
                    <Linkedin className="w-5 h-5" style={{ color: "#0b0b0b" }} />
                  </a>
                )}
                {isValidUrl(config?.twitter_url) && (
                  <a
                    href={config.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="rounded-full flex items-center justify-center transition-smooth"
                    style={{
                      background: "#fff",
                      width: 44,
                      height: 44,
                    }}
                  >
                    <Twitter className="w-5 h-5" style={{ color: "#0b0b0b" }} />
                  </a>
                )}
                {isValidUrl(config?.youtube_url) && (
                  <a
                    href={config.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="rounded-full flex items-center justify-center transition-smooth"
                    style={{
                      background: "#fff",
                      width: 44,
                      height: 44,
                    }}
                  >
                    <Youtube className="w-5 h-5" style={{ color: "#0b0b0b" }} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* COLUNA 2: Institucional */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Institucional</h3>
            <ul style={ulReset} className="space-y-3">
              <li><Link to="/sobre-nos" className="text-white/90 hover:text-primary transition-smooth">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-white/90 hover:text-primary transition-smooth">Contato</Link></li>
              <li><Link to="/blog" className="text-white/90 hover:text-primary transition-smooth">Blog</Link></li>
              <li><a href="https://sites.casteval.com.br/public/lp/contato-casteval/" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-primary transition-smooth">Reclamações ou Sugestões</a></li>
            </ul>
          </div>

          {/* COLUNA 3: Imóveis */}
          <div>
            <h3 className="text-lg font-heading font-semibold mb-6">Imóveis</h3>
            <ul style={ulReset} className="space-y-3">
              <li><Link to="/empreendimentos" className="text-white/90 hover:text-primary transition-smooth">Empreendimentos</Link></li>
              <li><Link to="/select" className="text-white/90 hover:text-primary transition-smooth">Select</Link></li>
              <li><Link to="/business" className="text-white/90 hover:text-primary transition-smooth">Business</Link></li>
            </ul>
          </div>

          {/* COLUNA 4: Fale Conosco */}
          <div className="cv-fale flex md:block">
            <div className="cv-fale-inner">
              <h3 className="text-lg font-heading font-semibold mb-6 text-white">Fale Conosco</h3>
              <div className="flex items-start gap-3">
                <MessageCircle className="h-6 w-6 text-primary mt-1" />
                <div>
                  <div className="text-white font-semibold">{config?.telefone || '(41) 3014-1122'}</div>
                  {config?.horario_segunda_sexta && (
                    <div className="text-white/80 text-sm">Segunda à Sexta: {config.horario_segunda_sexta}</div>
                  )}
                  {config?.horario_sabado && (
                    <div className="text-white/80 text-sm">Sábado: {config.horario_sabado}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra inferior */}
      <div className="bg-primary">
        <div style={bottomShell}>
          <div className="text-secondary text-sm text-center">
            Todos os direitos reservados para Casteval © 2025
          </div>
        </div>
      </div>
    </footer>
  );
};
