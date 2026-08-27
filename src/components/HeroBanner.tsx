import React from 'react';
import { ShieldCheck, Truck, Award, Sparkles, MapPin, ArrowRight } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onOpenArtisans: () => void;
  selectedRegion: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onOpenArtisans,
  selectedRegion
}) => {
  return (
    <div id="hero-banner-section" className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 text-stone-100 border-b border-amber-950/40">
      {/* Background Subtle Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Conexão Direta: Pequeno Produtor ao Consumidor</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-amber-50 leading-tight tracking-tight">
              A alma do artesanato brasileiro na sua casa.
            </h1>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
              Descubra cerâmicas tradicionais do Vale do Jequitinhonha, esculturas do Cariri, rendas de Sergipe e queijos artesanais da Canastra. Peças com história, identidade cultural e comércio justo garantido.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-button"
                onClick={onExploreClick}
                className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow-lg shadow-amber-900/40 hover:shadow-amber-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Explorar Vitrine Regional</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-artisans-button"
                onClick={onOpenArtisans}
                className="px-5 py-3 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 hover:text-white font-medium text-sm border border-stone-700 hover:border-amber-600/50 flex items-center gap-2 transition-all"
              >
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Conhecer os Mestres da Terra</span>
              </button>
            </div>

            {/* Trust Pill Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-800/80 text-xs">
              <div className="flex items-center gap-2 text-stone-300">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-stone-200">Pagamento Seguro</p>
                  <p className="text-stone-400 text-[11px]">Garantia de custódia</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-300">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-stone-200">Avaliações Verificadas</p>
                  <p className="text-stone-400 text-[11px]">Opinião de compradores reais</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-stone-300">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-stone-200">Envio Direto</p>
                  <p className="text-stone-400 text-[11px]">Embalagens reforçadas</p>
                </div>
              </div>
            </div>

          </div>

          {/* Hero Featured Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-700/60 group">
              <img
                src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80"
                alt="Artesanato e cerâmica tradicional brasileira"
                className="w-full h-72 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent flex flex-col justify-end p-5">
                <span className="text-amber-400 font-mono text-xs uppercase tracking-wider font-semibold">Destaque Regional</span>
                <h3 className="text-white font-serif text-lg font-bold">Cerâmica e Barro de Tradição Familiar</h3>
                <p className="text-stone-300 text-xs mt-1">Peças exclusivas moldadas à mão com pigmentos de tauá e barro virgem mineiro.</p>
              </div>
            </div>

            {/* Floating Mini Badge */}
            <div className="absolute -bottom-3 -left-3 bg-stone-900/95 backdrop-blur-md border border-amber-600/40 rounded-xl p-3 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold text-sm">
                100%
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Comércio Justo</p>
                <p className="text-amber-300 text-[11px]">Repasse integral aos artesãos</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
