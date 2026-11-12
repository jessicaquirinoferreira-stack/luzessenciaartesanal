import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  Tag, 
  Sliders, 
  LogOut, 
  ArrowLeft, 
  Sparkles, 
  Lock,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Product, Order, Coupon, CustomQuote, SiteSettings } from '../../types';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitAdmin,
  children,
}) => {
  const { user, isAdmin, loginWithGoogle, loginAsDemoAdmin, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
        <p className="text-xs text-[#8E6D2F] font-medium animate-pulse">Carregando painel de gestão...</p>
      </div>
    );
  }

  // If not logged in as admin, show login portal
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-[#ECE4D6] shadow-xl text-center space-y-6">
          <div className="w-14 h-14 bg-[#F4EFE6] rounded-full flex items-center justify-center mx-auto text-[#AD8942] border border-[#DDD2BF]">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#AD8942] font-semibold">
              Acesso Restrito
            </span>
            <h1 className="font-serif text-2xl text-[#1F1913] mt-1">
              Painel de Gestão da Elaine
            </h1>
            <p className="text-xs text-[#8E6D2F] mt-1.5">
              Área exclusiva para administração de produtos, pedidos, PDV e configurações da Luz & Essência Artesanal.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={loginWithGoogle}
              className="w-full py-3 px-4 bg-[#2E251C] hover:bg-[#1F1913] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Entrar com Conta Google</span>
            </button>

            <button
              onClick={loginAsDemoAdmin}
              className="w-full py-2.5 px-4 bg-[#F4EFE6] hover:bg-[#ECE4D6] text-[#2E251C] rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#DDD2BF]"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Acesso Rápido de Gestão (Ateliê Elaine)</span>
            </button>
          </div>

          <div className="pt-4 border-t border-[#F4EFE6]">
            <button
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 text-xs text-[#8E6D2F] hover:text-[#1F1913] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para a Loja Pública</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'pdv', label: 'PDV (Venda Presencial)', icon: Store },
    { id: 'products', label: 'Produtos', icon: Package },
    { id: 'orders', label: 'Pedidos da Loja', icon: ShoppingCart },
    { id: 'quotes', label: 'Orçamentos 15 Anos', icon: MessageSquare },
    { id: 'coupons', label: 'Cupons de Desconto', icon: Tag },
    { id: 'settings', label: 'Configurações', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col md:flex-row text-left">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#1F1913] text-[#FAF7F2] p-5 flex flex-col justify-between shrink-0 border-r border-[#3E3327]">
        <div className="space-y-6">
          {/* Header Brand */}
          <div className="border-b border-[#3E3327] pb-4">
            <span className="font-serif text-lg text-white block">
              Luz & Essência
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#D8B772] font-semibold">
              Painel de Gestão da Elaine
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#AD8942] text-white shadow-xs'
                      : 'text-[#DDD2BF] hover:bg-[#2E251C] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-[#3E3327] space-y-2 mt-6">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#D8B772] hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a Loja</span>
          </button>

          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-[#A69784] hover:text-red-400 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl overflow-y-auto">
        {children}
      </main>

    </div>
  );
};
