import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, MessageCircle, Send, CheckCircle, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFormValidation, ContactFormData } from "@/hooks/useFormValidation";
import contatoHero from "@/assets/contato-hero.png";
import { useConfig } from "@/hooks/useConfig";
import { useWhatsAppIntegration } from "@/hooks/useWhatsAppIntegration";

export const ContatoContent = () => {
  const { toast } = useToast();
  const { errors, isSubmitting, validateField, submitForm } = useFormValidation();
  const { data: config } = useConfig();
  const whatsapp = useWhatsAppIntegration();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "",
    message: ""
  });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    validateField(field, value);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitForm(formData);
    if (success) {
      setIsSuccess(true);
      toast({
        title: "Mensagem enviada!",
        description: "Você será redirecionado para o WhatsApp para finalizar o contato."
      });
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          interest: "",
          message: ""
        });
      }, 3000);
    } else {
      toast({
        title: "Erro ao enviar",
        description: "Por favor, verifique os campos e tente novamente.",
        variant: "destructive"
      });
    }
  };

  // container central da página
  const containerStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    paddingLeft: 20,
    paddingRight: 20
  };
  return <>
      {/* Hero Section - Fundo preto + imagem 80% opacidade (INLINE) */}
      <section style={{
      position: "relative",
      isolation: "isolate",
      backgroundColor: "#000",
      color: "#fff",
      textAlign: "center",
      paddingTop: 116,
      paddingBottom: 80,
      paddingLeft: 20,
      paddingRight: 20,
      overflow: "hidden"
    }}>
        {/* Background Image */}
        <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${contatoHero})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.8,
        pointerEvents: "none"
      }} />

        {/* Content */}
        <div style={{
        position: "relative",
        zIndex: 1,
        ...containerStyle
      }}>
          <h1 style={{
          fontSize: 40,
          fontWeight: 700,
          margin: 0,
          marginBottom: 10
        }}>Fale Conosco</h1>
          <p style={{
          fontSize: 18,
          opacity: 0.95,
          maxWidth: 760,
          margin: "0 auto"
        }}>
            Estamos prontos para atender você e tirar todas as suas dúvidas
          </p>
        </div>
      </section>

      {/* Contact Content Section - Tabs + Formulários (INLINE) */}
      <section style={{
      position: "relative",
      background: "#F6F7F8",
      // sky-50 aproximado
      paddingTop: 64,
      paddingBottom: 64,
      paddingLeft: 20,
      paddingRight: 20
    }}>
        <div style={containerStyle}>
          <Tabs defaultValue="fale-conosco" orientation="vertical" className="w-full contact-tabs">
            <div style={{
            display: "grid",
            gridTemplateColumns: "300px 1fr",
            gap: 28,
            alignItems: "start"
          }}>
              {/* COLUNA ESQUERDA — LISTA DE TABS (padding-top 30px solicitado) */}
              <TabsList style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 12,
              background: "transparent",
              padding: 0,
              margin: 0,
              paddingTop: 30 // <<<<<<<<<<<<<<<<<<<<<< 30px
            }}>
                <TabsTrigger value="fale-conosco" className="ct-tab">
                  Fale Conosco
                </TabsTrigger>
                <TabsTrigger value="duvidas" className="ct-tab ct-tab--outlined">
                  Dúvidas e Sugestões
                </TabsTrigger>
                <TabsTrigger value="corretor" className="ct-tab ct-tab--outlined">
                  Fale com um corretor
                </TabsTrigger>
              </TabsList>

              {/* COLUNA DIREITA — CONTEÚDOS */}
              <div style={{
              minWidth: 0
            }}>
                {/* ABA 1 */}
                <TabsContent value="fale-conosco" className="mt-0">
                  <div style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  padding: 24
                }}>
                    <h3 style={{
                    fontSize: 22,
                    fontWeight: 600,
                    color: "#111",
                    margin: 0,
                    marginBottom: 18
                  }}>
                      Entre em contato por nossos <strong>canais de atendimento</strong>
                    </h3>

                    <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 16
                  }}>
                      <div style={{
                      width: 46,
                      height: 46,
                      borderRadius: "50%",
                      background: "#FFF5CC",
                      display: "grid",
                      placeItems: "center"
                    }}>
                        <MessageCircle size={20} color="#C5A139" />
                      </div>

                      <a href="tel:+554130141122" style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: "#111",
                      textDecoration: "none"
                    }}>
                        {config?.telefone || '(41) 3014-1122'}
                      </a>
                    </div>

                    <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10
                  }}>
                      <Clock size={18} color="#C5A139" />
                      <div>
                        <p style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#111",
                        margin: 0,
                        marginBottom: 2
                      }}>
                          Horário de Atendimento
                        </p>
                        <p style={{
                        fontSize: 14,
                        color: "#555",
                        margin: 0
                      }}>
                          {config?.horario_segunda_sexta && `Segunda à Sexta: ${config.horario_segunda_sexta}`}<br/>
                          {config?.horario_sabado && `Sábado: ${config.horario_sabado}`}
                        </p>
                      </div>
                    </div>

                    <div style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    marginTop: 16
                  }}>
                      <MapPin size={18} color="#C5A139" />
                      <div>
                        <p style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#111",
                        margin: 0,
                        marginBottom: 2
                      }}>
                          Nosso Escritório
                        </p>
                        <p style={{
                        fontSize: 14,
                        color: "#555",
                        margin: 0,
                        lineHeight: 1.5
                      }}>
                          {config?.endereco_rua || 'R. Carlos Benato, 421'} - {config?.endereco_bairro || 'São Braz'}<br/>
                          {config?.endereco_cidade || 'Curitiba'} - {config?.endereco_uf || 'PR'}, {config?.endereco_cep || '82320-440'}
                        </p>
                      </div>
                    </div>

                    <button onClick={() => whatsapp.openGeneral()} style={{
                    marginTop: 20,
                    backgroundColor: "#25D366",
                    color: "#fff",
                    fontWeight: 700,
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: 9999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer"
                  }}>
                      <MessageCircle size={18} color="#fff" />
                      FALAR NO WHATSAPP
                    </button>
                  </div>
                </TabsContent>

                {/* ABA 2 */}
                <TabsContent value="duvidas" className="mt-0">
                  <div style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  padding: 22
                }}>
                    <h3 style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#111",
                    textAlign: "center",
                    margin: 0
                  }}>
                      Envie sua dúvida ou sugestão
                    </h3>
                    <p style={{
                    fontSize: 14,
                    color: "#666",
                    textAlign: "center",
                    margin: "6px 0 20px 0"
                  }}>
                      Preencha o formulário abaixo e entraremos em contato em breve
                    </p>

                    {isSuccess ? <div style={{
                    background: "#F8F8F8",
                    padding: 14,
                    borderRadius: 8,
                    textAlign: "center"
                  }}>
                        <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                        <h2 style={{
                      fontSize: 22,
                      fontWeight: 700,
                      margin: 0,
                      marginBottom: 6,
                      color: "#222"
                    }}>
                          Mensagem enviada com sucesso!
                        </h2>
                        <p style={{
                      color: "#666",
                      margin: 0
                    }}>
                          Você será redirecionado para o WhatsApp para continuarmos a conversa.
                        </p>
                      </div> : <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid mobile:grid-cols-1 desktop:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-body-s font-medium text-ink-700 mb-2 block">Nome *</Label>
                            <Input type="text" placeholder="Seu nome" value={formData.firstName} onChange={e => handleInputChange("firstName", e.target.value)} required className={errors.firstName ? "border-destructive" : ""} />
                            {errors.firstName && <p className="text-caption text-destructive mt-1">{errors.firstName}</p>}
                          </div>
                          <div>
                            <Label className="text-body-s font-medium text-ink-700 mb-2 block">Sobrenome *</Label>
                            <Input type="text" placeholder="Seu sobrenome" value={formData.lastName} onChange={e => handleInputChange("lastName", e.target.value)} required className={errors.lastName ? "border-destructive" : ""} />
                            {errors.lastName && <p className="text-caption text-destructive mt-1">{errors.lastName}</p>}
                          </div>
                        </div>

                        <div>
                          <Label className="text-body-s font-medium text-ink-700 mb-2 block">E-mail *</Label>
                          <Input type="email" placeholder="seu@email.com" value={formData.email} onChange={e => handleInputChange("email", e.target.value)} required className={errors.email ? "border-destructive" : ""} />
                          {errors.email && <p className="text-caption text-destructive mt-1">{errors.email}</p>}
                        </div>

                        <div>
                          <Label className="text-body-s font-medium text-ink-700 mb-2 block">Telefone *</Label>
                          <Input type="tel" placeholder="(41) 99999-9999" value={formData.phone} onChange={e => handleInputChange("phone", e.target.value)} required className={errors.phone ? "border-destructive" : ""} />
                          {errors.phone && <p className="text-caption text-destructive mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                          <Label className="text-body-s font-medium text-ink-700 mb-2 block">Interesse</Label>
                          <Select value={formData.interest} onValueChange={v => handleInputChange("interest", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione seu interesse" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="compra">Comprar imóvel</SelectItem>
                              <SelectItem value="venda">Vender imóvel</SelectItem>
                              <SelectItem value="locacao">Locação</SelectItem>
                              <SelectItem value="investimento">Investimento</SelectItem>
                              <SelectItem value="business">Casteval Business</SelectItem>
                              <SelectItem value="select">Casteval Select</SelectItem>
                              <SelectItem value="outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-body-s font-medium text-ink-700 mb-2 block">Mensagem *</Label>
                          <Textarea placeholder="Como podemos ajudar você?" rows={5} value={formData.message} onChange={e => handleInputChange("message", e.target.value)} required className={errors.message ? "border-destructive" : ""} />
                          {errors.message && <p className="text-caption text-destructive mt-1">{errors.message}</p>}
                        </div>

                        <Button type="submit" size="default" disabled={isSubmitting} className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-semibold text-body-s tracking-button rounded-pill px-[30px] py-[30px]">
                          {isSubmitting ? <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                              ENVIANDO...
                            </> : <>
                              <Send className="w-4 h-4 mr-2" />
                              ENVIAR MENSAGEM
                            </>}
                        </Button>
                      </form>}
                  </div>
                </TabsContent>

                {/* ABA 3 */}
                <TabsContent value="corretor" className="mt-0">
                  <div style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
                  padding: 24,
                  textAlign: "center"
                }}>
                    <h3 style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#111",
                    margin: 0,
                    marginBottom: 8
                  }}>
                      Fale diretamente com nossos corretores
                    </h3>
                    <p style={{
                    color: "#666",
                    margin: 0,
                    marginBottom: 18
                  }}>
                      Nossos especialistas estão prontos para ajudar você a encontrar o imóvel ideal.
                    </p>

                    <button onClick={() => whatsapp.openConsultation()} style={{
                    backgroundColor: "#C5A139",
                    color: "#000",
                    fontWeight: 700,
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: 9999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    cursor: "pointer",
                    marginBottom: 12
                  }}>
                      <MessageCircle size={18} color="#000" />
                      FALAR NO WHATSAPP
                    </button>

                    <p style={{
                    fontSize: 14,
                    color: "#555",
                    margin: 0
                  }}>
                      Ou ligue:{" "}
                      <a href="tel:+554130141122" style={{
                      color: "#111",
                      fontWeight: 700,
                      textDecoration: "none"
                    }}>
                        {config?.telefone || '(41) 3014-1122'}
                      </a>
                    </p>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </section>

      {/* Estado ativo das tabs + responsivo do grid */}
      <style>{`
        .contact-tabs .ct-tab {
          width: 100%;
          background: #ffffff;
          color: #333333;
          border: 1px solid #E5E5E5;
          font-weight: 600;
          border-radius: 8px;
          padding: 16px 18px;
          text-align: left;
          transition: all .2s ease;
        }
        .contact-tabs [role="tab"][data-state="active"] {
          background: #C5A139 !important;
          color: #000 !important;
          border-color: #C5A139 !important;
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }

        /* Responsivo: empilha colunas */
        @media (max-width: 1024px) {
          .contact-tabs > div { grid-template-columns: 1fr !important; }
          .contact-tabs .ct-tab { text-align: center; }
        }
      `}</style>
    </>;
};