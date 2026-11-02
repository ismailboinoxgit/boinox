export type WallpaperCategory =
  | 'Space'
  | 'AMOLED'
  | 'Nature'
  | 'Cars'
  | 'Football'
  | 'Anime'
  | 'Abstract'
  | 'Minimal'
  | 'Gaming';

export type ResolutionStandard =
  | '8K UHD'
  | '4K UHD'
  | 'AMOLED QHD'
  | 'QHD 1440p'
  | 'Ultrawide 4K'
  | 'FHD 1080p';

export type Orientation = 'landscape' | 'portrait' | 'ultrawide';

export interface Wallpaper {
  id: string;
  title: string;
  slug: string;
  category: WallpaperCategory;
  resolution: string; // e.g. "3840x2160"
  resolutionStandard: ResolutionStandard;
  orientation: Orientation;
  aspectRatio: string; // "16:9", "9:16", "21:9"
  url: string;
  thumbnailUrl?: string;
  fileSize: string;
  fileFormat: 'JPG' | 'PNG' | 'WEBP';
  downloads: number;
  views: number;
  featured: boolean;
  tags: string[];
  colorPalette: string[];
  createdAt: string;
  author: {
    name: string;
    handle?: string;
    verified?: boolean;
  };
  description?: string;
}

export type SortOption = 'latest' | 'popular' | 'downloads' | 'resolution';
export type OrientationFilter = 'all' | 'landscape' | 'portrait' | 'ultrawide';
export type ResolutionFilter = 'all' | '4k' | '8k' | 'amoled' | 'ultrawide';

export interface FilterState {
  category: WallpaperCategory | 'all';
  searchQuery: string;
  sortBy: SortOption;
  orientation: OrientationFilter;
  resolution: ResolutionFilter;
  onlyFavorites: boolean;
}
