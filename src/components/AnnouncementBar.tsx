import React from 'react';
import { Sparkles, MessageCircle, Truck } from 'lucide-react';

interface AnnouncementBarProps {
  message?: string;
  whatsapp?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  message = 'Envio para todo o Brasil • Feito com carinho em Enéas Marques - PR • Frete Grátis acima de R$ 199',
  whatsapp = '5546920027088',
}) => {
  return (
    <aside aria-label="Aviso da loja" className="bg-[#2E251C] text-[#FAF7F2] text-xs py-2 px-4 border-b border-[#3E3327]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2 text-[#D8B772]">
          <Truck className="w-3.5 h-3.5" />
          <span>Ateliê em Enéas Marques – PR</span>
        </div>

        <div className="flex-1 text-center font-medium tracking-wide flex items-center justify-center gap-2 truncate px-2">
          <Sparkles className="w-3 h-3 text-[#D8B772] shrink-0" />
          <span className="truncate">{message}</span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[#EFE9DF] hover:text-[#D8B772] transition-colors whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>(46) 92002-7088</span>
          </a>
        </div>
      </div>
    </aside>
  );
};
