import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingBag, 
  MessageCircle, 
  Truck, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Minus, 
  Heart,
  Check,
  Package
} from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/Toast';
import { ProductCard } from '../components/ProductCard';
import { lookupAddressByCep, calculateShippingOptions } from '../services/storeService';
import { ShimmerButton } from '../components/ui/ShimmerButton';

interface ProductDetailViewProps {
  product: Product;
  allProducts: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onNavigateToCheckout: () => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  allProducts,
  onBack,
  onSelectProduct,
  onNavigateToCheckout,
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // CEP calculator state
  const [cepInput, setCepInput] = useState('');
  const [isCalculatingCep, setIsCalculatingCep] = useState(false);
  const [shippingResult, setShippingResult] = useState<any[] | null>(null);
  const [cepError, setCepError] = useState('');

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    showToast('Adicionado à sacola!', `${quantity}x ${product.name}`, 'cart');
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onNavigateToCheckout();
  };

  const handleCalculateCep = async (e: React.FormEvent) => {
    e.preventDefault();
    setCepError('');
    setShippingResult(null);

    const cleanCep = cepInput.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      setCepError('Digite um CEP válido com 8 dígitos.');
      return;
    }

    setIsCalculatingCep(true);
    try {
      const address = await lookupAddressByCep(cleanCep);
      if (!address) {
        setCepError('CEP não encontrado pelos Correios.');
      } else {
        const options = calculateShippingOptions(address, product.weight * quantity, product.price * quantity);
        setShippingResult(options);
      }
    } catch {
      setCepError('Erro ao consultar CEP. Tente novamente.');
    } finally {
      setIsCalculatingCep(false);
    }
  };

  const images = product.images && product.images.length > 0 
    ? product.images 
    : ['/src/assets/images/vela_aromatica_manga_1794485801864.jpg'];

  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.isFeatured))
    .slice(0, 3);

  const directWhatsAppMsg = encodeURIComponent(
    `Olá Elaine! Tenho interesse no produto *${product.name}* (R$ ${product.price.toFixed(2).replace('.', ',')}) do site da Luz & Essência Artesanal. Poderia me passar mais detalhes?`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#8E6D2F] hover:text-[#1F1913] mb-8 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar ao Catálogo</span>
      </button>

      {/* PDP Split Grid (Gallery Left, Contiguous Purchase Module Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white border border-[#ECE4D6] shadow-sm relative">
            <img
              src={images[selectedImage]}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
              referrerPolicy="no-referrer"
            />
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="absolute top-4 left-4 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#8E6D2F] border border-[#ECE4D6] text-xs font-semibold px-3 py-1 rounded">
                Preço Promocional
              </span>
            )}
          </div>

          {/* Multiple thumbnails if present */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    selectedImage === idx ? 'border-[#AD8942] shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Natural Artisanal Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#ECE4D6]">
            <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-[#ECE4D6]">
              <Sparkles className="w-5 h-5 text-[#C5A059] shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-[#1F1913]">Cera 100% Vegetal</p>
                <p className="text-[11px] text-[#8E6D2F]">Queima limpa e sustentável</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-[#ECE4D6]">
              <Clock className="w-5 h-5 text-[#C5A059] shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-[#1F1913]">Duração Prolongada</p>
                <p className="text-[11px] text-[#8E6D2F]">{product.burnTime || 'Aprox. 40 horas'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-[#ECE4D6]">
              <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0" />
              <div className="text-left">
                <p className="text-xs font-semibold text-[#1F1913]">Feito em Enéas Marques</p>
                <p className="text-[11px] text-[#8E6D2F]">Artesanato paranaense</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          {/* Header & Category */}
          <div>
            <div className="flex items-center gap-2 text-xs text-[#8E6D2F] uppercase tracking-wider mb-2 font-medium">
              <span>{product.categoryLabel || 'Artesanal'}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-semibold">Em Estoque ({product.stock} un.)</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl text-[#1F1913] leading-snug">
              {product.name}
            </h1>

            {/* Price Box */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-semibold text-[#1F1913] tabular-nums">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-[#8E6D2F] line-through tabular-nums">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
              <span className="text-xs text-[#5F7461] bg-[#F4F6F4] px-2 py-0.5 rounded font-medium">
                Em até 3x sem juros
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="text-xs sm:text-sm text-[#4A3E31] leading-relaxed border-y border-[#ECE4D6] py-4">
            <p>{product.description}</p>
          </div>

          {/* Olfactory Notes Box if candle */}
          {product.scents && (
            <div className="p-4 bg-[#F4EFE6] rounded-2xl border border-[#DDD2BF] space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-[#AD8942] font-bold">
                Pirâmide Olfativa & Notas
              </p>
              <p className="text-xs text-[#2E251C] leading-relaxed">
                {product.scents}
              </p>
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#DDD2BF] rounded-xl bg-white overflow-hidden h-12">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 h-full hover:bg-[#F4EFE6] text-[#4A3E31] transition-colors cursor-pointer"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-semibold text-[#1F1913] tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 h-full hover:bg-[#F4EFE6] text-[#4A3E31] transition-colors cursor-pointer"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 h-12 px-6 bg-[#2E251C] hover:bg-[#1F1913] text-white rounded-xl text-xs font-semibold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Adicionado à Sacola!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Adicionar à Sacola</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full h-12 px-6 bg-[#C5A059] hover:bg-[#AD8942] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              Comprar Agora (Ir para Checkout)
            </button>

            {/* Direct WhatsApp Consultation */}
            <a
              href={`https://wa.me/5546920027088?text=${directWhatsAppMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2 border border-emerald-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Tirar dúvidas sobre este item no WhatsApp</span>
            </a>
          </div>

          {/* Real-time Correios Shipping Calculator */}
          <div className="p-4 bg-white rounded-2xl border border-[#ECE4D6] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1F1913]">
              <Truck className="w-4 h-4 text-[#C5A059]" />
              <span>Simular Prazo e Frete Correios</span>
            </div>

            <form onSubmit={handleCalculateCep} className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: 85630-000"
                maxLength={9}
                value={cepInput}
                onChange={(e) => setCepInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] placeholder-[#8E6D2F] focus:outline-none focus:border-[#AD8942]"
              />
              <button
                type="submit"
                disabled={isCalculatingCep}
                className="px-4 py-2 bg-[#F4EFE6] hover:bg-[#ECE4D6] text-[#2E251C] text-xs font-medium rounded-xl border border-[#DDD2BF] transition-colors cursor-pointer disabled:opacity-50"
              >
                {isCalculatingCep ? 'Calculando...' : 'Calcular'}
              </button>
            </form>

            {cepError && (
              <p className="text-[11px] text-red-600">{cepError}</p>
            )}

            {shippingResult && (
              <div className="space-y-2 pt-2 border-t border-[#F4EFE6]">
                {shippingResult.map((opt) => (
                  <div key={opt.id} className="flex items-center justify-between text-xs py-1">
                    <span className="text-[#4A3E31]">{opt.name}</span>
                    <span className="font-semibold text-[#1F1913] tabular-nums">
                      {opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Technical Specifications Accordion / Sheet */}
          <div className="space-y-2 text-xs text-[#4A3E31]">
            {product.ingredients && (
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#ECE4D6]">
                <strong className="text-[#1F1913] block mb-0.5">Ingredientes / Composição:</strong>
                <span>{product.ingredients}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#ECE4D6]">
                <strong className="text-[#1F1913] block mb-0.5">Dimensões & Peso:</strong>
                <span>{product.dimensions} • Peso aprox. para frete: {product.weight}g</span>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-12 border-t border-[#ECE4D6]">
          <h2 className="font-serif text-2xl text-[#1F1913] mb-8 text-left">
            Você também pode se encantar por:
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard
                key={rel.id}
                product={rel}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
