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
    <div className="bg-[#1e1c19] rounded-2xl border border-[#2e2a25] p-3 sm:p-5 shadow-sm">
      {/* Month & Year Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-4 border-b border-[#2d2924]">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-lg bg-[#26231f] hover:bg-[#302c27] text-[#beb6a6] border border-[#38332c] transition"
            title="Предыдущий месяц"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          </button>

          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => onSelectMonth(Number(e.target.value))}
              className="bg-[#26231f] hover:bg-[#302c27] text-[#ede7dc] font-medium text-sm sm:text-base px-3 py-1.5 rounded-lg border border-[#38332c] focus:outline-none focus:border-[#deb887] cursor-pointer transition"
            >
              {RUSSIAN_MONTH_NAMES.map((name, idx) => (
                <option key={idx + 1} value={idx + 1} className="bg-[#22201d] text-[#ede7dc]">
                  {name}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => onSelectYear(Number(e.target.value))}
              className="bg-[#26231f] hover:bg-[#302c27] text-[#deb887] font-medium text-sm sm:text-base px-3 py-1.5 rounded-lg border border-[#38332c] focus:outline-none focus:border-[#deb887] cursor-pointer transition"
            >
              {yearsList.map((y) => (
                <option key={y} value={y} className="bg-[#22201d] text-[#ede7dc]">
                  {y} г.
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onNextMonth}
            className="p-2 rounded-lg bg-[#26231f] hover:bg-[#302c27] text-[#beb6a6] border border-[#38332c] transition"
            title="Следующий месяц"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onJumpToday}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#26231f] hover:bg-[#302c27] text-[#beb6a6] hover:text-[#ede7dc] border border-[#38332c] text-xs font-medium transition"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#deb887]" strokeWidth={1.5} />
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
              className={`py-1 text-xs font-medium rounded-md ${
                isWeekend ? 'text-[#c97b71] bg-[#c97b71]/5' : 'text-[#877f72] bg-[#24211d]/50'
              }`}
            >
              {dow}
            </div>
          );
        })}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {/* Clean, quiet blank slots before 1st day of month (no heavy borders) */}
        {Array.from({ length: blankDaysCount }).map((_, i) => (
          <div
            key={`blank-${i}`}
            className="h-20 sm:h-24 rounded-xl opacity-20 pointer-events-none"
          />
        ))}

        {days.map((day) => {
          const def = SHIFT_DEFINITIONS[day.status];
          const isWeekend = day.dayOfWeek >= 6;

          return (
            <div
              key={day.dateStr}
              onClick={() => onSelectDay(day)}
              className={`relative flex flex-col justify-between h-20 sm:h-24 p-2 sm:p-2.5 rounded-xl border select-none cursor-pointer transition-colors ${
                def.colorBg
              } ${def.colorBorder} ${
                day.isDoublePay ? 'border-[#8f6a39] bg-[#2a2218]' : ''
              } ${day.isToday ? 'outline outline-1 outline-[#deb887] outline-offset-1' : ''}`}
            >
              {/* Day Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-xs sm:text-sm font-semibold tabular-nums leading-none ${
                      day.isToday
                        ? 'text-[#deb887]'
                        : isWeekend
                        ? 'text-[#c97b71]'
                        : 'text-[#ede7dc]'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  {day.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#deb887]" />
                  )}
                </div>

                {/* 2X Double Pay Tag */}
                {day.isDoublePay ? (
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#3d2e1c] text-[#f2c77e] border border-[#664b28]"
                    title={`Двойная оплата: ${day.holidayName || 'Праздник РФ'}`}
                  >
                    2X
                  </span>
                ) : day.isHoliday ? (
                  <span
                    className="text-[10px] text-[#b89565] font-medium truncate max-w-[65px]"
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
                  <span className={`text-[11px] sm:text-xs font-medium truncate ${def.colorText}`}>
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
                  <p className="text-[10px] text-[#b89565] truncate font-normal mt-0.5 hidden sm:block">
                    {day.holidayName}
                  </p>
                )}

                {/* Note */}
                {day.note && (
                  <div className="flex items-center gap-1 text-[10px] text-[#999081] truncate mt-0.5">
                    <Info className="w-2.5 h-2.5 shrink-0 text-[#736a5c]" />
                    <span className="truncate">{day.note}</span>
                  </div>
                )}
              </div>

              {/* Overridden marker */}
              {day.isOverridden && (
                <div className="absolute top-1.5 right-1.5 sm:hidden">
                  <span className="w-1 h-1 rounded-full bg-[#d19c52] block" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isReadOnly && (
        <div className="mt-4 p-3 bg-[#262119] border border-[#423624] rounded-xl text-center text-xs text-[#deb887]">
          Режим просмотра графика (только чтение). Чтобы редактировать, вернитесь к своему графику.
        </div>
      )}
    </div>
  );
};
