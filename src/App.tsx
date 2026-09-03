import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductFilters } from './components/ProductFilters';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { SupportChat } from './components/SupportChat';
import { AdminPanel } from './components/AdminPanel';
import { ArtisansDirectoryModal } from './components/ArtisansDirectoryModal';
import { Toast, ToastMessage } from './components/Toast';
import { Product, Artisan, Review, Order, CartItem, FilterState } from './types';
import { INITIAL_PRODUCTS, INITIAL_ARTISANS, INITIAL_REVIEWS, INITIAL_ORDERS } from './data/initialData';
import { Store, ShieldCheck, Heart, MapPin, Sparkles, MessageSquare } from 'lucide-react';

export default function App() {
  // Application Data States
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [artisans, setArtisans] = useState<Artisan[]>(INITIAL_ARTISANS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Navigation & View
  const [activeView, setActiveView] = useState<'shop' | 'admin'>('shop');

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isArtisansOpen, setIsArtisansOpen] = useState<boolean>(false);
  const [checkoutShippingFee, setCheckoutShippingFee] = useState<number>(24.90);
  const [checkoutCep, setCheckoutCep] = useState<string>('01410-000');

  // Notification Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    region: 'Todas',
    category: 'Todas',
    maxPrice: 600,
    minRating: 0,
    inStockOnly: false,
    sortBy: 'popular'
  });

  // Fetch initial data from server API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [prodRes, artRes, ordRes] = await Promise.all([
          fetch('/api/products').catch(() => null),
          fetch('/api/artisans').catch(() => null),
          fetch('/api/orders').catch(() => null)
        ]);

        if (prodRes && prodRes.ok) {
          const prods = await prodRes.json();
          if (prods && prods.length) setProducts(prods);
        }

        if (artRes && artRes.ok) {
          const arts = await artRes.json();
          if (arts && arts.length) setArtisans(arts);
        }

        if (ordRes && ordRes.ok) {
          const ords = await ordRes.json();
          if (ords && ords.length) setOrders(ords);
        }
      } catch (err) {
        console.warn('Usando dados em memória locais:', err);
      }
    };

    loadInitialData();
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Region Filter
      if (filters.region !== 'Todas' && p.location.region !== filters.region) {
        return false;
      }
      // Category Filter
      if (filters.category !== 'Todas' && p.category !== filters.category) {
        return false;
      }
      // Max Price
      if (p.price > filters.maxPrice) {
        return false;
      }
      // Min Rating
      if (filters.minRating > 0 && p.rating < filters.minRating) {
        return false;
      }
      // In stock
      if (filters.inStockOnly && p.stock <= 0) {
        return false;
      }
      // Search
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesArtisan = p.artisanName.toLowerCase().includes(q);
        const matchesCity = p.location.city.toLowerCase().includes(q);
        const matchesState = p.location.state.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesArtisan && !matchesCity && !matchesState) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') return a.price - b.price;
      if (filters.sortBy === 'price_desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return b.reviewCount - a.reviewCount; // popular default
    });
  }, [products, filters]);

  // Cart Operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (product.stock <= 0) {
      addToast('error', 'Peça esgotada no momento.');
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });

    addToast('success', `${product.name} adicionado ao carrinho!`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('info', 'Item removido do carrinho.');
  };

  const handleProceedToCheckout = (shippingFee: number, shippingCep: string) => {
    setCheckoutShippingFee(shippingFee);
    setCheckoutCep(shippingCep);
    setIsCheckoutOpen(true);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Reduce local stock
    setProducts((prev) =>
      prev.map((p) => {
        const boughtItem = newOrder.items.find((it) => it.productId === p.id);
        if (boughtItem) {
          return { ...p, stock: Math.max(0, p.stock - boughtItem.quantity) };
        }
        return p;
      })
    );
    setCartItems([]);
    addToast('success', `Pedido ${newOrder.id} confirmado com pagamento seguro!`);
  };

  // Review Submission
  const handleSubmitReview = async (
    productId: string,
    userName: string,
    userCity: string,
    rating: number,
    comment: string
  ) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      userName,
      userCity,
      rating,
      comment,
      date: new Date().toLocaleDateString('pt-BR'),
      verifiedPurchase: true
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate product rating locally
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const prodsRevs = [newRev, ...reviews.filter((r) => r.productId === productId)];
          const avg = prodsRevs.reduce((acc, r) => acc + r.rating, 0) / prodsRevs.length;
          return { ...p, rating: Number(avg.toFixed(1)), reviewCount: prodsRevs.length };
        }
        return p;
      })
    );

    addToast('success', 'Sua avaliação foi publicada com sucesso!');

    // Post to server
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, userName, userCity, rating, comment })
      });
    } catch (e) {
      console.warn('Erro ao salvar review no servidor:', e);
    }
  };

  // Admin Actions
  const handleUpdateStock = async (productId: string, newStock: number, newPrice?: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            stock: newStock,
            price: newPrice !== undefined ? newPrice : p.price
          };
        }
        return p;
      })
    );

    addToast('success', 'Estoque/Preço atualizado com sucesso.');

    try {
      await fetch(`/api/products/${productId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock, price: newPrice })
      });
    } catch (e) {
      console.warn('Erro no sync do estoque:', e);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    addToast('info', 'Produto removido do catálogo.');

    try {
      await fetch(`/api/products/${productId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Erro ao deletar produto no backend:', e);
    }
  };

  const handleAddProduct = async (productData: Partial<Product>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) {
        const created: Product = await res.json();
        setProducts((prev) => [created, ...prev]);
        addToast('success', `Peça "${created.name}" cadastrada com sucesso!`);
        return;
      }
    } catch (e) {
      console.warn('Fallback criação local:', e);
    }

    // Fallback local creation
    const localNew: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name || 'Nova Peça Artesanal',
      description: productData.description || '',
      category: productData.category || 'Cerâmica & Barro',
      price: productData.price || 99,
      image: productData.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
      galleryImages: [productData.image || 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80'],
      stock: productData.stock || 5,
      artisanId: productData.artisanId || 'art-1',
      artisanName: productData.artisanName || 'Artesão Local',
      location: productData.location || { city: 'São Paulo', state: 'SP', region: 'Sudeste' },
      dimensions: productData.dimensions || 'Peça Única',
      materials: productData.materials || ['Materiais Naturais'],
      productionDays: 3,
      rating: 5.0,
      reviewCount: 0,
      sustainableTag: 'Produção Local',
      createdAt: new Date().toISOString()
    };

    setProducts((prev) => [localNew, ...prev]);
    addToast('success', `Peça "${localNew.name}" adicionada ao catálogo!`);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: status } : o))
    );
    addToast('success', `Status do pedido ${orderId} alterado para "${status}".`);

    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: status })
      });
    } catch (e) {
      console.warn('Erro ao atualizar status do pedido no backend:', e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Top Navbar */}
      <Navbar
        cartItems={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setActiveView('admin')}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenArtisans={() => setIsArtisansOpen(true)}
        selectedRegion={filters.region}
        onSelectRegion={(reg) => setFilters((f) => ({ ...f, region: reg }))}
        searchQuery={filters.search}
        onSearchChange={(query) => setFilters((f) => ({ ...f, search: query }))}
        activeView={activeView}
        onSwitchView={setActiveView}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {activeView === 'admin' ? (
          <AdminPanel
            products={products}
            orders={orders}
            artisans={artisans}
            onUpdateStock={handleUpdateStock}
            onDeleteProduct={handleDeleteProduct}
            onAddProduct={handleAddProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        ) : (
          <div className="space-y-8">
            
            {/* Hero Banner Section */}
            <HeroBanner
              onExploreClick={() => {
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenArtisans={() => setIsArtisansOpen(true)}
              selectedRegion={filters.region}
            />

            {/* Catalog Section with Filters & Product Grid */}
            <div id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
              
              {/* Filter Controls Bar */}
              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={() =>
                  setFilters({
                    search: '',
                    region: 'Todas',
                    category: 'Todas',
                    maxPrice: 600,
                    minRating: 0,
                    inStockOnly: false,
                    sortBy: 'popular'
                  })
                }
                totalProductsCount={filteredProducts.length}
              />

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-stone-900/40 rounded-2xl border border-stone-800 space-y-3 p-6">
                  <div className="w-14 h-14 rounded-full bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
                    <Store className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-semibold text-stone-200">Nenhuma peça encontrada com esses filtros</h3>
                  <p className="text-xs text-stone-400 max-w-sm mx-auto">
                    Tente selecionar outra região, ajustar a faixa de preço ou limpar a busca.
                  </p>
                  <button
                    onClick={() =>
                      setFilters({
                        search: '',
                        region: 'Todas',
                        category: 'Todas',
                        maxPrice: 600,
                        minRating: 0,
                        inStockOnly: false,
                        sortBy: 'popular'
                      })
                    }
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold"
                  >
                    Ver Todo o Catálogo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={(p) => setSelectedProduct(p)}
                      onAddToCart={(p) => handleAddToCart(p, 1)}
                    />
                  ))}
                </div>
              )}

              {/* Trust & Community Banner */}
              <div className="bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 p-6 sm:p-8 rounded-2xl border border-amber-900/40 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Movimento da Arte Popular Brasileira</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                    Você é um pequeno produtor ou artesão da sua região?
                  </h3>
                  <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                    Nossa plataforma apoia comunidades tradicionais, associações de rendeiras, mestres ceramistas e produtores da agricultura familiar com infraestrutura de pagamento seguro e alcance nacional.
                  </p>
                </div>

                <button
                  onClick={() => setIsChatOpen(true)}
                  className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg whitespace-nowrap transition-all flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Falar com o Suporte Regional</span>
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 text-xs py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-500" />
            <span className="font-serif font-bold text-stone-200">Artesanato Regional</span>
            <span className="text-[11px] text-stone-500">— Conectando Pequenos Produtores e Consumidores</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-stone-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Pagamento Seguro em Custódia
            </span>
            <span className="flex items-center gap-1 text-stone-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" /> 100% Origem Regional Verificada
            </span>
          </div>
        </div>
      </footer>

      {/* Product Detail & Reviews Modal */}
      <ProductDetailModal
        product={selectedProduct}
        artisan={artisans.find((a) => a.id === selectedProduct?.artisanId)}
        reviews={reviews}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onSubmitReview={handleSubmitReview}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      {/* Checkout Modal with Secure Multi-Payment */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        shippingFee={checkoutShippingFee}
        initialCep={checkoutCep}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Support Customer Chat with AI */}
      <SupportChat
        isOpen={isChatOpen}
        onOpen={() => setIsChatOpen(true)}
        onClose={() => setIsChatOpen(false)}
        onSelectRegionFilter={(reg) => {
          setFilters((f) => ({ ...f, region: reg }));
          setActiveView('shop');
        }}
      />

      {/* Artisans Directory Modal */}
      <ArtisansDirectoryModal
        isOpen={isArtisansOpen}
        onClose={() => setIsArtisansOpen(false)}
        artisans={artisans}
        onFilterByArtisanRegion={(reg) => {
          setFilters((f) => ({ ...f, region: reg }));
          setActiveView('shop');
        }}
      />

    </div>
  );
}
