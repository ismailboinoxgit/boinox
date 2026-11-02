import React from 'react';
import { Info } from 'lucide-react';

interface AdPlaceholderProps {
  format?: 'banner' | 'card' | 'leaderboard';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({
  format = 'leaderboard',
  className = '',
}) => {
  if (format === 'card') {
    return (
      <div
        className={`rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 p-5 flex flex-col items-center justify-center text-center min-h-[260px] ${className}`}
      >
        <span className="text-[10px] tracking-wider uppercase font-semibold text-zinc-500 mb-1 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Sponsored Space
        </span>
        <div className="text-xs font-medium text-zinc-400 max-w-[200px]">
          Reserved for future compliant display advertisements (300×250)
        </div>
        <div className="mt-3 text-[10px] text-zinc-600">
          BOINOX Network Partner Slot · No user tracking
        </div>
      </div>
    );
  }

  return (
    <div className={`my-8 max-w-5xl mx-auto px-4 ${className}`}>
      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-wider uppercase font-semibold text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700/60">
            Advertisement
          </span>
          <span className="text-xs text-zinc-400">
            Leaderboard Slot (728×90 / Responsive)
          </span>
        </div>
        <p className="text-[11px] text-zinc-400">
          Compliant advertising placeholder. Future integration with Google AdSense / privacy-first ad networks.
        </p>
      </div>
    </div>
  );
};
