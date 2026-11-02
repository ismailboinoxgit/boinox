import React from 'react';
import { Heart, Search, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'categories' | 'latest' | 'popular' | 'favorites';
  onSelectTab: (tab: 'home' | 'categories' | 'latest' | 'popular' | 'favorites') => void;
  favoritesCount: number;
  onOpenAdmin: () => void;
  onFocusSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  onOpenAdmin,
  onFocusSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090a]/90 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Strict single line, no subtitle clutter) */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-400 p-[1px] shadow-sm">
            <div className="w-full h-full bg-[#08090a] rounded-[7px] flex items-center justify-center">
              <span className="font-display font-extrabold text-sm tracking-wider text-white group-hover:text-cyan-400 transition-colors">
                B
              </span>
            </div>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-zinc-200 transition-colors whitespace-nowrap">
            BOINOX
          </span>
        </button>

        {/* Zone 2: Navigation Links (Single line, text with subtle indicator) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onSelectTab('home')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'home'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onSelectTab('categories')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'categories'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => onSelectTab('latest')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'latest'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => onSelectTab('popular')}
            className={`transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'popular'
                ? 'text-white font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Popular
          </button>
          <button
            onClick={() => onSelectTab('favorites')}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'favorites'
                ? 'text-rose-400 font-semibold'
                : 'text-zinc-400 hover:text-rose-300'
            }`}
          >
            <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-xs bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded-full font-mono">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onFocusSearch}
            aria-label="Search wallpapers"
            className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-zinc-200 bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-700 rounded-lg transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Admin Hub</span>
            <span className="sm:hidden">Admin</span>
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row for quick navigation */}
      <div className="md:hidden flex items-center justify-around border-t border-zinc-850 px-2 py-2 text-xs font-medium bg-[#0a0c0e]">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-2 py-1 rounded transition-colors ${
            activeTab === 'home' ? 'text-white font-semibold' : 'text-zinc-400'
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onSelectTab('categories')}
          className={`px-2 py-1 rounded transition-colors ${
            activeTab === 'categories' ? 'text-white font-semibold' : 'text-zinc-400'
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => onSelectTab('latest')}
          className={`px-2 py-1 rounded transition-colors ${
            activeTab === 'latest' ? 'text-white font-semibold' : 'text-zinc-400'
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => onSelectTab('popular')}
          className={`px-2 py-1 rounded transition-colors ${
            activeTab === 'popular' ? 'text-white font-semibold' : 'text-zinc-400'
          }`}
        >
          Popular
        </button>
        <button
          onClick={() => onSelectTab('favorites')}
          className={`px-2 py-1 flex items-center gap-1 rounded transition-colors ${
            activeTab === 'favorites' ? 'text-rose-400 font-semibold' : 'text-zinc-400'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
          {favoritesCount > 0 && <span>({favoritesCount})</span>}
        </button>
      </div>
    </header>
  );
};
