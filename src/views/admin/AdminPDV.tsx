import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  Store, 
  Printer, 
  MessageCircle, 
  CheckCircle2, 
  QrCode, 
  CreditCard, 
  Banknote,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product, Order } from '../../types';
import { createOrder, generateWhatsAppOrderUrl } from '../../services/storeService';

interface AdminPDVProps {
  products: Product[];
  onOrderCompleted: () => void;
}

interface PosCartItem {
  product: Product;
  quantity: number;
}

export const AdminPDV: React.FC<AdminPDVProps> = ({ products, onOrderCompleted }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<PosCartItem[]>([]);
  const [customerName, setCustomerName] = useState('Cliente Balcão');
  const [customerPhone, setCustomerPhone] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'dinheiro_retirada'>('pix');
  const [isFinishing, setIsFinishing] = useState(false);
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Filter products for POS
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.isActive) return false;
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.slug.includes(q);
      }
      return true;
    });
  }, [products, selectedCategory, search]);

  const addToPosCart = (product: Product) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const next = [...prev];
        next[idx].quantity += 1;
        return next;
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updatePosQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(i => i.product.id !== productId));
      return;
    }
    setCart(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, [cart]);

  const total = Math.max(0, subtotal - discountAmount);

  const handleFinishPosSale = async () => {
    if (cart.length === 0) {
      alert('Adicione produtos para concluir a venda.');
      return;
    }

    setIsFinishing(true);
    try {
      const orderNumber = `PDV-${Math.floor(10000 + Math.random() * 90000)}`;

      const orderData: Omit<Order, 'id' | 'createdAt'> = {
        orderNumber,
        customerName: customerName.trim() || 'Cliente Balcão',
        customerPhone: customerPhone.trim() || 'Balcão Ateliê',
        items: cart.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
        })),
        subtotal,
        shippingCost: 0,
        shippingMethod: 'Venda Balcão Presencial',
        discount: discountAmount,
        total,
        paymentMethod,
        status: 'pago',
        isPosSale: true,
      };

      const id = await createOrder(orderData);
      const completed: Order = { ...orderData, id, createdAt: new Date().toISOString() };
      
      try {
        confetti({ particleCount: 50, spread: 50 });
      } catch {}

      setLastCompletedOrder(completed);
      setCart([]);
      setDiscountAmount(0);
      setCustomerName('Cliente Balcão');
      setCustomerPhone('');
      onOrderCompleted();

    } catch (error) {
      console.error('Error completing POS sale:', error);
      alert('Erro ao registrar venda PDV.');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center border-b border-[#ECE4D6] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#1F1913] flex items-center gap-2">
            <Store className="w-6 h-6 text-[#AD8942]" />
            <span>PDV • Ponto de Venda Presencial</span>
          </h1>
          <p className="text-xs text-[#8E6D2F] mt-0.5">
            Registro ágil de vendas em feiras, bazares e no ateliê em Enéas Marques.
          </p>
        </div>

        {lastCompletedOrder && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Última venda #{lastCompletedOrder.orderNumber} (R$ {lastCompletedOrder.total.toFixed(2)}) concluída!</span>
          </div>
        )}
      </div>

      {/* POS Grid: Product Catalog Left, POS Checkout Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Product Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search & Fast Filters */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8E6D2F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome da vela ou sabonete..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none cursor-pointer"
            >
              <option value="all">Todas Categorias</option>
              <option value="velas-aromaticas">Velas Aromáticas</option>
              <option value="velas-santuario">Velas de Santuário</option>
              <option value="sabonetes-artesanais">Sabonetes</option>
              <option value="lembrancinhas">Lembrancinhas</option>
              <option value="kits-presentes">Kits</option>
            </select>
          </div>

          {/* Product Quick-Click List */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addToPosCart(p)}
                className="p-3 bg-white rounded-xl border border-[#ECE4D6] hover:border-[#AD8942] hover:shadow-xs text-left transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="aspect-square rounded-lg overflow-hidden bg-[#FAF7F2] mb-2">
                    <img
                      src={p.images[0] || '/images/vela_aromatica_manga_1794485801864.jpg'}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-xs font-medium text-[#1F1913] line-clamp-1 leading-snug">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-[#8E6D2F]">{p.categoryLabel}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-[#F4EFE6] flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1F1913] tabular-nums">
                    R$ {p.price.toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-[10px] text-[#5F7461] bg-[#F4F6F4] px-1.5 py-0.5 rounded">
                    Estoque: {p.stock}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: POS Cart & Checkout (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-[#ECE4D6] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-3">
            <h2 className="font-serif text-base font-semibold text-[#1F1913]">
              Cupom de Venda Balcão
            </h2>
            <span className="text-xs text-[#8E6D2F] font-semibold tabular-nums">
              {cart.reduce((s, i) => s + i.quantity, 0)} itens
            </span>
          </div>

          {/* Cart Items list */}
          <div className="divide-y divide-[#F4EFE6] min-h-[160px] max-h-[220px] overflow-y-auto pr-1">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-8 text-[#8E6D2F]">
                <Store className="w-8 h-8 opacity-40 mb-2" />
                <p className="text-xs">Nenhum item adicionado ao PDV.</p>
                <p className="text-[11px] text-[#A69784]">Clique nos produtos ao lado para incluir na venda.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="min-w-0 pr-2">
                    <p className="font-medium text-[#1F1913] truncate">{item.product.name}</p>
                    <p className="text-[11px] text-[#8E6D2F]">
                      R$ {item.product.price.toFixed(2).replace('.', ',')} cada
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-[#DDD2BF] rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updatePosQty(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-[#F4EFE6] text-[#4A3E31]"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updatePosQty(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-[#F4EFE6] text-[#4A3E31]"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => updatePosQty(item.product.id, 0)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Customer info & Discount */}
          <div className="space-y-3 pt-3 border-t border-[#F4EFE6] text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-[#4A3E31] mb-1">Nome do Cliente</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#4A3E31] mb-1">WhatsApp (para recibo)</label>
                <input
                  type="text"
                  placeholder="(46) 99999-9999"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Discount field */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[#4A3E31]">Desconto Especial (R$):</span>
              <input
                type="number"
                min="0"
                step="0.50"
                value={discountAmount || ''}
                placeholder="0,00"
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                className="w-24 px-2 py-1 bg-[#FAF7F2] border border-[#DDD2BF] rounded-lg text-xs text-right font-semibold"
              />
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-[11px] font-medium text-[#4A3E31] mb-1.5">Forma de Pagamento</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer ${
                    paymentMethod === 'pix' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-[#DDD2BF]'
                  }`}
                >
                  Pix
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cartao')}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer ${
                    paymentMethod === 'cartao' ? 'border-[#AD8942] bg-[#FAF7F2] text-[#AD8942]' : 'border-[#DDD2BF]'
                  }`}
                >
                  Cartão
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('dinheiro_retirada')}
                  className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer ${
                    paymentMethod === 'dinheiro_retirada' ? 'border-amber-600 bg-amber-50 text-amber-800' : 'border-[#DDD2BF]'
                  }`}
                >
                  Dinheiro
                </button>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="pt-3 border-t border-[#ECE4D6] space-y-1.5 text-xs text-[#4A3E31]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="tabular-nums font-semibold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Desconto:</span>
                <span className="tabular-nums font-semibold">-R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-[#1F1913] pt-1 border-t border-[#F4EFE6]">
              <span>Total a Receber:</span>
              <span className="text-xl text-[#AD8942] tabular-nums">
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleFinishPosSale}
            disabled={isFinishing || cart.length === 0}
            className="w-full py-3.5 bg-[#2E251C] hover:bg-[#1F1913] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
          >
            <span>Concluir Venda Presencial</span>
          </button>

          {/* If there was a recent order with customer phone, offer WhatsApp receipt */}
          {lastCompletedOrder && lastCompletedOrder.customerPhone && lastCompletedOrder.customerPhone !== 'Balcão Ateliê' && (
            <a
              href={`https://wa.me/55${lastCompletedOrder.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`✨ Olá ${lastCompletedOrder.customerName}! Aqui está o seu comprovante da Luz & Essência Artesanal (Pedido #${lastCompletedOrder.orderNumber}) no valor de R$ ${lastCompletedOrder.total.toFixed(2)}. Muito obrigada pela preferência! 💛`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border border-emerald-200"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enviar Recibo no WhatsApp do Cliente</span>
            </a>
          )}

        </div>

      </div>

    </div>
  );
};
