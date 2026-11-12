import React, { useState } from 'react';
import { MessageSquare, MessageCircle, Calendar, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { CustomQuote } from '../../types';

interface AdminQuotesProps {
  quotes: CustomQuote[];
  onQuotesUpdated: () => void;
}

export const AdminQuotes: React.FC<AdminQuotesProps> = ({ quotes, onQuotesUpdated }) => {
  const [filter, setFilter] = useState('all');

  const filtered = quotes.filter(q => {
    if (filter === 'all') return true;
    return q.status === filter;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE4D6] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#1F1913]">Orçamentos de Lembrancinhas</h1>
          <p className="text-xs text-[#8E6D2F] mt-0.5">
            Solicitações de debutantes de 15 anos, casamentos e batizados enviadas pelo site.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              filter === 'all' ? 'bg-[#2E251C] text-white' : 'bg-white text-[#4A3E31] border border-[#DDD2BF]'
            }`}
          >
            Todos ({quotes.length})
          </button>
          <button
            onClick={() => setFilter('novo')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer ${
              filter === 'novo' ? 'bg-[#AD8942] text-white' : 'bg-white text-[#4A3E31] border border-[#DDD2BF]'
            }`}
          >
            Novos
          </button>
        </div>
      </div>

      {/* Quotes Cards Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#ECE4D6]">
          <MessageSquare className="w-10 h-10 text-[#C5A059] mx-auto mb-2 opacity-50" />
          <p className="text-xs text-[#8E6D2F]">Nenhum orçamento encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((quote) => {
            const cleanPhone = quote.phone.replace(/\D/g, '');
            const replyMsg = encodeURIComponent(
              `Olá ${quote.name}! Sou a Elaine da Luz & Essência Artesanal. Vi sua solicitação no site para o seu evento (${quote.eventType} com aprox. ${quote.quantity} lembrancinhas). Gostaria de lhe apresentar nossas opções de laços, aromas e coroas!`
            );

            return (
              <div
                key={quote.id}
                className="bg-white rounded-2xl p-5 border border-[#ECE4D6] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-serif text-base font-semibold text-[#1F1913]">
                        {quote.name}
                      </h3>
                      <p className="text-xs text-[#8E6D2F]">
                        WhatsApp: <strong className="text-[#1F1913]">{quote.phone}</strong>
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-[#FAF7F2] text-[#AD8942] border border-[#DDD2BF] rounded text-[11px] font-semibold">
                      {quote.quantity} unidades
                    </span>
                  </div>

                  <div className="p-3 bg-[#FAF7F2] rounded-xl text-xs text-[#4A3E31] space-y-1">
                    <p><strong>Evento:</strong> {quote.eventType}</p>
                    {quote.eventDate && <p><strong>Data Prevista:</strong> {quote.eventDate}</p>}
                    {quote.customization && (
                      <p className="pt-1 text-[#2E251C]">
                        <strong>Preferências:</strong> {quote.customization}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F4EFE6]">
                  <span className="text-[11px] text-[#8E6D2F]">
                    {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
                  </span>

                  <a
                    href={`https://wa.me/55${cleanPhone}?text=${replyMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Responder no WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
