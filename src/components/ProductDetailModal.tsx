import React, { useState } from 'react';
import { X, Star, MapPin, ShoppingBag, ShieldCheck, Truck, Clock, Sparkles, Send, CheckCircle2, User } from 'lucide-react';
import { Product, Review, Artisan } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  artisan?: Artisan;
  reviews: Review[];
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onSubmitReview: (productId: string, userName: string, userCity: string, rating: number, comment: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  artisan,
  reviews,
  onClose,
  onAddToCart,
  onSubmitReview
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'artisan' | 'reviews'>('details');

  // Review Form State
  const [newRating, setNewRating] = useState<number>(5);
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserCity, setNewUserCity] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newComment.trim()) return;

    onSubmitReview(product.id, newUserName.trim(), newUserCity.trim() || 'Brasil', newRating, newComment.trim());
    setReviewSubmitted(true);
    setNewUserName('');
    setNewUserCity('');
    setNewComment('');
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  const productReviews = reviews.filter(r => r.productId === product.id);

  return (
    <div id="product-detail-modal-backdrop" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      
      <div 
        id="product-detail-modal-container"
        className="relative bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-800/90 text-stone-300 hover:text-white hover:bg-stone-700 flex items-center justify-center border border-stone-700 transition-colors"
          aria-label="Fechar detalhes"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 sm:p-7">
          
          {/* Left: Gallery & Main Image */}
          <div className="md:col-span-6 space-y-3">
            <div className="rounded-xl overflow-hidden bg-stone-950 aspect-square border border-stone-800 relative">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-md text-amber-300 text-xs px-3 py-1 rounded-full border border-stone-700">
                {product.category}
              </span>
            </div>

            {/* Thumbnail selector */}
            {product.galleryImages && product.galleryImages.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === img ? 'border-amber-500 scale-95' : 'border-stone-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Miniatura ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Guarantee Box */}
            <div className="bg-stone-800/50 rounded-xl p-3.5 border border-stone-700/60 text-xs space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Garantia de Compra Segura & Custódia</span>
              </div>
              <p className="text-stone-300 text-[11px] leading-relaxed">
                Seu pagamento fica protegido pela plataforma e só é repassado ao mestre artesão após a confirmação da entrega da sua peça perfeita.
              </p>
            </div>
          </div>

          {/* Right: Product Info, Tabs & Actions */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              
              {/* Origin Badge */}
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                <MapPin className="w-4 h-4" />
                <span>{product.location.city}, {product.location.state} • Região {product.location.region}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-amber-50 leading-tight">
                {product.name}
              </h2>

              {/* Artisan attribution */}
              <p className="text-sm text-stone-300 flex items-center gap-2">
                <span>Criado por:</span>
                <span className="font-semibold text-amber-300">{product.artisanName}</span>
                {artisan?.badge && (
                  <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-800">
                    {artisan.badge}
                  </span>
                )}
              </p>

              {/* Rating summary */}
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(product.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-white text-sm">{product.rating.toFixed(1)}</span>
                <span className="text-stone-400 text-xs">({productReviews.length} avaliações)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 py-1">
                <span className="text-sm text-stone-400 font-medium">R$</span>
                <span className="text-3xl font-bold text-amber-400 font-sans">{product.price.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-stone-500 line-through">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Navigation Tabs (Details / Artisan / Reviews) */}
              <div className="flex items-center border-b border-stone-800 text-xs font-medium pt-2">
                <button
                  id="tab-details-btn"
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 px-3 border-b-2 transition-all ${
                    activeTab === 'details'
                      ? 'border-amber-500 text-amber-400 font-semibold'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Sobre a Peça
                </button>
                <button
                  id="tab-artisan-btn"
                  onClick={() => setActiveTab('artisan')}
                  className={`pb-2 px-3 border-b-2 transition-all ${
                    activeTab === 'artisan'
                      ? 'border-amber-500 text-amber-400 font-semibold'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  O Artesão
                </button>
                <button
                  id="tab-reviews-btn"
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 px-3 border-b-2 transition-all ${
                    activeTab === 'reviews'
                      ? 'border-amber-500 text-amber-400 font-semibold'
                      : 'border-transparent text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Avaliações ({productReviews.length})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="pt-2 text-xs text-stone-300 min-h-[140px]">
                {activeTab === 'details' && (
                  <div className="space-y-2.5">
                    <p className="leading-relaxed text-stone-300">{product.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-800 text-[11px]">
                      <div>
                        <span className="text-stone-500 block">Dimensões / Peso:</span>
                        <span className="text-stone-200 font-medium">{product.dimensions || 'Peça Única Sob Medida'}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block">Tempo de Feitura:</span>
                        <span className="text-stone-200 font-medium">~{product.productionDays} dias de cura/manufatura</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-stone-500 text-[11px] block mb-1">Materiais Utilizados:</span>
                      <div className="flex flex-wrap gap-1">
                        {product.materials.map((m, i) => (
                          <span key={i} className="bg-stone-800 text-amber-200/90 px-2 py-0.5 rounded text-[11px]">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'artisan' && (
                  <div className="space-y-3">
                    {artisan ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={artisan.avatar}
                            alt={artisan.name}
                            className="w-12 h-12 rounded-full object-cover border border-amber-600/50"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-semibold text-stone-100 text-sm">{artisan.name}</h4>
                            <p className="text-stone-400 text-[11px]">{artisan.specialty} • {artisan.experienceYears} anos de tradição</p>
                          </div>
                        </div>
                        <p className="text-stone-300 text-xs leading-relaxed italic bg-stone-800/40 p-3 rounded-lg border border-stone-800">
                          "{artisan.bio}"
                        </p>
                        <div className="flex items-center gap-3 text-[11px] text-amber-400">
                          <span>★ {artisan.rating} de satisfação</span>
                          <span>•</span>
                          <span>{artisan.totalSales}+ peças enviadas</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-stone-400">Mestre artesão certificado com produção autoral.</p>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                    {productReviews.length === 0 ? (
                      <p className="text-stone-400 italic">Esta peça ainda não possui avaliações. Seja o primeiro a avaliar!</p>
                    ) : (
                      productReviews.map((rev) => (
                        <div key={rev.id} className="bg-stone-800/60 p-3 rounded-lg border border-stone-800 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-stone-200 flex items-center gap-1">
                              <User className="w-3 h-3 text-stone-400" />
                              {rev.userName} ({rev.userCity})
                            </span>
                            <span className="text-[10px] text-stone-400">{rev.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-stone-600'}`} />
                            ))}
                          </div>
                          <p className="text-xs text-stone-300">{rev.comment}</p>
                          {rev.artisanAppreciation && (
                            <p className="text-[11px] text-amber-300/90 bg-amber-950/40 p-1.5 rounded border-l-2 border-amber-500 italic mt-1">
                              Resposta do artesão: {rev.artisanAppreciation}
                            </p>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Submit Review Form Box */}
              {activeTab === 'reviews' && (
                <form onSubmit={handleReviewSubmit} className="mt-3 pt-3 border-t border-stone-800 space-y-2 bg-stone-950/40 p-3 rounded-xl">
                  <h4 className="font-semibold text-stone-200 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Deixe sua Avaliação para esta Peça</span>
                  </h4>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-400">Sua nota:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="p-0.5 hover:scale-110 transition-transform"
                        >
                          <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-stone-600'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Seu nome"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      className="bg-stone-800 text-stone-100 rounded px-2.5 py-1.5 text-xs border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <input
                      type="text"
                      placeholder="Sua cidade/UF"
                      value={newUserCity}
                      onChange={(e) => setNewUserCity(e.target.value)}
                      className="bg-stone-800 text-stone-100 rounded px-2.5 py-1.5 text-xs border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <textarea
                    required
                    rows={2}
                    placeholder="Conte sobre o acabamento, história da peça ou entrega..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-stone-800 text-stone-100 rounded p-2 text-xs border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />

                  <div className="flex items-center justify-between">
                    {reviewSubmitted && (
                      <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Avaliação registrada com sucesso!
                      </span>
                    )}
                    <button
                      type="submit"
                      className="ml-auto px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Publicar Avaliação</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

            {/* Bottom Actions: Quantity Selector & Add to Cart */}
            <div className="pt-4 border-t border-stone-800 flex items-center gap-3">
              
              <div className="flex items-center bg-stone-800 rounded-xl border border-stone-700 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 flex items-center justify-center font-bold text-sm"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold text-sm text-stone-100">{quantity}</span>
                <button
                  type="button"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 flex items-center justify-center font-bold text-sm disabled:opacity-40"
                >
                  +
                </button>
              </div>

              <button
                id="modal-add-to-cart-btn"
                disabled={product.stock <= 0}
                onClick={() => {
                  onAddToCart(product, quantity);
                  onClose();
                }}
                className="flex-1 py-3 px-5 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-98 text-white font-semibold text-sm shadow-lg shadow-amber-900/30 flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar ao Carrinho • R$ {(product.price * quantity).toFixed(2)}</span>
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
