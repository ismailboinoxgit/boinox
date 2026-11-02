import React, { useRef } from 'react';
import { Search, Sparkles, X, ArrowRight } from 'lucide-react';
import { WallpaperCategory } from '../types/wallpaper';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (category: WallpaperCategory | 'all') => void;
  selectedCategory: WallpaperCategory | 'all';
  totalCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  onSelectCategory,
  selectedCategory,
  totalCount,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    { label: 'Space Nebula', value: 'space' },
    { label: 'AMOLED 0% Black', value: 'amoled' },
    { label: 'Nordic Twilight', value: 'mountains' },
    { label: 'Supercars 4K', value: 'supercar' },
    { label: 'Liquid Gold', value: 'gold' },
    { label: 'Cyberpunk', value: 'cyber' },
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-14 border-b border-zinc-800/60">
      {/* Subtle ambient background glow */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[340px] bg-gradient-to-b from-cyan-950/20 via-indigo-950/15 to-transparent blur-3xl pointer-events-none -z-10"
        aria-hidden="true" 
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Brand Kicker */}
        <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-400 tracking-wider uppercase mb-3">
          <span className="text-zinc-500">BOINOX</span>
          <span aria-hidden="true">·</span>
          <span>Ultra HD Curation</span>
          <span aria-hidden="true">·</span>
          <span className="text-cyan-400">4K &amp; 8K Master Bitrate</span>
        </div>

        {/* Hero Title with text-wrap: balance */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-3xl mx-auto text-balance">
          Discover Wallpapers <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            Without Limits
          </span>
        </h1>

        <p className="mt-4 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
          Curated master wallpapers engineered for high-DPI retina screens, AMOLED smartphones, and ultrawide battlestations. Uncompressed and free.
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              inputRef.current?.blur();
            }}
            className="relative flex items-center shadow-2xl rounded-2xl bg-zinc-900/90 border border-zinc-700/80 focus-within:border-cyan-500/80 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all"
          >
            <div className="pl-4 text-zinc-400 flex items-center pointer-events-none">
              <Search className="w-5 h-5" />
            </div>

            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search 4K wallpapers by title, category, tags, or resolution..."
              className="w-full py-4 pl-3.5 pr-24 bg-transparent text-sm sm:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-20 text-zinc-400 hover:text-zinc-200 p-1.5 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Popular Search Suggestions */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-zinc-400">
            <span className="text-zinc-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Popular:
            </span>
            {popularSearches.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onSearchChange(item.value)}
                className="hover:text-cyan-400 transition-colors text-zinc-400 hover:underline cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Item Proof Metrics Row (Adjacency principle) */}
        <div className="mt-12 pt-8 border-t border-zinc-850/70 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="text-xs text-zinc-500">Curated Assets</div>
            <div className="text-xl sm:text-2xl font-bold font-display text-white mt-1 tabular-nums">
              {totalCount}+ Wallpapers
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Updated daily</div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="text-xs text-zinc-500">Display Standards</div>
            <div className="text-xl sm:text-2xl font-bold font-display text-cyan-400 mt-1">
              4K &amp; 8K Ultra HD
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Up to 7680×4320</div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="text-xs text-zinc-500">AMOLED Zero Black</div>
            <div className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
              100% #000000
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Saves OLED battery</div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/50">
            <div className="text-xs text-zinc-500">Licensing</div>
            <div className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
              100% Free
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Personal &amp; commercial</div>
          </div>
        </div>
      </div>
    </section>
  );
};
