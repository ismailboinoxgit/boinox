import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Heart, 
  Share2, 
  Check, 
  AlertCircle, 
  Maximize2, 
  Monitor, 
  Smartphone, 
  Palette, 
  Info,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Wallpaper } from '../types/wallpaper';
import { downloadWallpaper } from '../utils/downloadHelper';
import { StorageService } from '../services/storageService';

interface WallpaperModalProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  isFavorite: boolean;
  onDownloadIncrement: (id: string) => void;
}

export const WallpaperModal: React.FC<WallpaperModalProps> = ({
  wallpaper,
  onClose,
  onToggleFavorite,
  isFavorite,
  onDownloadIncrement,
}) => {
  const [downloadTarget, setDownloadTarget] = useState<'original' | '1080p' | 'mobile'>('original');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({
    type: 'idle',
  });
  const [mockupMode, setMockupMode] = useState<'none' | 'phone' | 'desktop'>('none');
  const [copiedLink, setCopiedLink] = useState(false);
  const [currentTime, setCurrentTime] = useState('09:41');

  // Handle ESC key press to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Clock for device mockup
  useEffect(() => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`);
  }, []);

  if (!wallpaper) return null;

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadStatus({ type: 'idle' });

    let targetWidth: number | undefined;
    let targetHeight: number | undefined;
    let resLabel = wallpaper.resolution;

    if (downloadTarget === '1080p') {
      targetWidth = 1920;
      targetHeight = 1080;
      resLabel = '1920x1080';
    } else if (downloadTarget === 'mobile') {
      targetWidth = 1080;
      targetHeight = 2400;
      resLabel = '1080x2400-mobile';
    }

    const filename = `BOINOX-${wallpaper.slug}-${resLabel}.jpg`;

    const result = await downloadWallpaper(wallpaper.url, {
      filename,
      targetWidth,
      targetHeight,
    });

    setIsDownloading(false);

    if (result.success) {
      setDownloadStatus({ type: 'success', message: `Saved as ${filename}` });
      StorageService.recordDownload(wallpaper.id);
      onDownloadIncrement(wallpaper.id);
      setTimeout(() => {
        setDownloadStatus({ type: 'idle' });
      }, 5000);
    } else {
      setDownloadStatus({
        type: 'error',
        message: result.error || 'Failed to download image. Opening direct image link.',
      });
      // Fallback: Open in new window
      window.open(wallpaper.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-wallpaper-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 md:p-6"
    >
      <div 
        onClick={onClose} 
        className="fixed inset-0 -z-10 cursor-pointer" 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-6xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col lg:flex-row max-h-[92vh]">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors border border-zinc-700 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image Showcase & Mockup Viewport (Col 7-8) */}
        <div className="lg:w-7/12 bg-black flex flex-col justify-center items-center relative overflow-hidden min-h-[340px] sm:min-h-[460px] p-4 sm:p-6">
          {/* Mockup Toolbar */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 p-1 bg-zinc-900/80 backdrop-blur-md rounded-lg border border-zinc-800 text-xs text-zinc-300">
            <span className="text-[10px] text-zinc-500 uppercase font-semibold px-2">Preview Mode:</span>
            <button
              onClick={() => setMockupMode('none')}
              className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                mockupMode === 'none' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Raw Image
            </button>
            <button
              onClick={() => setMockupMode('desktop')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                mockupMode === 'desktop' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3 h-3" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setMockupMode('phone')}
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors cursor-pointer ${
                mockupMode === 'phone' ? 'bg-zinc-800 text-white font-medium' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3 h-3" />
              <span>Phone</span>
            </button>
          </div>

          {/* VIEW: 1. Normal Raw Image */}
          {mockupMode === 'none' && (
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={wallpaper.url}
                alt={wallpaper.title}
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          )}

          {/* VIEW: 2. Desktop Mockup */}
          {mockupMode === 'desktop' && (
            <div className="w-full max-w-xl aspect-[16/10] bg-zinc-900 rounded-xl overflow-hidden border border-zinc-700 shadow-2xl relative flex flex-col">
              {/* Fake Mac/PC Window Bar */}
              <div className="h-6 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between px-3 text-[10px] text-zinc-400 select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 font-medium text-zinc-300">BOINOX OS 4K</span>
                </div>
                <div>{currentTime}</div>
              </div>
              <div className="relative flex-1 overflow-hidden">
                <img
                  src={wallpaper.url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                {/* Desktop icons preview */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-md bg-blue-600/80 flex items-center justify-center text-[9px] text-white font-bold">F</div>
                  <div className="w-6 h-6 rounded-md bg-zinc-700 flex items-center justify-center text-[9px] text-white">T</div>
                  <div className="w-6 h-6 rounded-md bg-red-600 flex items-center justify-center text-[9px] text-white">M</div>
                  <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-[9px] text-white">B</div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: 3. Phone Mockup */}
          {mockupMode === 'phone' && (
            <div className="w-[230px] aspect-[9/18] rounded-[36px] bg-black p-2 border-2 border-zinc-700 shadow-2xl relative flex flex-col overflow-hidden">
              <div className="w-full h-full rounded-[28px] overflow-hidden relative flex flex-col justify-between">
                <img
                  src={wallpaper.url}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Phone dynamic island / notch */}
                <div className="relative z-10 w-full pt-2 flex flex-col items-center">
                  <div className="w-16 h-3 bg-black rounded-full mb-3" />
                  <div className="font-display text-3xl font-bold text-white tracking-tight drop-shadow-md">
                    {currentTime}
                  </div>
                  <div className="text-[10px] text-zinc-200 drop-shadow">Monday, November 2</div>
                </div>
                {/* Phone bottom shortcuts */}
                <div className="relative z-10 p-3 flex justify-between items-center">
                  <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white text-[10px]">
                    🔦
                  </div>
                  <div className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white text-[10px]">
                    📷
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Metadata, Download Options, Actions (Col 4-5) */}
        <div className="lg:w-5/12 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto bg-zinc-950 border-t lg:border-t-0 lg:border-l border-zinc-800">
          <div>
            {/* Category & Status */}
            <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
              <span className="text-cyan-400 font-semibold">{wallpaper.category}</span>
              <span aria-hidden="true">·</span>
              <span>{wallpaper.resolutionStandard}</span>
              <span aria-hidden="true">·</span>
              <span>{wallpaper.fileFormat}</span>
            </div>

            <h2 id="modal-wallpaper-title" className="font-display text-2xl font-bold text-white tracking-tight">
              {wallpaper.title}
            </h2>

            {wallpaper.description && (
              <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {wallpaper.description}
              </p>
            )}

            {/* Author Attribution */}
            <div className="mt-4 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-zinc-500">Curated &amp; Authored by</div>
                <div className="text-xs font-semibold text-zinc-200">{wallpaper.author.name}</div>
              </div>
              {wallpaper.author.handle && (
                <span className="text-xs font-mono text-zinc-400">{wallpaper.author.handle}</span>
              )}
            </div>

            {/* Technical Specifications Matrix */}
            <div className="mt-6 border-t border-zinc-850 pt-4">
              <div className="text-xs font-semibold uppercase text-zinc-500 tracking-wider mb-3">
                Asset Specifications
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/50">
                  <div className="text-zinc-500">Native Resolution</div>
                  <div className="font-mono font-medium text-white tabular-nums mt-0.5">{wallpaper.resolution}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/50">
                  <div className="text-zinc-500">File Size</div>
                  <div className="font-medium text-white mt-0.5">{wallpaper.fileSize}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/50">
                  <div className="text-zinc-500">Aspect Ratio</div>
                  <div className="font-mono font-medium text-white mt-0.5">{wallpaper.aspectRatio}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-800/50">
                  <div className="text-zinc-500">Total Downloads</div>
                  <div className="font-mono font-medium text-cyan-400 tabular-nums mt-0.5">
                    {wallpaper.downloads.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Color Palette Chips */}
            {wallpaper.colorPalette && wallpaper.colorPalette.length > 0 && (
              <div className="mt-5">
                <div className="text-xs font-semibold uppercase text-zinc-500 tracking-wider mb-2 flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>Dominant Palette</span>
                </div>
                <div className="flex items-center gap-2">
                  {wallpaper.colorPalette.map((hex, i) => (
                    <div
                      key={i}
                      className="group relative w-7 h-7 rounded-lg border border-zinc-700/80 cursor-pointer shadow-inner"
                      style={{ backgroundColor: hex }}
                      title={`Hex: ${hex}`}
                    >
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[9px] font-mono text-zinc-400 bg-zinc-900 px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        {hex}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions: Resolution Selector, Download Button & Social Actions */}
          <div className="mt-6 pt-5 border-t border-zinc-850">
            {/* Resolution Selector Segmented Control */}
            <div className="mb-3">
              <label className="text-[11px] font-medium text-zinc-400 block mb-1.5">
                Select Download Format:
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 rounded-xl border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setDownloadTarget('original')}
                  className={`py-2 px-1 text-center rounded-lg transition-colors cursor-pointer ${
                    downloadTarget === 'original'
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-medium">Original</div>
                  <div className="text-[10px] text-zinc-500">{wallpaper.resolutionStandard}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDownloadTarget('1080p')}
                  className={`py-2 px-1 text-center rounded-lg transition-colors cursor-pointer ${
                    downloadTarget === '1080p'
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-medium">1080p FHD</div>
                  <div className="text-[10px] text-zinc-500">1920×1080</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDownloadTarget('mobile')}
                  className={`py-2 px-1 text-center rounded-lg transition-colors cursor-pointer ${
                    downloadTarget === 'mobile'
                      ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-medium">Mobile OLED</div>
                  <div className="text-[10px] text-zinc-500">1080×2400</div>
                </button>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-zinc-200 active:bg-zinc-300 text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-cyan-500/10 cursor-pointer disabled:opacity-60"
            >
              {isDownloading ? (
                <>
                  <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  <span>Preparing Uncompressed Master...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Free Wallpaper</span>
                </>
              )}
            </button>

            {/* Download Status Toast / Message */}
            {downloadStatus.type === 'success' && (
              <div className="mt-2.5 p-2 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-1.5">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{downloadStatus.message}</span>
              </div>
            )}
            {downloadStatus.type === 'error' && (
              <div className="mt-2.5 p-2 rounded-lg bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{downloadStatus.message}</span>
              </div>
            )}

            {/* Favorite & Share Bar */}
            <div className="mt-3 flex items-center justify-between gap-3 text-xs">
              <button
                onClick={() => onToggleFavorite(wallpaper.id)}
                className={`flex-1 py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isFavorite ? 'Saved in Favorites' : 'Add to Favorites'}</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2 px-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Copy link"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
