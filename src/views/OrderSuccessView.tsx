import React, { useState } from 'react';
import { CheckCircle2, MessageCircle, Copy, Check, ArrowRight, Package, Home, QrCode } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessViewProps {
  order: Order;
  whatsappUrl: string;
  onNavigateHome: () => void;
}

export const OrderSuccessView: React.FC<OrderSuccessViewProps> = ({
  order,
  whatsappUrl,
  onNavigateHome,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyMessage = () => {
    const text = decodeURIComponent(whatsappUrl.split('text=')[1] || '');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 pb-24 text-left">
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#ECE4D6] shadow-xl text-center space-y-6">
        
        {/* Animated Celebration Icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold">
            Pedido Registrado com Sucesso!
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F1913] mt-2">
            Obrigado, {order.customerName.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-[#4A3E31] mt-2 max-w-md mx-auto leading-relaxed">
            Seu pedido <strong>#{order.orderNumber}</strong> foi gerado e aguarda apenas o envio no WhatsApp para que a Elaine confirme e prepare suas peças com todo carinho.
          </p>
        </div>

        {/* Big Action: Open WhatsApp */}
        <div className="max-w-md mx-auto space-y-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Enviar Pedido no WhatsApp da Elaine</span>
          </a>

          <button
            onClick={handleCopyMessage}
            className="w-full py-2.5 px-4 bg-[#F4EFE6] hover:bg-[#ECE4D6] text-[#2E251C] rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#DDD2BF]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Mensagem Copiada!' : 'Copiar Resumo do Pedido'}</span>
          </button>
        </div>

        {/* Pix Instructions if selected */}
        {order.paymentMethod === 'pix' && (
          <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-left max-w-md mx-auto text-xs text-emerald-950 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-900">
              <QrCode className="w-4 h-4 text-emerald-700" />
              <span>Chave Pix da Elaine para Pagamento:</span>
            </div>
            <div className="bg-white p-2.5 rounded-lg border border-emerald-300 font-mono text-xs flex justify-between items-center">
              <span>46920027088</span>
              <span className="text-[10px] text-emerald-700 font-sans">Tipo: Celular</span>
            </div>
            <p className="text-[11px] text-emerald-800">
              Favorecida: Elaine • Valor com desconto: R$ {order.total.toFixed(2).replace('.', ',')}
            </p>
          </div>
        )}

        {/* Order Details Card */}
        <div className="p-6 bg-[#FAF7F2] rounded-2xl border border-[#ECE4D6] text-left text-xs text-[#4A3E31] space-y-3 max-w-lg mx-auto">
          <div className="flex justify-between items-center border-b border-[#ECE4D6] pb-2 font-medium">
            <span className="text-[#1F1913]">Itens do Pedido</span>
            <span className="tabular-nums font-semibold">{order.items.length} produto(s)</span>
          </div>

          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span>
                  <strong>{item.quantity}x</strong> {item.productName}
                </span>
                <span className="tabular-nums font-semibold">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#ECE4D6] space-y-1">
            <div className="flex justify-between">
              <span>Frete ({order.shippingMethod}):</span>
              <span className="tabular-nums">
                {order.shippingCost === 0 ? 'Grátis' : `R$ ${order.shippingCost.toFixed(2).replace('.', ',')}`}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Desconto Total:</span>
                <span className="tabular-nums">-R$ {order.discount.toFixed(2).replace('.', ',')}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-[#1F1913] pt-2 border-t border-[#DDD2BF]">
              <span>Total Pago:</span>
              <span className="text-base text-[#AD8942] tabular-nums">
                R$ {order.total.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>

        {/* Return Home */}
        <div className="pt-4">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#8E6D2F] hover:text-[#1F1913] transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Voltar à Página Inicial</span>
          </button>
        </div>

      </div>
    </div>
  );
};
