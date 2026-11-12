import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, SlidersHorizontal, X } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopViewProps {
  products: Product[];
  initialCategory?: ProductCategory | 'all';
  onSelectProduct: (product: Product) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({ 
  products, 
  initialCategory = 'all', 
  onSelectProduct 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Todos os Produtos' },
    { id: 'velas-aromaticas', label: 'Velas Aromáticas' },
    { id: 'velas-santuario', label: 'Velas de Santuário' },
    { id: 'sabonetes-artesanais', label: 'Sabonetes Feitos à Mão' },
    { id: 'lembrancinhas', label: 'Lembrancinhas' },
    { id: 'kits-presentes', label: 'Kits & Presentes' },
    { id: 'difusores-aromas', label: 'Difusores' },
  ];

  // Extract all unique tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => p.tags?.forEach(t => set.add(t)));
    return Array.from(set);
  }, [products]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        if (!p.isActive) return false;
        if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
        if (selectedTag && !p.tags?.includes(selectedTag)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchScents = p.scents?.toLowerCase().includes(q);
          return matchName || matchDesc || matchScents;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, selectedTag, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-8">
      
      {/* Editorial Page Header */}
      <div className="text-left max-w-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold mb-2">
          Ateliê Luz & Essência
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1913]">
          Catálogo Artesanal Completo
        </h1>
        <p className="text-xs sm:text-sm text-[#4A3E31] mt-2 leading-relaxed">
          Peças moldadas uma a uma com cera 100% vegetal, essências nobres e sabonetes saponificados a frio. Selecione sua categoria ou aroma preferido.
        </p>
      </div>

      {/* Controls Bar: Search & Sort */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#8E6D2F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por aroma, ingrediente ou vela..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] placeholder-[#8E6D2F] focus:outline-none focus:border-[#AD8942] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E6D2F] hover:text-[#1F1913] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#8E6D2F] font-medium whitespace-nowrap">Ordenar por:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-[#DDD2BF] rounded-xl py-2 px-3 text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942] cursor-pointer"
          >
            <option value="featured">Destaques do Ateliê</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="name">Nome (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Category Segmented Tabs (Functional Buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setSelectedTag(null);
              }}
              className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2E251C] text-white shadow-sm'
                  : 'bg-white text-[#4A3E31] hover:bg-[#F4EFE6] border border-[#DDD2BF]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Active filters & Tags */}
      {allTags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-[#4A3E31]">
          <span className="text-[#8E6D2F] font-medium">Filtrar por estilo:</span>
          {allTags.map((tag) => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isTagActive ? null : tag)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                  isTagActive
                    ? 'bg-[#C5A059] text-white font-medium'
                    : 'bg-[#F4EFE6] text-[#4A3E31] hover:bg-[#ECE4D6]'
                }`}
              >
                {tag}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-[#8E6D2F] hover:text-[#1F1913] underline text-xs ml-2 cursor-pointer"
            >
              Limpar filtro
            </button>
          )}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-[#ECE4D6] p-8">
          <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-[#DDD2BF] flex items-center justify-center mx-auto mb-4 text-[#C5A059]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg text-[#1F1913] mb-1">Nenhum produto encontrado</h3>
          <p className="text-xs text-[#8E6D2F] max-w-sm mx-auto mb-6">
            Não encontramos produtos correspondentes ao seu filtro. Tente buscar por outros termos ou redefinir as categorias.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag(null);
              setSearchQuery('');
            }}
            className="px-5 py-2.5 bg-[#2E251C] text-white rounded-xl text-xs font-medium hover:bg-[#1F1913] transition-colors cursor-pointer"
          >
            Ver todos os produtos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      )}

    </div>
  );
};
