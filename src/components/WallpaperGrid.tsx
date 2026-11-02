import React, { useState } from 'react';
import { 
  Download, 
  Heart, 
  Eye, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw,
  Monitor,
  Smartphone,
  Maximize2
} from 'lucide-react';
import { Wallpaper, WallpaperCategory, SortOption, OrientationFilter, ResolutionFilter } from '../types/wallpaper';

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  selectedCategory: WallpaperCategory | 'all';
  onSelectCategory: (cat: WallpaperCategory | 'all') => void;
  searchQuery: string;
  onClearSearch: () => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  orientationFilter: OrientationFilter;
  onOrientationChange: (orientation: OrientationFilter) => void;
  resolutionFilter: ResolutionFilter;
  onResolutionChange: (res: ResolutionFilter) => void;
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  isFavorite: (id: string) => boolean;
  onQuickDownload: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
  onlyFavorites: boolean;
  onToggleOnlyFavorites: () => void;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  wallpapers,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  sortBy,
  onSortChange,
  orientationFilter,
  onOrientationChange,
  resolutionFilter,
  onResolutionChange,
  onSelectWallpaper,
  onToggleFavorite,
  isFavorite,
  onQuickDownload,
  onlyFavorites,
  onToggleOnlyFavorites,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const categories: (WallpaperCategory | 'all')[] = [
    'all',
    'Space',
    'AMOLED',
    'Nature',
    'Cars',
    'Football',
    'Anime',
    'Abstract',
    'Minimal',
    'Gaming',
  ];

  return (
    <section id="gallery-section" className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Active Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-800/80 gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>{onlyFavorites ? 'Your Favorite Wallpapers' : 'Wallpaper Gallery'}</span>
              <span className="text-sm font-mono font-normal text-zinc-400 bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-700/60 tabular-nums">
                {wallpapers.length} {wallpapers.length === 1 ? 'asset' : 'assets'}
              </span>
            </h2>
            <div className="text-xs text-zinc-400 mt-1 flex items-center gap-2">
              <span>Filter: {selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
              {searchQuery && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-cyan-400">Query: &quot;{searchQuery}&quot;</span>
                  <button
                    onClick={onClearSearch}
                    className="text-zinc-400 hover:text-white underline cursor-pointer"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Controls: Favorites Toggle & Sorting */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onToggleOnlyFavorites}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                onlyFavorites
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Favorites Only</span>
            </button>

            {/* Sort Dropdown / Selector */}
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
              <label htmlFor="sort-select" className="text-zinc-500 hidden sm:inline">Sort:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer pr-1"
              >
                <option value="latest" className="bg-zinc-900 text-white">Latest Added</option>
                <option value="popular" className="bg-zinc-900 text-white">Most Popular</option>
                <option value="downloads" className="bg-zinc-900 text-white">Most Downloaded</option>
                <option value="resolution" className="bg-zinc-900 text-white">Highest Resolution</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Bar: Categories + Device Orientation + Resolution Filter */}
        <div className="py-5 flex flex-col gap-4">
          {/* Categories Pill/Tab Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-sm'
                      : 'bg-zinc-900/90 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  {cat === 'all' ? 'All Wallpapers' : cat}
                </button>
              );
            })}
          </div>

          {/* Secondary Filters: Orientation & Resolution standard */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Orientation segmented control */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800/80">
              <button
                onClick={() => onOrientationChange('all')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  orientationFilter === 'all' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All Screens
              </button>
              <button
                onClick={() => onOrientationChange('landscape')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  orientationFilter === 'landscape' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Monitor className="w-3 h-3" />
                <span>Desktop (16:9)</span>
              </button>
              <button
                onClick={() => onOrientationChange('portrait')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  orientationFilter === 'portrait' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                <span>Mobile (9:16)</span>
              </button>
              <button
                onClick={() => onOrientationChange('ultrawide')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  orientationFilter === 'ultrawide' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Maximize2 className="w-3 h-3" />
                <span>Ultrawide (21:9)</span>
              </button>
            </div>

            {/* Resolution standard filter */}
            <div className="flex items-center gap-1 p-1 bg-zinc-900/80 rounded-lg border border-zinc-800/80">
              <button
                onClick={() => onResolutionChange('all')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  resolutionFilter === 'all' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All Quality
              </button>
              <button
                onClick={() => onResolutionChange('4k')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  resolutionFilter === '4k' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                4K UHD
              </button>
              <button
                onClick={() => onResolutionChange('8k')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  resolutionFilter === '8k' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                8K Ultra
              </button>
              <button
                onClick={() => onResolutionChange('amoled')}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  resolutionFilter === 'amoled' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                AMOLED
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {wallpapers.length === 0 && (
          <div className="py-20 text-center rounded-2xl bg-zinc-900/30 border border-zinc-800/80 p-8 my-6">
            <div className="w-12 h-12 mx-auto rounded-full bg-zinc-850 flex items-center justify-center text-zinc-500 mb-4">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-white">No wallpapers match your criteria</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-sm mx-auto">
              Try clearing your search query or switching to another category or orientation filter.
            </p>
            <button
              onClick={() => {
                onSelectCategory('all');
                onClearSearch();
                onOrientationChange('all');
                onResolutionChange('all');
                if (onlyFavorites) onToggleOnlyFavorites();
              }}
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}

        {/* Wallpaper Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wallpapers.map((wallpaper) => {
            const isPortrait = wallpaper.orientation === 'portrait';
            const isUltrawide = wallpaper.orientation === 'ultrawide';

            return (
              <div
                key={wallpaper.id}
                onClick={() => onSelectWallpaper(wallpaper)}
                className={`group relative rounded-2xl overflow-hidden bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 hover:shadow-xl transition-all duration-300 flex flex-col justify-end cursor-pointer ${
                  isPortrait ? 'aspect-[9/13]' : isUltrawide ? 'aspect-[21/11]' : 'aspect-[16/10]'
                }`}
              >
                {/* Wallpaper Preview Image or Fallback */}
                {!imageErrors[wallpaper.id] ? (
                  <img
                    src={wallpaper.url}
                    alt={wallpaper.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(wallpaper.id)}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-xs text-zinc-400 font-medium">{wallpaper.title}</span>
                    <span className="text-[10px] text-zinc-600 mt-1">{wallpaper.category}</span>
                  </div>
                )}

                {/* Dark Gradient Scrim Overlay */}
                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 opacity-75 group-hover:opacity-90 transition-opacity"
                  aria-hidden="true" 
                />

                {/* Top Floating Controls */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="px-2 py-0.5 text-[10px] font-semibold text-zinc-200 bg-black/60 backdrop-blur-md rounded border border-white/10">
                    {wallpaper.resolutionStandard}
                  </span>

                  <div className="flex items-center gap-1.5 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => onToggleFavorite(wallpaper.id, e)}
                      aria-label="Add to favorites"
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-400 transition-colors border border-white/10 cursor-pointer"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFavorite(wallpaper.id) ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => onQuickDownload(wallpaper, e)}
                      aria-label="Quick download"
                      title="Quick Download"
                      className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-cyan-400 transition-colors border border-white/10 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bottom Metadata (Zero-Pill Discipline: unboxed text with subtle dividers) */}
                <div className="relative z-10 p-4">
                  <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mb-1">
                    <span>{wallpaper.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums font-mono text-[10px]">{wallpaper.resolution}</span>
                    <span aria-hidden="true">·</span>
                    <span>{wallpaper.fileSize}</span>
                  </div>

                  <h3 className="font-display font-bold text-sm sm:text-base text-white group-hover:text-cyan-300 transition-colors truncate">
                    {wallpaper.title}
                  </h3>

                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="truncate max-w-[140px]">{wallpaper.author.name}</span>
                    <span className="tabular-nums font-mono">{wallpaper.downloads.toLocaleString()} dl</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
