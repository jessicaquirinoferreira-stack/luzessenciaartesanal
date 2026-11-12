import React, { useState } from 'react';
import { Sliders, Save, Check, RefreshCw } from 'lucide-react';
import { SiteSettings } from '../../types';
import { saveSiteSettings } from '../../services/storeService';

interface AdminSettingsProps {
  settings: SiteSettings;
  onSettingsUpdated: (newSettings: SiteSettings) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ settings, onSettingsUpdated }) => {
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess(false);

    try {
      await saveSiteSettings(formData);
      onSettingsUpdated(formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert('Erro ao salvar configurações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl text-left">
      
      {/* Header */}
      <div className="border-b border-[#ECE4D6] pb-4">
        <h1 className="font-serif text-2xl text-[#1F1913]">Configurações da Loja & Frete</h1>
        <p className="text-xs text-[#8E6D2F] mt-0.5">
          Atualize os dados de contato oficial da Elaine, CEP de envio em Enéas Marques e regras de frete grátis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#ECE4D6] shadow-xs text-xs">
        
        {/* Contatos Oficiais */}
        <div className="space-y-4">
          <h2 className="font-serif text-base font-semibold text-[#1F1913] border-b border-[#F4EFE6] pb-2">
            Contatos Oficiais da Marca
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#4A3E31] mb-1">WhatsApp Oficial de Pedidos</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
              />
              <span className="text-[10px] text-[#8E6D2F]">Ex: 5546920027088 (com código 55 do Brasil)</span>
            </div>

            <div>
              <label className="block font-medium text-[#4A3E31] mb-1">Perfil do Instagram</label>
              <input
                type="text"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
              />
              <span className="text-[10px] text-[#8E6D2F]">Ex: @luzessenciaartesanal</span>
            </div>
          </div>
        </div>

        {/* Frete & Correios */}
        <div className="space-y-4 pt-4 border-t border-[#F4EFE6]">
          <h2 className="font-serif text-base font-semibold text-[#1F1913] border-b border-[#F4EFE6] pb-2">
            Dados de Frete dos Correios
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#4A3E31] mb-1">CEP de Origem (Ateliê)</label>
              <input
                type="text"
                value={formData.originCep}
                onChange={(e) => setFormData({ ...formData, originCep: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
              />
              <span className="text-[10px] text-[#8E6D2F]">85630-000 (Enéas Marques – Paraná)</span>
            </div>

            <div>
              <label className="block font-medium text-[#4A3E31] mb-1">Valor Mínimo para Frete Grátis (R$)</label>
              <input
                type="number"
                step="1"
                value={formData.freeShippingThreshold}
                onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
              />
              <span className="text-[10px] text-[#8E6D2F]">Ex: 199.00 (frete econômico PAC grátis acima desse valor)</span>
            </div>
          </div>
        </div>

        {/* Chave Pix da Elaine */}
        <div className="space-y-4 pt-4 border-t border-[#F4EFE6]">
          <h2 className="font-serif text-base font-semibold text-[#1F1913] border-b border-[#F4EFE6] pb-2">
            Dados para Pagamento Pix
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#4A3E31] mb-1">Chave Pix</label>
              <input
                type="text"
                value={formData.pixKey}
                onChange={(e) => setFormData({ ...formData, pixKey: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913] font-mono"
              />
            </div>

            <div>
              <label className="block font-medium text-[#4A3E31] mb-1">Tipo da Chave</label>
              <input
                type="text"
                value={formData.pixKeyType}
                onChange={(e) => setFormData({ ...formData, pixKeyType: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
              />
            </div>
          </div>
        </div>

        {/* Textos Principais da Loja */}
        <div className="space-y-4 pt-4 border-t border-[#F4EFE6]">
          <h2 className="font-serif text-base font-semibold text-[#1F1913] border-b border-[#F4EFE6] pb-2">
            Textos e Mensagens do Site
          </h2>

          <div>
            <label className="block font-medium text-[#4A3E31] mb-1">Faixa de Aviso Superior (Announcement Bar)</label>
            <input
              type="text"
              value={formData.announcement}
              onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#4A3E31] mb-1">Título Principal do Hero</label>
            <input
              type="text"
              value={formData.heroTitle}
              onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
            />
          </div>

          <div>
            <label className="block font-medium text-[#4A3E31] mb-1">Subtítulo do Hero</label>
            <textarea
              rows={2}
              value={formData.heroSubtitle}
              onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-[#1F1913]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#F4EFE6] flex items-center justify-between">
          {success ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              Configurações salvas no Firestore!
            </span>
          ) : <span />}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-[#2E251C] hover:bg-[#1F1913] text-white rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar Configurações'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
