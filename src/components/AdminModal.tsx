import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Database, 
  Trash2, 
  Check, 
  Copy, 
  ShieldCheck, 
  Upload, 
  Sparkles,
  ExternalLink,
  Code
} from 'lucide-react';
import { Wallpaper, WallpaperCategory, ResolutionStandard, Orientation } from '../types/wallpaper';
import { StorageService } from '../services/storageService';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWallpaperAdded: (wallpaper: Wallpaper) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  onWallpaperAdded,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'supabase'>('upload');
  const [copiedSql, setCopiedSql] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WallpaperCategory>('AMOLED');
  const [resolutionStandard, setResolutionStandard] = useState<ResolutionStandard>('4K UHD');
  const [resolution, setResolution] = useState('3840x2160');
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [imageUrl, setImageUrl] = useState('');
  const [fileSize, setFileSize] = useState('6.2 MB');
  const [authorName, setAuthorName] = useState('BOINOX Studio');
  const [tagsInput, setTagsInput] = useState('4k, dark, amoled');
  const [description, setDescription] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  if (!isOpen) return null;

  const handleResolutionStandardChange = (val: ResolutionStandard) => {
    setResolutionStandard(val);
    if (val === '8K UHD') {
      setResolution('7680x4320');
      setOrientation('landscape');
      setAspectRatio('16:9');
    } else if (val === '4K UHD') {
      setResolution('3840x2160');
      setOrientation('landscape');
      setAspectRatio('16:9');
    } else if (val === 'AMOLED QHD') {
      setResolution('1440x3200');
      setOrientation('portrait');
      setAspectRatio('9:16');
    } else if (val === 'Ultrawide 4K') {
      setResolution('5120x2160');
      setOrientation('ultrawide');
      setAspectRatio('21:9');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const created = StorageService.addCustomWallpaper({
      title: title.trim(),
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      category,
      resolution,
      resolutionStandard,
      orientation,
      aspectRatio,
      url: imageUrl.trim(),
      fileSize,
      fileFormat: 'JPG',
      featured: false,
      tags: tags.length > 0 ? tags : [category.toLowerCase()],
      colorPalette: ['#09090B', '#27272A', '#38BDF8', '#FFFFFF'],
      author: {
        name: authorName.trim() || 'BOINOX Creator',
        verified: true,
      },
      description: description.trim() || `High-fidelity 4K wallpaper curated for ${category} displays.`,
    });

    onWallpaperAdded(created);
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      onClose();
    }, 1500);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(StorageService.getSupabaseSchemaSQL());
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
    >
      <div 
        onClick={onClose} 
        className="fixed inset-0 -z-10 cursor-pointer" 
        aria-hidden="true" 
      />

      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-850 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 id="admin-modal-title" className="font-display font-bold text-lg text-white">
                BOINOX Admin Hub
              </h2>
              <p className="text-xs text-zinc-400">
                Asset publishing dashboard &amp; cloud database architecture
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close admin modal"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-zinc-850 bg-zinc-900/40">
          <button
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'upload'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Publish New Wallpaper</span>
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'supabase'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase Cloud Integration</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'upload' && (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {formSuccess && (
                <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Wallpaper published successfully! It is now live in the gallery.</span>
                </div>
              )}

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Wallpaper Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midnight Cyberpunk Skyline 8K"
                  className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as WallpaperCategory)}
                    className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Space">Space</option>
                    <option value="AMOLED">AMOLED</option>
                    <option value="Nature">Nature</option>
                    <option value="Cars">Cars</option>
                    <option value="Football">Football</option>
                    <option value="Anime">Anime</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Minimal">Minimal</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Display Standard *</label>
                  <select
                    value={resolutionStandard}
                    onChange={(e) => handleResolutionStandardChange(e.target.value as ResolutionStandard)}
                    className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="4K UHD">4K UHD (3840×2160)</option>
                    <option value="8K UHD">8K UHD (7680×4320)</option>
                    <option value="AMOLED QHD">AMOLED QHD (1440×3200 Mobile)</option>
                    <option value="Ultrawide 4K">Ultrawide (5120×2160 21:9)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or /src/assets/images/..."
                  className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Image Preview Box if URL entered */}
              {imageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-zinc-800 h-36 bg-black relative flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-zinc-300 font-mono">
                    Live Preview
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Resolution Dimension</label>
                  <input
                    type="text"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">File Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">Author / Credit</label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="space, nebula, stars, 4k"
                  className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details regarding color grading, screen compatibility, or capture methodology..."
                  className="w-full p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Publish to Gallery</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'supabase' && (
            <div className="space-y-5 text-xs text-zinc-300">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <h3 className="font-display text-sm font-semibold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Supabase Architecture Prepared</span>
                </h3>
                <p className="mt-1 text-zinc-400 leading-relaxed text-[11px]">
                  BOINOX has been built with a decoupled database abstraction layer. When you are ready to connect a live Supabase backend, you can execute the SQL below in your Supabase SQL Editor and define your environment variables.
                </p>
                <div className="mt-3 flex items-center gap-2 text-[11px] font-mono text-zinc-400 bg-zinc-950 p-2 rounded-md border border-zinc-800">
                  <span className="text-emerald-400">VITE_SUPABASE_URL</span>=https://your-project.supabase.co
                  <br />
                  <span className="text-emerald-400">VITE_SUPABASE_ANON_KEY</span>=eyJhbGciOi...
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5 text-cyan-400" />
                    <span>PostgreSQL Database Schema &amp; RLS Policies</span>
                  </span>
                  <button
                    onClick={handleCopySql}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copied SQL' : 'Copy Schema SQL'}</span>
                  </button>
                </div>

                <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800/90 font-mono text-[10px] text-zinc-400 overflow-x-auto max-h-56 leading-relaxed">
                  <pre>{StorageService.getSupabaseSchemaSQL()}</pre>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-[11px] text-zinc-400 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Security Best Practice:</strong> Never commit your Supabase Service Role Secret to frontend client code. Only expose the public anonymous key with Row-Level-Security (RLS) policies protecting write access.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
