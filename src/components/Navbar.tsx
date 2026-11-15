import React from 'react';
import { Moon, Share2, Settings, Download, Eye, RotateCcw } from 'lucide-react';

interface NavbarProps {
  scheduleName: string;
  isReadOnly: boolean;
  onOpenShare: () => void;
  onOpenSettings: () => void;
  onExportImport: () => void;
  onExitReadOnly?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  scheduleName,
  isReadOnly,
  onOpenShare,
  onOpenSettings,
  onExportImport,
  onExitReadOnly,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#1d1b18]/95 backdrop-blur-md border-b border-[#2e2a26] px-4 py-3 sm:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Context */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-[#272420] border border-[#3b362f] flex items-center justify-center text-[#d49e54] shrink-0">
            <Moon className="w-4 h-4" strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold text-[#ede7dc] truncate">
                {scheduleName}
              </span>
              {isReadOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#362b1e] text-[#deb887] border border-[#59442c]">
                  <Eye className="w-3 h-3" /> Просмотр
                </span>
              )}
            </div>
            <p className="text-xs text-[#999081] truncate">
              Смены в ночь: 20:00 — 08:00 • График 2/2
            </p>
          </div>
        </div>

        {/* Quiet Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isReadOnly ? (
            <button
              onClick={onExitReadOnly}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#292621] hover:bg-[#332f29] text-[#ede7dc] text-xs font-medium border border-[#3b362f] transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#d49e54]" strokeWidth={1.5} />
              <span>Мой график</span>
            </button>
          ) : (
            <>
              <button
                onClick={onOpenShare}
                title="Поделиться графиком"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27231d] hover:bg-[#332b21] text-[#deb887] border border-[#4d3d29] text-xs font-medium transition"
              >
                <Share2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                <span className="hidden sm:inline">Поделиться</span>
              </button>

              <button
                onClick={onExportImport}
                title="Экспорт и импорт"
                className="p-2 rounded-lg bg-[#24211d] hover:bg-[#2e2a25] text-[#999081] hover:text-[#ede7dc] border border-[#36312a] transition"
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <button
                onClick={onOpenSettings}
                title="Настройки"
                className="p-2 rounded-lg bg-[#24211d] hover:bg-[#2e2a25] text-[#999081] hover:text-[#ede7dc] border border-[#36312a] transition"
              >
                <Settings className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
