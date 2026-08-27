import { Artisan, Product, Review, Order } from '../types';

export const INITIAL_ARTISANS: Artisan[] = [
  {
    id: 'art-1',
    name: 'Dona Maria das Graças',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    city: 'Vale do Jequitinhonha',
    state: 'MG',
    region: 'Sudeste',
    specialty: 'Bonecas e Vasos em Barro e Cerâmica Tradicional',
    bio: 'Mestra ceramista com mais de 35 anos moldando o barro com pigmentos naturais da terra vermelha mineira. Suas peças carregam a história e a poesia do Jequitinhonha.',
    experienceYears: 36,
    rating: 4.9,
    totalSales: 420,
    badge: 'Mestra da Tradição'
  },
  {
    id: 'art-2',
    name: 'Mestre Severino do Cariri',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    city: 'Juazeiro do Norte',
    state: 'CE',
    region: 'Nordeste',
    specialty: 'Esculturas em Madeira Imburana e Xilogravura',
    bio: 'Herdeiro de gerações de escultores populares do sertão cearense, transforma troncos secos caídos em anjos barrocos, pássaros da caatinga e santos populares.',
    experienceYears: 28,
    rating: 5.0,
    totalSales: 310,
    badge: 'Arte Popular Nordestina'
  },
  {
    id: 'art-3',
    name: 'Iracema Pataxó',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    city: 'Porto Seguro',
    state: 'BA',
    region: 'Nordeste',
    specialty: 'Biojoias de Sementes da Mata Atlântica e Fibra de Piaçava',
    bio: 'Artesã indígena que extrai sementes de açaí, tento e jarina de forma sustentável, criando colares e pulseiras com saberes ancestrais de proteção e beleza.',
    experienceYears: 18,
    rating: 4.8,
    totalSales: 540,
    badge: 'Sustentabilidade Ancestral'
  },
  {
    id: 'art-4',
    name: 'Lourdes & Associação das Rendeiras',
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=400&q=80',
    city: 'Divina Pastora',
    state: 'SE',
    region: 'Nordeste',
    specialty: 'Renda Irlandesa e Bordados Finos',
    bio: 'Coletivo de mulheres que mantêm vivo o patrimônio imaterial da Renda Irlandesa, tecendo almofadas, caminhos de mesa e xales de linho puro com extrema delicadeza.',
    experienceYears: 42,
    rating: 4.9,
    totalSales: 620,
    badge: 'Patrimônio Imaterial'
  },
  {
    id: 'art-5',
    name: 'Seu Bento da Canastra',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    city: 'São Roque de Minas',
    state: 'MG',
    region: 'Sudeste',
    specialty: 'Queijo Canastra Artesanal e Doces de Tacho',
    bio: 'Produtor familiar na Serra da Canastra com maturação de queijos em cavernas de pedra natural e doces caseiros cozidos em tachos de cobre centenários.',
    experienceYears: 25,
    rating: 5.0,
    totalSales: 890,
    badge: 'Indicação Geográfica Protegida'
  },
  {
    id: 'art-6',
    name: 'Clara & Cooperativa TeceSul',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    city: 'Gramado',
    state: 'RS',
    region: 'Sul',
    specialty: 'Mantas e Xales em Tear Manual de Lã Pura',
    bio: 'Tearistas das serras gaúchas que produzem mantas quentes com tingimento orgânico feito de cascas de pinhão, eucalipto e ervas nativas.',
    experienceYears: 19,
    rating: 4.8,
    totalSales: 275,
    badge: 'Lã Orgânica Pura'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Vaso Terracota com Pintura Botânica Ancestral',
    description: 'Vaso modelado à mão em torno manual, queimado em forno a lenha e pigmentado com argilas minerais naturais do Vale do Jequitinhonha. Ideal para decoração rústica e arranjos florais secos.',
    category: 'Cerâmica & Barro',
    price: 189.00,
    originalPrice: 220.00,
    image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    artisanId: 'art-1',
    artisanName: 'Dona Maria das Graças',
    location: {
      city: 'Vale do Jequitinhonha',
      state: 'MG',
      region: 'Sudeste'
    },
    dimensions: '28cm x 16cm x 16cm (1.2kg)',
    materials: ['Argila Vermelha Natural', 'Tauá Mineral', 'Verniz de Resina Vegetal'],
    productionDays: 4,
    rating: 4.9,
    reviewCount: 24,
    featured: true,
    sustainableTag: 'Pigmentos 100% Minerais',
    createdAt: '2026-08-10T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Escultura Arara-Azul em Madeira Caída de Imburana',
    description: 'Escultura autêntica entalhada a mão com formão e navalha em madeira reaproveitada de podas e árvores caídas da Caatinga. Pintura viva com detalhes minuciosos das penas.',
    category: 'Madeira & Escultura',
    price: 245.00,
    originalPrice: 280.00,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 5,
    artisanId: 'art-2',
    artisanName: 'Mestre Severino do Cariri',
    location: {
      city: 'Juazeiro do Norte',
      state: 'CE',
      region: 'Nordeste'
    },
    dimensions: '35cm altura x 14cm largura (750g)',
    materials: ['Madeira de Imburana Recuperada', 'Cera de Abelha Nativa', 'Tinta Acrílica'],
    productionDays: 6,
    rating: 5.0,
    reviewCount: 38,
    featured: true,
    sustainableTag: 'Madeira 100% Reaproveitada',
    createdAt: '2026-08-12T14:20:00Z'
  },
  {
    id: 'prod-3',
    name: 'Caminho de Mesa em Renda Irlandesa Pura',
    description: 'Trabalho artesanal minucioso reconhecido como Patrimônio Cultural Brasileiro. Produzido com cordão de lacê e ponto relevo sobre almofada de renda.',
    category: 'Tecelagem & Renda',
    price: 320.00,
    image: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 4,
    artisanId: 'art-4',
    artisanName: 'Lourdes & Associação das Rendeiras',
    location: {
      city: 'Divina Pastora',
      state: 'SE',
      region: 'Nordeste'
    },
    dimensions: '140cm x 45cm (320g)',
    materials: ['Fio de Algodão Egípcio 100%', 'Lacê Tradicional'],
    productionDays: 14,
    rating: 4.9,
    reviewCount: 19,
    featured: true,
    sustainableTag: 'Patrimônio Imaterial IPHAN',
    createdAt: '2026-08-05T09:15:00Z'
  },
  {
    id: 'prod-4',
    name: 'Cesto Orgânico em Fibra de Buriti Trançada',
    description: 'Cesto multiuso com alças reforçadas, trançado manualmente por artesãs ribeirinhas utilizando fibra sustentável de palmeira de buriti. Leve, resistente e aromático.',
    category: 'Cestas & Fibras',
    price: 135.00,
    originalPrice: 160.00,
    image: 'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    artisanId: 'art-3',
    artisanName: 'Iracema Pataxó',
    location: {
      city: 'Porto Seguro',
      state: 'BA',
      region: 'Nordeste'
    },
    dimensions: '30cm diâmetro x 22cm altura (450g)',
    materials: ['Fibra de Buriti', 'Tingimento com Casca de Caju'],
    productionDays: 3,
    rating: 4.8,
    reviewCount: 42,
    sustainableTag: 'Manejo Extrativista Limpo',
    createdAt: '2026-08-15T11:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'Manta Alpina em Tear Manual com Lã Pura Gaúcha',
    description: 'Manta felpuda e aconchegante tecida em tear de pedal com pura lã de ovelhas criadas soltas nos campos de cima da serra. Tingimento natural à base de cascas de pinhão.',
    category: 'Tecelagem & Renda',
    price: 390.00,
    image: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 6,
    artisanId: 'art-6',
    artisanName: 'Clara & Cooperativa TeceSul',
    location: {
      city: 'Gramado',
      state: 'RS',
      region: 'Sul'
    },
    dimensions: '180cm x 130cm (1.1kg)',
    materials: ['100% Lã Natural Não-Tratada Quimicamente', 'Corante Botânico de Pinhão'],
    productionDays: 7,
    rating: 4.8,
    reviewCount: 15,
    featured: true,
    sustainableTag: 'Fibras Naturais Renováveis',
    createdAt: '2026-08-18T16:30:00Z'
  },
  {
    id: 'prod-6',
    name: 'Colar Gargantilha Ancestral com Jarina e Açaí Silvestre',
    description: 'Biojoia exclusiva montada à mão com sementes de jarina (marfim vegetal da Amazônia) polidas manualmente e entremeios de prata de baixa liga e sementes de tento vermelho.',
    category: 'Biojoias',
    price: 115.00,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 15,
    artisanId: 'art-3',
    artisanName: 'Iracema Pataxó',
    location: {
      city: 'Porto Seguro',
      state: 'BA',
      region: 'Nordeste'
    },
    dimensions: 'Ajustável de 40cm a 52cm (60g)',
    materials: ['Semente de Jarina Polida', 'Sementes de Açaí', 'Fio Encerado de Algodão'],
    productionDays: 2,
    rating: 4.9,
    reviewCount: 31,
    sustainableTag: 'Colheita Indígena Sustentável',
    createdAt: '2026-08-20T08:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'Kit Queijo Canastra Curado + Doce de Leite na Palha',
    description: 'Diretamente da fazenda na Serra da Canastra: 1 peça de queijo artesanal curado 45 dias em tábua de cedro + pote de 400g de doce de leite artesanal em tacho de cobre envolto em palha de milho.',
    category: 'Gastronomia & Doces',
    price: 148.00,
    originalPrice: 170.00,
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 18,
    artisanId: 'art-5',
    artisanName: 'Seu Bento da Canastra',
    location: {
      city: 'São Roque de Minas',
      state: 'MG',
      region: 'Sudeste'
    },
    dimensions: 'Peça de queijo ~900g + Pote 400g',
    materials: ['Leite Cru de Pasto', 'Pingo Tradicional', 'Açúcar Demerara', 'Sal Marinho'],
    productionDays: 1,
    rating: 5.0,
    reviewCount: 67,
    featured: true,
    sustainableTag: 'Selo Arte e IG Canastra',
    createdAt: '2026-08-22T13:45:00Z'
  },
  {
    id: 'prod-8',
    name: 'Conjunto de Xícaras Esmaltadas à Mão em Cerâmica Grés',
    description: 'Conjunto com 4 xícaras de café em cerâmica de alta temperatura com efeito esmalte reativo azul oceano. Seguras para lava-louças e micro-ondas.',
    category: 'Cerâmica & Barro',
    price: 165.00,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 9,
    artisanId: 'art-1',
    artisanName: 'Dona Maria das Graças',
    location: {
      city: 'Vale do Jequitinhonha',
      state: 'MG',
      region: 'Sudeste'
    },
    dimensions: '180ml cada (4 unidades)',
    materials: ['Argila Grés Queimada a 1240°C', 'Esmalte Atóxico Reativo'],
    productionDays: 5,
    rating: 4.8,
    reviewCount: 27,
    sustainableTag: 'Queima Limpa em Biogás',
    createdAt: '2026-08-23T11:20:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Camila Mendonça',
    userCity: 'Belo Horizonte, MG',
    rating: 5,
    comment: 'O vaso é uma verdadeira obra de arte! Chegou muito bem embalado com palha de milho e um bilhete afetuoso escrito à mão pela Dona Maria. A textura do barro é incrível.',
    date: '18/08/2026',
    verifiedPurchase: true,
    artisanAppreciation: 'Gratidão imensa por valorizar as mãos do nosso sertão!'
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Rodrigo Esteves',
    userCity: 'São Paulo, SP',
    rating: 5,
    comment: 'Comprei para a mesa da sala e todos os convidados perguntam a história dele. O acabamento mineral é de alto padrão.',
    date: '12/08/2026',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userName: 'Juliana Barros',
    userCity: 'Recife, PE',
    rating: 5,
    comment: 'O entalhe do Mestre Severino é de emocionar. Cada pena da arara foi trabalhada com precisão. Vale cada centavo apoiar o mestre.',
    date: '21/08/2026',
    verifiedPurchase: true,
    artisanAppreciation: 'Mestre Severino agradece de coração a confiança na arte do Cariri.'
  },
  {
    id: 'rev-4',
    productId: 'prod-3',
    userName: 'Patrícia Alvarenga',
    userCity: 'Curitiba, PR',
    rating: 5,
    comment: 'A delicadeza dessa renda irlandesa é indescritível. Não se encontra isso em lojas de departamento normais. Recomendo muito!',
    date: '14/08/2026',
    verifiedPurchase: true
  },
  {
    id: 'rev-5',
    productId: 'prod-7',
    userName: 'Fernando Siqueira',
    userCity: 'Rio de Janeiro, RJ',
    rating: 5,
    comment: 'O melhor queijo Canastra que já comi na vida! Sabor amanteigado, cura no ponto exato. O doce de leite também é surreal.',
    date: '24/08/2026',
    verifiedPurchase: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'PED-98421',
    customerName: 'Mariana Duarte',
    customerEmail: 'mariana.duarte@email.com',
    customerPhone: '(11) 98765-4321',
    shippingAddress: {
      street: 'Rua das Camélias',
      number: '342',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      cep: '01410-000'
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Vaso Terracota com Pintura Botânica Ancestral',
        productImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=400&q=80',
        price: 189.00,
        quantity: 1,
        artisanName: 'Dona Maria das Graças'
      }
    ],
    totalAmount: 213.90,
    shippingFee: 24.90,
    paymentMethod: 'PIX',
    paymentStatus: 'Aprovado',
    orderStatus: 'Em Produção/Embalagem',
    trackingCode: 'BR-ART-872910-MG',
    createdAt: '2026-08-25T14:30:00Z',
    securityEscrowGuarantee: true
  },
  {
    id: 'PED-98420',
    customerName: 'Lucas Ferreira',
    customerEmail: 'lucas.ferreira@email.com',
    customerPhone: '(21) 99123-8877',
    shippingAddress: {
      street: 'Av. Atlântica',
      number: '1250',
      neighborhood: 'Copacabana',
      city: 'Rio de Janeiro',
      state: 'RJ',
      cep: '22070-000'
    },
    items: [
      {
        productId: 'prod-7',
        productName: 'Kit Queijo Canastra Curado + Doce de Leite na Palha',
        productImage: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80',
        price: 148.00,
        quantity: 2,
        artisanName: 'Seu Bento da Canastra'
      }
    ],
    totalAmount: 325.00,
    shippingFee: 29.00,
    paymentMethod: 'Cartão de Crédito',
    paymentStatus: 'Aprovado',
    orderStatus: 'Enviado',
    trackingCode: 'BR-COR-443912-BR',
    createdAt: '2026-08-24T09:15:00Z',
    securityEscrowGuarantee: true
  }
];
