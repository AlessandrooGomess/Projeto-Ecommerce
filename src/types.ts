export interface Artisan {
  id: string;
  name: string;
  avatar: string;
  city: string;
  state: string;
  region: 'Nordeste' | 'Sudeste' | 'Sul' | 'Norte' | 'Centro-Oeste';
  specialty: string;
  bio: string;
  experienceYears: number;
  rating: number;
  totalSales: number;
  badge?: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userCity: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  artisanAppreciation?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Cerâmica & Barro' | 'Tecelagem & Renda' | 'Madeira & Escultura' | 'Cestas & Fibras' | 'Cosméticos & Saboaria' | 'Gastronomia & Doces' | 'Biojoias';
  price: number;
  originalPrice?: number;
  image: string;
  galleryImages: string[];
  stock: number;
  artisanId: string;
  artisanName: string;
  location: {
    city: string;
    state: string;
    region: 'Nordeste' | 'Sudeste' | 'Sul' | 'Norte' | 'Centro-Oeste';
  };
  dimensions?: string;
  materials: string[];
  productionDays: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  sustainableTag?: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  artisanName: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingFee: number;
  paymentMethod: 'PIX' | 'Cartão de Crédito' | 'Boleto Bancário';
  paymentStatus: 'Aprovado' | 'Pendente' | 'Processando';
  orderStatus: 'Aguardando Envio' | 'Em Produção/Embalagem' | 'Enviado' | 'Entregue';
  trackingCode?: string;
  createdAt: string;
  securityEscrowGuarantee: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'filter_region' | 'view_product' | 'view_artisan' | 'open_faq';
    payload: string;
  };
}

export interface FilterState {
  search: string;
  region: string;
  category: string;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'popular' | 'rating' | 'price_asc' | 'price_desc' | 'newest';
}
