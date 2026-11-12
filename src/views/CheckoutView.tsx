import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  CheckCircle2, 
  MessageCircle, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  Loader2 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useToast } from '../components/ui/Toast';
import { ShimmerButton } from '../components/ui/ShimmerButton';
import { ShippingAddress, ShippingOption, Order, PaymentMethod } from '../types';
import { 
  lookupAddressByCep, 
  calculateShippingOptions, 
  validateCoupon, 
  createOrder, 
  generateWhatsAppOrderUrl 
} from '../services/storeService';

interface CheckoutViewProps {
  onBack: () => void;
  onOrderSuccess: (order: Order, whatsappUrl: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onBack, onOrderSuccess }) => {
  const { 
    items, 
    subtotal, 
    totalWeight, 
    clearCart, 
    appliedCoupon, 
    applyCoupon, 
    discount 
  } = useCart();
  const { showToast } = useToast();

  // Personal Info State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Address State
  const [address, setAddress] = useState<ShippingAddress>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState('');
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Payment & Notes
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time CEP lookup
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const clean = rawVal.replace(/\D/g, '');
    setAddress(prev => ({ ...prev, cep: rawVal }));

    if (clean.length === 8) {
      setIsLoadingCep(true);
      setCepError('');
      try {
        const found = await lookupAddressByCep(clean);
        if (found) {
          setAddress(prev => ({
            ...prev,
            ...found,
            number: prev.number, // keep current typed number
          }));
          const options = calculateShippingOptions(found, totalWeight, subtotal);
          setShippingOptions(options);
          if (options.length > 0) {
            setSelectedShipping(options[0]);
          }
        } else {
          setCepError('CEP não encontrado pelos Correios. Preencha o endereço manualmente.');
        }
      } catch {
        setCepError('Erro ao consultar CEP. Preencha os campos abaixo.');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  // Coupon Validation
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError('');
    setCouponSuccess('');

    try {
      const res = await validateCoupon(couponCodeInput, subtotal);
      if (res.valid && res.coupon) {
        applyCoupon(res.coupon);
        setCouponSuccess(`Cupom ${res.coupon.code} aplicado com sucesso!`);
        showToast('Cupom Aplicado!', `${res.coupon.code} adicionado ao pedido`, 'success');
      } else {
        setCouponError(res.message || 'Cupom inválido.');
        showToast('Cupom não aplicado', res.message || 'Código inválido', 'error');
      }
    } catch {
      setCouponError('Erro ao validar cupom.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // Pix payment discount: 5% extra discount if paying via Pix
  const pixDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const shippingCost = selectedShipping ? selectedShipping.price : 0;
  const totalAmount = Math.max(0, subtotal - discount - pixDiscount + shippingCost);

  // Handle final Order Submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Por favor, preencha seu nome e telefone WhatsApp.');
      return;
    }

    if (!selectedShipping) {
      alert('Por favor, informe seu CEP para calcular e selecionar o frete.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = `LE-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderData: Omit<Order, 'id' | 'createdAt'> = {
        orderNumber,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        address: selectedShipping.id === 'retirada' ? undefined : address,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0],
          note: item.selectedOption || item.customNote,
        })),
        subtotal,
        shippingCost,
        shippingMethod: selectedShipping.name,
        discount: discount + pixDiscount,
        couponCode: appliedCoupon?.code,
        total: totalAmount,
        paymentMethod,
        status: 'pendente',
        notes: orderNotes.trim() || undefined,
      };

      const orderId = await createOrder(orderData);

      const completedOrder: Order = {
        ...orderData,
        id: orderId,
        createdAt: new Date().toISOString(),
      };

      // Celebration Confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore confetti errors
      }

      const whatsappUrl = generateWhatsAppOrderUrl(completedOrder);
      clearCart();
      onOrderSuccess(completedOrder, whatsappUrl);

    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ocorreu um erro ao registrar seu pedido. Você ainda pode enviar seu pedido diretamente para a Elaine no WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl text-[#1F1913] mb-4">Sua sacola está vazia</h2>
        <p className="text-xs text-[#8E6D2F] mb-6">
          Adicione velas aromáticas ou sabonetes artesanais para prosseguir com o pedido.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2.5 bg-[#2E251C] text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 text-left">
      
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#8E6D2F] hover:text-[#1F1913] mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continuar Comprando</span>
      </button>

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#AD8942] font-semibold">
          Finalização Segura
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl text-[#1F1913]">
          Finalizar Pedido • Luz & Essência
        </h1>
        <p className="text-xs text-[#4A3E31] mt-1">
          Ao concluir, você receberá a confirmação e o resumo completo será gerado para o WhatsApp da Elaine.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Customer Data, Address, Payment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Personal Data */}
            <div className="bg-white rounded-2xl p-6 border border-[#ECE4D6] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F4EFE6] pb-3">
                <span className="w-6 h-6 rounded-full bg-[#2E251C] text-white text-xs font-bold flex items-center justify-center">1</span>
                <h2 className="font-serif text-base font-semibold text-[#1F1913]">Seus Dados Pessoais</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria da Silva"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
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
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Address & Freight calculation */}
            <div className="bg-white rounded-2xl p-6 border border-[#ECE4D6] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F4EFE6] pb-3">
                <span className="w-6 h-6 rounded-full bg-[#2E251C] text-white text-xs font-bold flex items-center justify-center">2</span>
                <h2 className="font-serif text-base font-semibold text-[#1F1913]">Endereço & Cálculo de Frete</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    CEP *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="85630-000"
                      maxLength={9}
                      value={address.cep}
                      onChange={handleCepChange}
                      className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                    />
                    {isLoadingCep && (
                      <Loader2 className="w-4 h-4 animate-spin text-[#AD8942] absolute right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    Rua / Avenida *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rua das Acácias"
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    Número *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={address.number}
                    onChange={(e) => setAddress({ ...address, number: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    Complemento (Apto, Bloco, etc.)
                  </label>
                  <input
                    type="text"
                    placeholder="Casa, Apto 204"
                    value={address.complement}
                    onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    Bairro *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Centro"
                    value={address.neighborhood}
                    onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enéas Marques"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                    Estado *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="PR"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                  />
                </div>
              </div>

              {cepError && (
                <p className="text-xs text-red-600 font-medium">{cepError}</p>
              )}

              {/* Shipping Method Selection */}
              {shippingOptions.length > 0 && (
                <div className="pt-4 border-t border-[#F4EFE6] space-y-3">
                  <p className="text-xs font-semibold text-[#1F1913] flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#C5A059]" />
                    <span>Opções de Envio Disponíveis:</span>
                  </p>

                  <div className="space-y-2">
                    {shippingOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          selectedShipping?.id === opt.id
                            ? 'border-[#AD8942] bg-[#FAF7F2] shadow-xs'
                            : 'border-[#DDD2BF] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={selectedShipping?.id === opt.id}
                            onChange={() => setSelectedShipping(opt)}
                            className="text-[#AD8942] focus:ring-[#AD8942]"
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#1F1913]">{opt.name}</p>
                            <p className="text-[11px] text-[#8E6D2F]">Prazo estimado: {opt.estimatedDays}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#1F1913] tabular-nums">
                          {opt.price === 0 ? 'Grátis' : `R$ ${opt.price.toFixed(2).replace('.', ',')}`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-2xl p-6 border border-[#ECE4D6] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#F4EFE6] pb-3">
                <span className="w-6 h-6 rounded-full bg-[#2E251C] text-white text-xs font-bold flex items-center justify-center">3</span>
                <h2 className="font-serif text-base font-semibold text-[#1F1913]">Forma de Pagamento</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'pix'
                      ? 'border-[#AD8942] bg-[#FAF7F2] shadow-xs'
                      : 'border-[#DDD2BF] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600 mb-2" />
                  <p className="text-xs font-semibold text-[#1F1913]">Pix Imediato</p>
                  <p className="text-[11px] text-emerald-700 font-bold mt-0.5">5% de desconto extra</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cartao')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'cartao'
                      ? 'border-[#AD8942] bg-[#FAF7F2] shadow-xs'
                      : 'border-[#DDD2BF] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-[#8E6D2F] mb-2" />
                  <p className="text-xs font-semibold text-[#1F1913]">Cartão de Crédito</p>
                  <p className="text-[11px] text-[#8E6D2F] mt-0.5">Até 3x sem juros</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('dinheiro_retirada')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'dinheiro_retirada'
                      ? 'border-[#AD8942] bg-[#FAF7F2] shadow-xs'
                      : 'border-[#DDD2BF] hover:bg-[#FAF7F2]'
                  }`}
                >
                  <Banknote className="w-5 h-5 text-[#8E6D2F] mb-2" />
                  <p className="text-xs font-semibold text-[#1F1913]">Pagar na Entrega</p>
                  <p className="text-[11px] text-[#8E6D2F] mt-0.5">Dinheiro ou maquininha</p>
                </button>
              </div>

              {paymentMethod === 'pix' && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Chave Pix da Elaine: 46920027088 (Telefone)
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    Você pode transferir via Pix e enviar o comprovante diretamente no WhatsApp ao finalizar o pedido!
                  </p>
                </div>
              )}

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-medium text-[#4A3E31] mb-1">
                  Observações para a Elaine (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: É para presente, gostaria de embalagem especial; ou entregar em determinado horário."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Coupon Box */}
            <div className="bg-white rounded-2xl p-5 border border-[#ECE4D6] shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#AD8942]" />
                <h3 className="text-xs font-semibold text-[#1F1913] uppercase tracking-wider">
                  Possui Cupom de Desconto?
                </h3>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: BEMVINDA10"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] uppercase placeholder-[#8E6D2F] focus:outline-none focus:border-[#AD8942]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isValidatingCoupon}
                  className="px-4 py-2 bg-[#2E251C] hover:bg-[#1F1913] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isValidatingCoupon ? 'Aplicando...' : 'Aplicar'}
                </button>
              </div>

              {couponSuccess && (
                <p className="text-xs text-emerald-700 font-medium">{couponSuccess}</p>
              )}
              {couponError && (
                <p className="text-xs text-red-600 font-medium">{couponError}</p>
              )}
            </div>

            {/* Order Items & Totals */}
            <div className="bg-white rounded-2xl p-6 border border-[#ECE4D6] shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-semibold text-[#1F1913] border-b border-[#F4EFE6] pb-3">
                Resumo da Compra
              </h3>

              {/* Items List */}
              <div className="divide-y divide-[#F4EFE6] max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <img
                        src={item.product.images[0] || '/src/assets/images/vela_aromatica_manga_1794485801864.jpg'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-[#F4EFE6] shrink-0"
                      />
                      <div className="truncate">
                        <p className="font-medium text-[#1F1913] truncate">{item.product.name}</p>
                        <p className="text-[11px] text-[#8E6D2F]">Qtd: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#1F1913] tabular-nums whitespace-nowrap">
                      R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals Breakdown */}
              <div className="pt-3 border-t border-[#F4EFE6] space-y-2 text-xs text-[#4A3E31]">
                <div className="flex justify-between items-center">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F1913] tabular-nums">
                    R$ {subtotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>Cupom ({appliedCoupon?.code})</span>
                    <span className="font-semibold tabular-nums">
                      -R$ {discount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}

                {pixDiscount > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>Desconto Pix (5%)</span>
                    <span className="font-semibold tabular-nums">
                      -R$ {pixDiscount.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Frete ({selectedShipping ? selectedShipping.carrier : 'A calcular'})</span>
                  <span className="font-semibold text-[#1F1913] tabular-nums">
                    {!selectedShipping
                      ? 'Informe o CEP'
                      : selectedShipping.price === 0
                      ? 'Grátis'
                      : `R$ ${selectedShipping.price.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-[#ECE4D6] flex justify-between items-baseline text-base font-bold text-[#1F1913]">
                  <span>Total do Pedido</span>
                  <span className="text-xl text-[#AD8942] tabular-nums">
                    R$ {totalAmount.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Primary Submit Button */}
              <ShimmerButton
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xs sm:text-sm font-semibold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registrando Pedido...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                    <span>Concluir & Abrir no WhatsApp</span>
                  </>
                )}
              </ShimmerButton>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8E6D2F] text-center pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Seus dados estão protegidos. Atendimento humano pela Elaine.</span>
              </div>
            </div>

          </div>

        </div>
      </form>

    </div>
  );
};
