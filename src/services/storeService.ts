import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Order, Coupon, CustomQuote, SiteSettings, ShippingOption, ShippingAddress } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_SETTINGS } from '../data/initialData';

const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const COUPONS_COL = 'coupons';
const QUOTES_COL = 'custom_quotes';
const SETTINGS_DOC = 'site_settings/general';

// Products API
export async function getProducts(): Promise<Product[]> {
  try {
    const colRef = collection(db, PRODUCTS_COL);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      // Seed default products on first load
      console.log('Seeding initial products into Firestore...');
      const seeded: Product[] = [];
      for (const prod of INITIAL_PRODUCTS) {
        try {
          await setDoc(doc(db, PRODUCTS_COL, prod.id), prod);
          seeded.push(prod);
        } catch (e) {
          console.warn('Could not seed product to remote db, using memory fallback:', e);
          seeded.push(prod);
        }
      }
      return seeded.length > 0 ? seeded : INITIAL_PRODUCTS;
    }

    const products: Product[] = [];
    snapshot.forEach(docSnap => {
      products.push({ id: docSnap.id, ...docSnap.data() } as Product);
    });
    return products;
  } catch (error) {
    console.warn('Falling back to initial product dataset due to error:', error);
    return INITIAL_PRODUCTS;
  }
}

export async function saveProduct(product: Partial<Product> & { name: string; price: number; category: any }): Promise<string> {
  try {
    const id = product.id || `prod_${Date.now()}`;
    const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const docRef = doc(db, PRODUCTS_COL, id);
    const data: Product = {
      id,
      name: product.name,
      slug,
      description: product.description || '',
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
      stock: Number(product.stock ?? 10),
      category: product.category,
      categoryLabel: product.categoryLabel,
      tags: product.tags || [],
      weight: Number(product.weight ?? 350),
      images: product.images && product.images.length > 0 ? product.images : ['/src/assets/images/vela_aromatica_manga_1794485801864.jpg'],
      scents: product.scents || '',
      burnTime: product.burnTime || '',
      ingredients: product.ingredients || '',
      dimensions: product.dimensions || '',
      isFeatured: Boolean(product.isFeatured),
      isActive: product.isActive ?? true,
      updatedAt: new Date().toISOString(),
    };
    await setDoc(docRef, data, { merge: true });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COL);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COL, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COL}/${id}`);
  }
}

// Orders API
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
  try {
    const colRef = collection(db, ORDERS_COL);
    const newDoc = await addDoc(colRef, {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return newDoc.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ORDERS_COL);
  }
}

export async function getOrders(): Promise<Order[]> {
  try {
    const colRef = collection(db, ORDERS_COL);
    const snapshot = await getDocs(colRef);
    const orders: Order[] = [];
    snapshot.forEach(docSnap => {
      orders.push({ id: docSnap.id, ...docSnap.data() } as Order);
    });
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Could not fetch orders:', error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status'], trackingCode?: string): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COL, orderId);
    const updates: any = { status, updatedAt: new Date().toISOString() };
    if (trackingCode !== undefined) updates.trackingCode = trackingCode;
    await updateDoc(docRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COL}/${orderId}`);
  }
}

// Coupons API
export async function getCoupons(): Promise<Coupon[]> {
  try {
    const colRef = collection(db, COUPONS_COL);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      // Seed default coupons
      for (const c of INITIAL_COUPONS) {
        await setDoc(doc(db, COUPONS_COL, c.id), c);
      }
      return INITIAL_COUPONS;
    }
    const coupons: Coupon[] = [];
    snapshot.forEach(docSnap => {
      coupons.push({ id: docSnap.id, ...docSnap.data() } as Coupon);
    });
    return coupons;
  } catch (error) {
    console.warn('Fallback to initial coupons:', error);
    return INITIAL_COUPONS;
  }
}

export async function validateCoupon(code: string, currentSubtotal: number): Promise<{ valid: boolean; coupon?: Coupon; message?: string }> {
  const cleanCode = code.trim().toUpperCase();
  const coupons = await getCoupons();
  const found = coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);

  if (!found) {
    return { valid: false, message: 'Cupom não encontrado ou inativo.' };
  }

  if (found.validUntil && new Date(found.validUntil) < new Date()) {
    return { valid: false, message: 'Este cupom já expirou.' };
  }

  if (found.maxUses && found.currentUses >= found.maxUses) {
    return { valid: false, message: 'Este cupom atingiu o limite de utilizações.' };
  }

  if (found.minOrderValue && currentSubtotal < found.minOrderValue) {
    return { 
      valid: false, 
      message: `Valor mínimo para este cupom é R$ ${found.minOrderValue.toFixed(2).replace('.', ',')}.` 
    };
  }

  return { valid: true, coupon: found };
}

export async function saveCoupon(coupon: Coupon): Promise<void> {
  try {
    await setDoc(doc(db, COUPONS_COL, coupon.id), coupon, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COUPONS_COL);
  }
}

// Custom Quotes API (Lembrancinhas 15 Anos / Casamentos)
export async function createCustomQuote(quote: Omit<CustomQuote, 'id' | 'createdAt' | 'status'>): Promise<string> {
  try {
    const colRef = collection(db, QUOTES_COL);
    const newDoc = await addDoc(colRef, {
      ...quote,
      status: 'novo',
      createdAt: new Date().toISOString(),
    });
    return newDoc.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, QUOTES_COL);
  }
}

export async function getCustomQuotes(): Promise<CustomQuote[]> {
  try {
    const colRef = collection(db, QUOTES_COL);
    const snapshot = await getDocs(colRef);
    const quotes: CustomQuote[] = [];
    snapshot.forEach(docSnap => {
      quotes.push({ id: docSnap.id, ...docSnap.data() } as CustomQuote);
    });
    return quotes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.warn('Could not fetch quotes:', error);
    return [];
  }
}

