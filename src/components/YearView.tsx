import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Coins,
  Clock,
  Share2,
  Settings,
  Download,
  Eye,
} from 'lucide-react';
import type {
  Colleague,
  DayOverride,
  DayShiftInfo,
  UserScheduleConfig,
  YearLayoutMode,
} from '../types/schedule';
import { SHIFT_DEFINITIONS } from '../types/schedule';
import {
  calculateYearStatistics,
  getYearMonthsData,
  RUSSIAN_DAY_OF_WEEK_SHORT,
  RUSSIAN_MONTH_NAMES,
} from '../utils/scheduleEngine';
import { getColleagueTheme } from '../utils/colleagueThemes';
import { YearDropdown } from './YearDropdown';

interface YearViewProps {
  year: number;
  config: UserScheduleConfig;
  overrides: Record<string, DayOverride>;
  colleagues: Colleague[];
  isReadOnly: boolean;
  layoutMode?: YearLayoutMode;
  activeTransitionMonth?: number;
  onSelectYear: (year: number) => void;
  onJumpToday: () => void;
  onOpenMonth: (month: number) => void;
  onSelectDay: (day: DayShiftInfo, anchorRect: DOMRect) => void;
  onOpenShare?: () => void;
  onOpenSettings?: () => void;
  onExportImport?: () => void;
  onExitReadOnly?: () => void;
}

