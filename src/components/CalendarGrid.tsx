import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw,
  X,
} from 'lucide-react';
import type { DayShiftInfo, ShiftType } from '../types/schedule';
import { SHIFT_DEFINITIONS } from '../types/schedule';
import { RUSSIAN_DAY_OF_WEEK_SHORT } from '../utils/scheduleEngine';
import { MonthYearDropdown } from './MonthYearDropdown';

interface CalendarGridProps {
  year: number;
  month: number; // 1-12
  days: DayShiftInfo[];
  isReadOnly: boolean;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSelectYear: (y: number) => void;
  onSelectMonth: (m: number) => void;
  onJumpToday: () => void;
  onSelectDay: (day: DayShiftInfo) => void;
  onApplyRange?: (startStr: string, endStr: string, status: ShiftType) => void;
  onResetRange?: (startStr: string, endStr: string) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  year,
  month,
  days,
  isReadOnly,
  onPrevMonth,
  onNextMonth,
  onSelectYear,
  onSelectMonth,
  onJumpToday,
  onSelectDay,
  onApplyRange,
  onResetRange,
}) => {
  const firstDayOfWeek = days.length > 0 ? days[0].dayOfWeek : 1;
  const blankDaysCount = firstDayOfWeek - 1;

  // Range Selection State (drag or click-tap)
  const [rangeAnchor, setRangeAnchor] = useState<string | null>(null);
  const [rangeTarget, setRangeTarget] = useState<string | null>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [isRangeMode, setIsRangeMode] = useState<boolean>(false);

  const rangeMin =
    rangeAnchor && rangeTarget
      ? rangeAnchor < rangeTarget
        ? rangeAnchor
        : rangeTarget
      : null;
  const rangeMax =
    rangeAnchor && rangeTarget
      ? rangeAnchor < rangeTarget
        ? rangeTarget
        : rangeAnchor
      : null;

  const isDayInRange = (dateStr: string) => {
    if (!rangeMin || !rangeMax) return false;
    return dateStr >= rangeMin && dateStr <= rangeMax;
  };

  const getRangeCount = () => {
    if (!rangeMin || !rangeMax) return 0;
    const [yA, mA, dA] = rangeMin.split('-').map(Number);
    const [yB, mB, dB] = rangeMax.split('-').map(Number);
    const utcA = Date.UTC(yA, mA - 1, dA);
    const utcB = Date.UTC(yB, mB - 1, dB);
    return Math.round((utcB - utcA) / (1000 * 60 * 60 * 24)) + 1;
  };

  const clearRange = () => {
    setRangeAnchor(null);
    setRangeTarget(null);
    setIsMouseDown(false);
  };

  const handleCellMouseDown = (day: DayShiftInfo) => {
    if (isReadOnly) return;
    setIsMouseDown(true);
    setRangeAnchor(day.dateStr);
    setRangeTarget(day.dateStr);
  };

  const handleCellMouseEnter = (day: DayShiftInfo) => {
    if (isReadOnly || !isMouseDown) return;
    setRangeTarget(day.dateStr);
  };

  const handleCellMouseUp = (day: DayShiftInfo) => {
    if (isReadOnly) return;
    if (isMouseDown) {
      setIsMouseDown(false);
      if (rangeAnchor === day.dateStr && !isRangeMode) {
        // Single click -> open DayModal
        clearRange();
        onSelectDay(day);
      }
    }
  };

  const handleCellClick = (day: DayShiftInfo) => {
    if (isReadOnly) {
      onSelectDay(day);
      return;
    }
    if (isRangeMode) {
      if (!rangeAnchor) {
        setRangeAnchor(day.dateStr);
        setRangeTarget(day.dateStr);
      } else {
        setRangeTarget(day.dateStr);
      }
    }
  };

  const handleApplyRangeStatus = (status: ShiftType) => {
    if (rangeMin && rangeMax && onApplyRange) {
      onApplyRange(rangeMin, rangeMax, status);
      clearRange();
    }
  };

  const handleResetRangeStatus = () => {
    if (rangeMin && rangeMax && onResetRange) {
      onResetRange(rangeMin, rangeMax);
      clearRange();
    }
  };

  return (
    <div className="bg-[#fcfaf7] rounded-2xl border border-[#e7ddcf] p-3 sm:p-5 shadow-[0_1px_3px_rgba(45,30,15,0.04)]">
      {/* Single Horizontal Toolbar Line (CoursingStats / Procursus pattern) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 mb-3 border-b border-[#e7ddcf]">
        {/* Left: Navigation, Dropdown, Divider, Inline Legend */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Month & Year Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={onPrevMonth}
              className="p-1.5 rounded-full bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-2xs active:scale-95"
              title="Предыдущий месяц"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>

            <MonthYearDropdown
              selectedYear={year}
              selectedMonth={month}
              onSelectYear={onSelectYear}
              onSelectMonth={onSelectMonth}
            />

            <button
              onClick={onNextMonth}
              className="p-1.5 rounded-full bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-2xs active:scale-95"
              title="Следующий месяц"
            >
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} />
            </button>
          </div>

          <div className="h-4 w-px bg-[#e7ddcf] hidden sm:block mx-1" />

          {/* Inline Legend (On the exact same row) */}
          <div className="flex items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d32f2f] shrink-0" />
              <span className="font-semibold text-[#93231c]">Работа</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b71c1c] ring-1 ring-[#e57373] shrink-0" />
              <span className="font-semibold text-[#7f1d1d]">Подработка</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32] shrink-0" />
              <span className="font-semibold text-[#215128]">Выходной</span>
            </div>

            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e5a100] shrink-0" />
              <span className="font-semibold text-[#7d5600]">Отпуск</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          {!isReadOnly && (
            <button
              type="button"
              onClick={() => {
                setIsRangeMode(!isRangeMode);
                clearRange();
              }}
              className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border transition shadow-2xs active:scale-95 cursor-pointer ${
                isRangeMode
                  ? 'bg-[#b68231] text-white border-[#b68231]'
                  : 'bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border-[#e7ddcf]'
              }`}
              title="Режим выбора диапазона дней"
            >
              <span>Выбор дней</span>
            </button>
          )}

          <button
            onClick={onJumpToday}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#f7f2ea] text-[#7b511c] border border-[#d8b57a] text-xs font-semibold shadow-2xs transition active:scale-95 cursor-pointer"
            title="Перейти к текущему дню"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
            <span className="hidden sm:inline">Текущий месяц</span>
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 mb-2 text-center">
        {RUSSIAN_DAY_OF_WEEK_SHORT.map((dow, idx) => {
          const isWeekend = idx >= 5;
          return (
            <div
              key={dow}
              className={`py-1 text-xs font-semibold rounded-md ${
                isWeekend ? 'text-[#9d4c37] bg-[#fbf4f0]' : 'text-[#81796e] bg-[#f3ede4]/50'
              }`}
            >
              {dow}
            </div>
          );
        })}
      </div>

      {/* Days Grid - Pure Square Cells with Consistent Vertical Horizon */}
      <div
        className="grid grid-cols-7 gap-1.5 sm:gap-2"
        onMouseLeave={() => {
          if (isMouseDown && !isRangeMode) {
            setIsMouseDown(false);
          }
        }}
      >
        {/* Transparent blank slots */}
        {Array.from({ length: blankDaysCount }).map((_, i) => (
          <div
            key={`blank-${i}`}
            className="aspect-square min-h-[64px] sm:min-h-[82px] md:min-h-[92px] rounded-xl opacity-0 pointer-events-none"
          />
        ))}

        {days.map((day) => {
          const def = SHIFT_DEFINITIONS[day.status];
          const isWeekend = day.dayOfWeek >= 6;
          const isInActiveRange = isDayInRange(day.dateStr);

          return (
            <div
              key={day.dateStr}
              onMouseDown={() => handleCellMouseDown(day)}
              onMouseEnter={() => handleCellMouseEnter(day)}
              onMouseUp={() => handleCellMouseUp(day)}
              onClick={() => handleCellClick(day)}
              className={`relative flex flex-col justify-between aspect-square min-h-[64px] sm:min-h-[82px] md:min-h-[92px] p-1.5 sm:p-2 rounded-xl border select-none cursor-pointer transition-all shadow-2xs ${
                def.colorBg
              } ${def.colorBorder} ${
                isInActiveRange
                  ? 'ring-2 ring-[#b68231] scale-[1.02] z-10 shadow-md'
                  : ''
              } ${
                day.isPast
                  ? 'opacity-60 grayscale-[30%] hover:opacity-100 hover:grayscale-0'
                  : ''
              } ${
                day.isToday
                  ? 'ring-2 ring-[#b68231] outline outline-2 outline-[#b68231] outline-offset-1 shadow-md !opacity-100 !grayscale-0'
                  : ''
              }`}
            >
              {/* Day Header (Number on Left, 2X/Status on Right) */}
              <div className="flex items-start justify-between gap-1 leading-none">
                <span
                  className={`text-xs sm:text-sm font-semibold tabular-nums ${
                    day.isToday
                      ? 'text-[#b68231] font-bold'
                      : isWeekend
                      ? 'text-[#9d4c37]'
                      : 'text-[#252320]'
                  }`}
                >
                  {day.dayNumber}
                </span>

                {/* 2X Double Pay Tag or Overridden marker */}
                {day.isDoublePay ? (
                  <span
                    className="inline-flex items-center px-1 py-0.2 rounded-full text-[9px] font-bold bg-[#fbf4f0] text-[#9d4c37] border border-[#efc8b4] shrink-0"
                    title={`Двойная оплата: ${day.holidayName || 'Праздник РФ'}`}
                  >
                    2X
                  </span>
                ) : day.isOverridden ? (
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#b68231] shrink-0 mt-0.5"
                    title="Статус изменен вручную"
                  />
                ) : null}
              </div>

              {/* Status Content (Centered on a Consistent Axis) */}
              <div className="flex items-center justify-center gap-1.5 my-auto">
                <span className={`w-2 h-2 rounded-full shrink-0 ${def.dotColor}`} />
                <span className={`text-[11px] sm:text-xs font-semibold truncate ${def.colorText}`}>
                  <span className="sm:hidden">{def.shortLabel}</span>
                  <span className="hidden sm:inline">{def.label}</span>
                </span>
              </div>

              {/* Bottom Slot (Reserved for Holiday text, never displaces middle status) */}
              <div className="h-3.5 sm:h-4 flex items-center justify-center overflow-hidden">
                {day.holidayName ? (
                  <span
                    className="text-[9px] text-[#9d4c37] font-medium truncate leading-none block text-center"
                    title={day.holidayName}
                  >
                    {day.holidayName}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Range Action Bar (Visible when multiple days selected) */}
      {rangeMin && rangeMax && (
        <div className="sticky bottom-2 z-40 mt-4 p-3 bg-white/95 backdrop-blur-md border border-[#d8b57a] rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-2.5 animate-in fade-in-0 slide-in-from-bottom-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#252320]">
              Выбрано: <strong className="text-[#b68231] tabular-nums">{getRangeCount()}</strong> дн.
            </span>
            <span className="text-[11px] text-[#81796e]">
              ({rangeMin} — {rangeMax})
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleApplyRangeStatus('vacation')}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fef7db] hover:bg-[#fdefbd] text-[#7d5600] border border-[#f6dc84] transition shadow-2xs active:scale-95"
            >
              Отпуск
            </button>
            <button
              type="button"
              onClick={() => handleApplyRangeStatus('overtime')}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fbdcd9] hover:bg-[#f8c8c3] text-[#7f1d1d] border border-[#e57373] border-dashed transition shadow-2xs active:scale-95"
            >
              Подработка
            </button>
            <button
              type="button"
              onClick={() => handleApplyRangeStatus('work')}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fdeeed] hover:bg-[#fbdcd9] text-[#93231c] border border-[#f5b8b2] transition shadow-2xs active:scale-95"
            >
              Работа
            </button>
            <button
              type="button"
              onClick={() => handleApplyRangeStatus('off')}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#eaf5ec] hover:bg-[#ddf0e0] text-[#215128] border border-[#b8deb9] transition shadow-2xs active:scale-95"
            >
              Выходной
            </button>
            <button
              type="button"
              onClick={handleResetRangeStatus}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f3ede4] hover:bg-[#e7ddcf] text-[#252320] border border-[#d8b57a] transition shadow-2xs active:scale-95 flex items-center gap-1"
              title="Сбросить все дни диапазона к эталону 2/2"
            >
              <RotateCcw className="w-3 h-3 text-[#b68231]" strokeWidth={2} />
              <span>В эталон (Дефолт)</span>
            </button>
            <button
              type="button"
              onClick={clearRange}
              className="p-1 rounded-full text-[#81796e] hover:text-[#252320] hover:bg-[#f3ede4] transition ml-1"
              title="Снять выделение"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      )}

      {isReadOnly && (
        <div className="mt-4 p-3 bg-[#fbf4f0] border border-[#efc8b4] rounded-xl text-center text-xs text-[#9d4c37]">
          Режим просмотра графика (только чтение). Чтобы редактировать, вернитесь к своему графику.
        </div>
      )}
    </div>
  );
};
