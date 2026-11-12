import React, { useMemo } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Store, 
  Plus, 
  ArrowRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Order, Product, CustomQuote } from '../../types';

interface AdminDashboardProps {
  orders: Order[];
  products: Product[];
  quotes: CustomQuote[];
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  products,
  quotes,
  onNavigateTab,
}) => {
  // Sales Metrics calculations
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).getTime();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  const metrics = useMemo(() => {
    let salesToday = 0;
    let salesWeek = 0;
    let salesMonth = 0;
    let totalRevenue = 0;

    orders.forEach(order => {
      const orderTime = new Date(order.createdAt).getTime();
      const val = order.total || 0;
      totalRevenue += val;

      if (orderTime >= startOfDay) salesToday += val;
      if (orderTime >= startOfWeek) salesWeek += val;
      if (orderTime >= startOfMonth) salesMonth += val;
    });

    return {
      salesToday,
      salesWeek,
      salesMonth,
      totalRevenue,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pendente').length,
    };
  }, [orders, startOfDay, startOfWeek, startOfMonth]);

  // Low stock products (< 5 items)
  const lowStockProducts = products.filter(p => p.stock <= 5);

  // Recent 5 orders
  const recentOrders = orders.slice(0, 5);

  // Status badge styling
  const getStatusBadge = (status: Order['status']) => {
    const config = {
      pendente: { bg: 'bg-amber-50 text-amber-800 border-amber-200', label: 'Pendente' },
      pago: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', label: 'Pago' },
      enviado: { bg: 'bg-blue-50 text-blue-800 border-blue-200', label: 'Enviado' },
      entregue: { bg: 'bg-purple-50 text-purple-800 border-purple-200', label: 'Entregue' },
      cancelado: { bg: 'bg-red-50 text-red-800 border-red-200', label: 'Cancelado' },
    }[status] || { bg: 'bg-gray-50 text-gray-800 border-gray-200', label: status };

    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${config.bg}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      
      {/* Top Welcome & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#1F1913]">
            Visão Geral do Ateliê
          </h1>
          <p className="text-xs text-[#8E6D2F] mt-1">
            Acompanhe pedidos da loja, estoque de essências e vendas presenciais em Enéas Marques.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('pdv')}
            className="px-4 py-2 bg-[#AD8942] hover:bg-[#8E6D2F] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Store className="w-4 h-4" />
            <span>Abrir PDV Presencial</span>
          </button>

          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2 bg-[#2E251C] hover:bg-[#1F1913] text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Sales Today */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE4D6] shadow-xs">
          <div className="flex justify-between items-center text-xs text-[#8E6D2F] mb-1">
            <span>Vendas Hoje</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1F1913] tabular-nums">
            R$ {metrics.salesToday.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-[11px] text-[#5F7461] mt-1">
            Esta semana: R$ {metrics.salesWeek.toFixed(2).replace('.', ',')}
          </p>
        </div>

        {/* Sales Month */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE4D6] shadow-xs">
          <div className="flex justify-between items-center text-xs text-[#8E6D2F] mb-1">
            <span>Vendas do Mês</span>
            <TrendingUp className="w-4 h-4 text-[#AD8942]" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1F1913] tabular-nums">
            R$ {metrics.salesMonth.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-[11px] text-[#8E6D2F] mt-1">
            Receita acumulada no sistema
          </p>
        </div>

        {/* Orders Pending */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE4D6] shadow-xs">
          <div className="flex justify-between items-center text-xs text-[#8E6D2F] mb-1">
            <span>Pedidos Pendentes</span>
            <ShoppingCart className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1F1913] tabular-nums">
            {metrics.pendingOrders}
          </p>
          <p className="text-[11px] text-[#8E6D2F] mt-1">
            Total de {metrics.totalOrders} pedidos realizados
          </p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-5 rounded-2xl border border-[#ECE4D6] shadow-xs">
          <div className="flex justify-between items-center text-xs text-[#8E6D2F] mb-1">
            <span>Estoque Baixo</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <p className="font-serif text-2xl font-bold text-[#1F1913] tabular-nums">
            {lowStockProducts.length} itens
          </p>
          <p className="text-[11px] text-red-600 mt-1">
            Produtos com ≤ 5 unidades
          </p>
        </div>

      </div>

      {/* Main Grid: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#ECE4D6] shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-3">
            <h2 className="font-serif text-lg font-semibold text-[#1F1913]">
              Pedidos Recentes
            </h2>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-semibold text-[#AD8942] hover:text-[#1F1913] flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-[#8E6D2F] py-8 text-center">
              Nenhum pedido recebido ainda. Quando clientes comprarem pelo site ou no PDV, eles aparecerão aqui.
            </p>
          ) : (
            <div className="divide-y divide-[#F4EFE6]">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-[#1F1913]">#{order.orderNumber}</span>
                      {getStatusBadge(order.status)}
                      {order.isPosSale && (
                        <span className="px-1.5 py-0.2 bg-[#F4EFE6] text-[#8E6D2F] rounded text-[10px]">PDV</span>
                      )}
                    </div>
                    <p className="text-[#4A3E31] mt-0.5">
                      {order.customerName} • {order.items.length} produto(s)
                    </p>
                    <p className="text-[10px] text-[#8E6D2F]">
                      {new Date(order.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-[#1F1913] tabular-nums">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                    <p className="text-[10px] text-[#8E6D2F] uppercase">{order.paymentMethod}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low Stock Alerts & Quotes (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Low Stock List */}
          <div className="bg-white rounded-2xl p-6 border border-[#ECE4D6] shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-3">
              <h2 className="font-serif text-lg font-semibold text-[#1F1913] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Alerta de Reposição</span>
              </h2>
              <button
                onClick={() => onNavigateTab('products')}
                className="text-xs text-[#AD8942] hover:underline cursor-pointer"
              >
                Gerenciar
              </button>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-emerald-700 py-4 text-center">
                ✓ Todos os produtos estão com estoque regular.
              </p>
            ) : (
              <div className="divide-y divide-[#F4EFE6]">
                {lowStockProducts.map((prod) => (
                  <div key={prod.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="truncate pr-2">
                      <p className="font-medium text-[#1F1913] truncate">{prod.name}</p>
                      <p className="text-[11px] text-[#8E6D2F]">{prod.categoryLabel}</p>
                    </div>
                    <span className="font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded tabular-nums whitespace-nowrap">
                      {prod.stock} em estoque
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* New Custom Quotes */}
          <div className="bg-white rounded-2xl p-6 border border-[#ECE4D6] shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-[#F4EFE6] pb-3">
              <h2 className="font-serif text-base font-semibold text-[#1F1913]">
                Orçamentos 15 Anos Recentes
              </h2>
              <button
                onClick={() => onNavigateTab('quotes')}
                className="text-xs text-[#AD8942] hover:underline cursor-pointer"
              >
                Ver todos ({quotes.length})
              </button>
            </div>

            {quotes.length === 0 ? (
              <p className="text-xs text-[#8E6D2F] py-2 text-center">
                Nenhum orçamento solicitado recentemente.
              </p>
            ) : (
              <div className="divide-y divide-[#F4EFE6]">
                {quotes.slice(0, 3).map((q) => (
                  <div key={q.id} className="py-2 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-[#1F1913]">{q.name}</p>
                      <p className="text-[11px] text-[#8E6D2F]">{q.quantity} peças • {q.phone}</p>
                    </div>
                    <a
                      href={`https://wa.me/55${q.phone.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(q.name)}!%20Recebemos%20sua%20solicitação%20de%20lembrancinhas%20na%20Luz%20&%20Essência.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded text-[11px] font-medium"
                    >
                      WhatsApp
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
