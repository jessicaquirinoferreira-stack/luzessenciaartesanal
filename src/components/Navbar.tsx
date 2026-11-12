import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Sparkles, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onOpenSearch: () => void;
  onOpenSommelier: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  onOpenSearch,
  onOpenSommelier,
}) => {
  const { totalItems, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Início' },
    { id: 'shop-velas-aromaticas', label: 'Velas Aromáticas', category: 'velas-aromaticas' },
    { id: 'shop-velas-santuario', label: 'Velas de Santuário', category: 'velas-santuario' },
    { id: 'shop-sabonetes', label: 'Sabonetes Artesanais', category: 'sabonetes-artesanais' },
    { id: 'lembrancinhas', label: 'Lembrancinhas 15 Anos' },
    { id: 'about', label: 'Nossa História' },
  ];

  const handleLinkClick = (link: typeof navLinks[0]) => {
    setMobileMenuOpen(false);
    if (link.id.startsWith('shop-')) {
      onNavigate('shop', { category: link.category });
    } else {
      onNavigate(link.id);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#ECE4D6] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-20">
          
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <span className="block font-serif text-2xl sm:text-3xl tracking-tight text-[#1F1913] group-hover:text-[#AD8942] transition-colors whitespace-nowrap">
                Luz & Essência
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#8E6D2F] font-medium -mt-1">
                Ateliê Artesanal • Paraná
              </span>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A3E31]">
            {navLinks.map((link) => {
              const isActive = currentView === link.id || 
                (currentView === 'shop' && link.category);
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link)}
                  className={`hover:text-[#1F1913] py-2 transition-colors relative whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive ? 'text-[#1F1913] font-semibold' : ''
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C5A059] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Search, WhatsApp, Cart Bag) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              aria-label="Buscar produtos (Ctrl+K)"
              className="flex items-center gap-2 p-2 text-[#4A3E31] hover:text-[#1F1913] hover:bg-[#F4EFE6] rounded-xl transition-colors cursor-pointer border border-transparent hover:border-[#DDD2BF]"
            >
              <Search className="w-5 h-5" />
              <span className="text-[10px] text-[#8E6D2F] bg-[#EFE9DF] px-1.5 py-0.5 rounded font-mono hidden xl:inline-block">
                ⌘K
              </span>
            </button>

            <a
              href="https://wa.me/5546920027088"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Pedir pelo WhatsApp"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2E251C] bg-[#EFE9DF] hover:bg-[#E4DACB] rounded-xl transition-colors whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>(46) 92002-7088</span>
            </a>

            {/* Shopping Bag Button with animated badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Abrir sacola com ${totalItems} itens`}
              className="relative p-2.5 text-[#1F1913] bg-[#F4EFE6] hover:bg-[#ECE4D6] rounded-xl transition-all flex items-center justify-center cursor-pointer border border-[#DDD2BF]"
            >
              <ShoppingBag className="w-5 h-5 text-[#2E251C]" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C5A059] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums shadow-sm animate-in zoom-in-75">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4A3E31] hover:text-[#1F1913] rounded-lg cursor-pointer"
              aria-label="Menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF7F2] border-b border-[#ECE4D6] px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link)}
                className="text-left py-3 px-3 rounded-xl text-base font-medium text-[#2E251C] hover:bg-[#F4EFE6] transition-colors"
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSommelier();
              }}
              className="py-3 px-3 rounded-xl text-base font-semibold text-[#AD8942] bg-[#F4EFE6] flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-[#AD8942]">
                <img
                  src="https://i.postimg.cc/fyxtWjdg/Sem-titulo.jpg"
                  alt="Elaine"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span>Sommelier IA com a Elaine</span>
            </button>

            <div className="pt-4 border-t border-[#ECE4D6] flex flex-col gap-3">
              <a
                href="https://wa.me/5546920027088"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-[#EFE9DF] text-[#2E251C] rounded-xl text-sm font-semibold"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Falar com a Elaine no WhatsApp
              </a>
              <p className="text-center text-xs text-[#8E6D2F]">
                Enéas Marques – Paraná • @luzessenciaartesanal
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
