import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useScrolled } from "@/hooks/useScrolled";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/casteval-logo-new.webp";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isScrolled = useScrolled();
  const location = useLocation();
  const whatsapp = useWhatsAppIntegration();

  const isActive = (path: string) => location.pathname === path;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const headerClasses = isScrolled 
    ? "bg-brand-charcoal text-white" 
    : "bg-transparent text-white";

  const textShadowStyle = !isScrolled ? { textShadow: '0 1px 0 rgba(0,0,0,0.25)' } : {};

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-smooth ${headerClasses}`}>
        <div className="container mx-auto max-w-container mobile:px-16 desktop:px-24">
          <div className="flex items-center justify-between mobile:h-[64px] desktop:h-[80px]">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <img 
                src={logo} 
                alt="Casteval" 
                className="h-[65px] w-auto p-[10px]"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden desktop:flex items-center space-x-16">
              <Link 
                to="/sobre-nos" 
                className={`text-[11px] font-semibold uppercase transition-smooth tracking-button ${
                  isActive('/sobre-nos') ? 'text-brand-gold' : 'hover:text-brand-gold'
                }`}
                style={textShadowStyle}
              >
                SOBRE NÓS
              </Link>
              <Link 
                to="/empreendimentos" 
                className={`text-[11px] font-semibold uppercase transition-smooth tracking-button ${
                  isActive('/empreendimentos') ? 'text-brand-gold' : 'hover:text-brand-gold'
                }`}
                style={textShadowStyle}
              >
                EMPREENDIMENTOS
              </Link>
              <Link 
                to="/select" 
                className={`text-[11px] font-semibold uppercase transition-smooth tracking-button ${
                  isActive('/select') ? 'text-brand-gold' : 'hover:text-brand-gold'
                }`}
                style={textShadowStyle}
              >
                SELECT
              </Link>
              <Link 
                to="/business" 
                className={`text-[11px] font-semibold uppercase transition-smooth tracking-button ${
                  isActive('/business') ? 'text-brand-gold' : 'hover:text-brand-gold'
                }`}
                style={textShadowStyle}
              >
                BUSINESS
              </Link>
              <Link 
                to="/blog" 
                className={`text-[11px] font-semibold uppercase transition-smooth tracking-button ${
                  isActive('/blog') ? 'text-brand-gold' : 'hover:text-brand-gold'
                }`}
                style={textShadowStyle}
              >
                BLOG
              </Link>
              <Link 
                to="/contato" 
                className={`text-[11px] font-semibold uppercase transition-smooth tracking-button ${
                  isActive('/contato') ? 'text-brand-gold' : 'hover:text-brand-gold'
                }`}
                style={textShadowStyle}
              >
                CONTATO
              </Link>
            </nav>

            {/* Desktop CTA */}
            <div className="hidden desktop:flex">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => whatsapp.openConsultation()}
                className="text-[10px] font-bold tracking-button shadow-card-rest hover:shadow-card-hover transition-smooth px-6 py-3"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--brand-gold)), hsl(var(--brand-gold-700)))',
                  color: '#000',
                  border: 'none'
                }}
              >
                <FaWhatsapp className="h-5 w-5 mr-1" style={{ width: '20px', height: '20px', color: 'inherit' }} />
                FALE COM UM CORRETOR
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="desktop:hidden p-2 transition-smooth focus:outline-none focus:focus-brand"
              aria-label="Menu"
              style={textShadowStyle}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 desktop:hidden">
          <div className="absolute inset-0 bg-brand-charcoal" onClick={toggleMenu} />
          <div className="relative h-full flex flex-col justify-center items-center space-y-6 px-6">
            <Link 
              to="/sobre-nos" 
              className={`text-h3 font-semibold uppercase transition-smooth ${
                isActive('/sobre-nos') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={toggleMenu}
            >
              SOBRE NÓS
            </Link>
            <Link 
              to="/empreendimentos" 
              className={`text-h3 font-semibold uppercase transition-smooth ${
                isActive('/empreendimentos') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={toggleMenu}
            >
              EMPREENDIMENTOS
            </Link>
            <Link 
              to="/select" 
              className={`text-h3 font-semibold uppercase transition-smooth ${
                isActive('/select') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={toggleMenu}
            >
              SELECT
            </Link>
            <Link 
              to="/business" 
              className={`text-h3 font-semibold uppercase transition-smooth ${
                isActive('/business') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={toggleMenu}
            >
              BUSINESS
            </Link>
            <Link 
              to="/blog" 
              className={`text-h3 font-semibold uppercase transition-smooth ${
                isActive('/blog') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={toggleMenu}
            >
              BLOG
            </Link>
            <Link 
              to="/contato" 
              className={`text-h3 font-semibold uppercase transition-smooth ${
                isActive('/contato') ? 'text-brand-gold' : 'text-white hover:text-brand-gold'
              }`}
              onClick={toggleMenu}
            >
              CONTATO
            </Link>
            <Button 
              variant="default" 
              size="pill"
              onClick={() => {
                whatsapp.openConsultation();
                toggleMenu();
              }}
              className="mt-8 text-caption font-semibold tracking-button shadow-card-rest hover:shadow-card-hover transition-smooth px-8 py-4"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--brand-gold)), hsl(var(--brand-gold-700)))',
                color: '#000',
                border: 'none',
                minWidth: '280px'
              }}
            >
              <FaWhatsapp className="h-5 w-5 mr-1" style={{ width: '20px', height: '20px', color: 'inherit' }} />
              FALE COM UM CORRETOR
            </Button>
          </div>
        </div>
      )}
    </>
  );
};