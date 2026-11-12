import React, { useState } from 'react';
import { Sparkles, MessageCircle, Heart, Calendar, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createCustomQuote } from '../services/storeService';
import { ShimmerButton } from '../components/ui/ShimmerButton';
import { useToast } from '../components/ui/Toast';

export const LembrancinhasView: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState<'15_anos' | 'casamento' | 'batizado' | 'corporativo' | 'maternidade' | 'outro'>('15_anos');
  const [quantity, setQuantity] = useState(30);
  const [eventDate, setEventDate] = useState('');
  const [customization, setCustomization] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Price estimate: approx R$ 18.90 per unit, with discount tiers
  const unitPrice = quantity >= 100 ? 16.50 : quantity >= 50 ? 17.50 : 18.90;
  const estimatedTotal = quantity * unitPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Por favor, informe seu nome e telefone WhatsApp.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createCustomQuote({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        eventType,
        quantity,
        eventDate: eventDate.trim() || undefined,
        customization: customization.trim() || undefined,
      });

      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch {}

      setSubmitted(true);

      // WhatsApp generation
      const eventLabel = {
        '15_anos': 'Festa de 15 Anos (Debutante)',
        'casamento': 'Casamento / Noivado',
        'batizado': 'Batizado / Primeira Comunhão',
        'maternidade': 'Maternidade / Chá de Bebê',
        'corporativo': 'Evento Corporativo / Brinde',
        'outro': 'Outro Evento',
      }[eventType];

      const msg = `✨ *ORÇAMENTO DE LEMBRANCINHAS PERSONALIZADAS* ✨\n` +
        `Olá Elaine! Gostaria de um orçamento personalizado para o meu evento.\n\n` +
        `👤 *Nome:* ${name}\n` +
        `📱 *WhatsApp:* ${phone}\n` +
        `🎉 *Ocasião:* ${eventLabel}\n` +
        `🕯️ *Quantidade Estimada:* ${quantity} unidades\n` +
        (eventDate ? `📅 *Data Prevista do Evento:* ${eventDate}\n` : '') +
        (customization ? `🎨 *Detalhes / Preferências:* ${customization}\n\n` : '\n') +
        `💰 *Estimativa no site:* Aprox. R$ ${estimatedTotal.toFixed(2).replace('.', ',')}\n\n` +
        `Podemos conversar sobre as opções de aromas, laços e tags? Obrigada! 💛`;

      const whatsappUrl = `https://wa.me/5546920027088?text=${encodeURIComponent(msg)}`;
      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Erro ao enviar solicitação. Você pode falar diretamente pelo WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 text-left space-y-16">
      
      {/* Editorial Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#AD8942] bg-[#F4EFE6] px-3 py-1 rounded-full border border-[#ECE4D6] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ateliê Luz & Essência • Linha Celebrações</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#1F1913] tracking-tight leading-tight">
          Lembrancinhas Personalizadas para Festas de 15 Anos & Celebrações
        </h1>
        <p className="text-sm sm:text-base text-[#4A3E31] mt-3 leading-relaxed">
          Mini velas perfumadas feitas à mão com pingentes de coroa dourada, laços de cetim e tags personalizadas. O carinho que seus convidados guardarão para sempre.
        </p>
      </div>

      {/* Grid: Image Showcase + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left Column: Visual Details & Gallery */}
        <div className="lg:col-span-6 space-y-6">
          <div className="rounded-3xl overflow-hidden shadow-xl border border-[#ECE4D6] aspect-[4/3] bg-white">
            <img
              src="/images/lembrancinhas_festa_1794485803571.jpg"
              alt="Lembrancinhas de 15 anos personalizadas com laço rosé e coroa"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-[#ECE4D6] space-y-1">
              <p className="text-xs font-bold text-[#1F1913]">Detalhes da Personalização</p>
              <ul className="text-[11px] text-[#4A3E31] space-y-1 list-disc list-inside">
                <li>Nome da debutante e data gravados</li>
                <li>Laço em cetim na cor da sua festa</li>
                <li>Pingente coroa ou símbolo religioso</li>
                <li>Fragrância assinatura à sua escolha</li>
              </ul>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-[#ECE4D6] space-y-1">
              <p className="text-xs font-bold text-[#1F1913]">Prazos & Envio</p>
              <ul className="text-[11px] text-[#4A3E31] space-y-1 list-disc list-inside">
                <li>Produção artesanal em até 15 dias</li>
                <li>Envio seguro para todo o Brasil</li>
                <li>Embalagem protetora individual</li>
                <li>Pedido mínimo a partir de 15 un.</li>
              </ul>
            </div>
          </div>

          {/* Emotional Quote */}
          <div className="p-5 bg-[#FAF7F2] rounded-2xl border border-[#DDD2BF] italic text-xs text-[#4A3E31] leading-relaxed">
            "A festa de 15 anos da minha filha foi inesquecível e as velas da Elaine foram o comentário de todos os convidados. Perfume divino e acabamento perfeito!"
            <span className="block mt-2 font-semibold not-italic text-[#1F1913] text-[11px]">— Camila M., Francisco Beltrão - PR</span>
          </div>
        </div>

        {/* Right Column: Quote Simulator & Form */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#ECE4D6] shadow-sm space-y-6">
          <div className="border-b border-[#F4EFE6] pb-4">
            <h2 className="font-serif text-xl sm:text-2xl text-[#1F1913]">
              Simule e Solicite seu Orçamento
            </h2>
            <p className="text-xs text-[#8E6D2F] mt-1">
              Preencha os dados abaixo. Nós responderemos com fotos de modelos e a proposta detalhada no seu WhatsApp.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center space-y-4 bg-[#FAF7F2] rounded-2xl border border-[#ECE4D6]">
              <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-xl text-[#1F1913]">Solicitação Enviada!</h3>
              <p className="text-xs text-[#4A3E31] leading-relaxed max-w-sm mx-auto">
                Abrimos sua conversa no WhatsApp com a Elaine. Caso não tenha aberto automaticamente, clique no botão abaixo:
              </p>
              <a
                href={`https://wa.me/5546920027088?text=${encodeURIComponent(`Olá Elaine! Acabei de enviar um orçamento de ${quantity} lembrancinhas no site.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Abrir WhatsApp da Elaine</span>
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Beatriz Lima"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(46) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    Tipo de Evento *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942] cursor-pointer"
                  >
                    <option value="15_anos">Festa de 15 Anos (Debutante)</option>
                    <option value="casamento">Casamento / Noivado</option>
                    <option value="batizado">Batizado / Religioso</option>
                    <option value="maternidade">Maternidade / Chá de Bebê</option>
                    <option value="corporativo">Corporativo / Brinde</option>
                    <option value="outro">Outro Evento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    Data Prevista do Evento
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>
              </div>

              {/* Quantity slider / input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-medium text-[#4A3E31]">
                    Quantidade Estimada de Peças:
                  </label>
                  <span className="text-xs font-bold text-[#AD8942] tabular-nums">
                    {quantity} unidades
                  </span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="250"
                  step="5"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full accent-[#C5A059] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#8E6D2F] mt-1">
                  <span>15 un. (mínimo)</span>
                  <span>50 un.</span>
                  <span>100 un.</span>
                  <span>250+ un.</span>
                </div>
              </div>

              {/* Live Price Estimation Box */}
              <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#DDD2BF] flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-[#8E6D2F]">Valor Unitário Estimado:</p>
                  <p className="text-xs font-semibold text-[#1F1913]">
                    R$ {unitPrice.toFixed(2).replace('.', ',')} / unidade
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-[#8E6D2F]">Total Estimado ({quantity} un.):</p>
                  <p className="text-base font-bold text-[#AD8942] tabular-nums">
                    R$ {estimatedTotal.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                  Cores, aromas ou detalhes desejados (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Fita rosé ou dourada, pingente coroa, aroma de baunilha doce, nome da debutante: Gabriela..."
                  value={customization}
                  onChange={(e) => setCustomization(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                />
              </div>

              <ShimmerButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enviando Proposta...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Enviar Orçamento para o WhatsApp da Elaine</span>
                  </>
                )}
              </ShimmerButton>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
