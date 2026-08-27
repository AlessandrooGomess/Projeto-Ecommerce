import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, MapPin } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (shippingFee: number, shippingCep: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [cepInput, setCepInput] = useState<string>('01410-000');
  const [shippingCalculated, setShippingCalculated] = useState<boolean>(true);
  const [calculatedShippingFee, setCalculatedShippingFee] = useState<number>(24.90);
  const [shippingRegionName, setShippingRegionName] = useState<string>('Sudeste (Envio Padrão com Rastreio)');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const finalTotal = subtotal + (cartItems.length > 0 ? calculatedShippingFee : 0);

  const handleCalculateCep = (e: React.FormEvent) => {
    e.preventDefault();
    if (cepInput.trim().length >= 8) {
      // Simulate regional shipping rates
      const digits = cepInput.replace(/\D/g, '');
      const firstDigit = digits.charAt(0);

      if (['0', '1', '2', '3'].includes(firstDigit)) {
        setCalculatedShippingFee(22.50);
        setShippingRegionName('Sudeste (Entrega Direta do Artesão)');
      } else if (['4', '5'].includes(firstDigit)) {
        setCalculatedShippingFee(28.90);
        setShippingRegionName('Nordeste (Rota Direta das Oficinas)');
      } else if (['8', '9'].includes(firstDigit)) {
        setCalculatedShippingFee(26.00);
        setShippingRegionName('Sul (Frete Seguro)');
      } else {
        setCalculatedShippingFee(32.00);
        setShippingRegionName('Norte / Centro-Oeste');
      }
      setShippingCalculated(true);
    }
  };

  return (
    <div id="cart-drawer-backdrop" className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end">
      
      <div 
        id="cart-drawer-panel"
        className="w-full max-w-md bg-stone-900 text-stone-100 h-full flex flex-col border-l border-stone-800 shadow-2xl relative animate-in slide-in-from-right duration-300"
      >
        
        {/* Cart Header */}
        <div className="p-4 sm:p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950/60">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-lg text-white">Carrinho de Compras</h3>
            <span className="bg-stone-800 text-amber-300 text-xs px-2 py-0.5 rounded-full font-sans font-medium">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)} itens
            </span>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-stone-800/60">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-stone-400">
              <div className="w-16 h-16 rounded-full bg-stone-800/80 flex items-center justify-center text-stone-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="font-medium text-stone-200 text-base">Seu carrinho está vazio</p>
                <p className="text-xs text-stone-400 mt-1 max-w-xs">
                  Explore o catálogo de mestres ceramistas, tecelões e artesãos do Brasil.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold rounded-xl transition-colors shadow"
              >
                Explorar Catálogo
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.product.id} className="pt-3 flex gap-3 items-start">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-stone-950 flex-shrink-0 border border-stone-800"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="text-xs font-semibold text-stone-100 truncate">{item.product.name}</h4>
                  <p className="text-[11px] text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" />
                    <span>{item.product.location.city}, {item.product.location.state}</span>
                  </p>
                  
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-bold text-amber-400">
                      R$ {(item.product.price * item.quantity).toFixed(2)}
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-stone-800 rounded-lg border border-stone-700">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-stone-300 hover:text-white hover:bg-stone-700 rounded-l"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-medium text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="px-2 py-0.5 text-xs text-stone-300 hover:text-white hover:bg-stone-700 rounded-r disabled:opacity-30"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="p-1 text-stone-500 hover:text-red-400 transition-colors"
                        title="Remover produto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Footer Summary & Shipping */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-stone-950 border-t border-stone-800 space-y-3">
            
            {/* CEP Shipping Calculator */}
            <form onSubmit={handleCalculateCep} className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-stone-300">
                <span className="flex items-center gap-1 font-medium">
                  <Truck className="w-3.5 h-3.5 text-amber-400" />
                  Calcular Frete Regional:
                </span>
                {shippingCalculated && (
                  <span className="text-amber-400 font-semibold">R$ {calculatedShippingFee.toFixed(2)}</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cepInput}
                  onChange={(e) => setCepInput(e.target.value)}
                  className="flex-1 bg-stone-800 text-stone-100 text-xs px-2.5 py-1.5 rounded-lg border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold rounded-lg border border-stone-700 transition-colors"
                >
                  OK
                </button>
              </div>

              {shippingCalculated && (
                <p className="text-[10px] text-stone-400 italic">
                  {shippingRegionName}
                </p>
              )}
            </form>

            {/* Price breakdown */}
            <div className="space-y-1.5 text-xs text-stone-300 pt-1">
              <div className="flex justify-between">
                <span>Subtotal dos produtos:</span>
                <span className="text-white font-medium">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Frete Seguro Direto:</span>
                <span className="text-white font-medium">R$ {calculatedShippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-stone-800">
                <span>Total com Garantia:</span>
                <span className="text-amber-400 font-sans text-lg">R$ {finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Trust Pill */}
            <div className="flex items-center gap-2 text-[11px] text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/40">
              <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-400" />
              <span>Garantia de Custódia: repasse ao artesão apenas após a entrega.</span>
            </div>

            {/* Checkout Button */}
            <button
              id="checkout-proceed-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout(calculatedShippingFee, cepInput);
              }}
              className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Finalizar Compra Segura</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>

    </div>
  );
};
