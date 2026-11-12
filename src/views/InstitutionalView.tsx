import React from 'react';
import { HelpCircle, Sparkles, Truck, ShieldAlert, Flame, MessageCircle, MapPin, Instagram } from 'lucide-react';

interface InstitutionalViewProps {
  topic: 'faq' | 'cuidados' | 'politicas' | 'contact';
}

export const InstitutionalView: React.FC<InstitutionalViewProps> = ({ topic }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 text-left space-y-12">
      
      {/* CUIDADOS COM A VELA */}
      {topic === 'cuidados' && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold">
              Guia Sensorial & Segurança
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1913] mt-1">
              Como cuidar e aproveitar ao máximo sua vela
            </h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#4A3E31] leading-relaxed">
            <div className="p-5 bg-white rounded-2xl border border-[#ECE4D6] space-y-2">
              <h3 className="font-serif text-base font-semibold text-[#1F1913] flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#C5A059]" />
                1. A primeira queima é a mais importante (Memória da Cera)
              </h3>
              <p>
                Ao acender sua vela pela primeira vez, deixe-a queimar até que toda a superfície derreta de ponta a ponta (a chamada "piscina de cera"), o que costuma levar de 1h30 a 2 horas. Isso evita o efeito túnel (quando a vela queima apenas no meio e desperdiça cera nas laterais).
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#ECE4D6] space-y-2">
              <h3 className="font-serif text-base font-semibold text-[#1F1913] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                2. Apare o pavio antes de reacender
              </h3>
              <p>
                Sempre apare o pavio para cerca de 5mm antes de cada reacendimento. Isso reduz fumaça preta, evita fagulhas e mantém a chama com altura controlada e segura.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#ECE4D6] space-y-2">
              <h3 className="font-serif text-base font-semibold text-[#1F1913] flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-[#C5A059]" />
                3. Segurança em primeiro lugar
              </h3>
              <p>
                Nunca deixe uma vela acesa sem supervisão. Mantenha longe de correntes de ar, cortinas, crianças e animais de estimação. Não queime por mais de 4 horas consecutivas para evitar superaquecimento do vidro.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* FAQ */}
      {topic === 'faq' && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold">
              Tire suas Dúvidas
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1913] mt-1">
              Perguntas Frequentes (FAQ)
            </h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#4A3E31] leading-relaxed">
            <div className="p-5 bg-white rounded-2xl border border-[#ECE4D6] space-y-1.5">
              <h3 className="font-serif text-base font-semibold text-[#1F1913]">
                As velas são feitas de cera vegetal?
              </h3>
              <p>
                Sim! Utilizamos blend exclusivo 100% de cera de coco, palma e arroz. Não utilizamos derivados de petróleo (parafina mineral). Nossas velas são ecológicas, biodegradáveis e sustentáveis.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#ECE4D6] space-y-1.5">
              <h3 className="font-serif text-base font-semibold text-[#1F1913]">
                Como funcionam as encomendas de lembrancinhas de 15 anos?
              </h3>
              <p>
                Aceitamos pedidos sob encomenda com quantidade mínima de 15 unidades. Você pode escolher a cor da fita de cetim, pingentes de coroa ou religiosos, e personalizar as tags com o nome da debutante e data. Entre em contato com 15 a 30 dias de antecedência pelo WhatsApp.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#ECE4D6] space-y-1.5">
              <h3 className="font-serif text-base font-semibold text-[#1F1913]">
                Vocês enviam para todo o Brasil?
              </h3>
              <p>
                Sim! Despachamos via Correios (PAC e SEDEX) diretamente de Enéas Marques – Paraná com embalagem reforçada anti-impacto. Para compras acima de R$ 199, o frete via PAC é gratuito!
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#ECE4D6] space-y-1.5">
              <h3 className="font-serif text-base font-semibold text-[#1F1913]">
                Posso retirar no ateliê?
              </h3>
              <p>
                Clientes de Enéas Marques e região sudoeste do Paraná podem selecionar a opção "Retirada no Ateliê" com frete grátis e combinar o horário de retirada diretamente com a Elaine.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* POLÍTICAS */}
      {topic === 'politicas' && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold">
              Transparência
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1913] mt-1">
              Políticas de Envio, Trocas e Devoluções
            </h1>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#4A3E31] leading-relaxed">
            <div className="p-5 bg-white rounded-2xl border border-[#ECE4D6] space-y-2">
              <h3 className="font-serif text-base font-semibold text-[#1F1913]">
                1. Prazo de Postagem
              </h3>
              <p>
                Para produtos em pronta entrega, o envio é realizado em até 2 dias úteis após a confirmação do pagamento. Para encomendas personalizadas (lembrancinhas), o prazo médio de produção é de 7 a 15 dias úteis.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#ECE4D6] space-y-2">
              <h3 className="font-serif text-base font-semibold text-[#1F1913]">
                2. Trocas e Danos no Transporte
              </h3>
              <p>
                Todas as velas e sabonetes são embalados com plástico bolha de alta gramatura e almofadas de papel. Se algum produto for danificado durante o transporte dos Correios, envie uma foto para nosso WhatsApp em até 7 dias corridos após o recebimento para envio imediato de uma nova peça sem custos.
              </p>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#ECE4D6] space-y-2">
              <h3 className="font-serif text-base font-semibold text-[#1F1913]">
                3. Direito de Arrependimento
              </h3>
              <p>
                Em conformidade com o Código de Defesa do Consumidor, compras pela internet têm prazo de arrependimento de 7 dias após o recebimento, desde que o produto esteja sem uso e em sua embalagem original.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTATO */}
      {topic === 'contact' && (
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold">
              Fale com a Elaine
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1913] mt-1">
              Canais Oficiais de Atendimento
            </h1>
            <p className="text-xs sm:text-sm text-[#4A3E31] mt-2">
              Estamos sempre à disposição para tirar dúvidas sobre fragrâncias, encomendas e pedidos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#ECE4D6] space-y-3">
              <MessageCircle className="w-6 h-6 text-emerald-600" />
              <h3 className="font-serif text-base font-semibold text-[#1F1913]">WhatsApp Oficial</h3>
              <p className="text-xs text-[#4A3E31]">
                Atendimento rápido para dúvidas e pedidos personalizados.
              </p>
              <a
                href="https://wa.me/5546920027088"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-emerald-700 hover:underline"
              >
                (46) 92002-7088 →
              </a>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#ECE4D6] space-y-3">
              <Instagram className="w-6 h-6 text-[#AD8942]" />
              <h3 className="font-serif text-base font-semibold text-[#1F1913]">Instagram</h3>
              <p className="text-xs text-[#4A3E31]">
                Conheça os lançamentos e converse conosco por mensagem direta.
              </p>
              <a
                href="https://instagram.com/luzessenciaartesanal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-xs font-bold text-[#AD8942] hover:underline"
              >
                @luzessenciaartesanal →
              </a>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#ECE4D6] space-y-3">
              <MapPin className="w-6 h-6 text-[#8E6D2F]" />
              <h3 className="font-serif text-base font-semibold text-[#1F1913]">Ateliê</h3>
              <p className="text-xs text-[#4A3E31]">
                Enéas Marques – Paraná<br />
                CEP 85630-000<br />
                Atendimento com agendamento
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
