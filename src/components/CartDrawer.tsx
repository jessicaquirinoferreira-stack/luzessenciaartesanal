import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ShimmerButton } from './ui/ShimmerButton';

interface CartDrawerProps {
  onCheckout: () => void;
  onBrowse: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout, onBrowse }) => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    items, 
    removeFromCart, 
    updateQuantity, 
    subtotal, 
    totalItems 
  } = useCart();

  if (!isCartOpen) return null;

  const FREE_SHIPPING_GOAL = 199.0;
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_GOAL) * 100);
  const remainingForFree = Math.max(0, FREE_SHIPPING_GOAL - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside aria-label="Sacola de compras" className="w-screen max-w-md bg-[#FAF7F2] shadow-2xl flex flex-col border-l border-[#ECE4D6]">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#ECE4D6] flex items-center justify-between bg-[#F4EFE6]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8E6D2F]" />
              <h2 className="font-serif text-xl font-medium text-[#1F1913]">Sua Sacola</h2>
              <span className="text-xs text-[#8E6D2F] font-medium bg-[#EFE9DF] px-2 py-0.5 rounded-full tabular-nums">
                {totalItems} {totalItems === 1 ? 'item' : 'itens'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#4A3E31] hover:text-[#1F1913] rounded-full hover:bg-[#EFE9DF] transition-colors cursor-pointer"
              aria-label="Fechar sacola"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3.5 bg-[#FAF7F2] border-b border-[#ECE4D6]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-[#4A3E31] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                {remainingForFree <= 0 ? (
                  <span className="text-emerald-700 font-semibold">Parabéns! Você ganhou Frete Grátis ✨</span>
                ) : (
                  <span>Faltam <strong>R$ {remainingForFree.toFixed(2).replace('.', ',')}</strong> para frete grátis</span>
                )}
              </span>
              <span className="text-[11px] text-[#8E6D2F] tabular-nums font-semibold">
                {progressPercent.toFixed(0)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#ECE4D6] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#C5A059] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#ECE4D6]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-full bg-[#F4EFE6] flex items-center justify-center mb-4 text-[#C5A059]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif text-lg text-[#1F1913] mb-1">Sua sacola está vazia</h3>
                <p className="text-xs text-[#8E6D2F] max-w-xs mb-6">
                  Descubra nossas velas aromáticas, sabonetes artesanais e leve mais aconchego para o seu lar.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    onBrowse();
                  }}
                  className="px-6 py-2.5 bg-[#2E251C] text-[#FAF7F2] text-xs font-medium rounded-xl hover:bg-[#1F1913] transition-colors cursor-pointer"
                >
                  Ver Catálogo de Aromas
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-4 items-start">
                  <div className="w-20 h-20 bg-[#F4EFE6] rounded-lg overflow-hidden shrink-0 border border-[#ECE4D6]">
                    <img
                      src={item.product.images[0] || '/images/vela_aromatica_manga_1794485801864.jpg'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-[#1F1913] line-clamp-1 leading-snug">
                      {item.product.name}
                    </h4>
                    {item.selectedOption && (
                      <p className="text-[11px] text-[#8E6D2F] mt-0.5">{item.selectedOption}</p>
                    )}
                    <p className="text-sm font-semibold text-[#2E251C] mt-1 tabular-nums">
                      R$ {item.product.price.toFixed(2).replace('.', ',')}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#DDD2BF] rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#F4EFE6] text-[#4A3E31] transition-colors cursor-pointer"
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-[#1F1913] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#F4EFE6] text-[#4A3E31] transition-colors cursor-pointer"
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-xs text-[#8E6D2F] hover:text-red-700 flex items-center gap-1 transition-colors cursor-pointer"
                        aria-label="Remover item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remover</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-[#F4EFE6] border-t border-[#ECE4D6] space-y-4">
              <div className="space-y-1.5 text-xs text-[#4A3E31]">
                <div className="flex justify-between items-center text-sm font-medium text-[#1F1913]">
                  <span>Subtotal</span>
                  <span className="text-base font-bold tabular-nums">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
                <p className="text-[11px] text-[#8E6D2F]">
                  Frete e cupons de desconto calculados na finalização do pedido.
                </p>
              </div>

              <ShimmerButton
                onClick={() => {
                  setIsCartOpen(false);
                  onCheckout();
                }}
                className="w-full py-3.5 text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Finalizar Pedido</span>
                <ArrowRight className="w-4 h-4" />
              </ShimmerButton>

              <p className="text-center text-[11px] text-[#8E6D2F]">
                Finalização rápida com envio direto para o WhatsApp da Elaine
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
