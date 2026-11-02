import React from 'react';
import { PolicyTab } from './PolicyModal';
import { WallpaperCategory } from '../types/wallpaper';

interface FooterProps {
  onOpenPolicy: (tab: PolicyTab) => void;
  onSelectCategory: (category: WallpaperCategory | 'all') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPolicy,
  onSelectCategory,
}) => {
  const currentYear = new Date().getFullYear();

  const categories: WallpaperCategory[] = [
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
    <footer className="bg-[#060708] border-t border-zinc-850/80 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Mission (Col 5) */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-zinc-100 p-[1px]">
                <div className="w-full h-full bg-[#08090a] rounded-[7px] flex items-center justify-center">
                  <span className="font-display font-extrabold text-xs text-white">B</span>
                </div>
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                BOINOX
              </span>
            </div>

            <p className="text-zinc-400 max-w-sm leading-relaxed mb-4">
              <strong className="text-zinc-200">Wallpapers Without Limits.</strong> Dedicated to ultra-sharp 4K, 8K, and pure-black AMOLED wallpapers for discerning desktop workspaces and mobile devices.
            </p>

            <div className="text-[11px] text-zinc-500">
              Designed with 0-clutter discipline · Zero fake download gates
            </div>
          </div>

          {/* Categories Jump List (Col 4) */}
          <div className="md:col-span-4">
            <h4 className="font-display font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Explore Categories
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    const el = document.getElementById('gallery-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-left text-zinc-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {cat} Wallpapers
                </button>
              ))}
            </div>
          </div>

          {/* Legal, Support & Policies (Col 3) */}
          <div className="md:col-span-3">
            <h4 className="font-display font-semibold text-white uppercase tracking-wider text-[11px] mb-3">
              Transparency &amp; Legal
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onOpenPolicy('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About the Platform
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('privacy')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('dmca')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  DMCA &amp; Copyright Notice
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenPolicy('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Contact &amp; Submissions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-12 pt-6 border-t border-zinc-850/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            &copy; {currentYear} BOINOX. All wallpapers curated for personal non-commercial customization.
          </div>
          <div className="flex items-center gap-4">
            <span>High Dynamic Range (HDR)</span>
            <span aria-hidden="true">·</span>
            <span>Uncompressed Bitrate</span>
            <span aria-hidden="true">·</span>
            <span>Ultra HD 4K/8K</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
