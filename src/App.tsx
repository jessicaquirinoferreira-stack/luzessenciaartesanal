/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider, useToast } from './components/ui/Toast';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FloatingSocialDock } from './components/FloatingSocialDock';
import { SearchModal } from './components/ui/SearchModal';
import { SommelierModal } from './components/SommelierModal';

// Public Views
import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { LembrancinhasView } from './views/LembrancinhasView';
import { AboutView } from './views/AboutView';
import { InstitutionalView } from './views/InstitutionalView';
import { CheckoutView } from './views/CheckoutView';
import { OrderSuccessView } from './views/OrderSuccessView';

// Admin Views
import { AdminLayout } from './views/admin/AdminLayout';
import { AdminDashboard } from './views/admin/AdminDashboard';
import { AdminPDV } from './views/admin/AdminPDV';
import { AdminProducts } from './views/admin/AdminProducts';
import { AdminOrders } from './views/admin/AdminOrders';
import { AdminCoupons } from './views/admin/AdminCoupons';
import { AdminQuotes } from './views/admin/AdminQuotes';
import { AdminSettings } from './views/admin/AdminSettings';

// Services & Types
import { 
  getProducts, 
  getOrders, 
  getCoupons, 
  getCustomQuotes, 
  getSiteSettings 
} from './services/storeService';
import { Product, Order, Coupon, CustomQuote, SiteSettings } from './types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_SETTINGS } from './data/initialData';

function AppContent() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [initialShopCategory, setInitialShopCategory] = useState<any>('all');
  const [completedOrderData, setCompletedOrderData] = useState<{ order: Order; whatsappUrl: string } | null>(null);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSommelierOpen, setIsSommelierOpen] = useState(false);

  // Admin Sub-Tab
  const [adminTab, setAdminTab] = useState<string>('dashboard');

  // Application Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [quotes, setQuotes] = useState<CustomQuote[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);

  // Load data from Firestore
  const loadStoreData = async () => {
    try {
      const [prods, ords, coups, qts, sets] = await Promise.all([
        getProducts(),
        getOrders(),
        getCoupons(),
        getCustomQuotes(),
        getSiteSettings(),
      ]);

      if (prods && prods.length > 0) setProducts(prods);
      if (ords) setOrders(ords);
      if (coups && coups.length > 0) setCoupons(coups);
      if (qts) setQuotes(qts);
      if (sets) setSettings(sets);
    } catch (e) {
      console.warn('Error loading remote store data, using local dataset:', e);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, []);

  // Global keyboard shortcut for Search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to top on navigation
  const handleNavigate = (view: string, params?: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (view === 'shop') {
      setInitialShopCategory(params?.category || 'all');
    }
    setCurrentView(view);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView('product-detail');
  };

  const handleOrderSuccess = (order: Order, whatsappUrl: string) => {
    setCompletedOrderData({ order, whatsappUrl });
    setCurrentView('order-success');
    loadStoreData(); // refresh orders in background
  };

  // If in Admin view, render isolated admin layout
  if (currentView === 'admin') {
    return (
      <AdminLayout
        currentTab={adminTab}
        onSelectTab={setAdminTab}
        onExitAdmin={() => handleNavigate('home')}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            orders={orders}
            products={products}
            quotes={quotes}
            onNavigateTab={setAdminTab}
          />
        )}
        {adminTab === 'pdv' && (
          <AdminPDV
            products={products}
            onOrderCompleted={loadStoreData}
          />
        )}
        {adminTab === 'products' && (
          <AdminProducts
            products={products}
            onProductsUpdated={loadStoreData}
          />
        )}
        {adminTab === 'orders' && (
          <AdminOrders
            orders={orders}
            onOrdersUpdated={loadStoreData}
          />
        )}
        {adminTab === 'quotes' && (
          <AdminQuotes
            quotes={quotes}
            onQuotesUpdated={loadStoreData}
          />
        )}
        {adminTab === 'coupons' && (
          <AdminCoupons
            coupons={coupons}
            onCouponsUpdated={loadStoreData}
          />
        )}
        {adminTab === 'settings' && (
          <AdminSettings
            settings={settings}
            onSettingsUpdated={(newSets) => setSettings(newSets)}
          />
        )}
      </AdminLayout>
    );
  }

  // Public Storefront Layout
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1F1913] selection:bg-[#AD8942] selection:text-white pb-16 lg:pb-0">
      
      {/* Top Announcement Bar */}
      <AnnouncementBar
        message={settings.announcement}
        whatsapp={settings.whatsapp}
      />

      {/* Main Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSommelier={() => setIsSommelierOpen(true)}
      />

      {/* Slide-out Cart Drawer */}
      <CartDrawer
        onCheckout={() => handleNavigate('checkout')}
        onBrowse={() => handleNavigate('shop')}
      />

      {/* Command Palette / Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Sommelier de Aromas com IA */}
      <SommelierModal
        isOpen={isSommelierOpen}
        onClose={() => setIsSommelierOpen(false)}
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={products}
            onNavigate={handleNavigate}
            onSelectProduct={handleSelectProduct}
            onOpenSommelier={() => setIsSommelierOpen(true)}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            products={products}
            initialCategory={initialShopCategory}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'product-detail' && selectedProduct && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            onBack={() => handleNavigate('shop')}
            onSelectProduct={handleSelectProduct}
            onNavigateToCheckout={() => handleNavigate('checkout')}
          />
        )}

        {currentView === 'lembrancinhas' && (
          <LembrancinhasView />
        )}

        {currentView === 'about' && (
          <AboutView />
        )}

        {(currentView === 'faq' || currentView === 'cuidados' || currentView === 'politicas' || currentView === 'contact') && (
          <InstitutionalView topic={currentView as any} />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            onBack={() => handleNavigate('shop')}
            onOrderSuccess={handleOrderSuccess}
          />
        )}

        {currentView === 'order-success' && completedOrderData && (
          <OrderSuccessView
            order={completedOrderData.order}
            whatsappUrl={completedOrderData.whatsappUrl}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Global Luxury Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Sommelier avatar on Left & Instagram/WhatsApp on Right */}
      <FloatingSocialDock onOpenSommelier={() => setIsSommelierOpen(true)} />

      {/* Responsive Mobile Bottom Dock */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSommelier={() => setIsSommelierOpen(true)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
