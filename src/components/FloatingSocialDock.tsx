import React from 'react';
import { MessageCircle, Instagram, Sparkles } from 'lucide-react';

interface FloatingSocialDockProps {
  onOpenSommelier: () => void;
}

export const FloatingSocialDock: React.FC<FloatingSocialDockProps> = ({ onOpenSommelier }) => {
  return (
    <>
      {/* Left Floating Button: Sommelier IA with Elaine's Human Photo Avatar */}
      <aside aria-label="Sommelier IA flutuante" className="fixed left-5 bottom-24 z-40">
        <button
          onClick={onOpenSommelier}
          aria-label="Abrir Sommelier de Aromas com a Elaine"
          className="group relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#AD8942] shadow-2xl transition-all transform hover:scale-110 cursor-pointer bg-[#FAF7F2]"
          title="Conversar com a Elaine (Sommelier de Aromas IA)"
        >
          <img
            src="https://i.postimg.cc/fyxtWjdg/Sem-titulo.jpg"
            alt="Elaine Sommelier"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
          <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#C5A059] text-white flex items-center justify-center text-[10px] shadow-sm border border-white animate-pulse">
            ✨
          </span>
          <span className="absolute left-16 bg-[#1F1913] text-white text-[11px] px-3 py-1.5 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#D8B772]" />
            <span>Sommelier IA • Elaine</span>
          </span>
        </button>
      </aside>

      {/* Right Floating Dock: WhatsApp & Instagram */}
      <aside aria-label="Atalhos flutuantes de atendimento" className="fixed right-5 bottom-24 z-40 flex flex-col gap-3">
        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/5546920027088?text=Olá%20Elaine!%20Gostaria%20de%20tirar%20dúvidas%20sobre%20as%20velas%20da%20Luz%20&%20Essência."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Conversar no WhatsApp"
          className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer group relative"
          title="Falar com a Elaine no WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          <span className="absolute right-14 bg-[#1F1913] text-white text-[11px] px-2.5 py-1 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
            WhatsApp da Elaine
          </span>
        </a>

        {/* Instagram Floating Button */}
        <a
          href="https://instagram.com/luzessenciaartesanal"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Seguir no Instagram @luzessenciaartesanal"
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-110 cursor-pointer group relative"
          title="Instagram @luzessenciaartesanal"
        >
          <Instagram className="w-6 h-6 text-white" />
          <span className="absolute right-14 bg-[#1F1913] text-white text-[11px] px-2.5 py-1 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium">
            @luzessenciaartesanal
          </span>
        </a>
      </aside>
    </>
  );
};
