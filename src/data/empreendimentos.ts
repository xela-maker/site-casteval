import property1 from "@/assets/property-1.jpg";
import commercialBuilding from "@/assets/commercial-building.jpg";
import heroHouse from "@/assets/hero-house.jpg";
import casaVolpiHero from "@/assets/casa-volpi-hero.jpg";
import splendoreHero from "@/assets/splendore-hero.jpg";
import parqueImbuiasHero from "@/assets/parque-imbuias-hero.jpg";

export interface Casa {
  id: string;
  nome: string;
  tipo: string;
  area: number;
  quartos: number;
  banheiros: number;
  suites: number;
  vagas: number;
  preco: string;
  descricao: string;
  comodidades: string[];
  imagens: string[];
  plantaBaixa: string[];
  localizacao: {
    lat: number;
    lng: number;
  };
}

export interface EmpreendimentoDetalhado {
  id: string;
  nome: string;
  localizacao: string;
  regiao: string;
  status: 'lançamento' | 'em-obras' | 'entregue';
  preco: string;
  area?: string;
  quartos?: number;
  vagas?: number;
  image: string;
  metragem: number;
  
  // Dados detalhados
  videoUrl?: string;
  descricao: string;
  amenities: string[];
  galeria: string[];
  implantacao: string;
  casas: Casa[];
  localizacaoMapa: {
    lat: number;
    lng: number;
  };
}

