import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { saveProduct, deleteProduct } from '../../services/storeService';

interface AdminProductsProps {
  products: Product[];
  onProductsUpdated: () => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({ products, onProductsUpdated }) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const brandImagePresets = [
    { label: 'Vela Manga Verde (Travertino)', url: '/src/assets/images/vela_aromatica_manga_1794485801864.jpg' },
    { label: 'Vela Santuário Maria (Ouro & Azul)', url: '/src/assets/images/vela_santuario_maria_1794485802727.jpg' },
    { label: 'Sabonete Alecrim & Sal Grosso', url: '/src/assets/images/sabonete_alecrim_sal_1794485803465.jpg' },
    { label: 'Lembrancinhas 15 Anos Rosé & Coroa', url: '/src/assets/images/lembrancinhas_festa_1794485803571.jpg' },
    { label: 'Ateliê / Velas Aconchego', url: '/src/assets/images/hero_luz_essencia_1794485802025.jpg' },
  ];

  const filtered = products.filter(p => {
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.slug.includes(q);
    }
    return true;
  });

  const handleOpenNew = () => {
    setEditingProduct({
      name: '',
      slug: '',
      description: '',
      price: 68.0,
      originalPrice: undefined,
      stock: 15,
      category: 'velas-aromaticas',
      categoryLabel: 'Velas Aromáticas',
      tags: ['Artesanal'],
      weight: 380,
      images: ['/src/assets/images/vela_aromatica_manga_1794485801864.jpg'],
      scents: 'Notas de Saída: ... Notas de Corpo: ...',
      burnTime: 'Aprox. 40 horas',
      ingredients: 'Cera 100% vegetal de coco, essência premium, pavio de algodão.',
      dimensions: '8cm x 8,5cm • 190g',
      isFeatured: false,
      isActive: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) {
      alert('Nome e preço são obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
      await saveProduct(editingProduct as any);
      setEditingProduct(null);
      onProductsUpdated();
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Erro ao salvar produto.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja remover o produto "${name}"?`)) return;
    try {
      await deleteProduct(id);
      onProductsUpdated();
    } catch {
      alert('Erro ao excluir produto.');
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      await saveProduct({ ...product, isActive: !product.isActive });
      onProductsUpdated();
    } catch {
      alert('Erro ao atualizar status.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE4D6] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#1F1913]">Gestão do Catálogo de Produtos</h1>
          <p className="text-xs text-[#8E6D2F] mt-0.5">
            Cadastre novas velas, sabonetes artesanais, altere preços e controle estoques.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="px-4 py-2.5 bg-[#2E251C] hover:bg-[#1F1913] text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Novo Produto</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8E6D2F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome do produto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className="px-3 py-2 bg-white border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none cursor-pointer"
        >
          <option value="all">Todas as Categorias</option>
          <option value="velas-aromaticas">Velas Aromáticas</option>
          <option value="velas-santuario">Velas de Santuário</option>
          <option value="sabonetes-artesanais">Sabonetes Feitos à Mão</option>
          <option value="lembrancinhas">Lembrancinhas</option>
          <option value="kits-presentes">Kits & Presentes</option>
          <option value="difusores-aromas">Difusores & Aromas</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-[#ECE4D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#ECE4D6] text-[#8E6D2F] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Preço (R$)</th>
                <th className="py-3 px-4">Estoque</th>
                <th className="py-3 px-4">Peso Frete</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={prod.images[0] || '/src/assets/images/vela_aromatica_manga_1794485801864.jpg'}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-[#F4EFE6] shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-[#1F1913] truncate max-w-xs">{prod.name}</p>
                      <p className="text-[10px] text-[#8E6D2F] truncate">/{prod.slug}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {prod.categoryLabel || prod.category}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-semibold tabular-nums text-[#1F1913]">
                    R$ {prod.price.toFixed(2).replace('.', ',')}
                    {prod.originalPrice && (
                      <span className="text-[10px] text-[#8E6D2F] line-through block font-normal">
                        R$ {prod.originalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums ${
                      prod.stock <= 5 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
                    }`}>
                      {prod.stock} un.
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap tabular-nums">
                    {prod.weight}g
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(prod)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        prod.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {prod.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{prod.isActive ? 'Ativo na Loja' : 'Pausado'}</span>
                    </button>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => setEditingProduct(prod)}
                      className="p-1.5 text-[#8E6D2F] hover:text-[#1F1913] hover:bg-[#F4EFE6] rounded-lg transition-colors cursor-pointer"
                      title="Editar produto"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.id, prod.name)}
                      className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir produto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#ECE4D6] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-3">
              <h2 className="font-serif text-xl font-semibold text-[#1F1913]">
                {editingProduct.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 text-[#8E6D2F] hover:text-[#1F1913]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-medium text-[#4A3E31] mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
                    setEditingProduct({ ...editingProduct, name, slug });
                  }}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">Categoria *</label>
                  <select
                    value={editingProduct.category || 'velas-aromaticas'}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const labels: Record<string, string> = {
                        'velas-aromaticas': 'Velas Aromáticas',
                        'velas-santuario': 'Velas de Santuário',
                        'sabonetes-artesanais': 'Sabonetes Feitos à Mão',
                        'lembrancinhas': 'Lembrancinhas',
                        'kits-presentes': 'Kits & Presentes',
                        'difusores-aromas': 'Difusores & Aromas',
                      };
                      setEditingProduct({
                        ...editingProduct,
                        category: cat,
                        categoryLabel: labels[cat],
                      });
                    }}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
                  >
                    <option value="velas-aromaticas">Velas Aromáticas</option>
                    <option value="velas-santuario">Velas de Santuário</option>
                    <option value="sabonetes-artesanais">Sabonetes Feitos à Mão</option>
                    <option value="lembrancinhas">Lembrancinhas</option>
                    <option value="kits-presentes">Kits & Presentes</option>
                    <option value="difusores-aromas">Difusores & Aromas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">Slug URL</label>
                  <input
                    type="text"
                    value={editingProduct.slug || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913] font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">Preço Original (opcional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.originalPrice ?? ''}
                    placeholder="Sem desconto"
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">Estoque Disponível *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#4A3E31] mb-1">Descrição Completa</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">Pirâmide Olfativa / Aroma</label>
                  <input
                    type="text"
                    placeholder="Ex: Notas de Saída: Manga Verde..."
                    value={editingProduct.scents || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, scents: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">Peso p/ Frete Correios (gramas)</label>
                  <input
                    type="number"
                    placeholder="Ex: 380"
                    value={editingProduct.weight ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, weight: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
                  />
                </div>
              </div>

              {/* Photo Preset Selection & Custom URL */}
              <div>
                <label className="block font-medium text-[#4A3E31] mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-[#AD8942]" />
                  <span>Foto Principal do Produto (Selecione um Preset ou Cole a URL do Vercel Blob):</span>
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  {brandImagePresets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, images: [preset.url] })}
                      className={`p-1.5 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                        editingProduct.images?.[0] === preset.url ? 'border-[#AD8942] bg-[#FAF7F2]' : 'border-[#DDD2BF]'
                      }`}
                    >
                      <img src={preset.url} alt="" className="w-8 h-8 rounded object-cover" />
                      <span className="text-[10px] font-medium truncate">{preset.label}</span>
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Ou cole a URL da imagem (Vercel Blob Storage ou arquivo local)"
                  value={editingProduct.images?.[0] || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
                />
              </div>

              {/* Checkboxes for featured and active */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isFeatured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded text-[#AD8942]"
                  />
                  <span className="text-xs font-medium text-[#1F1913]">Destacar na Página Inicial</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                    className="rounded text-[#AD8942]"
                  />
                  <span className="text-xs font-medium text-[#1F1913]">Disponível para Compra (Ativo)</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#F4EFE6] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 border border-[#DDD2BF] rounded-xl text-xs text-[#4A3E31] hover:bg-[#FAF7F2] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-[#2E251C] hover:bg-[#1F1913] text-white rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Produto'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
