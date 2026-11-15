import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Moon,
  Coffee,
  Zap,
  Palmtree,
  Sparkles,
  Info,
} from 'lucide-react';
import type {
  DayShiftInfo,
  ShiftType,
} from '../types/schedule';
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

  const renderShiftIcon = (type: ShiftType) => {
    switch (type) {
      case 'work':
        return <Moon className="w-3.5 h-3.5 text-indigo-400" />;
      case 'off':
        return <Coffee className="w-3.5 h-3.5 text-slate-400" />;
      case 'overtime':
        return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'vacation':
        return <Palmtree className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const yearsList = [2024, 2025, 2026, 2027, 2028];

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-3 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={onPrevMonth}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition active:scale-95"
            title="Предыдущий месяц"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <select
              value={month}
              onChange={(e) => onSelectMonth(Number(e.target.value))}
              className="bg-slate-800 hover:bg-slate-750 text-white font-bold text-base sm:text-lg px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
            >
              {RUSSIAN_MONTH_NAMES.map((name, idx) => (
                <option key={idx + 1} value={idx + 1} className="bg-slate-900 text-white">
                  {name}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => onSelectYear(Number(e.target.value))}
              className="bg-slate-800 hover:bg-slate-750 text-indigo-400 font-bold text-base sm:text-lg px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
            >
              {yearsList.map((y) => (
                <option key={y} value={y} className="bg-slate-900 text-white">
                  {y} г.
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onNextMonth}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition active:scale-95"
            title="Следующий месяц"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onJumpToday}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs sm:text-sm font-medium transition active:scale-95"
          >
            <CalendarIcon className="w-4 h-4 text-indigo-400" />
            <span>Текущий месяц</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {RUSSIAN_DAY_OF_WEEK_SHORT.map((dow, idx) => {
          const isWeekend = idx >= 5;
          return (
            <div
              key={dow}
              className={`py-1.5 text-xs sm:text-sm font-semibold rounded-lg ${
                isWeekend ? 'text-rose-400/80 bg-rose-500/5' : 'text-slate-400 bg-slate-800/30'
              }`}
            >
              {dow}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {Array.from({ length: blankDaysCount }).map((_, i) => (
          <div
            key={`blank-${i}`}
            className="h-20 sm:h-28 rounded-xl bg-slate-900/30 border border-dashed border-slate-800/40 opacity-40 pointer-events-none"
          />
        ))}

        {days.map((day) => {
          const def = SHIFT_DEFINITIONS[day.status];
          const isWeekend = day.dayOfWeek >= 6;

          return (
            <div
              key={day.dateStr}
              onClick={() => onSelectDay(day)}
              className={`relative flex flex-col justify-between h-20 sm:h-28 p-1.5 sm:p-2.5 rounded-xl border transition-all cursor-pointer select-none group active:scale-[0.98] ${
                def.colorBg
              } ${def.colorBorder} ${
                day.isDoublePay
                  ? 'ring-2 ring-amber-400/80 shadow-lg shadow-amber-500/10'
                  : ''
              } ${day.isToday ? 'outline outline-2 outline-indigo-400 outline-offset-1' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1">
                  <span
                    className={`text-sm sm:text-base font-bold leading-none ${
                      day.isToday
                        ? 'text-indigo-400'
                        : isWeekend
                        ? 'text-rose-400'
                        : 'text-slate-200'
                    }`}
                  >
                    {day.dayNumber}
                  </span>
                  {day.isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  )}
                </div>

                {day.isDoublePay ? (
                  <span
                    className="inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-black bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm"
                    title={`Двойная оплата: ${day.holidayName || 'Праздник РФ'}`}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    2X
                  </span>
                ) : day.isHoliday ? (
                  <span
                    className="text-[9px] sm:text-[10px] text-amber-300/80 font-medium truncate max-w-[50px] sm:max-w-[70px]"
                    title={day.holidayName}
                  >
                    🇷🇺
                  </span>
                ) : null}
              </div>

              <div className="my-auto">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <div className="shrink-0">{renderShiftIcon(day.status)}</div>
                  <span
                    className={`text-[11px] sm:text-xs font-semibold truncate ${def.colorText}`}
                  >
                    <span className="sm:hidden">{def.shortLabel}</span>
                    <span className="hidden sm:inline">
                      {day.status === 'work'
                        ? 'Смена 20:00'
                        : day.status === 'overtime'
                        ? 'Подр. 20:00'
                        : def.label}
                    </span>
                  </span>
                </div>

                {day.holidayName && (
                  <p className="text-[9px] sm:text-[10px] text-amber-300/90 truncate font-medium mt-0.5 hidden sm:block">
                    {day.holidayName}
                  </p>
                )}

                {day.note && (
                  <div className="flex items-center gap-0.5 text-[9px] sm:text-[10px] text-slate-300 truncate mt-0.5">
                    <Info className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                    <span className="truncate">{day.note}</span>
                  </div>
                )}
              </div>

              {day.isOverridden && (
                <div className="absolute top-1 right-1 sm:hidden">
                  <span className="w-1 h-1 rounded-full bg-amber-400 block" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isReadOnly && (
        <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center text-xs text-amber-300">
          Вы просматриваете чужой график в режиме «Только чтение». Чтобы вносить изменения, вернитесь к своему графику.
        </div>
      )}
    </div>
  );
};
