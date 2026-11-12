import React, { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Truck, 
  CheckCircle2, 
  Clock, 
  X, 
  FileText, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { updateOrderStatus, generateWhatsAppOrderUrl } from '../../services/storeService';

interface AdminOrdersProps {
  orders: Order[];
  onOrdersUpdated: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, onOrdersUpdated }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      onOrdersUpdated();
    } catch {
      alert('Erro ao atualizar status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveTracking = async (orderId: string) => {
    setIsUpdating(true);
    try {
      await updateOrderStatus(orderId, selectedOrder?.status || 'enviado', trackingInput.trim());
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, trackingCode: trackingInput.trim() });
      }
      alert('Código de rastreio salvo!');
      onOrdersUpdated();
    } catch {
      alert('Erro ao salvar rastreio.');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const config = {
      pendente: { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Pendente' },
      pago: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Pago' },
      enviado: { bg: 'bg-blue-50 text-blue-800 border-blue-200', label: 'Enviado' },
      entregue: { bg: 'bg-purple-50 text-purple-800 border-purple-200', label: 'Entregue' },
      cancelado: { bg: 'bg-red-50 text-red-800 border-red-200', label: 'Cancelado' },
    }[status] || { bg: 'bg-gray-50 text-gray-800 border-gray-200', label: status };

    return (
      <span className={`px-2.5 py-0.5 rounded text-[11px] font-medium border ${config.bg}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE4D6] pb-4">
        <div>
          <h1 className="font-serif text-2xl text-[#1F1913]">Gestão de Pedidos</h1>
          <p className="text-xs text-[#8E6D2F] mt-0.5">
            Visualize pedidos, envie atualizações no WhatsApp e insira códigos de rastreio dos Correios.
          </p>
        </div>

        <span className="text-xs font-semibold text-[#1F1913] bg-white px-3 py-1.5 rounded-xl border border-[#DDD2BF] self-start sm:self-auto">
          Total: {orders.length} pedidos
        </span>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8E6D2F] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por número do pedido, cliente ou telefone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none focus:border-[#AD8942]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-white border border-[#DDD2BF] rounded-xl text-xs text-[#1F1913] focus:outline-none cursor-pointer"
        >
          <option value="all">Todos os Status</option>
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
          <option value="enviado">Enviado</option>
          <option value="entregue">Entregue</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl border border-[#ECE4D6] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] border-b border-[#ECE4D6] text-[#8E6D2F] font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Pedido #</th>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">WhatsApp</th>
                <th className="py-3 px-4">Itens</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4EFE6] text-[#4A3E31]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#8E6D2F]">
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-[#1F1913]">
                      #{order.orderNumber}
                      {order.isPosSale && (
                        <span className="ml-1.5 px-1.5 py-0.2 bg-[#F4EFE6] text-[#8E6D2F] rounded text-[10px] font-sans">PDV</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-[#8E6D2F]">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-[#1F1913]">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {order.customerPhone}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {order.items.reduce((s, i) => s + i.quantity, 0)} un. ({order.items.length} tipos)
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-bold text-[#1F1913] tabular-nums">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setTrackingInput(order.trackingCode || '');
                        }}
                        className="px-3 py-1 bg-[#F4EFE6] hover:bg-[#ECE4D6] text-[#2E251C] rounded-lg font-medium transition-colors cursor-pointer"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 border border-[#ECE4D6] shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-left">
            
            <div className="flex justify-between items-start border-b border-[#F4EFE6] pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#AD8942] font-semibold">
                  Detalhes do Pedido
                </span>
                <h2 className="font-serif text-2xl text-[#1F1913]">
                  Pedido #{selectedOrder.orderNumber}
                </h2>
                <p className="text-xs text-[#8E6D2F] mt-0.5">
                  Realizado em {new Date(selectedOrder.createdAt).toLocaleString('pt-BR')}
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-[#8E6D2F] hover:text-[#1F1913]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Selector */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#ECE4D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-[#1F1913] block">Status Atual:</span>
                <span className="text-[11px] text-[#8E6D2F]">Altere conforme o progresso do pedido</span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={selectedOrder.status}
                  disabled={isUpdating}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                  className="px-3 py-1.5 bg-white border border-[#DDD2BF] rounded-xl text-xs font-semibold text-[#1F1913] cursor-pointer"
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregue">Entregue</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Customer & Delivery Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-white rounded-2xl border border-[#ECE4D6] space-y-1">
                <p className="font-semibold text-[#1F1913]">Dados do Cliente</p>
                <p>Nome: {selectedOrder.customerName}</p>
                <p>WhatsApp: {selectedOrder.customerPhone}</p>
                {selectedOrder.customerEmail && <p>E-mail: {selectedOrder.customerEmail}</p>}
                <p>Pagamento: <strong className="uppercase">{selectedOrder.paymentMethod}</strong></p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-[#ECE4D6] space-y-1">
                <p className="font-semibold text-[#1F1913]">Endereço & Envio</p>
                {selectedOrder.address ? (
                  <>
                    <p>{selectedOrder.address.street}, {selectedOrder.address.number}</p>
                    {selectedOrder.address.complement && <p>{selectedOrder.address.complement}</p>}
                    <p>{selectedOrder.address.neighborhood} - {selectedOrder.address.city}/{selectedOrder.address.state}</p>
                    <p>CEP: {selectedOrder.address.cep}</p>
                  </>
                ) : (
                  <p>Retirada no Ateliê / Venda Balcão</p>
                )}
                <p className="text-[#AD8942] font-semibold mt-1">Frete: {selectedOrder.shippingMethod}</p>
              </div>
            </div>

            {/* Correios Tracking Code Input */}
            <div className="p-4 bg-white rounded-2xl border border-[#ECE4D6] space-y-2">
              <label className="block text-xs font-semibold text-[#1F1913] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#AD8942]" />
                <span>Código de Rastreamento dos Correios:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: QB123456789BR"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-1.5 bg-[#FAF7F2] border border-[#DDD2BF] rounded-xl text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleSaveTracking(selectedOrder.id)}
                  className="px-4 py-1.5 bg-[#2E251C] text-white rounded-xl text-xs font-medium cursor-pointer"
                >
                  Salvar Rastreio
                </button>
              </div>
            </div>

            {/* Items Ordered */}
            <div className="border border-[#ECE4D6] rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] border-b border-[#ECE4D6] text-[11px] text-[#8E6D2F] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Item</th>
                    <th className="py-2.5 px-3">Qtd</th>
                    <th className="py-2.5 px-3">Preço Un.</th>
                    <th className="py-2.5 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4EFE6]">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-medium text-[#1F1913]">{item.productName}</td>
                      <td className="py-2.5 px-3">{item.quantity}</td>
                      <td className="py-2.5 px-3 tabular-nums">R$ {item.price.toFixed(2).replace('.', ',')}</td>
                      <td className="py-2.5 px-3 text-right font-semibold tabular-nums">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="p-3 bg-[#FAF7F2] border-t border-[#ECE4D6] text-xs space-y-1 text-right text-[#4A3E31]">
                <p>Subtotal: R$ {selectedOrder.subtotal.toFixed(2).replace('.', ',')}</p>
                {selectedOrder.discount > 0 && (
                  <p className="text-emerald-700">Desconto: -R$ {selectedOrder.discount.toFixed(2).replace('.', ',')}</p>
                )}
                <p>Frete: R$ {selectedOrder.shippingCost.toFixed(2).replace('.', ',')}</p>
                <p className="text-sm font-bold text-[#1F1913] pt-1 border-t border-[#DDD2BF]">
                  Total: R$ {selectedOrder.total.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>

            {/* WhatsApp Resend Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a
                href={generateWhatsAppOrderUrl(selectedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reenviar Resumo Completo no WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-3 border border-[#DDD2BF] rounded-xl text-xs text-[#4A3E31] hover:bg-[#FAF7F2]"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