// Mock data expandido
export const empreendimentosDetalhados: EmpreendimentoDetalhado[] = [
  {
    id: 'casa-volpi',
    nome: 'Casa Volpi',
    localizacao: 'Santa Felicidade, Curitiba',
    regiao: 'santa-felicidade',
    status: 'lançamento',
    preco: 'A partir de R$ 850.000',
    area: '180m² a 250m²',
    quartos: 3,
    vagas: 2,
    image: casaVolpiHero,
    metragem: 180,
    videoUrl: '/placeholder-video.mp4',
    descricao: 'O Casa Volpi é um condomínio residencial que combina design contemporâneo com a tranquilidade do bairro Bigorrilho. Localizado em uma das regiões mais valorizadas de Curitiba, oferece casas de 2 a 4 quartos com acabamentos de alta qualidade.',
    amenities: [
      'Academia', 'Piscina', 'Espaço Gourmet', 'Quadra Poliesportiva',
      'Playground', 'Salão de Festas', 'Churrasqueira', 'Portaria 24h',
      'Jardim Zen', 'Pet Place', 'Bike Storage', 'Coworking',
      'Espaço Kids', 'Sauna', 'Home Theater', 'Wi-Fi Áreas Comuns'
    ],
    galeria: [
      '/placeholder-gallery-1.jpg',
      '/placeholder-gallery-2.jpg',
      '/placeholder-gallery-3.jpg',
      '/placeholder-gallery-4.jpg',
      '/placeholder-gallery-5.jpg',
      '/placeholder-gallery-6.jpg'
    ],
    implantacao: '/placeholder-implantacao.jpg',
    localizacaoMapa: {
      lat: -25.4372,
      lng: -49.2844
    },
    casas: [
      {
        id: 'casa-1',
        nome: 'Casa Tipo A - 2 Quartos',
        tipo: 'Tipo A',
        area: 95,
        quartos: 2,
        banheiros: 2,
        suites: 1,
        vagas: 1,
        preco: 'R$ 650.000',
        descricao: 'Casa compacta e funcional, ideal para casais ou pequenas famílias. Layout inteligente maximiza o aproveitamento dos espaços.',
        comodidades: [
          'Água Quente', 'Área de Serviço', 'Banheiro Social', 'Churrasqueira',
          'Cozinha Americana', 'Garagem Coberta', 'Jardim Privativo', 'Sala de Estar',
          'Sala de Jantar', 'Suíte Master', 'Varanda', 'Área Gourmet'
        ],
        imagens: [
          '/placeholder-casa-1-1.jpg',
          '/placeholder-casa-1-2.jpg',
          '/placeholder-casa-1-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-terreo-1.jpg'
        ],
        localizacao: {
          lat: -25.4372,
          lng: -49.2844
        }
      },
      {
        id: 'casa-2',
        nome: 'Casa Tipo B - 3 Quartos',
        tipo: 'Tipo B',
        area: 120,
        quartos: 3,
        banheiros: 3,
        suites: 2,
        vagas: 2,
        preco: 'R$ 780.000',
        descricao: 'Casa familiar com distribuição inteligente dos ambientes, oferecendo conforto e privacidade para toda a família.',
        comodidades: [
          'Água Quente', 'Área de Serviço', 'Banheiro Social', 'Churrasqueira',
          'Closet', 'Cozinha Planejada', 'Garagem para 2 Carros', 'Jardim Privativo',
          'Sala de Estar', 'Sala de Jantar', 'Suíte Master', 'Varanda Gourmet',
          'Home Office', 'Despensa', 'Lavabo', 'Área Íntima'
        ],
        imagens: [
          '/placeholder-casa-2-1.jpg',
          '/placeholder-casa-2-2.jpg',
          '/placeholder-casa-2-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-terreo-2.jpg'
        ],
        localizacao: {
          lat: -25.4375,
          lng: -49.2847
        }
      },
      {
        id: 'casa-3',
        nome: 'Casa Tipo C - 4 Quartos',
        tipo: 'Tipo C',
        area: 180,
        quartos: 4,
        banheiros: 4,
        suites: 3,
        vagas: 3,
        preco: 'R$ 950.000',
        descricao: 'Casa premium com dois pavimentos, oferecendo amplos espaços e total privacidade. Ideal para famílias grandes.',
        comodidades: [
          'Água Quente', 'Área de Serviço', 'Banheiro Social', 'Churrasqueira',
          'Closet', 'Cozinha Gourmet', 'Garagem para 3 Carros', 'Jardim Privativo',
          'Sala de Estar', 'Sala de Jantar', 'Suíte Master', 'Varanda Gourmet',
          'Home Office', 'Despensa', 'Lavabo', 'Sala Íntima',
          'Área Gourmet Completa', 'Piscina Privativa', 'Sauna', 'Adega'
        ],
        imagens: [
          '/placeholder-casa-3-1.jpg',
          '/placeholder-casa-3-2.jpg',
          '/placeholder-casa-3-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-terreo-3.jpg',
          '/placeholder-planta-superior-3.jpg'
        ],
        localizacao: {
          lat: -25.4378,
          lng: -49.2850
        }
      }
    ]
  },
  {
    id: 'villa-bianca',
    nome: 'Residencial Villa Bianca',
    localizacao: 'Batel, Curitiba',
    regiao: 'batel',
    status: 'lançamento',
    preco: 'A partir de R$ 420.000',
    area: '48m² a 140m²',
    quartos: 1,
    vagas: 1,
    image: property1,
    metragem: 48,
    videoUrl: '/placeholder-video-villa.mp4',
    descricao: 'Um empreendimento moderno no coração do Batel, com apartamentos de alto padrão e localização privilegiada. Próximo ao Shopping Mueller e principais avenidas da cidade.',
    amenities: [
      'Rooftop', 'Piscina Infinity', 'Academia Premium', 'Espaço Coworking',
      'Lounge', 'Churrasqueira Gourmet', 'Bike Storage', 'Pet Care',
      'Concierge', 'Valet Parking', 'Lavanderia', 'Sala de Jogos',
      'Terraço Zen', 'Cinema', 'Espaço Yoga', 'Wi-Fi Premium'
    ],
    galeria: [
      '/placeholder-villa-1.jpg',
      '/placeholder-villa-2.jpg',
      '/placeholder-villa-3.jpg',
      '/placeholder-villa-4.jpg',
      '/placeholder-villa-5.jpg',
      '/placeholder-villa-6.jpg',
      '/placeholder-villa-7.jpg',
      '/placeholder-villa-8.jpg'
    ],
    implantacao: '/placeholder-implantacao-villa.jpg',
    localizacaoMapa: {
      lat: -25.4415,
      lng: -49.2716
    },
    casas: [
      {
        id: 'apt-101',
        nome: 'Studio 48m²',
        tipo: 'Studio',
        area: 48,
        quartos: 1,
        banheiros: 1,
        suites: 0,
        vagas: 1,
        preco: 'R$ 420.000',
        descricao: 'Studio moderno e funcional, perfeito para jovens profissionais. Ambiente integrado com cozinha americana e varanda.',
        comodidades: [
          'Ar Condicionado', 'Cozinha Americana', 'Varanda', 'Piso Laminado',
          'Banheiro Completo', 'Closet Compacto', 'Iluminação LED', 'Janelas Amplas'
        ],
        imagens: [
          '/placeholder-studio-1.jpg',
          '/placeholder-studio-2.jpg',
          '/placeholder-studio-3.jpg',
          '/placeholder-studio-4.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-studio.jpg'
        ],
        localizacao: {
          lat: -25.4415,
          lng: -49.2716
        }
      },
      {
        id: 'apt-201',
        nome: 'Apartamento 1 Quarto 65m²',
        tipo: '1 Quarto',
        area: 65,
        quartos: 1,
        banheiros: 1,
        suites: 1,
        vagas: 1,
        preco: 'R$ 520.000',
        descricao: 'Apartamento de 1 quarto com suíte, ideal para casais. Sala ampla integrada com cozinha e varanda gourmet.',
        comodidades: [
          'Suíte Master', 'Varanda Gourmet', 'Cozinha Planejada', 'Sala Integrada',
          'Ar Condicionado', 'Closet', 'Lavabo', 'Área de Serviço'
        ],
        imagens: [
          '/placeholder-1q-1.jpg',
          '/placeholder-1q-2.jpg',
          '/placeholder-1q-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-1q.jpg'
        ],
        localizacao: {
          lat: -25.4417,
          lng: -49.2718
        }
      },
      {
        id: 'apt-301',
        nome: 'Apartamento 2 Quartos 85m²',
        tipo: '2 Quartos',
        area: 85,
        quartos: 2,
        banheiros: 2,
        suites: 1,
        vagas: 1,
        preco: 'R$ 680.000',
        descricao: 'Apartamento espaçoso com 2 quartos, sendo 1 suíte. Excelente aproveitamento dos espaços e vista privilegiada.',
        comodidades: [
          'Suíte Master', '2 Quartos', 'Varanda Gourmet', 'Cozinha Planejada',
          'Sala de Estar', 'Sala de Jantar', 'Banheiro Social', 'Área de Serviço',
          'Closet', 'Lavabo', 'Ar Condicionado', 'Vista Panorâmica'
        ],
        imagens: [
          '/placeholder-2q-1.jpg',
          '/placeholder-2q-2.jpg',
          '/placeholder-2q-3.jpg',
          '/placeholder-2q-4.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-2q.jpg'
        ],
        localizacao: {
          lat: -25.4419,
          lng: -49.2720
        }
      },
      {
        id: 'apt-401',
        nome: 'Cobertura 3 Quartos 140m²',
        tipo: 'Cobertura',
        area: 140,
        quartos: 3,
        banheiros: 3,
        suites: 2,
        vagas: 2,
        preco: 'R$ 950.000',
        descricao: 'Cobertura premium com terraço privativo e vista 360° da cidade. Acabamentos de luxo e ambientes amplos.',
        comodidades: [
          'Terraço Privativo', '2 Suítes', 'Vista 360°', 'Cozinha Gourmet',
          'Home Office', 'Closet Master', 'Lavabo', 'Sala de TV',
          'Churrasqueira Privativa', 'Jacuzzi', 'Jardim Suspenso', 'Ar Central'
        ],
        imagens: [
          '/placeholder-cobertura-1.jpg',
          '/placeholder-cobertura-2.jpg',
          '/placeholder-cobertura-3.jpg',
          '/placeholder-cobertura-4.jpg',
          '/placeholder-cobertura-5.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-cobertura-inferior.jpg',
          '/placeholder-planta-cobertura-superior.jpg'
        ],
        localizacao: {
          lat: -25.4421,
          lng: -49.2722
        }
      }
    ]
  },
  {
    id: 'jardins-lago',
    nome: 'Condomínio Jardins do Lago',
    localizacao: 'Ecoville, Curitiba',
    regiao: 'ecoville',
    status: 'em-obras',
    preco: 'A partir de R$ 750.000',
    area: '110m² a 200m²',
    quartos: 2,
    vagas: 2,
    image: commercialBuilding,
    metragem: 110,
    videoUrl: '/placeholder-video-jardins.mp4',
    descricao: 'Condomínio fechado de casas e sobrados em meio à natureza do Ecoville. Projeto sustentável com área verde preservada e lago ornamental.',
    amenities: [
      'Lago Ornamental', 'Trilha Ecológica', 'Piscina Natural', 'Academia Outdoor',
      'Quadra de Tênis', 'Playground Ecológico', 'Horta Comunitária', 'Deck do Lago',
      'Salão de Festas', 'Espaço Gourmet', 'Pet Park', 'Bike Park',
      'Portaria Premium', 'Segurança 24h', 'Estação de Recarga', 'Wi-Fi Áreas Comuns'
    ],
    galeria: [
      '/placeholder-jardins-1.jpg',
      '/placeholder-jardins-2.jpg',
      '/placeholder-jardins-3.jpg',
      '/placeholder-jardins-4.jpg',
      '/placeholder-jardins-5.jpg',
      '/placeholder-jardins-6.jpg'
    ],
    implantacao: '/placeholder-implantacao-jardins.jpg',
    localizacaoMapa: {
      lat: -25.4129,
      lng: -49.2343
    },
    casas: [
      {
        id: 'casa-eco-1',
        nome: 'Casa Térrea 2 Quartos',
        tipo: 'Térrea',
        area: 110,
        quartos: 2,
        banheiros: 2,
        suites: 1,
        vagas: 2,
        preco: 'R$ 750.000',
        descricao: 'Casa térrea com conceito sustentável, jardim frontal e quintal com vista para o lago. Perfeita para quem busca tranquilidade.',
        comodidades: [
          'Vista do Lago', 'Jardim Frontal', 'Quintal Privativo', 'Suíte Master',
          'Cozinha Integrada', 'Sala de Estar', 'Área Gourmet', 'Lavanderia',
          'Garagem Coberta', 'Aquecimento Solar', 'Cisterna', 'Ar Condicionado'
        ],
        imagens: [
          '/placeholder-eco-casa-1.jpg',
          '/placeholder-eco-casa-2.jpg',
          '/placeholder-eco-casa-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-eco-terrea.jpg'
        ],
        localizacao: {
          lat: -25.4129,
          lng: -49.2343
        }
      },
      {
        id: 'casa-eco-2',
        nome: 'Casa 3 Quartos',
        tipo: 'Casa',
        area: 145,
        quartos: 3,
        banheiros: 3,
        suites: 2,
        vagas: 2,
        preco: 'R$ 890.000',
        descricao: 'Casa de dois pavimentos com varanda superior e vista panorâmica. Ambiente familiar com espaços integrados.',
        comodidades: [
          '2 Suítes', 'Varanda Superior', 'Vista Panorâmica', 'Sala de TV',
          'Cozinha Gourmet', 'Home Office', 'Área Gourmet', 'Quintal Grande',
          'Closet Master', 'Despensa', 'Lavabo', 'Aquecimento Solar'
        ],
        imagens: [
          '/placeholder-eco-casa2-1.jpg',
          '/placeholder-eco-casa2-2.jpg',
          '/placeholder-eco-casa2-3.jpg',
          '/placeholder-eco-casa2-4.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-eco-terreo.jpg',
          '/placeholder-planta-eco-superior.jpg'
        ],
        localizacao: {
          lat: -25.4132,
          lng: -49.2346
        }
      },
      {
        id: 'sobrado-eco-1',
        nome: 'Sobrado Premium 4 Quartos',
        tipo: 'Sobrado',
        area: 200,
        quartos: 4,
        banheiros: 4,
        suites: 3,
        vagas: 3,
        preco: 'R$ 1.150.000',
        descricao: 'Sobrado premium com 3 suítes e espaço gourmet completo. Vista privilegiada do lago e área verde preservada.',
        comodidades: [
          '3 Suítes', 'Master com Hidro', 'Vista do Lago', 'Terraço Privativo',
          'Cozinha Gourmet', 'Sala de Jantar', 'Sala de TV', 'Home Theater',
          'Espaço Gourmet', 'Piscina Privativa', 'Closet Duplo', 'Adega Climatizada'
        ],
        imagens: [
          '/placeholder-sobrado-eco-1.jpg',
          '/placeholder-sobrado-eco-2.jpg',
          '/placeholder-sobrado-eco-3.jpg',
          '/placeholder-sobrado-eco-4.jpg',
          '/placeholder-sobrado-eco-5.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-sobrado-terreo.jpg',
          '/placeholder-planta-sobrado-superior.jpg'
        ],
        localizacao: {
          lat: -25.4135,
          lng: -49.2349
        }
      }
    ]
  },
  {
    id: 'prime-tower',
    nome: 'Edifício Prime Tower',
    localizacao: 'Centro, Curitiba',
    regiao: 'centro',
    status: 'entregue',
    preco: 'A partir de R$ 350.000',
    area: '35m² a 120m²',
    quartos: 1,
    vagas: 1,
    image: property1,
    metragem: 35,
    videoUrl: '/placeholder-video-prime.mp4',
    descricao: 'Torre comercial e residencial no centro da cidade. Apartamentos compactos e modernos para quem busca praticidade e localização central.',
    amenities: [
      'Lobby Moderno', 'Coworking 24h', 'Rooftop Bar', 'Academia Compacta',
      'Lavanderia Compartilhada', 'Bike Storage', 'Terraço Panorâmico', 'Concierge',
      'Sala de Reuniões', 'Lounge', 'Coffee Station', 'Wi-Fi Premium',
      'Segurança 24h', 'Portaria Virtual', 'Elevadores High Speed', 'Ar Central'
    ],
    galeria: [
      '/placeholder-prime-1.jpg',
      '/placeholder-prime-2.jpg',
      '/placeholder-prime-3.jpg',
      '/placeholder-prime-4.jpg',
      '/placeholder-prime-5.jpg'
    ],
    implantacao: '/placeholder-implantacao-prime.jpg',
    localizacaoMapa: {
      lat: -25.4284,
      lng: -49.2733
    },
    casas: [
      {
        id: 'loft-1',
        nome: 'Loft Compacto 35m²',
        tipo: 'Loft',
        area: 35,
        quartos: 1,
        banheiros: 1,
        suites: 0,
        vagas: 0,
        preco: 'R$ 350.000',
        descricao: 'Loft urbano e moderno, ideal para jovens profissionais. Ambiente integrado com cozinha americana.',
        comodidades: [
          'Ambiente Integrado', 'Cozinha Americana', 'Banheiro Moderno', 'Pé Direito Alto',
          'Janelas Amplas', 'Ar Condicionado', 'Aquecedor Elétrico', 'Iluminação LED'
        ],
        imagens: [
          '/placeholder-loft-1.jpg',
          '/placeholder-loft-2.jpg',
          '/placeholder-loft-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-loft.jpg'
        ],
        localizacao: {
          lat: -25.4284,
          lng: -49.2733
        }
      },
      {
        id: 'apt-smart-1',
        nome: 'Smart 1 Quarto 45m²',
        tipo: 'Smart',
        area: 45,
        quartos: 1,
        banheiros: 1,
        suites: 1,
        vagas: 1,
        preco: 'R$ 420.000',
        descricao: 'Apartamento inteligente com automação residencial. Compacto e funcional para vida urbana.',
        comodidades: [
          'Automação Residencial', 'Suíte Compacta', 'Cozinha Integrada', 'Smart TV',
          'Ar Condicionado Smart', 'Iluminação Automatizada', 'Varanda', 'Vaga Coberta'
        ],
        imagens: [
          '/placeholder-smart-1.jpg',
          '/placeholder-smart-2.jpg',
          '/placeholder-smart-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-smart.jpg'
        ],
        localizacao: {
          lat: -25.4286,
          lng: -49.2735
        }
      },
      {
        id: 'apt-exec-1',
        nome: 'Executivo 2 Quartos 75m²',
        tipo: 'Executivo',
        area: 75,
        quartos: 2,
        banheiros: 2,
        suites: 1,
        vagas: 1,
        preco: 'R$ 580.000',
        descricao: 'Apartamento executivo com home office integrado. Ideal para profissionais que trabalham em casa.',
        comodidades: [
          'Home Office', 'Suíte Master', 'Sala Integrada', 'Cozinha Planejada',
          'Varanda Office', 'Banheiro Social', 'Área de Serviço', 'Closet',
          'Ar Condicionado', 'Automação Básica', 'Vista da Cidade', 'Vaga Coberta'
        ],
        imagens: [
          '/placeholder-exec-1.jpg',
          '/placeholder-exec-2.jpg',
          '/placeholder-exec-3.jpg',
          '/placeholder-exec-4.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-exec.jpg'
        ],
        localizacao: {
          lat: -25.4288,
          lng: -49.2737
        }
      }
    ]
  },
  {
    id: 'vila-harmonia',
    nome: 'Vila Harmonia',
    localizacao: 'Água Verde, Curitiba',
    regiao: 'agua-verde',
    status: 'lançamento',
    preco: 'A partir de R$ 580.000',
    area: '85m² a 150m²',
    quartos: 2,
    vagas: 2,
    image: heroHouse,
    metragem: 85,
    videoUrl: '/placeholder-video-harmonia.mp4',
    descricao: 'Condomínio de casas geminadas no Água Verde. Projeto que une modernidade e tradição, com fácil acesso ao centro da cidade.',
    amenities: [
      'Praça Central', 'Playground', 'Academia ao Ar Livre', 'Pista de Caminhada',
      'Salão de Festas', 'Churrasqueira Coletiva', 'Quadra de Futsal', 'Pet Place',
      'Portaria 24h', 'Segurança Integrada', 'Jardim Zen', 'Bike Rack',
      'Espaço Kids', 'Horta Comunitária', 'Wi-Fi Praça', 'Coleta Seletiva'
    ],
    galeria: [
      '/placeholder-harmonia-1.jpg',
      '/placeholder-harmonia-2.jpg',
      '/placeholder-harmonia-3.jpg',
      '/placeholder-harmonia-4.jpg',
      '/placeholder-harmonia-5.jpg',
      '/placeholder-harmonia-6.jpg'
    ],
    implantacao: '/placeholder-implantacao-harmonia.jpg',
    localizacaoMapa: {
      lat: -25.4558,
      lng: -49.2825
    },
    casas: [
      {
        id: 'geminada-a',
        nome: 'Casa Geminada Tipo A',
        tipo: 'Geminada A',
        area: 85,
        quartos: 2,
        banheiros: 2,
        suites: 1,
        vagas: 2,
        preco: 'R$ 580.000',
        descricao: 'Casa geminada com quintal privativo e garagem para 2 carros. Ideal para famílias que buscam privacidade.',
        comodidades: [
          'Quintal Privativo', 'Garagem para 2 Carros', 'Suíte Master', 'Sala Integrada',
          'Cozinha Americana', 'Área de Serviço', 'Lavabo', 'Churrasqueira',
          'Jardim Frontal', 'Área Gourmet', 'Closet', 'Varanda'
        ],
        imagens: [
          '/placeholder-geminada-a-1.jpg',
          '/placeholder-geminada-a-2.jpg',
          '/placeholder-geminada-a-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-geminada-a.jpg'
        ],
        localizacao: {
          lat: -25.4558,
          lng: -49.2825
        }
      },
      {
        id: 'geminada-b',
        nome: 'Casa Geminada Tipo B',
        tipo: 'Geminada B',
        area: 95,
        quartos: 3,
        banheiros: 2,
        suites: 1,
        vagas: 2,
        preco: 'R$ 650.000',
        descricao: 'Casa geminada ampliada com 3 quartos. Mais espaço para famílias que crescem.',
        comodidades: [
          '3 Quartos', 'Suíte Master', 'Quintal Maior', 'Sala de Jantar',
          'Cozinha Planejada', 'Área Gourmet Ampla', 'Home Office', 'Despensa',
          'Closet', 'Lavabo', 'Área de Serviço', 'Jardim Lateral'
        ],
        imagens: [
          '/placeholder-geminada-b-1.jpg',
          '/placeholder-geminada-b-2.jpg',
          '/placeholder-geminada-b-3.jpg',
          '/placeholder-geminada-b-4.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-geminada-b.jpg'
        ],
        localizacao: {
          lat: -25.4560,
          lng: -49.2827
        }
      },
      {
        id: 'sobrado-harmonia',
        nome: 'Sobrado Premium',
        tipo: 'Sobrado',
        area: 150,
        quartos: 3,
        banheiros: 3,
        suites: 2,
        vagas: 2,
        preco: 'R$ 820.000',
        descricao: 'Sobrado com 3 quartos sendo 2 suítes. Terraço privativo e área gourmet completa.',
        comodidades: [
          '2 Suítes', 'Terraço Privativo', 'Área Gourmet Completa', 'Home Office',
          'Sala de TV', 'Cozinha Gourmet', 'Closet Duplo', 'Lavabo',
          'Quintal Amplo', 'Churrasqueira Premium', 'Despensa', 'Garagem Coberta'
        ],
        imagens: [
          '/placeholder-sobrado-harmonia-1.jpg',
          '/placeholder-sobrado-harmonia-2.jpg',
          '/placeholder-sobrado-harmonia-3.jpg',
          '/placeholder-sobrado-harmonia-4.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-sobrado-harmonia-terreo.jpg',
          '/placeholder-planta-sobrado-harmonia-superior.jpg'
        ],
        localizacao: {
          lat: -25.4562,
          lng: -49.2829
        }
      }
    ]
  },
  {
    id: 'green-park',
    nome: 'Residencial Green Park',
    localizacao: 'Portão, Curitiba',
    regiao: 'portao',
    status: 'em-obras',
    preco: 'A partir de R$ 720.000',
    area: '100m² a 180m²',
    quartos: 2,
    vagas: 2,
    image: commercialBuilding,
    metragem: 100,
    videoUrl: '/placeholder-video-green.mp4',
    descricao: 'Empreendimento sustentável no Portão com foco em qualidade de vida e sustentabilidade. Casas e sobrados com certificação verde.',
    amenities: [
      'Parque Ecológico', 'Ciclovia Interna', 'Estação de Compostagem', 'Energia Solar',
      'Captação de Água da Chuva', 'Academia Ecológica', 'Playground Natural', 'Pomar Comunitário',
      'Trilha Ecológica', 'Deck de Contemplação', 'Centro de Reciclagem', 'Horta Orgânica',
      'Espaço Yoga', 'Meditação ao Ar Livre', 'Pet Park Natural', 'Wi-Fi Sustentável'
    ],
    galeria: [
      '/placeholder-green-1.jpg',
      '/placeholder-green-2.jpg',
      '/placeholder-green-3.jpg',
      '/placeholder-green-4.jpg',
      '/placeholder-green-5.jpg',
      '/placeholder-green-6.jpg',
      '/placeholder-green-7.jpg'
    ],
    implantacao: '/placeholder-implantacao-green.jpg',
    localizacaoMapa: {
      lat: -25.4894,
      lng: -49.3384
    },
    casas: [
      {
        id: 'eco-terrea',
        nome: 'Casa Eco Térrea',
        tipo: 'Eco Térrea',
        area: 100,
        quartos: 2,
        banheiros: 2,
        suites: 1,
        vagas: 2,
        preco: 'R$ 720.000',
        descricao: 'Casa térrea sustentável com painéis solares e sistema de captação de água da chuva. Certificação LEED.',
        comodidades: [
          'Painéis Solares', 'Captação Água Chuva', 'Suíte Master', 'Cozinha Eco',
          'Jardim Permacultura', 'Aquecimento Solar', 'Iluminação LED', 'Piso Ecológico',
          'Telhado Verde', 'Composteira', 'Horta Residencial', 'Cisterna'
        ],
        imagens: [
          '/placeholder-eco-terrea-1.jpg',
          '/placeholder-eco-terrea-2.jpg',
          '/placeholder-eco-terrea-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-eco-terrea-green.jpg'
        ],
        localizacao: {
          lat: -25.4894,
          lng: -49.3384
        }
      },
      {
        id: 'casa-sustentavel',
        nome: 'Casa Sustentável 3Q',
        tipo: 'Sustentável',
        area: 130,
        quartos: 3,
        banheiros: 2,
        suites: 1,
        vagas: 2,
        preco: 'R$ 850.000',
        descricao: 'Casa de dois pavimentos com tecnologias sustentáveis avançadas. Máxima eficiência energética.',
        comodidades: [
          'Automação Sustentável', 'Ventilação Natural', 'Materiais Reciclados', 'Teto Solar',
          'Sistema Smart Grid', 'Purificador de Ar', 'Jardim Vertical', 'Home Office Eco',
          'Cozinha Sustentável', 'Banheiro Econômico', 'Closet Ecológico', 'Varanda Verde'
        ],
        imagens: [
          '/placeholder-sustentavel-1.jpg',
          '/placeholder-sustentavel-2.jpg',
          '/placeholder-sustentavel-3.jpg',
          '/placeholder-sustentavel-4.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-sustentavel-terreo.jpg',
          '/placeholder-planta-sustentavel-superior.jpg'
        ],
        localizacao: {
          lat: -25.4896,
          lng: -49.3386
        }
      },
      {
        id: 'sobrado-premium-green',
        nome: 'Sobrado Premium Eco',
        tipo: 'Sobrado Eco',
        area: 180,
        quartos: 4,
        banheiros: 3,
        suites: 2,
        vagas: 3,
        preco: 'R$ 1.050.000',
        descricao: 'Sobrado premium com máxima eficiência energética e design bioclimático. Casa do futuro disponível hoje.',
        comodidades: [
          'Design Bioclimático', 'Automação Total', 'Energia Positiva', 'Ar Purificado',
          '2 Suítes Eco', 'Terraço Jardim', 'Cozinha Inteligente', 'Home Theater Eco',
          'Spa Privativo', 'Piscina Natural', 'Adega Climatizada', 'Garagem Elétrica'
        ],
        imagens: [
          '/placeholder-sobrado-eco-1.jpg',
          '/placeholder-sobrado-eco-2.jpg',
          '/placeholder-sobrado-eco-3.jpg',
          '/placeholder-sobrado-eco-4.jpg',
          '/placeholder-sobrado-eco-5.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-sobrado-eco-terreo.jpg',
          '/placeholder-planta-sobrado-eco-superior.jpg'
        ],
        localizacao: {
          lat: -25.4898,
          lng: -49.3388
        }
      }
    ]
  },
  {
    id: 'splendore',
    nome: 'Splendore',
    localizacao: 'Santa Felicidade, Curitiba',
    regiao: 'santa-felicidade',
    status: 'lançamento',
    preco: 'A partir de R$ 520.000',
    area: '143m² a 211m²',
    quartos: 3,
    vagas: 2,
    image: splendoreHero,
    metragem: 143,
    videoUrl: '/placeholder-video-splendore.mp4',
    descricao: 'Residências exclusivas e um condomínio sem igual em Santa Felicidade. O Splendore combina design contemporâneo com acabamentos premium em um dos bairros mais charmosos de Curitiba.',
    amenities: [
      'Piscina Aquecida', 'Academia Completa', 'Espaço Gourmet', 'Salão de Festas',
      'Playground', 'Quadra Sports', 'Pet Place', 'Churrasqueira',
      'Portaria 24h', 'CFTV', 'Bike Storage', 'Jardim Zen',
      'Coworking Space', 'Kids Space', 'Sauna', 'Home Cinema'
    ],
    galeria: [
      '/placeholder-splendore-1.jpg',
      '/placeholder-splendore-2.jpg',
      '/placeholder-splendore-3.jpg',
      '/placeholder-splendore-4.jpg',
      '/placeholder-splendore-5.jpg',
      '/placeholder-splendore-6.jpg'
    ],
    implantacao: '/placeholder-implantacao-splendore.jpg',
    localizacaoMapa: {
      lat: -25.4285,
      lng: -49.3256
    },
    casas: [
      {
        id: 'splendore-1',
        nome: 'Casa Tipo 1 - 3 Quartos',
        tipo: 'Tipo 1',
        area: 143,
        quartos: 3,
        banheiros: 3,
        suites: 2,
        vagas: 2,
        preco: 'R$ 520.000',
        descricao: 'Casa com design moderno e funcional, ideal para famílias que buscam conforto e sofisticação.',
        comodidades: [
          'Suíte Master', 'Closet', 'Varanda Gourmet', 'Cozinha Integrada',
          'Sala de Estar', 'Sala de Jantar', 'Lavabo', 'Área de Serviço',
          'Jardim Privativo', 'Churrasqueira', 'Ar Condicionado', 'Garagem Coberta'
        ],
        imagens: [
          '/placeholder-splendore-casa-1.jpg',
          '/placeholder-splendore-casa-2.jpg',
          '/placeholder-splendore-casa-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-splendore-1.jpg'
        ],
        localizacao: {
          lat: -25.4285,
          lng: -49.3256
        }
      },
      {
        id: 'splendore-2',
        nome: 'Casa Tipo 2 - 3 Quartos Premium',
        tipo: 'Tipo 2',
        area: 211,
        quartos: 3,
        banheiros: 4,
        suites: 3,
        vagas: 2,
        preco: 'R$ 720.000',
        descricao: 'Casa premium com amplos espaços e acabamentos de alto padrão, perfeita para famílias exigentes.',
        comodidades: [
          '3 Suítes', 'Master com Closet', 'Varanda Gourmet', 'Cozinha Gourmet',
          'Sala de Estar Ampla', 'Sala de Jantar', 'Home Office', 'Lavabo',
          'Área Gourmet Completa', 'Jardim Paisagístico', 'Piscina Privativa', 'Sauna'
        ],
        imagens: [
          '/placeholder-splendore-premium-1.jpg',
          '/placeholder-splendore-premium-2.jpg',
          '/placeholder-splendore-premium-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-splendore-2.jpg'
        ],
        localizacao: {
          lat: -25.4287,
          lng: -49.3258
        }
      }
    ]
  },
  {
    id: 'parque-imbuias',
    nome: 'Parque das Imbuias',
    localizacao: 'Santa Felicidade, Curitiba',
    regiao: 'santa-felicidade',
    status: 'entregue',
    preco: 'A partir de R$ 680.000',
    area: '150m² a 220m²',
    quartos: 3,
    vagas: 2,
    image: parqueImbuiasHero,
    metragem: 150,
    videoUrl: '/placeholder-video-parque.mp4',
    descricao: 'Condomínio de casas em meio à natureza, próximo ao Parque das Imbuias. Perfeito para quem busca qualidade de vida, tranquilidade e contato com a natureza sem abrir mão da comodidade urbana.',
    amenities: [
      'Área Verde Preservada', 'Piscina', 'Academia', 'Quadra Poliesportiva',
      'Playground', 'Trilha Ecológica', 'Espaço Pet', 'Churrasqueira',
      'Salão de Festas', 'Portaria 24h', 'Segurança Total', 'Bike Park',
      'Bosque Nativo', 'Lago Ornamental', 'Horta Comunitária', 'Deck Contemplativo'
    ],
    galeria: [
      '/placeholder-parque-1.jpg',
      '/placeholder-parque-2.jpg',
      '/placeholder-parque-3.jpg',
      '/placeholder-parque-4.jpg',
      '/placeholder-parque-5.jpg',
      '/placeholder-parque-6.jpg'
    ],
    implantacao: '/placeholder-implantacao-parque.jpg',
    localizacaoMapa: {
      lat: -25.4195,
      lng: -49.3145
    },
    casas: [
      {
        id: 'parque-1',
        nome: 'Casa Térrea 3 Quartos',
        tipo: 'Térrea',
        area: 150,
        quartos: 3,
        banheiros: 3,
        suites: 2,
        vagas: 2,
        preco: 'R$ 680.000',
        descricao: 'Casa térrea com amplo jardim e integração com a natureza, ideal para famílias que valorizam espaço e conforto.',
        comodidades: [
          'Vista para Área Verde', '2 Suítes', 'Jardim Amplo', 'Varanda Integrada',
          'Cozinha Americana', 'Sala de Estar', 'Sala de Jantar', 'Área Gourmet',
          'Churrasqueira', 'Lavanderia', 'Garagem Coberta', 'Aquecimento Solar'
        ],
        imagens: [
          '/placeholder-parque-terrea-1.jpg',
          '/placeholder-parque-terrea-2.jpg',
          '/placeholder-parque-terrea-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-parque-terrea.jpg'
        ],
        localizacao: {
          lat: -25.4195,
          lng: -49.3145
        }
      },
      {
        id: 'parque-2',
        nome: 'Sobrado 3 Quartos',
        tipo: 'Sobrado',
        area: 220,
        quartos: 3,
        banheiros: 4,
        suites: 3,
        vagas: 3,
        preco: 'R$ 890.000',
        descricao: 'Sobrado espaçoso com 3 suítes e área gourmet completa. Design moderno e funcional para toda a família.',
        comodidades: [
          '3 Suítes', 'Master com Closet', 'Varanda Panorâmica', 'Cozinha Gourmet',
          'Sala de TV', 'Home Office', 'Lavabo', 'Área Gourmet Completa',
          'Piscina Privativa', 'Jardim Paisagístico', 'Garagem para 3 Carros', 'Adega'
        ],
        imagens: [
          '/placeholder-parque-sobrado-1.jpg',
          '/placeholder-parque-sobrado-2.jpg',
          '/placeholder-parque-sobrado-3.jpg'
        ],
        plantaBaixa: [
          '/placeholder-planta-parque-sobrado-terreo.jpg',
          '/placeholder-planta-parque-sobrado-superior.jpg'
        ],
        localizacao: {
          lat: -25.4197,
          lng: -49.3147
        }
      }
    ]
  }
];

// Função helper para buscar empreendimento por ID
export const getEmpreendimentoById = (id: string): EmpreendimentoDetalhado | undefined => {
  return empreendimentosDetalhados.find(emp => emp.id === id);
};

// Função helper para buscar casa por ID
export const getCasaById = (empreendimentoId: string, casaId: string): Casa | undefined => {
  const empreendimento = getEmpreendimentoById(empreendimentoId);
  return empreendimento?.casas.find(casa => casa.id === casaId);
};