import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface YearDropdownProps {
  selectedYear: number;
  yearsRange?: number[];
  onSelectYear: (year: number) => void;
  className?: string;
}

export const YearDropdown: React.FC<YearDropdownProps> = ({
  selectedYear,
  yearsRange = [2024, 2025, 2026, 2027, 2028, 2029, 2030],
  onSelectYear,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className={`relative inline-block ${isOpen ? 'z-50' : 'z-10'} ${className}`} ref={dropdownRef}>
      {/* Trigger Button inside segmented control */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-transparent hover:bg-white text-xs sm:text-sm font-bold text-[#252320] transition-all cursor-pointer active:scale-95"
        title="Выбрать год"
      >
        <span className="tabular-nums">{selectedYear} год</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#81796e] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#b68231]' : ''
          }`}
          strokeWidth={2}
        />
      </button>

      {/* Floating Popup (Old Money style matching Month dropdown) */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[130px] max-h-64 overflow-y-auto bg-[#fcfaf7] border border-[#e7ddcf] rounded-2xl shadow-2xl p-1.5 backdrop-blur-md animate-in fade-in-0 zoom-in-95 space-y-0.5">
          {yearsRange.map((y) => {
            const isSelected = y === selectedYear;
            return (
              <button
                key={y}
                type="button"
                onClick={() => {
                  onSelectYear(y);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#f3e7d5] text-[#7b511c] font-bold shadow-2xs'
                    : 'text-[#252320] hover:bg-[#f5ede3] font-medium'
                }`}
              >
                <span className="tabular-nums">{y} год</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b68231] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
