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
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Logo and Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Moon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white truncate leading-tight">
                {scheduleName}
              </h1>
              {isReadOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Eye className="w-3 h-3" /> Просмотр
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate">
              Смены в ночь: 20:00 — 08:00 • 2/2
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {isReadOnly ? (
            <button
              onClick={onExitReadOnly}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium transition shadow-md shadow-indigo-600/20"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Мой график</span>
            </button>
          ) : (
            <>
              <button
                onClick={onOpenShare}
                title="Поделиться графиком"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs sm:text-sm font-medium transition active:scale-95"
              >
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Поделиться</span>
              </button>

              <button
                onClick={onExportImport}
                title="Бэкап / Экспорт"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs sm:text-sm transition active:scale-95"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSettings}
                title="Настройки графика"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs sm:text-sm transition active:scale-95"
              >
                <Settings className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
