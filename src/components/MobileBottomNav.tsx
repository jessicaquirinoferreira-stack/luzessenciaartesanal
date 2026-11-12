import React from 'react';
import { Home, Compass, Sparkles, ShoppingBag, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onOpenSommelier: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenSommelier,
}) => {
  const { totalItems, setIsCartOpen } = useCart();

  // Hide in checkout and admin to keep focused checkout flow
  if (currentView === 'checkout' || currentView === 'admin' || currentView === 'order-success') {
    return null;
  }

  return (
    <nav 
      aria-label="Navegação rápida móvel"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#ECE4D6] px-3 py-2 flex items-center justify-around shadow-lg"
    >
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
          currentView === 'home' ? 'text-[#AD8942]' : 'text-[#8E6D2F] hover:text-[#1F1913]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Início</span>
      </button>

      <button
        onClick={() => onNavigate('shop')}
        className={`flex flex-col items-center gap-1 p-1 text-[10px] font-medium transition-colors ${
          currentView === 'shop' ? 'text-[#AD8942]' : 'text-[#8E6D2F] hover:text-[#1F1913]'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span>Catálogo</span>
      </button>

      {/* Sommelier IA Center Button */}
      <button
        onClick={onOpenSommelier}
        className="flex flex-col items-center -mt-4 group cursor-pointer"
        aria-label="Abrir Sommelier de Aromas com IA"
      >
        <div className="w-12 h-12 rounded-full bg-[#1F1913] text-[#F5D77F] shadow-lg flex items-center justify-center border-2 border-[#C5A059] group-active:scale-95 transition-transform">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <span className="text-[9px] font-bold text-[#AD8942] mt-0.5">Sommelier IA</span>
      </button>

      {/* Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center gap-1 p-1 text-[10px] font-medium text-[#8E6D2F] hover:text-[#1F1913] transition-colors"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#C5A059] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center tabular-nums">
              {totalItems}
            </span>
          )}
        </div>
        <span>Sacola</span>
      </button>

      {/* WhatsApp Link */}
      <a
        href="https://wa.me/5546920027088"
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 p-1 text-[10px] font-medium text-emerald-700 hover:text-emerald-800 transition-colors"
      >
        <MessageCircle className="w-5 h-5" />
        <span>WhatsApp</span>
      </a>
    </nav>
  );
};
