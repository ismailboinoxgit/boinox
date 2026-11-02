import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FeaturedSection } from './components/FeaturedSection';
import { CategorySection } from './components/CategorySection';
import { WallpaperGrid } from './components/WallpaperGrid';
import { WallpaperModal } from './components/WallpaperModal';
import { AdminModal } from './components/AdminModal';
import { PolicyModal, PolicyTab } from './components/PolicyModal';
import { AdPlaceholder } from './components/AdPlaceholder';
import { Footer } from './components/Footer';

import { Wallpaper, WallpaperCategory, SortOption, OrientationFilter, ResolutionFilter } from './types/wallpaper';
import { StorageService } from './services/storageService';
import { downloadWallpaper } from './utils/downloadHelper';
import { Check, AlertCircle, Heart } from 'lucide-react';

export default function App() {
  // Navigation & Data State
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'latest' | 'popular' | 'favorites'>('home');
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Modals
  const [selectedWallpaper, setSelectedWallpaper] = useState<Wallpaper | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState<{ isOpen: boolean; tab: PolicyTab }>({
    isOpen: false,
    tab: 'about',
  });

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WallpaperCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [orientationFilter, setOrientationFilter] = useState<OrientationFilter>('all');
  const [resolutionFilter, setResolutionFilter] = useState<ResolutionFilter>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Initialize data on mount
  useEffect(() => {
    const loadedWallpapers = StorageService.getAllWallpapers();
    const loadedFavorites = StorageService.getFavorites();
    setWallpapers(loadedWallpapers);
    setFavorites(loadedFavorites);
  }, []);

  // Handle Tab changes
  const handleSelectTab = (tab: 'home' | 'categories' | 'latest' | 'popular' | 'favorites') => {
    setActiveTab(tab);

    if (tab === 'home') {
      setSelectedCategory('all');
      setOnlyFavorites(false);
      setSortBy('latest');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'categories') {
      const el = document.getElementById('categories-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (tab === 'latest') {
      setSortBy('latest');
      setOnlyFavorites(false);
      const el = document.getElementById('gallery-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'popular') {
      setSortBy('popular');
      setOnlyFavorites(false);
      const el = document.getElementById('gallery-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'favorites') {
      setOnlyFavorites(true);
      const el = document.getElementById('gallery-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Favorites Toggle
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const result = StorageService.toggleFavorite(id);
    setFavorites(result.favorites);
    const targetW = wallpapers.find((w) => w.id === id);
    if (result.isFavorite) {
      showToast('success', `Saved "${targetW?.title || 'Wallpaper'}" to favorites`);
    } else {
      showToast('success', `Removed from favorites`);
    }
  };

  const isFavorite = (id: string) => favorites.includes(id);

  // Quick 1-click Download Action from Grid/Featured Cards
  const handleQuickDownload = async (wallpaper: Wallpaper, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast('success', `Starting download for ${wallpaper.title}...`);

    const filename = `BOINOX-${wallpaper.slug}-${wallpaper.resolution}.jpg`;
    const res = await downloadWallpaper(wallpaper.url, { filename });

    if (res.success) {
      StorageService.recordDownload(wallpaper.id);
      setWallpapers((prev) =>
        prev.map((w) => (w.id === wallpaper.id ? { ...w, downloads: w.downloads + 1 } : w))
      );
      showToast('success', `Downloaded ${wallpaper.title}`);
    } else {
      showToast('error', `Download error: ${res.error || 'Failed to download'}. Opening direct link...`);
      window.open(wallpaper.url, '_blank', 'noopener,noreferrer');
    }
  };

  // Handle new custom wallpaper added in Admin
  const handleWallpaperAdded = (newW: Wallpaper) => {
    setWallpapers((prev) => [newW, ...prev]);
    showToast('success', `"${newW.title}" added to gallery!`);
  };

  // Filter & Sort Logic
  const filteredWallpapers = useMemo(() => {
    let result = [...wallpapers];

    // Filter by Category
    if (selectedCategory !== 'all') {
      result = result.filter((w) => w.category === selectedCategory);
    }

    // Filter by Favorites
    if (onlyFavorites) {
      result = result.filter((w) => favorites.includes(w.id));
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.category.toLowerCase().includes(q) ||
          w.tags.some((t) => t.toLowerCase().includes(q)) ||
          w.resolution.toLowerCase().includes(q) ||
          w.resolutionStandard.toLowerCase().includes(q)
      );
    }

    // Filter by Orientation
    if (orientationFilter !== 'all') {
      result = result.filter((w) => w.orientation === orientationFilter);
    }

    // Filter by Resolution
    if (resolutionFilter === '4k') {
      result = result.filter((w) => w.resolutionStandard === '4K UHD');
    } else if (resolutionFilter === '8k') {
      result = result.filter((w) => w.resolutionStandard === '8K UHD');
    } else if (resolutionFilter === 'amoled') {
      result = result.filter((w) => w.category === 'AMOLED' || w.resolutionStandard === 'AMOLED QHD');
    }

    // Sorting
    if (sortBy === 'latest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.views - a.views);
    } else if (sortBy === 'downloads') {
      result.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === 'resolution') {
      result.sort((a, b) => {
        const getPixels = (res: string) => {
          const [width, height] = res.split('x').map(Number);
          return (width || 0) * (height || 0);
        };
        return getPixels(b.resolution) - getPixels(a.resolution);
      });
    }

    return result;
  }, [
    wallpapers,
    selectedCategory,
    onlyFavorites,
    favorites,
    searchQuery,
    orientationFilter,
    resolutionFilter,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#08090a] text-zinc-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md border ${
              toast.type === 'success'
                ? 'bg-zinc-900/95 text-white border-zinc-700'
                : 'bg-rose-950/95 text-rose-200 border-rose-800'
            }`}
          >
            {toast.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* 1. Header & Navigation (Strict 3-zone contract) */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        favoritesCount={favorites.length}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onFocusSearch={() => {
          const el = document.querySelector('input[type="text"]') as HTMLInputElement;
          el?.focus();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        {/* 2. Hero Section: "Discover Wallpapers Without Limits" */}
        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (activeTab !== 'home') setActiveTab('home');
          }}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const el = document.getElementById('gallery-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          selectedCategory={selectedCategory}
          totalCount={wallpapers.length}
        />

        {/* 3. Featured 4K & 8K Wallpapers Showcase */}
        {selectedCategory === 'all' && !searchQuery && !onlyFavorites && (
          <FeaturedSection
            wallpapers={wallpapers}
            onSelectWallpaper={(w) => setSelectedWallpaper(w)}
            onToggleFavorite={handleToggleFavorite}
            isFavorite={isFavorite}
            onQuickDownload={handleQuickDownload}
          />
        )}

        {/* 4. Compliant Ad Placeholder (Leaderboard) */}
        <AdPlaceholder format="leaderboard" />

        {/* 5. 9-Category Section */}
        <CategorySection
          wallpapers={wallpapers}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            const el = document.getElementById('gallery-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 6. Main Wallpaper Gallery with Full Filters and Sorting */}
        <WallpaperGrid
          wallpapers={filteredWallpapers}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          sortBy={sortBy}
          onSortChange={setSortBy}
          orientationFilter={orientationFilter}
          onOrientationChange={setOrientationFilter}
          resolutionFilter={resolutionFilter}
          onResolutionChange={setResolutionFilter}
          onSelectWallpaper={(w) => setSelectedWallpaper(w)}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
          onQuickDownload={handleQuickDownload}
          onlyFavorites={onlyFavorites}
          onToggleOnlyFavorites={() => setOnlyFavorites(!onlyFavorites)}
        />
      </main>

      {/* 7. Footer with About, Contact, Privacy Policy, DMCA, and Categories */}
      <Footer
        onOpenPolicy={(tab) => setPolicyModal({ isOpen: true, tab })}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setOnlyFavorites(false);
        }}
      />

      {/* Wallpaper Detail & Download Modal */}
      <WallpaperModal
        wallpaper={selectedWallpaper}
        onClose={() => setSelectedWallpaper(null)}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedWallpaper ? isFavorite(selectedWallpaper.id) : false}
        onDownloadIncrement={(id) => {
          setWallpapers((prev) =>
            prev.map((w) => (w.id === id ? { ...w, downloads: w.downloads + 1 } : w))
          );
        }}
      />

      {/* Admin Publishing & Supabase Preparation Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onWallpaperAdded={handleWallpaperAdded}
      />

      {/* Legal & About Modal */}
      <PolicyModal
        isOpen={policyModal.isOpen}
        initialTab={policyModal.tab}
        onClose={() => setPolicyModal({ isOpen: false, tab: 'about' })}
      />
    </div>
  );
}
