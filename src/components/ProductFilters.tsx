import React from 'react';
import { Filter, Star, SlidersHorizontal, RotateCcw, MapPin, Tag } from 'lucide-react';
import { FilterState } from '../types';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
  totalProductsCount: number;
}

const CATEGORIES = [
  'Todas',
  'Cerâmica & Barro',
  'Tecelagem & Renda',
  'Madeira & Escultura',
  'Cestas & Fibras',
  'Biojoias',
  'Gastronomia & Doces'
];

const REGIONS = [
  'Todas',
  'Nordeste',
  'Sudeste',
  'Sul',
  'Norte',
  'Centro-Oeste'
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalProductsCount
}) => {
  return (
    <div id="product-filters-bar" className="bg-stone-900/60 backdrop-blur-sm p-4 rounded-xl border border-stone-800 shadow-sm space-y-4">
      
      {/* Top Filter Header & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
        <div className="flex items-center gap-2 text-stone-200 font-semibold text-sm">
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <span>Filtros do Catálogo ({totalProductsCount} {totalProductsCount === 1 ? 'peça encontrada' : 'peças encontradas'})</span>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="sort-by-select" className="text-xs text-stone-400 font-medium">
            Ordenar por:
          </label>
          <select
            id="sort-by-select"
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
            className="bg-stone-800 text-stone-100 text-xs rounded-lg px-2.5 py-1.5 border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="popular">Mais Populares</option>
            <option value="rating">Melhor Avaliados (★ 5.0)</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
            <option value="newest">Novidades Recentes</option>
          </select>

          <button
            id="reset-filters-button"
            onClick={onResetFilters}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 px-2 py-1 rounded bg-stone-800/80 hover:bg-stone-800 transition-colors"
            title="Limpar todos os filtros"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        
        {/* Category Selector */}
        <div>
          <label htmlFor="category-select" className="block text-stone-300 font-medium mb-1.5 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Categoria Artesanal</span>
          </label>
          <select
            id="category-select"
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full bg-stone-800 text-stone-100 rounded-lg p-2 border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Region Locality Selector */}
        <div>
          <label htmlFor="region-filter-select" className="block text-stone-300 font-medium mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Filtro por Localidade / Região</span>
          </label>
          <select
            id="region-filter-select"
            value={filters.region}
            onChange={(e) => onFilterChange({ ...filters, region: e.target.value })}
            className="w-full bg-stone-800 text-stone-100 rounded-lg p-2 border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            {REGIONS.map(reg => (
              <option key={reg} value={reg}>{reg === 'Todas' ? 'Todas as Regiões' : `Região ${reg}`}</option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label htmlFor="min-rating-select" className="block text-stone-300 font-medium mb-1.5 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Avaliação Mínima</span>
          </label>
          <select
            id="min-rating-select"
            value={filters.minRating}
            onChange={(e) => onFilterChange({ ...filters, minRating: Number(e.target.value) })}
            className="w-full bg-stone-800 text-stone-100 rounded-lg p-2 border border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value={0}>Todas as avaliações</option>
            <option value={4.5}>4.5★ ou mais (Excelência)</option>
            <option value={4.8}>4.8★ ou mais (Mestres consagrados)</option>
            <option value={5.0}>Apenas 5.0★ (Nota máxima)</option>
          </select>
        </div>

        {/* In Stock & Price Limit */}
        <div className="flex flex-col justify-end space-y-2">
          <label className="flex items-center gap-2 cursor-pointer select-none text-stone-300 hover:text-white">
            <input
              id="in-stock-checkbox"
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => onFilterChange({ ...filters, inStockOnly: e.target.checked })}
              className="rounded bg-stone-800 border-stone-700 text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span>Apenas peças a pronta entrega</span>
          </label>

          <div className="flex items-center justify-between text-[11px] text-stone-400">
            <span>Preço até R$ {filters.maxPrice}</span>
            <input
              id="price-range-slider"
              type="range"
              min="50"
              max="600"
              step="10"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-24 accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

      </div>

    </div>
  );
};
