import React from 'react';
import { ShoppingBag, MessageSquare, ShieldCheck, MapPin, Store, Sparkles, UserCheck } from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  cartItems: CartItem[];
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenChat: () => void;
  onOpenArtisans: () => void;
  selectedRegion: string;
  onSelectRegion: (region: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeView: 'shop' | 'admin';
  onSwitchView: (view: 'shop' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartItems,
  onOpenCart,
  onOpenAdmin,
  onOpenChat,
  onOpenArtisans,
  selectedRegion,
  onSelectRegion,
  searchQuery,
  onSearchChange,
  activeView,
  onSwitchView
}) => {
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const regions = ['Todas', 'Nordeste', 'Sudeste', 'Sul', 'Norte', 'Centro-Oeste'];

  return (
    <header id="main-navbar" className="sticky top-0 z-40 bg-stone-900 text-stone-100 shadow-md border-b border-stone-800">
      {/* Top Notification Bar */}
      <div id="top-announcement" className="bg-amber-800 text-amber-100 text-xs py-1.5 px-4 text-center flex items-center justify-center gap-2 font-medium tracking-wide">
        <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
        <span>Pagamento 100% Seguro com Garantia de Custódia para Produtor e Consumidor | Envio com Rastreio Direto das Oficinas</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div 
            id="brand-logo-button"
            onClick={() => onSwitchView('shop')}
            className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-orange-700 flex items-center justify-center text-white shadow-inner group-hover:scale-105 transition-transform">
              <Store className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold tracking-tight text-amber-50 group-hover:text-amber-200 transition-colors">
                Artesanato<span className="text-amber-400 font-sans ml-1 text-sm font-semibold uppercase tracking-wider">Regional</span>
              </span>
              <p className="text-[10px] text-stone-400 font-sans tracking-tight">Comércio Justo & Mestres da Terra</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <input
                id="search-products-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por cerâmica, mestre artesão, cidade ou tipo de peça..."
                className="w-full bg-stone-800/90 text-stone-100 placeholder-stone-400 text-sm rounded-lg pl-3.5 pr-9 py-2 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
              />
              {searchQuery && (
                <button
                  id="clear-search-button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 text-xs px-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links & Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Switcher: Loja / Painel Admin */}
            <div className="bg-stone-800 p-1 rounded-lg border border-stone-700 flex items-center">
              <button
                id="nav-shop-button"
                onClick={() => onSwitchView('shop')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeView === 'shop'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                Vitrine
              </button>
              <button
                id="nav-admin-button"
                onClick={() => onSwitchView('admin')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                  activeView === 'admin'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <span>Painel Admin</span>
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              </button>
            </div>

            {/* Artisans Directory Trigger */}
            <button
              id="nav-artisans-button"
              onClick={onOpenArtisans}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-300 hover:text-amber-300 bg-stone-800/50 hover:bg-stone-800 rounded-lg border border-stone-700/60 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Nossos Artesãos</span>
            </button>

            {/* Support Chat Trigger */}
            <button
              id="nav-chat-button"
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-200 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/60 rounded-lg transition-colors shadow-sm"
              title="Atendimento e Dúvidas com Suporte Regional"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Suporte & Dúvidas</span>
              <Sparkles className="w-3 h-3 text-amber-300" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="nav-cart-button"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-lg bg-stone-800 text-stone-200 hover:text-white hover:bg-stone-700 border border-stone-700 transition-all flex items-center justify-center"
              aria-label="Abrir carrinho"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              {totalCartCount > 0 && (
                <span id="cart-badge-count" className="absolute -top-1.5 -right-1.5 bg-amber-500 text-stone-950 text-[11px] font-bold rounded-full h-5 min-w-[20px] px-1 flex items-center justify-center shadow-md animate-bounce">
                  {totalCartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <input
            id="mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por artesanato, artesão ou região..."
            className="w-full bg-stone-800 text-stone-100 placeholder-stone-400 text-sm rounded-lg px-3 py-2 border border-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Regional Filter Bar (Horizontal Pills) */}
        <div className="mt-3 pt-2.5 border-t border-stone-800/80 flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <div className="flex items-center gap-1 text-stone-400 flex-shrink-0 font-medium mr-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500" />
            <span>Região:</span>
          </div>
          {regions.map((reg) => (
            <button
              key={reg}
              id={`filter-region-pill-${reg.toLowerCase()}`}
              onClick={() => onSelectRegion(reg)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedRegion === reg
                  ? 'bg-amber-500 text-stone-950 shadow-sm font-semibold scale-105'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700/50'
              }`}
            >
              {reg === 'Todas' ? 'Todas as Regiões' : `Região ${reg}`}
            </button>
          ))}
        </div>

      </div>
    </header>
  );
};
