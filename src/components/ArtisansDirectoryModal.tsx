import React from 'react';
import { X, MapPin, Award, Star, ShoppingBag } from 'lucide-react';
import { Artisan } from '../types';

interface ArtisansDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  artisans: Artisan[];
  onFilterByArtisanRegion: (region: string) => void;
}

export const ArtisansDirectoryModal: React.FC<ArtisansDirectoryModalProps> = ({
  isOpen,
  onClose,
  artisans,
  onFilterByArtisanRegion
}) => {
  if (!isOpen) return null;

  return (
    <div id="artisans-modal-backdrop" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      
      <div 
        id="artisans-modal-container"
        className="relative bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
      >
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-stone-800 flex items-center justify-between bg-stone-950/60 sticky top-0 z-10">
          <div>
            <h3 className="font-serif font-bold text-xl text-white">Mestres Artesãos & Pequenos Produtores</h3>
            <p className="text-xs text-stone-400 mt-0.5">Conheça as mãos, histórias e saberes ancestrais por trás de cada peça única.</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Artisans Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {artisans.map((artisan) => (
            <div
              key={artisan.id}
              className="bg-stone-950/70 rounded-xl p-4 border border-stone-800 hover:border-amber-600/50 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start gap-3">
                <img
                  src={artisan.avatar}
                  alt={artisan.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-600/60 flex-shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h4 className="font-semibold text-white text-sm">{artisan.name}</h4>
                    {artisan.badge && (
                      <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded-full border border-amber-800">
                        {artisan.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{artisan.city}, {artisan.state} ({artisan.region})</span>
                  </p>
                  <p className="text-[11px] text-stone-400 font-medium mt-0.5">{artisan.specialty}</p>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed italic bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80">
                "{artisan.bio}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                <div className="flex items-center gap-2 text-stone-400 text-[11px]">
                  <span className="text-amber-400 font-bold flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {artisan.rating}
                  </span>
                  <span>•</span>
                  <span>{artisan.experienceYears} anos de ofício</span>
                </div>

                <button
                  onClick={() => {
                    onFilterByArtisanRegion(artisan.region);
                    onClose();
                  }}
                  className="px-3 py-1 bg-amber-600/80 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  Ver Peças da Região
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
