import React from 'react';
import { Share2, Settings, Download, Eye, RotateCcw } from 'lucide-react';

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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e7ddcf] px-4 py-3 sm:px-6 shadow-[0_1px_3px_rgba(45,30,15,0.04)]">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Context */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#252320]">
                Сменограф
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#f3ede4] text-[#7b511c] font-semibold border border-[#e7ddcf]">
                2/2 в ночь
              </span>
              {isReadOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f3e7d5] text-[#7b511c] border border-[#d8b57a]">
                  <Eye className="w-3 h-3" strokeWidth={1.5} /> Просмотр
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#81796e] truncate">
              {scheduleName}
            </p>
          </div>
        </div>

        {/* Actions in Old Money style */}
        <div className="flex items-center gap-2 shrink-0">
          {isReadOnly ? (
            <button
              onClick={onExitReadOnly}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#2a1c0a] text-xs font-semibold border border-[#d8b57a] transition shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.5} />
              <span>Мой график</span>
            </button>
          ) : (
            <>
              <button
                onClick={onOpenShare}
                title="Поделиться графиком"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#d8b57a] bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#2a1c0a] text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.5} />
                <span className="hidden sm:inline">Поделиться</span>
              </button>

              <button
                onClick={onExportImport}
                title="Экспорт и импорт"
                className="p-2 rounded-full bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-sm active:scale-95"
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <button
                onClick={onOpenSettings}
                title="Настройки"
                className="p-2 rounded-full bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-sm active:scale-95"
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
