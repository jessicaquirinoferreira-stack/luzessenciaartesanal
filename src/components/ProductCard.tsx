import React from 'react';
import { Plus, Check, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from './ui/Toast';
import { TiltCard } from './ui/TiltCard';
import { MagicCard } from './ui/MagicCard';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = React.useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    showToast('Adicionado à sacola!', product.name, 'cart');
    setTimeout(() => setJustAdded(false), 1500);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <TiltCard maxTilt={5} scale={1.015} className="h-full">
      <MagicCard
        gradientColor="#C5A059"
        gradientSize={200}
        gradientOpacity={0.08}
        onClick={() => onSelect(product)}
        className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-[#ECE4D6] hover:border-[#D8CEBE] hover:shadow-xl transition-all duration-300 cursor-pointer"
      >
        {/* Product Image Showcase */}
        <div className="relative aspect-[4/3] bg-[#F7F3ED] overflow-hidden">
          <img
            src={product.images[0] || '/src/assets/images/vela_aromatica_manga_1794485801864.jpg'}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            referrerPolicy="no-referrer"
          />

          {/* Quiet label for special batch */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-semibold text-[#8E6D2F] border border-[#ECE4D6]">
              Edição Especial
            </div>
          )}

          {/* Quick Add action button */}
          <button
            onClick={handleQuickAdd}
            aria-label={`Adicionar ${product.name} à sacola`}
            className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/95 text-[#2E251C] shadow-md hover:bg-[#C5A059] hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 cursor-pointer"
          >
            {justAdded ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>

        {/* Product Details */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
          <div>
            {/* Unboxed clean metadata with subtle separators */}
            <div className="flex items-center gap-1.5 text-xs text-[#8E6D2F] uppercase tracking-wider mb-1.5 font-medium">
              <span>{product.categoryLabel || 'Artesanal'}</span>
              {product.scents && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="truncate max-w-[130px] normal-case text-[#5F7461]">
                    {product.scents.split('.')[0].replace('Notas de Saída: ', '')}
                  </span>
                </>
              )}
            </div>

            <h3 className="font-serif text-base sm:text-lg font-medium text-[#1F1913] group-hover:text-[#AD8942] transition-colors line-clamp-1">
              {product.name}
            </h3>

            <p className="text-xs text-[#4A3E31] mt-1.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Price & Purchase Action */}
          <div className="mt-4 pt-3 border-t border-[#F4EFE6] flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-semibold text-[#1F1913] tabular-nums">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {hasDiscount && (
                <span className="text-xs text-[#8E6D2F] line-through tabular-nums">
                  R$ {product.originalPrice?.toFixed(2).replace('.', ',')}
                </span>
              )}
            </div>

            <span className="text-xs font-medium text-[#AD8942] group-hover:underline">
              Ver detalhes →
            </span>
          </div>
        </div>
      </MagicCard>
    </TiltCard>
  );
};
