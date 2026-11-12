import React from 'react';
import { Instagram, MessageCircle, MapPin, Sparkles, Heart, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#1F1913] text-[#FAF7F2] border-t border-[#3E3327]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-[#FAF7F2] tracking-tight">
              Luz & Essência
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#D8B772] font-medium -mt-2">
              Ateliê de Velas & Sabonetes
            </p>
            <p className="text-xs text-[#DDD2BF] leading-relaxed">
              Velas aromáticas artesanais • Sabonetes feitos a mão • Aromas para deixar seus ambientes com aquele cheirinho de aconchego. Cada produto é criado artesanalmente pela Elaine em Enéas Marques – PR.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/luzessenciaartesanal"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2E251C] flex items-center justify-center text-[#D8B772] hover:bg-[#C5A059] hover:text-white transition-colors"
                aria-label="Instagram @luzessenciaartesanal"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/5546920027088"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2E251C] flex items-center justify-center text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                aria-label="WhatsApp oficial"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h3 className="text-sm font-semibold text-[#FAF7F2] uppercase tracking-wider mb-4">
              Coleções Exclusivas
            </h3>
            <ul className="space-y-2.5 text-xs text-[#DDD2BF]">
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'velas-aromaticas' })}
                  className="hover:text-[#D8B772] transition-colors cursor-pointer text-left"
                >
                  Velas Aromáticas Artesanais
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'velas-santuario' })}
                  className="hover:text-[#D8B772] transition-colors cursor-pointer text-left"
                >
                  Velas de Santuário & Religiosas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'sabonetes-artesanais' })}
                  className="hover:text-[#D8B772] transition-colors cursor-pointer text-left"
                >
                  Sabonetes Naturais Feitos à Mão
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('lembrancinhas')}
                  className="hover:text-[#D8B772] transition-colors cursor-pointer text-left"
                >
                  Lembrancinhas 15 Anos & Festas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('shop', { category: 'kits-presentes' })}
                  className="hover:text-[#D8B772] transition-colors cursor-pointer text-left"
                >
                  Kits Especiais & Caixas Presente
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional & Help */}
          <div>
            <h3 className="text-sm font-semibold text-[#FAF7F2] uppercase tracking-wider mb-4">
              Ajuda & Informações
            </h3>
            <ul className="space-y-2.5 text-xs text-[#DDD2BF]">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-[#D8B772] transition-colors cursor-pointer text-left"
                >
                  Sobre a Elaine e o Ateliê
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="hover:text-[#D8B772] transition-colors cursor-pointer text-left"
                >
                  Dúvidas Frequentes (FAQ)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cuidados')}
                  className="hover:text-[#D8B772] transition-colors cursor-pointer text-left"
                >
                  Guia de Cuidados com sua Vela
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('politicas')}
                  className="hover:text-[#D8B772] transition-colors cursor-pointer text-left"
                >
                  Envios, Prazos e Devoluções
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[#D8B772] transition-colors cursor-pointer text-left"
                >
                  Fale Conosco
                </button>
              </li>
            </ul>
          </div>

          {/* Location & Workshop Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#FAF7F2] uppercase tracking-wider mb-4">
              Ateliê & Contato
            </h3>
            <div className="flex items-start gap-2.5 text-xs text-[#DDD2BF]">
              <MapPin className="w-4 h-4 text-[#D8B772] shrink-0 mt-0.5" />
              <span>Enéas Marques – Paraná • CEP 85630-000</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#DDD2BF]">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>WhatsApp de Pedidos: (46) 92002-7088</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#DDD2BF]">
              <Instagram className="w-4 h-4 text-[#D8B772] shrink-0 mt-0.5" />
              <span>Instagram: @luzessenciaartesanal</span>
            </div>
            <div className="pt-2 text-[11px] text-[#A69784]">
              Horário de atendimento: Segunda a Sábado das 08h às 18h.
            </div>
          </div>
        </div>

        {/* Bottom Bar with discrete Admin Access */}
        <div className="mt-14 pt-8 border-t border-[#3E3327] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A69784]">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Luz & Essência Artesanal. Todos os direitos reservados. CNPJ sob solicitação.
          </p>

          {/* Discreet Admin Link in center/right as requested */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('admin')}
              className="flex items-center gap-1.5 text-[#A69784] hover:text-[#D8B772] text-[11px] transition-colors cursor-pointer py-1 px-2.5 rounded hover:bg-[#2E251C]"
              title="Painel de controle da Elaine"
            >
              <Lock className="w-3 h-3" />
              <span>Área da Elaine / Gestão</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
