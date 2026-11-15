import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: number;
  label: string;
}

interface CustomDropdownProps {
  value: number;
  options: DropdownOption[];
  onChange: (value: number) => void;
  accentColor?: string;
  className?: string;
}

export const CustomDropdown: React.FC<CustomDropdownProps> = ({
  value,
  options,
  onChange,
  accentColor = 'text-[#252320]',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
    <div className={`relative inline-block ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-between gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#fcfaf7] border border-[#e7ddcf] hover:border-[#d8b57a] text-sm sm:text-base font-semibold shadow-2xs transition-all cursor-pointer ${accentColor}`}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#81796e] transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#b68231]' : ''
          }`}
          strokeWidth={2}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 min-w-[130px] max-h-60 overflow-y-auto bg-[#fcfaf7] border border-[#e7ddcf] rounded-2xl shadow-xl p-1.5 backdrop-blur-md animate-in fade-in-0 zoom-in-95">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#f3e7d5] text-[#7b511c] font-bold shadow-2xs'
                    : 'text-[#252320] hover:bg-[#f5ede3] font-medium'
                }`}
              >
                <span>{opt.label}</span>
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
