import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const MONTHS_GRID = [
  { value: 1, short: 'Янв', full: 'Январь' },
  { value: 2, short: 'Фев', full: 'Февраль' },
  { value: 3, short: 'Мар', full: 'Март' },
  { value: 4, short: 'Апр', full: 'Апрель' },
  { value: 5, short: 'Май', full: 'Май' },
  { value: 6, short: 'Июн', full: 'Июнь' },
  { value: 7, short: 'Июл', full: 'Июль' },
  { value: 8, short: 'Авг', full: 'Август' },
  { value: 9, short: 'Сен', full: 'Сентябрь' },
  { value: 10, short: 'Окт', full: 'Октябрь' },
  { value: 11, short: 'Ноя', full: 'Ноябрь' },
  { value: 12, short: 'Дек', full: 'Декабрь' },
];

export interface MonthYearDropdownProps {
  selectedYear: number;
  selectedMonth: number;
  onSelectYear: (year: number) => void;
  onSelectMonth: (month: number) => void;
  className?: string;
}

export const MonthYearDropdown: React.FC<MonthYearDropdownProps> = ({
  selectedYear,
  selectedMonth,
  onSelectYear,
  onSelectMonth,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'years' | 'months'>('months');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const years = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  const monthInfo = MONTHS_GRID.find((m) => m.value === selectedMonth);
  const triggerLabel = `${monthInfo?.full || ''} ${selectedYear}`;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger Button inside segmented control */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-transparent hover:bg-white text-xs sm:text-sm font-bold text-[#252320] transition-all cursor-pointer active:scale-95"
        title="Выбрать месяц и год"
      >
        <span className="tabular-nums">{triggerLabel}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#81796e] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#b68231]' : ''
          }`}
          strokeWidth={2}
        />
      </button>

      {/* Floating Popup (CoursingStats MonthYearDropdown style) */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-64 sm:w-72 p-3 bg-[#fcfaf7] border border-[#e7ddcf] rounded-2xl shadow-xl backdrop-blur-md animate-in fade-in-0 zoom-in-95 space-y-2.5">
          {/* Segmented Mode Switcher: Год / Месяц */}
          <div
            className="grid grid-cols-2 p-0.5 rounded-lg bg-[#f3ede4] border border-[#e7ddcf] gap-0.5"
            role="tablist"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'years'}
              onClick={() => setViewMode('years')}
              className={`py-1 rounded-md text-xs font-semibold transition-all text-center cursor-pointer ${
                viewMode === 'years'
                  ? 'bg-[#f3e7d5] text-[#7b511c] shadow-2xs'
                  : 'text-[#81796e] hover:text-[#252320] hover:bg-white/60'
              }`}
            >
              Год
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'months'}
              onClick={() => setViewMode('months')}
              className={`py-1 rounded-md text-xs font-semibold transition-all text-center cursor-pointer ${
                viewMode === 'months'
                  ? 'bg-[#f3e7d5] text-[#7b511c] shadow-2xs'
                  : 'text-[#81796e] hover:text-[#252320] hover:bg-white/60'
              }`}
            >
              Месяц
            </button>
          </div>

          {/* View Mode: Years */}
          {viewMode === 'years' && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-medium text-[#81796e] px-0.5">
                Выберите год:
              </div>
              <div className="grid grid-cols-3 gap-1.5 max-h-52 overflow-y-auto p-0.5">
                {years.map((year) => {
                  const isSelected = selectedYear === year;
                  return (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        onSelectYear(year);
                        setViewMode('months');
                      }}
                      className={`h-8 rounded-lg text-xs font-semibold transition-colors tabular-nums cursor-pointer border ${
                        isSelected
                          ? 'bg-[#f3e7d5] text-[#7b511c] border-[#d8b57a] shadow-xs'
                          : 'bg-white hover:bg-[#f3e7d5]/40 text-[#252320] border-[#e7ddcf]'
                      }`}
                    >
                      {year}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* View Mode: Months */}
          {viewMode === 'months' && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-medium text-[#81796e] px-0.5">
                Месяцы за {selectedYear} год:
              </div>
              <div className="grid grid-cols-3 gap-1.5 p-0.5">
                {MONTHS_GRID.map((m) => {
                  const isSelected = selectedMonth === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => {
                        onSelectMonth(m.value);
                        setIsOpen(false);
                      }}
                      className={`h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer border ${
                        isSelected
                          ? 'bg-[#f3e7d5] text-[#7b511c] border-[#d8b57a] shadow-xs'
                          : 'bg-white hover:bg-[#f3e7d5]/40 text-[#252320] border-[#e7ddcf]'
                      }`}
                    >
                      {m.short}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
