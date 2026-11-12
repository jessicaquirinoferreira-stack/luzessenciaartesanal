export type ProductCategory = 
  | 'velas-aromaticas'
  | 'velas-santuario'
  | 'sabonetes-artesanais'
  | 'lembrancinhas'
  | 'kits-presentes'
  | 'difusores-aromas';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  category: ProductCategory;
  categoryLabel?: string;
  tags: string[];
  weight: number; // in grams
  images: string[];
  scents?: string; // aroma description / olfactory notes
  burnTime?: string; // e.g. "Aprox. 35 horas"
  ingredients?: string;
  dimensions?: string;
  isFeatured?: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
  customNote?: string;
}

export interface ShippingAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  price: number;
  estimatedDays: string;
}

export type OrderStatus = 'pendente' | 'pago' | 'enviado' | 'entregue' | 'cancelado';
export type PaymentMethod = 'pix' | 'cartao' | 'dinheiro_retirada';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  address?: ShippingAddress;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image?: string;
    note?: string;
  }[];
  subtotal: number;
  shippingCost: number;
  shippingMethod: string;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  notes?: string;
  trackingCode?: string;
  isPosSale?: boolean; // Ponto de Venda presencial
  createdAt: string;
  updatedAt?: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // e.g. 10 for 10% or 15 for R$ 15
  minOrderValue?: number;
  maxUses?: number;
  currentUses: number;
  validUntil?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CustomQuote {
  id: string;
  name: string;
  phone: string;
  email?: string;
  eventType: '15_anos' | 'casamento' | 'batizado' | 'corporativo' | 'maternidade' | 'outro';
  quantity: number;
  eventDate?: string;
  customization?: string;
  status: 'novo' | 'em_atendimento' | 'finalizado';
  createdAt: string;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  announcement: string;
  instagram: string;
  whatsapp: string;
  originCep: string;
  freeShippingThreshold: number;
  founderStoryTitle: string;
  founderStoryText: string;
  pixKey: string;
  pixKeyType: string;
}
