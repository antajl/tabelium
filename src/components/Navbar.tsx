import React from 'react';
import {
  Share2,
  Settings,
  Download,
  Eye,
  RotateCcw,
  CalendarDays,
  CalendarRange,
} from 'lucide-react';

interface NavbarProps {
  scheduleName: string;
  isReadOnly: boolean;
  viewMode: 'month' | 'year';
  onChangeViewMode: (mode: 'month' | 'year') => void;
  onOpenShare: () => void;
  onOpenSettings: () => void;
  onExportImport: () => void;
  onExitReadOnly?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  scheduleName: _scheduleName,
  isReadOnly,
  viewMode,
  onChangeViewMode,
  onOpenShare,
  onOpenSettings,
  onExportImport,
  onExitReadOnly,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e7ddcf] shadow-[0_1px_3px_rgba(45,30,15,0.04)]">
      <div className="w-full max-w-[1700px] mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Left: Brand & Context */}
        <div className="flex-1 flex items-center justify-start gap-3 min-w-0">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-[#252320] leading-tight">
              Сменограф
            </span>
            <span className="text-[10px] text-[#81796e] hidden md:inline leading-none mt-0.5">
              График смен и отпусков
            </span>
          </div>

          {isReadOnly && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f3e7d5] text-[#7b511c] border border-[#d8b57a]">
              <Eye className="w-3 h-3" strokeWidth={1.5} /> Просмотр
            </span>
          )}
        </div>

        {/* Center: Tabs [ Месяц | Год ] */}
        <div className="flex items-center justify-center shrink-0">
          <div className="inline-flex p-1 rounded-full bg-[#f3ece2] border border-[#e7ddcf] shadow-inner text-xs">
            <button
              onClick={() => onChangeViewMode('month')}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full transition-all text-xs font-semibold cursor-pointer active:scale-95 ${
                viewMode === 'month'
                  ? 'bg-white text-[#2a1c0a] shadow-sm border border-[#d8b57a]/50 font-bold'
                  : 'text-[#736b60] hover:text-[#252320]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.75} />
              <span>Месяц</span>
            </button>
            <button
              onClick={() => onChangeViewMode('year')}
              className={`inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full transition-all text-xs font-semibold cursor-pointer active:scale-95 ${
                viewMode === 'year'
                  ? 'bg-white text-[#2a1c0a] shadow-sm border border-[#d8b57a]/50 font-bold'
                  : 'text-[#736b60] hover:text-[#252320]'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.75} />
              <span>Год</span>
            </button>
          </div>
        </div>

        {/* Right: Functional actions */}
        <div className="flex-1 flex items-center justify-end gap-2 shrink-0">
          {isReadOnly ? (
            <button
              onClick={onExitReadOnly}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#2a1c0a] text-xs font-semibold border border-[#d8b57a] transition shadow-sm active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.5} />
              <span>Мой график</span>
            </button>
          ) : (
            <>
              <button
                onClick={onOpenShare}
                title="Поделиться графиком"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#d8b57a] bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#2a1c0a] text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.5} />
                <span className="hidden sm:inline">Поделиться</span>
              </button>

              <button
                onClick={onExportImport}
                title="Экспорт и импорт"
                className="p-2 rounded-full bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-sm active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" strokeWidth={1.5} />
              </button>

              <button
                onClick={onOpenSettings}
                title="Настройки"
                className="p-2 rounded-full bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-sm active:scale-95 cursor-pointer"
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
