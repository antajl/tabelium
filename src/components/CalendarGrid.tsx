import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Info,
} from 'lucide-react';
import type { DayShiftInfo } from '../types/schedule';
import { SHIFT_DEFINITIONS } from '../types/schedule';
import { RUSSIAN_DAY_OF_WEEK_SHORT, RUSSIAN_MONTH_NAMES } from '../utils/scheduleEngine';

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
}) => {
  const firstDayOfWeek = days.length > 0 ? days[0].dayOfWeek : 1;
  const blankDaysCount = firstDayOfWeek - 1;

  const yearsList = [2024, 2025, 2026, 2027, 2028];

  return (
    <div className="bg-[#fcfaf7] rounded-2xl border border-[#e7ddcf] p-3 sm:p-5 shadow-[0_1px_3px_rgba(45,30,15,0.04)]">
      {/* Month & Year Navigation in Old Money style */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-4 border-b border-[#e7ddcf]">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-full bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-sm"
            title="Предыдущий месяц"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => onSelectMonth(Number(e.target.value))}
              className="bg-white hover:bg-[#fcfaf7] text-[#252320] font-semibold text-sm sm:text-base px-3.5 py-1.5 rounded-full border border-[#e7ddcf] focus:outline-none focus:border-[#d8b57a] cursor-pointer transition shadow-sm"
            >
              {RUSSIAN_MONTH_NAMES.map((name, idx) => (
                <option key={idx + 1} value={idx + 1} className="bg-white text-[#252320]">
                  {name}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => onSelectYear(Number(e.target.value))}
              className="bg-white hover:bg-[#fcfaf7] text-[#7b511c] font-semibold text-sm sm:text-base px-3.5 py-1.5 rounded-full border border-[#e7ddcf] focus:outline-none focus:border-[#d8b57a] cursor-pointer transition shadow-sm"
            >
              {yearsList.map((y) => (
                <option key={y} value={y} className="bg-white text-[#252320]">
                  {y} г.
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onNextMonth}
            className="p-2 rounded-full bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-sm"
            title="Следующий месяц"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onJumpToday}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f7f2ea] text-[#7b511c] border border-[#d8b57a] text-xs font-semibold shadow-sm transition active:scale-95"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
            <span>Текущий месяц</span>
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

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {/* Transparent blank slots */}
        {Array.from({ length: blankDaysCount }).map((_, i) => (
          <div
            key={`blank-${i}`}
            className="h-20 sm:h-24 rounded-xl opacity-0 pointer-events-none"
          />
        ))}

        {days.map((day) => {
          const def = SHIFT_DEFINITIONS[day.status];
          const isWeekend = day.dayOfWeek >= 6;

          return (
            <div
              key={day.dateStr}
              onClick={() => onSelectDay(day)}
              className={`relative flex flex-col justify-between h-20 sm:h-24 p-2 sm:p-2.5 rounded-xl border select-none cursor-pointer transition-all shadow-2xs ${
                def.colorBg
              } ${def.colorBorder} ${
                day.isDoublePay ? 'ring-2 ring-[#e3a488] border-[#e3a488]' : ''
              } ${day.isToday ? 'outline outline-2 outline-[#b68231] outline-offset-1' : ''}`}
            >
              {/* Day Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs sm:text-sm font-semibold tabular-nums leading-none ${
                      day.isToday
                        ? 'text-[#b68231]'
                        : isWeekend
                        ? 'text-[#9d4c37]'
                        : 'text-[#252320]'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  {day.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b68231]" />
                  )}
                </div>

                {/* 2X Double Pay Tag (Terracotta Old Money) */}
                {day.isDoublePay ? (
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fbf4f0] text-[#9d4c37] border border-[#efc8b4]"
                    title={`Двойная оплата: ${day.holidayName || 'Праздник РФ'}`}
                  >
                    2X
                  </span>
                ) : day.isHoliday ? (
                  <span
                    className="text-[10px] text-[#9d4c37] font-medium truncate max-w-[65px]"
                    title={day.holidayName}
                  >
                    Праздник
                  </span>
                ) : null}
              </div>

              {/* Status Content */}
              <div className="my-auto">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${def.dotColor}`} />
                  <span className={`text-[11px] sm:text-xs font-semibold truncate ${def.colorText}`}>
                    <span className="sm:hidden">{def.shortLabel}</span>
                    <span className="hidden sm:inline">
                      {day.status === 'work'
                        ? '20:00 — 08:00'
                        : day.status === 'overtime'
                        ? 'Подр. 20:00'
                        : def.label}
                    </span>
                  </span>
                </div>

                {/* Holiday Name */}
                {day.holidayName && (
                  <p className="text-[10px] text-[#9d4c37] truncate font-medium mt-0.5 hidden sm:block">
                    {day.holidayName}
                  </p>
                )}

                {/* Note */}
                {day.note && (
                  <div className="flex items-center gap-1 text-[10px] text-[#81796e] truncate mt-0.5">
                    <Info className="w-2.5 h-2.5 shrink-0 text-[#bcb7ad]" />
                    <span className="truncate">{day.note}</span>
                  </div>
                )}
              </div>

              {/* Overridden marker */}
              {day.isOverridden && (
                <div className="absolute top-1.5 right-1.5 sm:hidden">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#b68231] block" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isReadOnly && (
        <div className="mt-4 p-3 bg-[#fbf4f0] border border-[#efc8b4] rounded-xl text-center text-xs text-[#9d4c37]">
          Режим просмотра графика (только чтение). Чтобы редактировать, вернитесь к своему графику.
        </div>
      )}
    </div>
  );
};
