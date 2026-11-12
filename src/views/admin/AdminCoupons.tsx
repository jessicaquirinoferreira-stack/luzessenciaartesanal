import React, { useState } from 'react';
import { Tag, Plus, Check, X, Trash2, Power, AlertCircle } from 'lucide-react';
import { Coupon } from '../../types';
import { saveCoupon } from '../../services/storeService';

interface AdminCouponsProps {
  coupons: Coupon[];
  onCouponsUpdated: () => void;
}

export const AdminCoupons: React.FC<AdminCouponsProps> = ({ coupons, onCouponsUpdated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState(10);
  const [minOrderValue, setMinOrderValue] = useState(80);
  const [maxUses, setMaxUses] = useState(100);
  const [validUntil, setValidUntil] = useState('');

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('Código do cupom é obrigatório.');
      return;
    }

    try {
      const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const newCoupon: Coupon = {
        id: `cupom_${cleanCode.toLowerCase()}`,
        code: cleanCode,
        type,
        value: Number(value),
        minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
        maxUses: maxUses ? Number(maxUses) : undefined,
        currentUses: 0,
        validUntil: validUntil || undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      await saveCoupon(newCoupon);
      setIsCreating(false);
      setCode('');
      onCouponsUpdated();
      alert(`Cupom ${cleanCode} criado com sucesso!`);
    } catch {
      alert('Erro ao salvar cupom.');
    }
  };

  const handleToggle = async (coupon: Coupon) => {
    try {
      await saveCoupon({ ...coupon, isActive: !coupon.isActive });
      onCouponsUpdated();
    } catch {
      alert('Erro ao alterar status do cupom.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE4D6] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#1F1913]">Cupons de Desconto</h1>
          <p className="text-xs text-[#8E6D2F] mt-0.5">
            Crie promoções, descontos em porcentagem (%) ou valor fixo (R$) para suas clientes.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2.5 bg-[#2E251C] hover:bg-[#1F1913] text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Cupom</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-[#ECE4D6] shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF7F2] border-b border-[#ECE4D6] text-[#8E6D2F] font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Tipo & Valor</th>
              <th className="py-3 px-4">Pedido Mínimo</th>
              <th className="py-3 px-4">Usos Realizados</th>
              <th className="py-3 px-4">Validade</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-[#FAF7F2] transition-colors">
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-mono font-bold text-sm text-[#1F1913] bg-[#F4EFE6] px-2 py-0.5 rounded border border-[#DDD2BF]">
                    {coupon.code}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap font-semibold">
                  {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `R$ ${coupon.value.toFixed(2)} OFF`}
                </td>
                <td className="py-3 px-4 whitespace-nowrap tabular-nums">
                  {coupon.minOrderValue ? `R$ ${coupon.minOrderValue.toFixed(2)}` : 'Sem mínimo'}
                </td>
                <td className="py-3 px-4 whitespace-nowrap tabular-nums">
                  {coupon.currentUses} {coupon.maxUses ? `/ ${coupon.maxUses}` : 'usos'}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {coupon.validUntil ? new Date(coupon.validUntil).toLocaleDateString('pt-BR') : 'Sem expiração'}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                    coupon.isActive ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {coupon.isActive ? 'Ativo' : 'Desativado'}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => handleToggle(coupon)}
                    className="p-1.5 text-[#8E6D2F] hover:text-[#1F1913] rounded-lg transition-colors cursor-pointer"
                    title={coupon.isActive ? 'Desativar cupom' : 'Ativar cupom'}
                  >
                    <Power className={`w-4 h-4 ${coupon.isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Coupon Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#ECE4D6] shadow-2xl space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-3">
              <h2 className="font-serif text-lg font-semibold text-[#1F1913]">Criar Cupom de Desconto</h2>
              <button onClick={() => setIsCreating(false)} className="p-1 text-[#8E6D2F] hover:text-[#1F1913]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-[#4A3E31] mb-1">Código do Cupom *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: NOVOAROMA10"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl uppercase font-mono font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">Tipo de Desconto</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl"
                  >
                    <option value="percentage">Porcentagem (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">
                    {type === 'percentage' ? 'Porcentagem (%)' : 'Valor (R$)'}
                  </label>
                  <input
                    type="number"
                    required
                    step="0.50"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">Pedido Mínimo (R$)</label>
                  <input
                    type="number"
                    value={minOrderValue}
                    onChange={(e) => setMinOrderValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-medium text-[#4A3E31] mb-1">Limite Máximo de Usos</label>
                  <input
                    type="number"
                    value={maxUses}
                    onChange={(e) => setMaxUses(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-[#4A3E31] mb-1">Data de Validade (opcional)</label>
                <input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-[#F4EFE6] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-[#DDD2BF] rounded-xl text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2E251C] text-white rounded-xl text-xs font-semibold"
                >
                  Salvar Cupom
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
