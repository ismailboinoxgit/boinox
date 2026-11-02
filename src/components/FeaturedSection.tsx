import React, { useState } from 'react';
import { Download, Heart, Eye, ArrowUpRight } from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';

interface FeaturedSectionProps {
  wallpapers: Wallpaper[];
  onSelectWallpaper: (wallpaper: Wallpaper) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  isFavorite: (id: string) => boolean;
  onQuickDownload: (wallpaper: Wallpaper, e: React.MouseEvent) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  wallpapers,
  onSelectWallpaper,
  onToggleFavorite,
  isFavorite,
  onQuickDownload,
}) => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const featured = wallpapers.filter((w) => w.featured).slice(0, 5);
  if (featured.length === 0) return null;

  const handleImageError = (id: string) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };

  const mainItem = featured[0];
  const sideItems = featured.slice(1, 5);

  return (
    <section className="py-12 border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
              Curated Showcase
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured 4K &amp; 8K Wallpapers
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            Hand-inspected for optical precision, color gamut depth, and zero digital artifacting.
          </p>
        </div>

        {/* Bento Grid Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Large Hero Card (Col 7) */}
          {mainItem && (
            <div
              onClick={() => onSelectWallpaper(mainItem)}
              className="lg:col-span-7 group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800/90 hover:border-zinc-700 transition-all cursor-pointer min-h-[380px] lg:min-h-[460px] flex flex-col justify-end"
            >
              {/* Background Image / Fallback Container */}
              {!imageErrors[mainItem.id] ? (
                <img
                  src={mainItem.url}
                  alt={mainItem.title}
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(mainItem.id)}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 flex items-center justify-center p-6 text-center">
                  <div className="text-zinc-400 text-sm font-medium">{mainItem.title}</div>
                </div>
              )}

              {/* Scrim Overlay */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10 transition-opacity group-hover:opacity-95"
                aria-hidden="true" 
              />

              {/* Floating Top Badges */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-2.5 py-1 text-[11px] font-semibold text-cyan-300 bg-black/60 backdrop-blur-md rounded-md border border-cyan-500/30">
                  {mainItem.resolutionStandard} · {mainItem.resolution}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => onToggleFavorite(mainItem.id, e)}
                    aria-label="Add to favorites"
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-rose-400 hover:bg-black/80 transition-colors border border-white/10"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isFavorite(mainItem.id) ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => onQuickDownload(mainItem, e)}
                    aria-label="Download wallpaper"
                    className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:text-cyan-400 hover:bg-black/80 transition-colors border border-white/10"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Content */}
              <div className="relative z-10 p-6 sm:p-8">
                <div className="text-xs text-zinc-300 font-medium mb-1.5 flex items-center gap-2">
                  <span>{mainItem.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{mainItem.fileSize}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{mainItem.downloads.toLocaleString()} downloads</span>
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                  <span>{mainItem.title}</span>
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </h3>
                {mainItem.description && (
                  <p className="mt-2 text-xs sm:text-sm text-zinc-300 line-clamp-2 max-w-xl">
                    {mainItem.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Side 4 Cards (Col 5 - 2x2 grid) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sideItems.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectWallpaper(item)}
                className="group relative rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer h-[220px] flex flex-col justify-end"
              >
                {!imageErrors[item.id] ? (
                  <img
                    src={item.url}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={() => handleImageError(item.id)}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-950 to-zinc-900 flex items-center justify-center p-4 text-center">
                    <span className="text-xs text-zinc-400">{item.title}</span>
                  </div>
                )}

                <div 
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10"
                  aria-hidden="true" 
                />

                {/* Floating Top Controls */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                  <span className="px-2 py-0.5 text-[10px] font-semibold text-zinc-200 bg-black/60 backdrop-blur-sm rounded border border-white/10">
                    {item.resolutionStandard}
                  </span>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => onToggleFavorite(item.id, e)}
                      aria-label="Add to favorites"
                      className="p-1.5 rounded-full bg-black/70 text-white hover:text-rose-400 transition-colors"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isFavorite(item.id) ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => onQuickDownload(item, e)}
                      aria-label="Download"
                      className="p-1.5 rounded-full bg-black/70 text-white hover:text-cyan-400 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Card Title & Meta */}
                <div className="relative z-10 p-3.5">
                  <div className="text-[11px] text-zinc-400">
                    <span>{item.category}</span>
                    <span className="mx-1">·</span>
                    <span className="tabular-nums">{item.resolution}</span>
                  </div>
                  <h4 className="font-display text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors truncate mt-0.5">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
