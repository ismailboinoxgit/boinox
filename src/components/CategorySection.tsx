import React from 'react';
import { CATEGORY_DETAILS } from '../data/wallpapers';
import { Wallpaper, WallpaperCategory } from '../types/wallpaper';
import { 
  Orbit, 
  Moon, 
  Mountain, 
  Car, 
  Trophy, 
  Sparkles, 
  Layers, 
  Square, 
  Gamepad2, 
  ChevronRight 
} from 'lucide-react';

interface CategorySectionProps {
  wallpapers: Wallpaper[];
  selectedCategory: WallpaperCategory | 'all';
  onSelectCategory: (category: WallpaperCategory | 'all') => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  wallpapers,
  selectedCategory,
  onSelectCategory,
}) => {
  const getIcon = (category: string) => {
    switch (category) {
      case 'Space':
        return <Orbit className="w-4 h-4 text-purple-400" />;
      case 'AMOLED':
        return <Moon className="w-4 h-4 text-cyan-400" />;
      case 'Nature':
        return <Mountain className="w-4 h-4 text-emerald-400" />;
      case 'Cars':
        return <Car className="w-4 h-4 text-rose-400" />;
      case 'Football':
        return <Trophy className="w-4 h-4 text-green-400" />;
      case 'Anime':
        return <Sparkles className="w-4 h-4 text-pink-400" />;
      case 'Abstract':
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 'Minimal':
        return <Square className="w-4 h-4 text-zinc-300" />;
      case 'Gaming':
        return <Gamepad2 className="w-4 h-4 text-blue-400" />;
      default:
        return <Layers className="w-4 h-4 text-zinc-400" />;
    }
  };

  const categories = Object.keys(CATEGORY_DETAILS) as WallpaperCategory[];

  return (
    <section id="categories-section" className="py-12 border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
              Browse Taxonomy
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Wallpaper Categories
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('all')}
            className={`text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              selectedCategory === 'all' ? 'text-cyan-400' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>View All ({wallpapers.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 9 Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {categories.map((catKey) => {
            const detail = CATEGORY_DETAILS[catKey];
            const count = wallpapers.filter((w) => w.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                onClick={() => onSelectCategory(catKey)}
                className={`group relative text-left rounded-xl overflow-hidden p-4 sm:p-5 border transition-all cursor-pointer flex flex-col justify-between min-h-[120px] sm:min-h-[140px] ${
                  isSelected
                    ? 'border-cyan-500 bg-zinc-900/90 ring-1 ring-cyan-500/30'
                    : 'border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-850 hover:border-zinc-700'
                }`}
              >
                {/* Background preview thumbnail with subtle blend */}
                <div 
                  className="absolute inset-0 opacity-15 group-hover:opacity-25 transition-opacity pointer-events-none"
                  aria-hidden="true"
                >
                  <img
                    src={detail.sampleImage}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
                </div>

                {/* Top Row: Icon and Count */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-zinc-800/70 border border-zinc-700/50">
                    {getIcon(catKey)}
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-full border border-zinc-700/40">
                    {count}
                  </span>
                </div>

                {/* Bottom Row: Name and Description */}
                <div className="relative z-10 mt-3">
                  <h3 className={`font-display font-bold text-base sm:text-lg transition-colors flex items-center justify-between ${
                    isSelected ? 'text-cyan-300' : 'text-white group-hover:text-cyan-300'
                  }`}>
                    <span>{detail.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                  </h3>
                  <p className="text-[11px] sm:text-xs text-zinc-400 line-clamp-1 mt-0.5">
                    {detail.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
