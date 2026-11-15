import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  RotateCcw,
  Check,
  AlertCircle,
  Calendar,
  Users,
} from 'lucide-react';
import type { DayShiftInfo, ShiftType } from '../types/schedule';
import { RUSSIAN_MONTH_NAMES } from '../utils/scheduleEngine';
import { getColleagueTheme } from '../utils/colleagueThemes';

export interface DayModalProps {
  day: DayShiftInfo | null;
  anchorRect: DOMRect | null;
  isOpen: boolean;
  isReadOnly: boolean;
  onClose: () => void;
  onSave: (dateStr: string, status: ShiftType, note?: string) => void;
  onReset: (dateStr: string) => void;
  onSetAnchorDate?: (dateStr: string) => void;
}

export const DayModal: React.FC<DayModalProps> = ({
  day,
  anchorRect,
  isOpen,
  isReadOnly,
  onClose,
  onSave,
  onReset,
  onSetAnchorDate,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [note, setNote] = useState<string>('');
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (day) {
      setNote(day.note || '');
    }
  }, [day]);

  // Calculate Popover Position relative to anchorRect without blur backdrop
  useEffect(() => {
    if (!isOpen || !anchorRect) return;

    const width = 310;
    const height = 370;
    const padding = 12;

    let left = 0;
    let top = 0;

    const isMobile = window.innerWidth < 640;

    if (isMobile) {
      // On narrow mobile devices, center horizontally
      left = Math.max(padding, (window.innerWidth - width) / 2);
      if (anchorRect.bottom + height + padding <= window.innerHeight) {
        top = anchorRect.bottom + 8;
      } else if (anchorRect.top - height - padding >= 0) {
        top = anchorRect.top - height - 8;
      } else {
        top = Math.max(padding, window.innerHeight - height - padding);
      }
    } else {
      // Desktop: Prefer positioning to the right of the cell
      if (anchorRect.right + width + padding <= window.innerWidth) {
        left = anchorRect.right + 8;
        top = Math.max(padding, Math.min(anchorRect.top, window.innerHeight - height - padding));
      }
      // Else position to the left of the cell
      else if (anchorRect.left - width - padding >= 0) {
        left = anchorRect.left - width - 8;
        top = Math.max(padding, Math.min(anchorRect.top, window.innerHeight - height - padding));
      }
      // Else position below cell
      else {
        left = Math.max(padding, Math.min(anchorRect.left, window.innerWidth - width - padding));
        top = Math.min(anchorRect.bottom + 8, window.innerHeight - height - padding);
      }
    }

    setCoords({ top, left });
  }, [isOpen, anchorRect]);

  // Click Outside to Close (No full-screen blur!)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    if (isOpen) {
      // Delay listener slightly to prevent the opening click from triggering outside click
      const timer = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
      }, 50);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !day) return null;

  const [yearStr, monthStr, dayStr] = day.dateStr.split('-');
  const monthName = RUSSIAN_MONTH_NAMES[Number(monthStr) - 1];

  const handleSelectStatus = (newStatus: ShiftType) => {
    if (isReadOnly) return;
    onSave(day.dateStr, newStatus, note.trim() || undefined);
    onClose();
  };

  const handleSaveNote = () => {
    if (isReadOnly) return;
    onSave(day.dateStr, day.status, note.trim() || undefined);
    onClose();
  };

  const handleReset = () => {
    onReset(day.dateStr);
    onClose();
  };

  const statusOptions: {
    type: ShiftType;
    label: string;
    dotColor: string;
    color: string;
    border: string;
    bg: string;
    activeBg: string;
  }[] = [
    {
      type: 'work',
      label: 'Работа',
      dotColor: 'bg-[#d32f2f]',
      color: 'text-[#93231c]',
      border: 'border-[#f5b8b2]',
      bg: 'bg-[#fdeeed]',
      activeBg: 'bg-[#fdeeed] border-[#d32f2f] ring-2 ring-[#d32f2f]',
    },
    {
      type: 'off',
      label: 'Выходной',
      dotColor: 'bg-[#2e7d32]',
      color: 'text-[#215128]',
      border: 'border-[#b8deb9]',
      bg: 'bg-[#eaf5ec]',
      activeBg: 'bg-[#eaf5ec] border-[#2e7d32] ring-2 ring-[#2e7d32]',
    },
    {
      type: 'overtime',
      label: 'Подработка',
      dotColor: 'bg-[#b71c1c]',
      color: 'text-[#7f1d1d]',
      border: 'border-[#e57373] border-dashed',
      bg: 'bg-[#fbdcd9]',
      activeBg: 'bg-[#fbdcd9] border-[#b71c1c] ring-2 ring-[#b71c1c]',
    },
    {
      type: 'vacation',
      label: 'Отпуск',
      dotColor: 'bg-[#e5a100]',
      color: 'text-[#7d5600]',
      border: 'border-[#f6dc84]',
      bg: 'bg-[#fef7db]',
      activeBg: 'bg-[#fef7db] border-[#e5a100] ring-2 ring-[#e5a100]',
    },
  ];

  return (
    <div
      ref={popoverRef}
      style={{
        position: 'fixed',
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        width: '310px',
        zIndex: 60,
      }}
      className="bg-[#fcfaf7] border border-[#e7ddcf] rounded-2xl p-4 shadow-2xl backdrop-blur-sm animate-in fade-in-0 zoom-in-95 text-xs select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#e7ddcf]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#252320]">
            {Number(dayStr)} {monthName} {yearStr}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#f3ede4] text-[#81796e] font-semibold border border-[#e7ddcf]">
            {day.dayOfWeekName}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full text-[#81796e] hover:text-[#252320] hover:bg-[#f7f2ea] transition cursor-pointer"
          title="Закрыть"
        >
          <X className="w-3.5 h-3.5" strokeWidth={1.5} />
        </button>
      </div>

      {/* Holiday Alert */}
      {day.isHoliday && (
        <div className="mt-2.5 p-2 rounded-xl bg-[#fbf4f0] border border-[#efc8b4] text-[11px] text-[#9d4c37] flex flex-col gap-1 shadow-2xs">
          <div className="flex items-center gap-1.5 font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-[#9d4c37] shrink-0" strokeWidth={1.5} />
            <span className="truncate">{day.holidayFullName || day.holidayName || 'Праздник РФ'}</span>
            {day.isDoublePay ? (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#f3e7d5] text-[#7b511c] font-bold border border-[#d8b57a] ml-auto shrink-0">
                2X
              </span>
            ) : day.holidayCategory === 'transfer' ? (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#f3e7d5] text-[#7b511c] font-medium border border-[#d8b57a] ml-auto shrink-0">
                Перенос
              </span>
            ) : null}
          </div>
          {day.holidayDescription && (
            <div className="text-[10px] text-[#81796e] pl-5 leading-tight">
              {day.holidayDescription}
            </div>
          )}
        </div>
      )}

      {/* Colleague Vacations Alert */}
      {day.colleagueVacations && day.colleagueVacations.length > 0 && (
        <div className="mt-2.5 p-2 rounded-xl bg-[#f8f6f0] border border-[#e7ddcf] text-[11px] text-[#252320] flex flex-col gap-1.5 shadow-2xs">
          <div className="font-semibold flex items-center gap-1.5 text-[#81796e]">
            <Users className="w-3.5 h-3.5 text-[#b68231] shrink-0" strokeWidth={1.5} />
            <span>Отпуск напарников в этот день:</span>
          </div>
          {day.colleagueVacations.map((cv) => {
            const theme = getColleagueTheme(cv.colorTheme);
            return (
              <div
                key={cv.colleagueId + cv.vacationId}
                className={`flex items-center justify-between px-2 py-1 rounded-lg border text-[10px] ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                  <span className="truncate">
                    <strong>{cv.colleagueName}</strong> ({cv.startDate} — {cv.endDate})
                  </span>
                </div>
                <span className="font-semibold shrink-0 ml-1">
                  день {cv.dayIndex} из {cv.totalDays}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Status Selection (Instant 1-Click Action) */}
      <div className="mt-3">
        <label className="text-[11px] font-semibold text-[#81796e] block mb-1.5">
          Сменить статус дня:
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {statusOptions.map((opt) => {
            const isCurrent = day.status === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleSelectStatus(opt.type)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isCurrent
                    ? opt.activeBg
                    : `${opt.bg} ${opt.border} ${opt.color} hover:brightness-95 active:scale-95`
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${opt.dotColor} shrink-0`} />
                  <span className={opt.color}>{opt.label}</span>
                </div>
                {isCurrent && <Check className="w-3.5 h-3.5 text-[#252320]" strokeWidth={2.5} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cycle Anchor Button */}
      {onSetAnchorDate && !isReadOnly && (
        <div className="mt-3 pt-2.5 border-t border-[#e7ddcf]">
          <button
            type="button"
            onClick={() => {
              onSetAnchorDate(day.dateStr);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-[#fbf5ec] hover:bg-[#f3e7d5] text-[#7b511c] border border-[#d8b57a] text-xs font-semibold transition shadow-2xs cursor-pointer active:scale-95"
            title="Сделать этот день началом смены и автоматически перестроить график"
          >
            <Calendar className="w-3 h-3 text-[#b68231]" strokeWidth={1.5} />
            <span>Начать цикл с этого дня</span>
          </button>
        </div>
      )}

      {/* Note Input */}
      {!isReadOnly && (
        <div className="mt-2.5">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onBlur={handleSaveNote}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveNote();
            }}
            placeholder="Заметка к дню (Enter)..."
            className="w-full bg-white border border-[#e7ddcf] rounded-xl px-2.5 py-1.5 text-[11px] text-[#252320] placeholder-[#bcb7ad] focus:outline-none focus:border-[#d8b57a] shadow-2xs"
          />
        </div>
      )}

      {/* Reset to Default */}
      {day.isOverridden && !isReadOnly && (
        <div className="mt-2 pt-2 border-t border-[#e7ddcf] flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 text-[11px] text-[#81796e] hover:text-[#93231c] transition cursor-pointer"
            title="Вернуть базовый статус по формуле 2/2"
          >
            <RotateCcw className="w-3 h-3" strokeWidth={1.5} />
            <span>Сбросить к дефолту</span>
          </button>
        </div>
      )}
    </div>
  );
};
