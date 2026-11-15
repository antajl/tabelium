import React from 'react';
import {
  Share2,
  Settings,
  Download,
  Eye,
  RotateCcw,
} from 'lucide-react';
import type { YearLayoutMode } from '../types/schedule';

interface NavbarProps {
  scheduleName: string;
  isReadOnly: boolean;
  viewMode?: 'month' | 'year';
  yearLayout?: YearLayoutMode;
  onChangeYearLayout?: (layout: YearLayoutMode) => void;
  onGoHome?: () => void;
  onOpenShare: () => void;
  onOpenSettings: () => void;
  onExportImport: () => void;
  onExitReadOnly?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  scheduleName: _scheduleName,
  isReadOnly,
  viewMode: _viewMode,
  yearLayout: _yearLayout,
  onChangeYearLayout: _onChangeYearLayout,
  onGoHome,
  onOpenShare,
  onOpenSettings,
  onExportImport,
  onExitReadOnly,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e7ddcf] shadow-[0_1px_3px_rgba(45,30,15,0.04)]">
      <div className="w-full max-w-[1700px] mx-auto px-4 py-2 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Brand & Context (Clickable logo to go home) */}
        <div className="flex-1 flex items-center justify-start gap-3 min-w-0">
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 text-left cursor-pointer group focus:outline-none"
            title="Перейти к годовому календарю Табелиум"
          >
            {/* Tabelium Brand Emblem (Monogram T with night shift crescent moon) */}
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-[#b68231]/40 shadow-xs group-hover:border-[#b68231] transition-colors bg-black">
              <img
                src={`${import.meta.env.BASE_URL}logo.png`}
                alt="Табелиум — Tabelium"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base sm:text-lg font-bold tracking-tight text-[#252320] leading-none group-hover:text-[#b68231] transition-colors">
                  Табелиум
                </span>
                <span className="text-[11px] font-medium text-[#81796e] tracking-wider uppercase opacity-75 hidden sm:inline leading-none">
                  Tabelium
                </span>
              </div>
              <span className="text-[10px] text-[#81796e] hidden md:inline leading-none mt-1 font-normal">
                График смен и отпусков • 2/2 в ночь
              </span>
            </div>
          </button>

          {isReadOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f3e7d5] text-[#7b511c] border border-[#d8b57a]">
              <Eye className="w-3 h-3" strokeWidth={1.5} /> Просмотр
            </span>
          )}
        </div>

        {/* Center: Clean and spacious */}
        <div className="hidden lg:flex flex-1" />

        {/* Right: Functional actions (Unified h-8 controls) */}
        <div className="flex-1 flex items-center justify-end gap-2 shrink-0">
          {isReadOnly ? (
            <button
              onClick={onExitReadOnly}
              className="h-8 inline-flex items-center gap-1.5 px-3.5 rounded-lg bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#2a1c0a] text-xs font-semibold border border-[#d8b57a] transition shadow-xs active:scale-95 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.5} />
              <span>Мой график</span>
            </button>
          ) : (
            <>
              <button
                onClick={onOpenShare}
                title="Поделиться графиком"
                className="h-8 inline-flex items-center gap-1.5 px-3 rounded-lg border border-[#d8b57a] bg-[#fbf5eb] hover:bg-[#f3e7d5] text-[#2a1c0a] text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.5} />
                <span className="hidden sm:inline">Поделиться</span>
              </button>

              <button
                onClick={onExportImport}
                title="Экспорт и импорт данных"
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-xs active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <button
                onClick={onOpenSettings}
                title="Настройки графика и ставок"
                className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-xs active:scale-95 cursor-pointer"
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
