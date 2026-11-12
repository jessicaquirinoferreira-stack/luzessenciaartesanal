import React, { useState } from 'react';
import { Sparkles, X, Heart, MessageCircle, ArrowRight, Loader2, Check, RefreshCw, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from './ui/Toast';
import { ShimmerButton } from './ui/ShimmerButton';

interface SommelierModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

interface SommelierResponse {
  recommendedProductId: string;
  productName: string;
  elaineMessage: string;
  sensoryNotes: string;
  ritualTip: string;
}

export const SommelierModal: React.FC<SommelierModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedMood, setSelectedMood] = useState('Relaxamento & Calma');
  const [selectedSpace, setSelectedSpace] = useState('Quarto de Descanso');
  const [customText, setCustomText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<SommelierResponse | null>(null);

  const moods = [
    { label: 'Relaxamento & Calma', desc: 'Desacelerar e dormir em paz', emoji: '🌿' },
    { label: 'Foco & Produtividade', desc: 'Home office, clareza e mente desperta', emoji: '🍋' },
    { label: 'Oração, Fé & Proteção', desc: 'Momento sagrado de devoção e luz', emoji: '🕊️' },
    { label: 'Limpeza Energética', desc: 'Renovação do lar e banho purificante', emoji: '✨' },
    { label: 'Aconchego & Abraço Doce', desc: 'Noites frias, perfume aveludado', emoji: '🕯️' },
    { label: 'Lembrancinhas Festivas', desc: '15 anos, debutantes e celebrações', emoji: '👑' },
  ];

  const spaces = [
    'Quarto de Descanso',
    'Sala de Estar',
    'Lavabo / Banho Relaxante',
    'Home Office / Escritório',
    'Altar de Oração / Santuário',
    'Casa Inteira',
  ];

  const handleAskSommelier = async () => {
    setIsLoading(true);
    setRecommendation(null);

    try {
      const response = await fetch('/api/ai/sommelier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          space: selectedSpace,
          intention: customText || selectedMood,
          notes: customText,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do Sommelier');
      }

      const data: SommelierResponse = await response.json();
      setRecommendation(data);
      setStep(2);
    } catch (e) {
      console.warn('Fallback local Sommelier:', e);
      // Fallback
      setRecommendation({
        recommendedProductId: 'vela-manga-verde',
        productName: 'Vela Aromática Manga Verde & Folhas de Bambu',
        elaineMessage: 'Para esse momento especial, nada acolhe melhor do que a nossa fragrância Manga Verde. Ela traz o frescor vibrante da natureza para dentro da sua casa, renovando o ar e convidando à leveza.',
        sensoryNotes: 'Manga verde fresca, raspas de lima e folhas suaves de bambu.',
        ritualTip: 'Acenda no final da tarde, deixe a cera derreter até as bordas e sinta o aroma preencher o ambiente com tranquilidade.',
      });
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const recommendedProduct = recommendation
    ? products.find(p => p.id === recommendation.recommendedProductId || p.name.includes(recommendation.productName)) || products[0]
    : null;

  const handleAddToCart = () => {
    if (recommendedProduct) {
      addToCart(recommendedProduct, 1);
      showToast('Adicionado à sacola!', recommendedProduct.name, 'cart');
      onClose();
    }
  };

  const handleReset = () => {
    setStep(1);
    setRecommendation(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ECE4D6] overflow-hidden text-left z-10"
      >
        {/* Header */}
        <div className="bg-[#1F1913] text-[#FAF7F2] p-6 sm:p-8 flex items-start justify-between relative overflow-hidden">
          <div className="space-y-1.5 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#2E251C] text-[#D8B772] text-[10px] font-semibold uppercase tracking-widest rounded-full border border-[#3E3327]">
              <Sparkles className="w-3 h-3 text-[#D8B772]" />
              <span>Inteligência Artesanal • Ateliê Elaine</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white">
              Sommelier de Aromas & Essências
            </h2>
            <p className="text-xs text-[#DDD2BF] max-w-md">
              Conte o que você deseja sentir e a Elaine recomendará a fragrância perfeita para o seu refúgio.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#DDD2BF] hover:text-white rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer relative z-10"
            aria-label="Fechar Sommelier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto text-xs">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#1F1913] mb-2">
                  1. Qual energia você deseja despertar hoje?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {moods.map((m) => {
                    const isSelected = selectedMood === m.label;
                    return (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => setSelectedMood(m.label)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-[#AD8942] bg-[#FAF7F2] shadow-xs ring-1 ring-[#AD8942]'
                            : 'border-[#DDD2BF] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <span className="text-lg">{m.emoji}</span>
                        <div>
                          <p className="font-semibold text-[#1F1913]">{m.label}</p>
                          <p className="text-[11px] text-[#8E6D2F]">{m.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1913] mb-2">
                  2. Para qual cantinho do seu lar?
                </label>
                <div className="flex flex-wrap gap-2">
                  {spaces.map((sp) => {
                    const isSelected = selectedSpace === sp;
                    return (
                      <button
                        key={sp}
                        type="button"
                        onClick={() => setSelectedSpace(sp)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#2E251C] text-white border-[#2E251C]'
                            : 'bg-white text-[#4A3E31] border-[#DDD2BF] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {sp}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F1913] mb-1">
                  Deseja contar algum detalhe a mais para a Elaine? (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Tive uma semana muito cansativa e preciso relaxar com um bom livro..."
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                />
              </div>

              <div className="pt-3 border-t border-[#F4EFE6] flex justify-end">
                <ShimmerButton
                  onClick={handleAskSommelier}
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#F5D77F]" />
                      <span>Consultando a Elaine com IA...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#F5D77F]" />
                      <span>Descobrir Minha Essência Ideal</span>
                    </>
                  )}
                </ShimmerButton>
              </div>
            </div>
          )}

          {step === 2 && recommendation && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              {/* Elaine's Personal Message */}
              <div className="p-5 bg-[#FAF7F2] rounded-3xl border border-[#DDD2BF] space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://i.postimg.cc/fyxtWjdg/Sem-titulo.jpg"
                    alt="Elaine"
                    className="w-10 h-10 rounded-full object-cover border border-[#AD8942] shrink-0"
                  />
                  <div>
                    <p className="font-serif text-sm font-semibold text-[#1F1913]">
                      Mensagem da Elaine
                    </p>
                    <p className="text-[10px] text-[#8E6D2F]">
                      Fundadora & Artesã • Enéas Marques – PR
                    </p>
                  </div>
                </div>

                <p className="text-xs text-[#2E251C] italic leading-relaxed">
                  "{recommendation.elaineMessage}"
                </p>

                <div className="pt-2 border-t border-[#ECE4D6] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <strong className="text-[#1F1913] block">Notas Sensoriais:</strong>
                    <span className="text-[#4A3E31]">{recommendation.sensoryNotes}</span>
                  </div>
                  <div>
                    <strong className="text-[#1F1913] block">Dica de Ritual:</strong>
                    <span className="text-[#4A3E31]">{recommendation.ritualTip}</span>
                  </div>
                </div>
              </div>

              {/* Recommended Product Card */}
              {recommendedProduct && (
                <div className="p-4 bg-white rounded-2xl border border-[#ECE4D6] shadow-sm flex flex-col sm:flex-row items-center gap-4">
                  <img
                    src={recommendedProduct.images[0] || '/images/vela_aromatica_manga_1794485801864.jpg'}
                    alt={recommendedProduct.name}
                    className="w-24 h-24 rounded-xl object-cover bg-[#FAF7F2] shrink-0"
                  />
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-[#AD8942] font-semibold">
                      {recommendedProduct.categoryLabel}
                    </p>
                    <h3 className="font-serif text-base font-semibold text-[#1F1913]">
                      {recommendedProduct.name}
                    </h3>
                    <p className="text-xs font-bold text-[#1F1913] mt-1 tabular-nums">
                      R$ {recommendedProduct.price.toFixed(2).replace('.', ',')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 w-full sm:w-auto">
                    <button
                      onClick={handleAddToCart}
                      className="px-4 py-2 bg-[#2E251C] hover:bg-[#1F1913] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Adicionar à Sacola</span>
                    </button>
                    <button
                      onClick={() => {
                        onSelectProduct(recommendedProduct);
                        onClose();
                      }}
                      className="px-4 py-2 border border-[#DDD2BF] hover:bg-[#FAF7F2] text-[#4A3E31] rounded-xl text-xs font-medium cursor-pointer"
                    >
                      Ver Detalhes
                    </button>
                  </div>
                </div>
              )}

              {/* Retry / Reset Button */}
              <div className="pt-2 flex justify-between items-center text-xs">
                <button
                  onClick={handleReset}
                  className="text-[#8E6D2F] hover:text-[#1F1913] flex items-center gap-1.5 cursor-pointer font-medium"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Escolher outra sensação</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#F4EFE6] hover:bg-[#ECE4D6] text-[#2E251C] rounded-xl font-medium cursor-pointer"
                >
                  Continuar Navegando
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
