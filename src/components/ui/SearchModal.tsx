import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl+K / Cmd+K to open/close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = query.trim()
    ? products.filter(p => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.scents?.toLowerCase().includes(q) ||
          p.categoryLabel?.toLowerCase().includes(q)
        );
      })
    : products.slice(0, 4); // suggestions when empty

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-[#ECE4D6] overflow-hidden text-left z-10"
      >
        {/* Search Header Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#ECE4D6] bg-[#FAF7F2]">
          <Search className="w-5 h-5 text-[#8E6D2F] shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Buscar por aroma, vela, sabonete ou santuário..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#1F1913] placeholder-[#8E6D2F] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#8E6D2F] hover:text-[#1F1913]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] bg-[#EFE9DF] text-[#8E6D2F] px-2 py-0.5 rounded font-mono hidden sm:inline-block">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 divide-y divide-[#F4EFE6]">
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#AD8942]">
            {query.trim() ? `Resultados da busca (${filtered.length})` : 'Sugestões mais amadas do ateliê'}
          </div>

          {filtered.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#8E6D2F]">
              Nenhum produto encontrado para "{query}".
            </div>
          ) : (
            filtered.map((prod) => (
              <button
                key={prod.id}
                onClick={() => {
                  onSelectProduct(prod);
                  onClose();
                }}
                className="w-full py-3 px-3 rounded-2xl hover:bg-[#FAF7F2] transition-colors flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <img
                    src={prod.images[0] || '/src/assets/images/vela_aromatica_manga_1794485801864.jpg'}
                    alt=""
                    className="w-12 h-12 rounded-xl object-cover bg-[#F4EFE6] shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1F1913] group-hover:text-[#AD8942] transition-colors truncate">
                      {prod.name}
                    </p>
                    <p className="text-[11px] text-[#8E6D2F] truncate">
                      {prod.categoryLabel} {prod.scents ? `• ${prod.scents.split('.')[0]}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-[#1F1913] tabular-nums">
                    R$ {prod.price.toFixed(2).replace('.', ',')}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#8E6D2F] group-hover:translate-x-1 group-hover:text-[#1F1913] transition-all" />
                </div>
              </button>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
