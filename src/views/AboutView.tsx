import React from 'react';
import { Heart, Sparkles, MapPin, Instagram, MessageCircle, ShieldCheck, Feather } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 text-left space-y-16">
      
      {/* Header */}
      <div className="max-w-3xl">
        <span className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold">
          Nossa História • Enéas Marques – PR
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1F1913] mt-2 tracking-tight">
          O amor e o carinho artesanal em cada detalhe
        </h1>
        <p className="text-sm sm:text-base text-[#4A3E31] mt-3 leading-relaxed">
          Conheça a história da Elaine e como a Luz & Essência Artesanal se tornou sinônimo de acolhimento e aromas inesquecíveis no Paraná e em todo o Brasil.
        </p>
      </div>

      {/* Grid: Elaine Photo + Biography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        <div className="lg:col-span-5">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-[#ECE4D6] aspect-[4/3] bg-[#F4EFE6]">
            <img
              src="https://i.postimg.cc/fyxtWjdg/Sem-titulo.jpg"
              alt="Elaine, fundadora da Luz & Essência"
              loading="lazy"
              className="w-full h-full object-contain bg-[#FAF7F2]"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-xs text-[#8E6D2F] text-center mt-3 font-medium">
            Elaine em seu ateliê em Enéas Marques – Paraná
          </p>
        </div>

        <div className="lg:col-span-7 space-y-4 text-sm text-[#4A3E31] leading-relaxed">
          <h2 className="font-serif text-2xl text-[#1F1913]">
            Como Tudo Começou
          </h2>
          <p>
            A <strong>Luz & Essência Artesanal</strong> nasceu da paixão por transformar a rotina da casa em um refúgio acolhedor. Elaine sempre acreditou que a chama de uma vela aromática tem o poder de acalmar pensamentos, reunir a família e despertar memórias afetivas profundas.
          </p>
          <p>
            Iniciada em <strong>Enéas Marques, no sudoeste do Paraná</strong>, a marca preserva rigorosamente os métodos artesanais: cada vela de cera de coco é derramada e rotulada manualmente, e nossos sabonetes naturais descansam durante semanas no processo a frio (cold process) para preservar a glicerina natural e as propriedades nutritivas do azeite de oliva e da manteiga de karité.
          </p>
          <p>
            Na linha de <strong>Velas de Santuário</strong>, unimos a devoção e o respeito à fé com acabamentos nobres em ouro e azul profundo, criando peças de oração para proteger seu lar. E na linha de <strong>Lembrancinhas</strong>, celebramos a vida de jovens debutantes de 15 anos e casais que desejam marcar sua história com um perfume inesquecível.
          </p>
        </div>
      </div>

      {/* Values / Pilares */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-[#ECE4D6]">
        <div className="p-6 bg-white rounded-2xl border border-[#ECE4D6] space-y-2">
          <Feather className="w-6 h-6 text-[#C5A059]" />
          <h3 className="font-serif text-lg font-semibold text-[#1F1913]">100% Ceras Vegetais</h3>
          <p className="text-xs text-[#4A3E31] leading-relaxed">
            Livre de parafina de petróleo. Utilizamos blends puros de coco, palma e arroz que garantem uma queima limpa, ecológica e sem fumaça preta tóxica.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#ECE4D6] space-y-2">
          <Sparkles className="w-6 h-6 text-[#C5A059]" />
          <h3 className="font-serif text-lg font-semibold text-[#1F1913]">Essências de Alta Fixação</h3>
          <p className="text-xs text-[#4A3E31] leading-relaxed">
            Fragrâncias finas e concentradas desenvolvidas para preencher o ambiente de maneira elegante, sem causar dores de cabeça ou enjoos.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#ECE4D6] space-y-2">
          <Heart className="w-6 h-6 text-[#C5A059]" />
          <h3 className="font-serif text-lg font-semibold text-[#1F1913]">Feito com Afeto & Oração</h3>
          <p className="text-xs text-[#4A3E31] leading-relaxed">
            Cada encomenda é preparada como se fosse para a nossa própria família, com embalagens perfumadas e bilhetes carinhosos da Elaine.
          </p>
        </div>
      </div>

      {/* Social links */}
      <div className="p-8 bg-[#FAF7F2] rounded-3xl border border-[#DDD2BF] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="font-serif text-xl text-[#1F1913]">Acompanhe os bastidores no Instagram</h3>
          <p className="text-xs text-[#8E6D2F] mt-0.5">Veja vídeos do processo produtivo, novos aromas e depoimentos diários.</p>
        </div>
        <div className="flex gap-3">
          <a
            href="https://instagram.com/luzessenciaartesanal"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#2E251C] text-white rounded-xl text-xs font-semibold hover:bg-[#1F1913] transition-colors flex items-center gap-2"
          >
            <Instagram className="w-4 h-4 text-[#D8B772]" />
            <span>@luzessenciaartesanal</span>
          </a>
          <a
            href="https://wa.me/5546920027088"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#EFE9DF] text-[#2E251C] rounded-xl text-xs font-semibold hover:bg-[#E4DACB] transition-colors flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>(46) 92002-7088</span>
          </a>
        </div>
      </div>

    </div>
  );
};