export const YearView: React.FC<YearViewProps> = ({
  year,
  config,
  overrides,
  colleagues,
  isReadOnly,
  layoutMode = 'fit-screen',
  activeTransitionMonth,
  onSelectYear,
  onJumpToday,
  onOpenMonth,
  onSelectDay,
  onOpenShare,
  onOpenSettings,
  onExportImport,
  onExitReadOnly,
}) => {
  const [selectedColleagueFilter, setSelectedColleagueFilter] = useState<string | null>(null);
  const [expandingMonth, setExpandingMonth] = useState<number | null>(null);
  const [hoveredDay, setHoveredDay] = useState<{
    day: DayShiftInfo;
    rect: DOMRect;
  } | null>(null);

  const handleMonthClick = (m: number) => {
    if (expandingMonth !== null) return;
    setExpandingMonth(m);
    setTimeout(() => {
      onOpenMonth(m);
      setExpandingMonth(null);
    }, 220);
  };

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

  // Determine layout-specific parameters
  const isFitScreen = layoutMode === 'fit-screen';
  const is6x2 = layoutMode === 'rows-6x2';

  return (
    <div
      className={
        isFitScreen
          ? 'h-full flex flex-col justify-between gap-1.5 sm:gap-2'
          : 'flex flex-col gap-3 sm:gap-3.5'
      }
    >
      {/* Unified Year Control & Statistics Card */}
      <div
        style={{ viewTransitionName: 'active-stats-surface' } as React.CSSProperties}
        className="bg-white rounded-xl border border-[#e7ddcf] p-2 sm:p-2.5 gap-2 shadow-[0_2px_8px_rgba(45,30,15,0.03)] flex flex-col shrink-0 relative z-30"
      >
        {/* Top Control Line: Year Switcher, Colleague Vacation Filters, Stats & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 sm:gap-3">
          {/* Left: Year Switcher & Status (Unified segmented control, exact h-8 height) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
            <div className="inline-flex items-center h-8 bg-[#fbf9f5] border border-[#e7ddcf] rounded-lg p-0.5 shadow-2xs">
              <button
                onClick={() => onSelectYear(year - 1)}
                title="Предыдущий год"
                className="w-7 h-7 flex items-center justify-center rounded text-[#81796e] hover:text-[#252320] hover:bg-white transition active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>

              <YearDropdown
                selectedYear={year}
                yearsRange={yearsRange}
                onSelectYear={onSelectYear}
              />

              <button
                onClick={() => onSelectYear(year + 1)}
                title="Следующий год"
                className="w-7 h-7 flex items-center justify-center rounded text-[#81796e] hover:text-[#252320] hover:bg-white transition active:scale-95 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
              </button>
            </div>

            <button
              onClick={onJumpToday}
              className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#e7ddcf] bg-[#fbf9f5] hover:bg-[#f3ece2] text-xs font-medium text-[#736b60] hover:text-[#252320] transition shadow-2xs active:scale-95 cursor-pointer"
              title="Перейти к текущему году"
            >
              <RotateCcw className="w-3 h-3 text-[#b68231]" strokeWidth={1.75} />
              <span className="hidden sm:inline">Текущий год</span>
            </button>

            {isReadOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#f3e7d5] text-[#7b511c] border border-[#d8b57a]">
                <Eye className="w-3 h-3" strokeWidth={1.5} />
                <span className="hidden sm:inline">Просмотр</span>
              </span>
            )}
          </div>

          {/* Middle: Colleague Vacation Filter (Unified segmented group, no floating pills) */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#81796e] font-medium mr-1 hidden sm:inline">
              Отпуска:
            </span>

            <div className="inline-flex items-center h-8 bg-[#fbf9f5] border border-[#e7ddcf] rounded-lg p-0.5 shadow-2xs text-xs overflow-x-auto overflow-y-hidden max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => setSelectedColleagueFilter(null)}
                className={`h-full px-2.5 rounded-md font-medium transition cursor-pointer shrink-0 ${
                  selectedColleagueFilter === null
                    ? 'bg-white text-[#252320] shadow-xs font-semibold'
                    : 'text-[#81796e] hover:text-[#252320]'
                }`}
              >
                Все (365 дн.)
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
                    className={`h-full px-2.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-white text-[#252320] shadow-xs font-semibold ring-1 ring-[#b68231]'
                        : 'text-[#81796e] hover:text-[#252320]'
                    }`}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ backgroundColor: theme.accentColor }}
                    />
                    <span>{c.name}</span>
                    <span className="text-[10px] opacity-60 tabular-nums">
                      {daysCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Hours & Actions (Unified h-8 controls) */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-xs text-[#81796e] shrink-0 justify-between lg:justify-end">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
              <span>
                Отработано: <strong className="text-[#252320] font-bold tabular-nums">{yearStats.estimatedHours} ч.</strong>
                <span className="text-[11px] opacity-70 ml-1 hidden sm:inline">
                  (ночных {yearStats.estimatedNightHours} ч.)
                </span>
              </span>
            </div>

            {yearStats.estimatedPay !== undefined && yearStats.estimatedPay > 0 && (
              <div className="flex items-center gap-1 font-bold text-[#7b511c]">
                <Coins className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
                <span>{yearStats.estimatedPay.toLocaleString('ru-RU')} ₽</span>
              </div>
            )}

            <div className="h-4 w-px bg-[#e7ddcf] hidden sm:block" />

            {/* Functional actions */}
            {isReadOnly ? (
              <button
                onClick={onExitReadOnly}
                className="h-8 inline-flex items-center gap-1.5 px-3 rounded-lg bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#2a1c0a] text-xs font-semibold border border-[#d8b57a] transition shadow-xs active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.5} />
                <span>Мой график</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 shrink-0">
                {onOpenShare && (
                  <button
                    onClick={onOpenShare}
                    title="Поделиться графиком"
                    className="h-8 inline-flex items-center gap-1.5 px-2.5 sm:px-3 rounded-lg border border-[#d8b57a] bg-[#fbf5eb] hover:bg-[#f3e7d5] text-[#2a1c0a] text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.5} />
                    <span className="hidden sm:inline">Поделиться</span>
                  </button>
                )}

                {onExportImport && (
                  <button
                    onClick={onExportImport}
                    title="Экспорт и импорт данных"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Download className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                )}

                {onOpenSettings && (
                  <button
                    onClick={onOpenSettings}
                    title="Настройки графика и ставок"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-[#fcfaf7] hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-xs active:scale-95 cursor-pointer"
                  >
                    <Settings className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Row: Clean Metrics Row (No nested pill boxes, just clean numbers & dots) */}
        <div className="flex flex-wrap items-center justify-between gap-y-1.5 gap-x-4 pt-2 border-t border-[#f2ede4] text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d32f2f] shrink-0" />
            <span className="text-[#81796e]">Работа:</span>
            <strong className="text-[#252320] font-bold tabular-nums">{yearStats.workDaysCount} смен</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2e7d32] shrink-0" />
            <span className="text-[#81796e]">Выходные:</span>
            <strong className="text-[#252320] font-bold tabular-nums">{yearStats.offDaysCount} дн.</strong>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e5a100] shrink-0" />
            <span className="text-[#81796e]">Мой отпуск:</span>
            <strong className="text-[#252320] font-bold tabular-nums">{yearStats.vacationDaysCount} дн.</strong>
          </div>

          {yearStats.overtimeDaysCount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#b71c1c] ring-1 ring-[#e57373] shrink-0" />
              <span className="text-[#81796e]">Подработка:</span>
              <strong className="text-[#252320] font-bold tabular-nums">{yearStats.overtimeDaysCount} смен</strong>
            </div>
          )}

          {yearStats.doublePayShiftsCount > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#9d4c37] shrink-0" />
              <span className="text-[#81796e]">Оплата 2X:</span>
              <strong className="text-[#252320] font-bold tabular-nums">{yearStats.doublePayShiftsCount} смен</strong>
            </div>
          )}
        </div>
      </div>

      {/* 12 Months Grid: Responsive based on layoutMode */}
      <div
        className={
          isFitScreen
            ? 'flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-rows-12 md:grid-rows-6 lg:grid-rows-4 xl:grid-rows-3 gap-2 p-0.5 sm:p-1'
            : is6x2
            ? 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2'
            : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 sm:gap-2.5'
        }
      >
        {monthsData.map((mData) => {
          const firstDayOfWeek = mData.days.length > 0 ? mData.days[0].dayOfWeek : 1;
          const blankDaysCount = firstDayOfWeek - 1;
          const isExpanding = expandingMonth === mData.month;
          const isTransitionTarget = mData.month === (activeTransitionMonth ?? 1);

          return (
            <div
              key={mData.month}
              style={{
                viewTransitionName: isTransitionTarget ? 'active-calendar-surface' : undefined,
              } as React.CSSProperties}
              onClick={(e) => {
                // If clicked directly on the month card container (not on a day button)
                if ((e.target as HTMLElement).closest('button[data-day]')) return;
                handleMonthClick(mData.month);
              }}
              className={`rounded-xl flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                isFitScreen
                  ? 'h-full min-h-0 p-1.5 sm:p-2'
                  : 'p-2 sm:p-2.5'
              } ${
                isExpanding
                  ? 'bg-white scale-[1.04] shadow-2xl ring-4 ring-[#b68231] border-[#b68231] z-30 opacity-90'
                  : 'bg-white border border-[#e7ddcf] shadow-[0_2px_8px_rgba(45,30,15,0.03)] hover:shadow-lg hover:border-[#d8b57a] hover:scale-[1.01]'
              }`}
            >
              {/* Month Header */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleMonthClick(mData.month);
                }}
                className="group/mhdr flex items-center justify-between gap-1 border-b border-[#f2ede4] cursor-pointer shrink-0 mb-1 pb-1"
                title={`Кликните, чтобы открыть ${mData.monthName}`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#252320] group-hover/mhdr:text-[#b68231] transition">
                  <span>{mData.monthName}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span
                    className="text-[10px] sm:text-[11px] font-semibold text-[#81796e] tabular-nums"
                    title={`Всего смен: ${mData.stats.workDaysCount + mData.stats.overtimeDaysCount} (основных: ${mData.stats.workDaysCount}, подработок: ${mData.stats.overtimeDaysCount})`}
                  >
                    {mData.stats.workDaysCount + mData.stats.overtimeDaysCount} см.
                  </span>
                  {mData.stats.doublePayShiftsCount > 0 && (
                    <span
                      title={`${mData.stats.doublePayShiftsCount} смен с 2X оплатой`}
                      className="text-[9px] sm:text-[10px] font-bold text-[#9d4c37] tabular-nums"
                    >
                      2X: {mData.stats.doublePayShiftsCount}
                    </span>
                  )}
                </div>
              </div>

              {/* Day of Week Row */}
              <div className="grid grid-cols-7 text-[9px] sm:text-[10px] font-bold text-[#81796e]/80 text-center shrink-0 mb-0.5 gap-0.5">
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
              <div
                className={
                  isFitScreen
                    ? 'flex-1 min-h-0 grid grid-cols-7 grid-rows-6 gap-0.5'
                    : 'grid grid-cols-7 gap-0.5 sm:gap-1'
                }
              >
                {/* Blanks */}
                {Array.from({ length: blankDaysCount }).map((_, i) => (
                  <div
                    key={`blank-${i}`}
                    className={
                      isFitScreen
                        ? 'h-full min-h-0'
                        : 'aspect-[1/0.8]'
                    }
                  />
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
                      data-day="true"
                      onClick={(e) => {
                        e.stopPropagation();
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
                      className={`${
                        isFitScreen
                          ? 'h-full min-h-0 rounded p-0.5'
                          : 'aspect-[1/0.8] rounded p-0.5'
                      } flex flex-col items-center justify-between text-[10px] font-medium border relative transition cursor-pointer active:scale-95 ${
                        shiftDef.colorBg
                      } ${shiftDef.colorBorder} ${shiftDef.colorText} ${
                        day.isPast && !day.isToday
                          ? 'opacity-60 grayscale-[30%] hover:opacity-100 hover:grayscale-0'
                          : ''
                      } ${
                        day.isToday
                          ? 'ring-2 ring-[#b68231] outline outline-1 outline-[#b68231] outline-offset-1 font-bold z-10 !opacity-100 !grayscale-0'
                          : ''
                      } ${
                        matchesFilter
                          ? 'ring-2 ring-[#b68231] ring-offset-1 font-bold scale-105 z-10 shadow-xs'
                          : ''
                      } ${isFaded ? 'opacity-35 grayscale-[50%]' : 'hover:scale-105 hover:z-10'}`}
                    >
                      {/* Day number & 2X marker */}
                      <div className="w-full flex items-center justify-between leading-none px-0.5">
                        <span className="text-[9px] sm:text-[10px]">{day.dayNumber}</span>
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
