import React from 'react';
import { Star, MapPin, ShoppingBag, Eye, ShieldCheck, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onSelectArtisan?: (artisanId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onAddToCart,
  onSelectArtisan
}) => {
  const isLowStock = product.stock > 0 && product.stock <= 4;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="bg-stone-900 rounded-2xl overflow-hidden border border-stone-800/90 hover:border-amber-600/60 shadow-md hover:shadow-xl hover:shadow-amber-950/20 transition-all duration-300 flex flex-col group"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-stone-950">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Category Pill */}
        <span className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md text-amber-300 text-[11px] font-medium px-2.5 py-1 rounded-full border border-stone-700/60 shadow-sm">
          {product.category}
        </span>

        {/* Sustainable Tag */}
        {product.sustainableTag && (
          <span className="absolute bottom-3 left-3 bg-amber-950/90 text-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-amber-700/50 shadow">
            {product.sustainableTag}
          </span>
        )}

        {/* Quick View Button */}
        <button
          id={`quick-view-btn-${product.id}`}
          onClick={() => onSelectProduct(product)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/80 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center backdrop-blur-sm transition-colors shadow"
          title="Ver detalhes da peça e avaliações"
          aria-label="Ver detalhes da peça"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Stock Status Pill if low or out */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-stone-950/75 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-red-950 text-red-200 text-xs font-bold px-3 py-1 rounded-full border border-red-800">
              Esgotado Temporariamente
            </span>
          </div>
        ) : isLowStock ? (
          <span className="absolute bottom-3 right-3 bg-orange-950/90 text-orange-300 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-700/60">
            Apenas {product.stock} un.
          </span>
        ) : null}
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-2">
          
          {/* Locality & Origin Tag */}
          <div className="flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-1 text-amber-400/90 font-medium">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{product.location.city}, {product.location.state}</span>
            </div>
            <span className="text-[11px] bg-stone-800 px-1.5 py-0.5 rounded text-stone-300">
              {product.location.region}
            </span>
          </div>

          {/* Product Title */}
          <h3 
            id={`product-title-${product.id}`}
            onClick={() => onSelectProduct(product)}
            className="text-stone-100 font-serif font-semibold text-base leading-snug hover:text-amber-300 cursor-pointer line-clamp-2 transition-colors"
          >
            {product.name}
          </h3>

          {/* Artisan Name */}
          <p className="text-xs text-stone-400 flex items-center gap-1">
            <span>Feito por:</span>
            <span className="text-stone-200 font-medium">{product.artisanName}</span>
          </p>

          {/* Reviews & Star Rating */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-stone-100">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-stone-500">|</span>
            <button
              onClick={() => onSelectProduct(product)}
              className="text-stone-400 hover:text-amber-300 text-xs underline decoration-stone-600 hover:decoration-amber-400"
            >
              {product.reviewCount} {product.reviewCount === 1 ? 'avaliação' : 'avaliações'}
            </button>
          </div>

        </div>

        {/* Pricing & Add to Cart Footer */}
        <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-stone-400">R$</span>
              <span className="text-lg font-bold text-amber-400 font-sans">{product.price.toFixed(2)}</span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-[11px] text-stone-500 line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            id={`add-to-cart-btn-${product.id}`}
            disabled={isOutOfStock}
            onClick={() => onAddToCart(product)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow transition-all ${
              isOutOfStock
                ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95'
            }`}
            title="Adicionar ao carrinho de compras"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Comprar</span>
          </button>
        </div>

      </div>
    </div>
  );
};
