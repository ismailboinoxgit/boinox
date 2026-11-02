import { INITIAL_WALLPAPERS } from '../data/wallpapers';
import { Wallpaper, WallpaperCategory } from '../types/wallpaper';

const FAVORITES_KEY = 'boinox_favorites_v1';
const CUSTOM_WALLPAPERS_KEY = 'boinox_custom_wallpapers_v1';
const DOWNLOAD_STATS_KEY = 'boinox_download_stats_v1';

export class StorageService {
  /**
   * Retrieve all favorites IDs from localStorage
   */
  static getFavorites(): string[] {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /**
   * Toggle a wallpaper favorite status
   */
  static toggleFavorite(wallpaperId: string): { isFavorite: boolean; favorites: string[] } {
    try {
      const favorites = this.getFavorites();
      const exists = favorites.includes(wallpaperId);
      const updated = exists
        ? favorites.filter((id) => id !== wallpaperId)
        : [...favorites, wallpaperId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return { isFavorite: !exists, favorites: updated };
    } catch {
      return { isFavorite: false, favorites: [] };
    }
  }

  /**
   * Check if a specific wallpaper is favorited
   */
  static isFavorite(wallpaperId: string): boolean {
    return this.getFavorites().includes(wallpaperId);
  }

  /**
   * Get all wallpapers combining default seed data + user/admin uploaded custom wallpapers
   */
  static getAllWallpapers(): Wallpaper[] {
    try {
      const raw = localStorage.getItem(CUSTOM_WALLPAPERS_KEY);
      const custom: Wallpaper[] = raw ? JSON.parse(raw) : [];
      // Apply any local download stat overrides
      const downloadStats = this.getDownloadStats();
      const combined = [...custom, ...INITIAL_WALLPAPERS].map((w) => {
        if (downloadStats[w.id]) {
          return {
            ...w,
            downloads: w.downloads + downloadStats[w.id],
          };
        }
        return w;
      });
      return combined;
    } catch {
      return INITIAL_WALLPAPERS;
    }
  }

  /**
   * Record a download event and increment local count
   */
  static recordDownload(wallpaperId: string): number {
    try {
      const stats = this.getDownloadStats();
      stats[wallpaperId] = (stats[wallpaperId] || 0) + 1;
      localStorage.setItem(DOWNLOAD_STATS_KEY, JSON.stringify(stats));
      return stats[wallpaperId];
    } catch {
      return 1;
    }
  }

  private static getDownloadStats(): Record<string, number> {
    try {
      const raw = localStorage.getItem(DOWNLOAD_STATS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  /**
   * Add a new wallpaper through the Admin dashboard
   */
  static addCustomWallpaper(data: Omit<Wallpaper, 'id' | 'createdAt' | 'downloads' | 'views'>): Wallpaper {
    const newWallpaper: Wallpaper = {
      ...data,
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      downloads: 0,
      views: 1,
    };

    try {
      const raw = localStorage.getItem(CUSTOM_WALLPAPERS_KEY);
      const existing: Wallpaper[] = raw ? JSON.parse(raw) : [];
      const updated = [newWallpaper, ...existing];
      localStorage.setItem(CUSTOM_WALLPAPERS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save custom wallpaper:', err);
    }

    return newWallpaper;
  }

  /**
   * Delete a wallpaper (custom or soft delete)
   */
  static deleteWallpaper(id: string): void {
    try {
      const raw = localStorage.getItem(CUSTOM_WALLPAPERS_KEY);
      if (raw) {
        const existing: Wallpaper[] = JSON.parse(raw);
        const filtered = existing.filter((w) => w.id !== id);
        localStorage.setItem(CUSTOM_WALLPAPERS_KEY, JSON.stringify(filtered));
      }
    } catch (err) {
      console.error('Failed to delete wallpaper:', err);
    }
  }

  /**
   * Reset data back to default initial state
   */
  static resetToDefault(): void {
    localStorage.removeItem(CUSTOM_WALLPAPERS_KEY);
    localStorage.removeItem(DOWNLOAD_STATS_KEY);
  }

  /**
   * Supabase Connection Guide & SQL Schema Exporter
   * Ready for direct copy-paste into Supabase SQL Editor
   */
  static getSupabaseSchemaSQL(): string {
    return `-- ==============================================================================
-- BOINOX WALLPAPERS SUPABASE SCHEMA & POLICIES
-- Ready to run directly inside Supabase SQL Query Editor
-- ==============================================================================

-- 1. Create categories enum
CREATE TYPE wallpaper_category AS ENUM (
  'Space', 'AMOLED', 'Nature', 'Cars', 'Football', 'Anime', 'Abstract', 'Minimal', 'Gaming'
);

-- 2. Create orientation enum
CREATE TYPE wallpaper_orientation AS ENUM (
  'landscape', 'portrait', 'ultrawide'
);

-- 3. Create wallpapers table
CREATE TABLE IF NOT EXISTS public.wallpapers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category wallpaper_category NOT NULL,
  resolution TEXT NOT NULL,
  resolution_standard TEXT NOT NULL DEFAULT '4K UHD',
  orientation wallpaper_orientation NOT NULL DEFAULT 'landscape',
  aspect_ratio TEXT NOT NULL DEFAULT '16:9',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size TEXT NOT NULL DEFAULT '6.0 MB',
  file_format TEXT NOT NULL DEFAULT 'JPG',
  downloads BIGINT NOT NULL DEFAULT 0,
  views BIGINT NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  color_palette TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL DEFAULT 'BOINOX Collective',
  author_handle TEXT,
  author_verified BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.wallpapers ENABLE ROW LEVEL SECURITY;

-- 5. Public read policy (anyone can browse and view wallpapers)
CREATE POLICY "Public wallpapers are viewable by everyone" 
  ON public.wallpapers FOR SELECT 
  USING (true);

-- 6. Authenticated admin write policy (only authenticated admins can insert/update/delete)
CREATE POLICY "Admins can insert wallpapers" 
  ON public.wallpapers FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Admins can update wallpapers" 
  ON public.wallpapers FOR UPDATE 
  TO authenticated 
  USING (true);

-- 7. Secure download counter increment procedure (callable by public without auth)
CREATE OR REPLACE FUNCTION increment_download(wallpaper_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.wallpapers
  SET downloads = downloads + 1
  WHERE slug = wallpaper_slug;
END;
$$;
`;
  }
}