// Site Settings API
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docRef = doc(db, SETTINGS_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as SiteSettings;
    } else {
      await setDoc(docRef, INITIAL_SETTINGS);
      return INITIAL_SETTINGS;
    }
  } catch (e) {
    return INITIAL_SETTINGS;
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_DOC);
    await setDoc(docRef, settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, SETTINGS_DOC);
  }
}

// Shipping & CEP API (ViaCEP + Correios quotation calculation)
export async function lookupAddressByCep(rawCep: string): Promise<ShippingAddress | null> {
  const cleanCep = rawCep.replace(/\D/g, '');
  if (cleanCep.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;

    return {
      cep: cleanCep.replace(/(\d{5})(\d{3})/, '$1-$2'),
      street: data.logradouro || '',
      number: '',
      complement: data.complemento || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
    };
  } catch (e) {
    console.error('Error fetching CEP:', e);
    return null;
  }
}

export function calculateShippingOptions(
  address: ShippingAddress, 
  totalWeightGrams: number, 
  subtotal: number,
  freeShippingThreshold = 199.0
): ShippingOption[] {
  const isEnéasMarques = address.city.toLowerCase().includes('enéas marques') || address.cep.startsWith('85630');
  const isParana = address.state.toUpperCase() === 'PR';
  const isFreeEligible = subtotal >= freeShippingThreshold;

  // Base pricing based on weight and distance tier
  const weightKg = Math.max(0.3, totalWeightGrams / 1000);
  const extraWeightFee = (weightKg - 0.3) * 6.5;

  let pacPrice = isParana ? 19.90 : 28.50;
  pacPrice = Math.round((pacPrice + extraWeightFee) * 100) / 100;

  let sedexPrice = isParana ? 32.00 : 49.90;
  sedexPrice = Math.round((sedexPrice + extraWeightFee * 1.5) * 100) / 100;

  const options: ShippingOption[] = [];

  // PAC option
  options.push({
    id: 'pac',
    name: isFreeEligible ? 'PAC dos Correios (Frete Grátis)' : 'PAC dos Correios Econômico',
    carrier: 'Correios',
    price: isFreeEligible ? 0 : pacPrice,
    estimatedDays: isParana ? '3 a 6 dias úteis' : '6 a 11 dias úteis',
  });

  // SEDEX option
  options.push({
    id: 'sedex',
    name: 'SEDEX dos Correios Expresso',
    carrier: 'Correios',
    price: sedexPrice,
    estimatedDays: isParana ? '1 a 2 dias úteis' : '2 a 4 dias úteis',
  });

  // Retirada no Ateliê (free for local or anywhere)
  options.push({
    id: 'retirada',
    name: 'Retirada no Ateliê em Enéas Marques - PR',
    carrier: 'Ateliê Luz & Essência',
    price: 0,
    estimatedDays: 'Disponível em 24h após confirmação',
  });

  return options;
}

// Generate formatted WhatsApp message URL for order completion
export function generateWhatsAppOrderUrl(order: Order, phone = '5546920027088'): string {
  const itemsText = order.items
    .map(i => `• *${i.quantity}x* ${i.productName} — R$ ${(i.price * i.quantity).toFixed(2).replace('.', ',')}${i.note ? ` _(${i.note})_` : ''}`)
    .join('\n');

  const addressText = order.address 
    ? `${order.address.street}, ${order.address.number}${order.address.complement ? ` - ${order.address.complement}` : ''}\n` +
      `Bairro: ${order.address.neighborhood}\n` +
      `Cidade: ${order.address.city} - ${order.address.state} • CEP: ${order.address.cep}`
    : 'Retirada presencial no ateliê';

  const paymentLabel = {
    pix: 'Pix (com confirmação rápida)',
    cartao: 'Cartão de Crédito',
    dinheiro_retirada: 'Dinheiro / Pagamento na Entrega',
  }[order.paymentMethod] || order.paymentMethod;

  const message = `✨ *NOVO PEDIDO - LUZ & ESSÊNCIA ARTESANAL* ✨\n` +
    `Olá Elaine! Acabei de fazer um pedido pelo site.\n\n` +
    `📋 *Pedido:* #${order.orderNumber}\n` +
    `👤 *Cliente:* ${order.customerName}\n` +
    `📱 *WhatsApp:* ${order.customerPhone}\n` +
    (order.customerEmail ? `✉️ *E-mail:* ${order.customerEmail}\n\n` : '\n') +
    `📍 *Endereço de Entrega:*\n${addressText}\n\n` +
    `🕯️ *Itens Escolhidos:*\n${itemsText}\n\n` +
    `📦 *Frete:* ${order.shippingMethod} (R$ ${order.shippingCost.toFixed(2).replace('.', ',')})\n` +
    (order.discount > 0 ? `🎟️ *Desconto (${order.couponCode || 'Cupom'}):* -R$ ${order.discount.toFixed(2).replace('.', ',')}\n` : '') +
    `💰 *Subtotal:* R$ ${order.subtotal.toFixed(2).replace('.', ',')}\n` +
    `🌟 *VALOR TOTAL:* R$ ${order.total.toFixed(2).replace('.', ',')}\n\n` +
    `💳 *Forma de Pagamento:* ${paymentLabel}\n` +
    (order.notes ? `📝 *Observações:* ${order.notes}\n\n` : '\n') +
    `Aguardando suas instruções para envio. Muito obrigada pelo carinho! 💛`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
