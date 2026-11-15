import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ExternalLink,
  Coins,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import type {
  Colleague,
  DayOverride,
  DayShiftInfo,
  UserScheduleConfig,
} from '../types/schedule';
import { SHIFT_DEFINITIONS } from '../types/schedule';
import {
  calculateYearStatistics,
  getYearMonthsData,
  RUSSIAN_DAY_OF_WEEK_SHORT,
  RUSSIAN_MONTH_NAMES,
} from '../utils/scheduleEngine';
import { getColleagueTheme } from '../utils/colleagueThemes';

interface YearViewProps {
  year: number;
  config: UserScheduleConfig;
  overrides: Record<string, DayOverride>;
  colleagues: Colleague[];
  isReadOnly: boolean;
  onSelectYear: (year: number) => void;
  onJumpToday: () => void;
  onOpenMonth: (month: number) => void;
  onSelectDay: (day: DayShiftInfo, anchorRect: DOMRect) => void;
}

export const YearView: React.FC<YearViewProps> = ({
  year,
  config,
  overrides,
  colleagues,
  isReadOnly: _isReadOnly,
  onSelectYear,
  onJumpToday,
  onOpenMonth,
  onSelectDay,
}) => {
  const [selectedColleagueFilter, setSelectedColleagueFilter] = useState<string | null>(null);
  const [hoveredDay, setHoveredDay] = useState<{
    day: DayShiftInfo;
    rect: DOMRect;
  } | null>(null);

  // Compute all 12 months data
  const monthsData = useMemo(() => {
    return getYearMonthsData(year, config, overrides, colleagues);
  }, [year, config, overrides, colleagues]);

  // Compute annual statistics
  const yearStats = useMemo(() => {
    return calculateYearStatistics(monthsData, config);
  }, [monthsData, config]);

  // Count vacation days in this year for each colleague
  const colleagueVacationDayCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of colleagues) {
      counts[c.id] = 0;
    }
    const yearPrefix = `${year}-`;
    for (const c of colleagues) {
      if (c.isSelf) {
        counts[c.id] = yearStats.vacationDaysCount;
        continue;
      }
      let totalDaysInYear = 0;
      for (const vac of c.vacations) {
        // Simple day by day check if within year
        const [yA, mA, dA] = vac.startDate.split('-').map(Number);
        const [yB, mB, dB] = vac.endDate.split('-').map(Number);
        const cur = new Date(Date.UTC(yA, mA - 1, dA));
        const end = new Date(Date.UTC(yB, mB - 1, dB));
        while (cur <= end) {
          const iso = cur.toISOString().slice(0, 10);
          if (iso.startsWith(yearPrefix)) {
            totalDaysInYear++;
          }
          cur.setUTCDate(cur.getUTCDate() + 1);
        }
      }
      counts[c.id] = totalDaysInYear;
    }
    return counts;
  }, [colleagues, year, yearStats.vacationDaysCount]);

  const yearsRange = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

  return (
    <div className="flex flex-col gap-4">
      {/* Top Bar: Year Navigator & Quick Filters */}
      <div className="bg-white rounded-2xl border border-[#e7ddcf] p-3 sm:p-4 shadow-[0_2px_8px_rgba(45,30,15,0.03)] flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Year Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectYear(year - 1)}
              title="Предыдущий год"
              className="p-1.5 rounded-lg border border-[#e7ddcf] bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
            </button>

            {/* Year selector */}
            <div className="relative">
              <select
                value={year}
                onChange={(e) => onSelectYear(Number(e.target.value))}
                className="appearance-none px-3.5 py-1.5 pr-7 font-bold text-base sm:text-lg text-[#252320] bg-[#fbf8f3] border border-[#d8b57a] rounded-xl cursor-pointer hover:border-[#b68231] transition focus:outline-none focus:ring-2 focus:ring-[#b68231]/30"
              >
                {yearsRange.map((y) => (
                  <option key={y} value={y}>
                    {y} год
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#7b511c]">
                <ChevronRight className="w-3.5 h-3.5 rotate-90" strokeWidth={1.5} />
              </div>
            </div>

            <button
              onClick={() => onSelectYear(year + 1)}
              title="Следующий год"
              className="p-1.5 rounded-lg border border-[#e7ddcf] bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] transition active:scale-95"
            >
              <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
            </button>
          </div>

          <button
            onClick={onJumpToday}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#7b511c] border border-[#d8b57a] transition shadow-2xs active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span className="hidden sm:inline">Текущий год</span>
          </button>
        </div>

        {/* Right: Colleagues Filter Pills & Legend */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5">
          <span className="text-[11px] text-[#81796e] font-medium mr-1 hidden lg:inline">
            Отпуска:
          </span>

          <button
            onClick={() => setSelectedColleagueFilter(null)}
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border transition active:scale-95 ${
              selectedColleagueFilter === null
                ? 'bg-[#252320] text-white border-[#252320] shadow-2xs'
                : 'bg-[#fcfaf7] text-[#736b60] border-[#e7ddcf] hover:bg-[#f7f2ea]'
            }`}
          >
            Все (365 дней)
          </button>

          {colleagues.map((c) => {
            const theme = getColleagueTheme(c.colorTheme, c.isSelf);
            const isSelected = selectedColleagueFilter === c.id;
            const daysCount = colleagueVacationDayCounts[c.id] || 0;
            return (
              <button
                key={c.id}
                onClick={() =>
                  setSelectedColleagueFilter(isSelected ? null : c.id)
                }
                title={`Подсветить отпуска: ${c.name} (${daysCount} дн. в ${year} г.)`}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition active:scale-95 ${
                  isSelected
                    ? `${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText} ring-2 ring-offset-1 ring-[#b68231]`
                    : `${theme.itemBg} ${theme.itemBorder} ${theme.itemText} hover:opacity-85`
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <span>{c.name}</span>
                <span className="text-[10px] opacity-75 font-normal">
                  {daysCount} дн.
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Year Statistics Ribbon */}
      <div className="bg-white rounded-2xl border border-[#e7ddcf] p-3 sm:p-4 shadow-[0_2px_8px_rgba(45,30,15,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b68231]" strokeWidth={1.5} />
            <h2 className="text-xs sm:text-sm font-bold text-[#252320] uppercase tracking-wide">
              Сводка за {year} год
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="inline-flex items-center gap-1.5 text-[#81796e]">
              <Clock className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
              <span>
                Отработано: <strong className="text-[#252320]">{yearStats.estimatedHours} ч.</strong>
                <span className="text-[11px] opacity-75 ml-1">
                  (ночных: {yearStats.estimatedNightHours} ч.)
                </span>
              </span>
            </div>

            {yearStats.estimatedPay !== undefined && yearStats.estimatedPay > 0 && (
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#f3e7d5] border border-[#d8b57a] text-[#7b511c] font-bold">
                <Coins className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
                <span>{yearStats.estimatedPay.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}
          </div>
        </div>

        {/* Stat badges row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 text-xs">
          <div className="p-2 rounded-xl bg-[#fdeeed] border border-[#f5b8b2] flex items-center justify-between">
            <span className="text-[#93231c] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#d32f2f]" /> Работа
            </span>
            <strong className="text-[#93231c] tabular-nums font-bold">
              {yearStats.workDaysCount} смен
            </strong>
          </div>

          <div className="p-2 rounded-xl bg-[#eaf5ec] border border-[#b8deb9] flex items-center justify-between">
            <span className="text-[#215128] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2e7d32]" /> Выходные
            </span>
            <strong className="text-[#215128] tabular-nums font-bold">
              {yearStats.offDaysCount} дн.
            </strong>
          </div>

          <div className="p-2 rounded-xl bg-[#fef7db] border border-[#f6dc84] flex items-center justify-between">
            <span className="text-[#7d5600] font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#e5a100]" /> Мой отпуск
            </span>
            <strong className="text-[#7d5600] tabular-nums font-bold">
              {yearStats.vacationDaysCount} дн.
            </strong>
          </div>

          {yearStats.overtimeDaysCount > 0 && (
            <div className="p-2 rounded-xl bg-[#fbdcd9] border border-[#e57373] border-dashed flex items-center justify-between">
              <span className="text-[#7f1d1d] font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#b71c1c]" /> Подработка
              </span>
              <strong className="text-[#7f1d1d] tabular-nums font-bold">
                {yearStats.overtimeDaysCount} смен
              </strong>
            </div>
          )}

          {yearStats.doublePayShiftsCount > 0 && (
            <div className="p-2 rounded-xl bg-[#fbf4f0] border border-[#efc8b4] flex items-center justify-between">
              <span className="text-[#9d4c37] font-semibold flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-[#9d4c37]" strokeWidth={1.5} />
                Оплата 2X
              </span>
              <strong className="text-[#9d4c37] tabular-nums font-bold">
                {yearStats.doublePayShiftsCount} смен
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* 12 Months Grid (4 cols on xl, 3 on lg, 2 on md, 1 on sm) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {monthsData.map((mData) => {
          const firstDayOfWeek = mData.days.length > 0 ? mData.days[0].dayOfWeek : 1;
          const blankDaysCount = firstDayOfWeek - 1;

          return (
            <div
              key={mData.month}
              className="bg-white rounded-2xl border border-[#e7ddcf] p-3 shadow-[0_2px_8px_rgba(45,30,15,0.03)] hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Month Header */}
              <div className="flex items-center justify-between gap-1 mb-2 pb-1.5 border-b border-[#f2ede4]">
                <button
                  onClick={() => onOpenMonth(mData.month)}
                  className="group flex items-center gap-1.5 text-left font-bold text-sm text-[#252320] hover:text-[#b68231] transition"
                  title={`Перейти к просмотру месяца: ${mData.monthName}`}
                >
                  <span>{mData.monthName}</span>
                  <ExternalLink
                    className="w-3 h-3 text-[#81796e] group-hover:text-[#b68231] transition opacity-0 group-hover:opacity-100"
                    strokeWidth={1.5}
                  />
                </button>

                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fdeeed] text-[#93231c] border border-[#f5b8b2]/60">
                    {mData.stats.workDaysCount} см.
                  </span>
                  {mData.stats.doublePayShiftsCount > 0 && (
                    <span
                      title={`${mData.stats.doublePayShiftsCount} смен с 2X оплатой`}
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#fbf4f0] text-[#9d4c37] border border-[#efc8b4]"
                    >
                      2X: {mData.stats.doublePayShiftsCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Day of Week Row */}
              <div className="grid grid-cols-7 gap-1 text-[10px] font-bold text-[#81796e]/80 text-center mb-1">
                {RUSSIAN_DAY_OF_WEEK_SHORT.map((dow, idx) => (
                  <span
                    key={dow}
                    className={idx >= 5 ? 'text-[#9d4c37]/75' : ''}
                  >
                    {dow}
                  </span>
                ))}
              </div>

              {/* Calendar Grid for this month */}
              <div className="grid grid-cols-7 gap-1">
                {/* Blanks */}
                {Array.from({ length: blankDaysCount }).map((_, i) => (
                  <div key={`blank-${i}`} className="aspect-square" />
                ))}

                {/* Days */}
                {mData.days.map((day) => {
                  const shiftDef = SHIFT_DEFINITIONS[day.status];
                  const hasColleagueVacation =
                    day.colleagueVacations && day.colleagueVacations.length > 0;

                  // Check if this day matches selected colleague filter
                  const matchesFilter = selectedColleagueFilter
                    ? selectedColleagueFilter === 'self'
                      ? day.status === 'vacation'
                      : day.colleagueVacations?.some(
                          (cv) => cv.colleagueId === selectedColleagueFilter
                        )
                    : false;

                  const isFaded =
                    selectedColleagueFilter !== null && !matchesFilter;

                  return (
                    <button
                      key={day.dateStr}
                      onClick={(e) => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        onSelectDay(day, rect);
                      }}
                      onMouseEnter={(e) => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        setHoveredDay({ day, rect });
                      }}
                      onMouseLeave={() => setHoveredDay(null)}
                      title={`${day.dateStr} — ${shiftDef.label}${
                        day.holidayName ? ` (${day.holidayName})` : ''
                      }`}
                      className={`aspect-square rounded-lg p-0.5 flex flex-col items-center justify-between text-[11px] font-medium border relative transition cursor-pointer active:scale-95 ${
                        shiftDef.colorBg
                      } ${shiftDef.colorBorder} ${shiftDef.colorText} ${
                        day.isToday
                          ? 'ring-2 ring-[#252320] ring-offset-1 font-bold z-10'
                          : ''
                      } ${
                        matchesFilter
                          ? 'ring-2 ring-[#b68231] ring-offset-1 font-bold scale-105 z-10 shadow-xs'
                          : ''
                      } ${isFaded ? 'opacity-35' : 'opacity-100 hover:scale-105 hover:z-10'}`}
                    >
                      {/* Day number & 2X marker */}
                      <div className="w-full flex items-center justify-between leading-none px-0.5">
                        <span className="text-[10px]">{day.dayNumber}</span>
                        {day.isDoublePay && (
                          <span
                            className="text-[7px] font-black text-[#9d4c37] leading-none"
                            title="2X Оплата"
                          >
                            2X
                          </span>
                        )}
                      </div>

                      {/* Colleague Vacations Indicator (colored dots or bars) */}
                      {hasColleagueVacation && (
                        <div className="flex items-center justify-center gap-0.5 w-full mt-auto pb-0.5">
                          {day.colleagueVacations!.map((cv) => {
                            const theme = getColleagueTheme(cv.colorTheme);
                            return (
                              <span
                                key={cv.colleagueId + cv.vacationId}
                                style={{ backgroundColor: theme.accentColor }}
                                className="w-1.5 h-1.5 rounded-full shrink-0 shadow-2xs"
                                title={`Отпуск: ${cv.colleagueName} (${cv.startDate} — ${cv.endDate})`}
                              />
                            );
                          })}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Floating Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none px-3 py-2 bg-[#252320] text-white rounded-xl shadow-xl text-xs flex flex-col gap-1 max-w-xs animate-in fade-in duration-150"
          style={{
            top: Math.max(10, hoveredDay.rect.top - 70),
            left: Math.min(
              window.innerWidth - 250,
              Math.max(10, hoveredDay.rect.left - 60)
            ),
          }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-1">
            <strong className="text-[11px] text-[#f3e7d5]">
              {hoveredDay.day.dayNumber}{' '}
              {
                RUSSIAN_MONTH_NAMES[
                  Number(hoveredDay.day.dateStr.split('-')[1]) - 1
                ]
              }{' '}
              ({hoveredDay.day.dayOfWeekName})
            </strong>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                SHIFT_DEFINITIONS[hoveredDay.day.status].badgeBg
              }`}
            >
              {SHIFT_DEFINITIONS[hoveredDay.day.status].label}
            </span>
          </div>

          {hoveredDay.day.holidayName && (
            <div className="text-[10px] text-[#fcd34d] flex items-center gap-1">
              <span>⭐ {hoveredDay.day.holidayName}</span>
              {hoveredDay.day.isDoublePay && (
                <span className="font-bold underline ml-1">(2X оплата)</span>
              )}
            </div>
          )}

          {hoveredDay.day.colleagueVacations &&
            hoveredDay.day.colleagueVacations.length > 0 && (
              <div className="flex flex-col gap-0.5 pt-0.5 text-[10px]">
                {hoveredDay.day.colleagueVacations.map((cv) => (
                  <div
                    key={cv.colleagueId + cv.vacationId}
                    className="flex items-center gap-1.5 text-cyan-200"
                  >
                    <span>🏖️</span>
                    <span>
                      {cv.colleagueName}: отпуск (день {cv.dayIndex} из{' '}
                      {cv.totalDays})
                    </span>
                  </div>
                ))}
              </div>
            )}

          <div className="text-[9px] text-white/50 pt-0.5">
            Кликните для подробностей или редактирования
          </div>
        </div>
      )}
    </div>
  );
};
