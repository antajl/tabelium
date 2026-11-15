import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  RotateCcw,
  X,
  FileText,
  ArrowLeft,
  Share2,
  Settings,
  Download,
  Eye,
} from 'lucide-react';
import type { DayShiftInfo, ShiftType } from '../types/schedule';
import { SHIFT_DEFINITIONS } from '../types/schedule';
import { RUSSIAN_DAY_OF_WEEK_SHORT } from '../utils/scheduleEngine';
import { getColleagueTheme } from '../utils/colleagueThemes';
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
  onSelectDay: (day: DayShiftInfo, anchorRect: DOMRect) => void;
  onBackToYear?: () => void;
  onApplyRange?: (startStr: string, endStr: string, status: ShiftType) => void;
  onResetRange?: (startStr: string, endStr: string) => void;
  onOpenShare?: () => void;
  onOpenSettings?: () => void;
  onExportImport?: () => void;
  onExitReadOnly?: () => void;
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
  onBackToYear,
  onApplyRange,
  onResetRange,
  onOpenShare,
  onOpenSettings,
  onExportImport,
  onExitReadOnly,
}) => {
  const firstDayOfWeek = days.length > 0 ? days[0].dayOfWeek : 1;
  const blankDaysCount = firstDayOfWeek - 1;

  const isCurrentMonth = React.useMemo(() => {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() + 1;
  }, [year, month]);

  // Range Selection State (click-and-drag or tap)
  const [rangeAnchor, setRangeAnchor] = useState<string | null>(null);
  const [rangeTarget, setRangeTarget] = useState<string | null>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  // Instant Holiday Tooltip State (Old Money Styled)
  const [hoveredHoliday, setHoveredHoliday] = useState<{
    day: DayShiftInfo;
    rect: DOMRect;
  } | null>(null);
  const holidayTooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
    isAbove: boolean;
    arrowX: number;
  }>({ top: 0, left: 0, isAbove: true, arrowX: 0 });

  useLayoutEffect(() => {
    if (!hoveredHoliday) return;
    const cellRect = hoveredHoliday.rect;
    const tooltip = holidayTooltipRef.current;
    const tooltipWidth = tooltip ? tooltip.offsetWidth : 260;
    const tooltipHeight = tooltip ? tooltip.offsetHeight : 80;

    const cellCenterX = cellRect.left + cellRect.width / 2;
    const isAbove = cellRect.top - tooltipHeight - 12 >= 10;
    const top = isAbove ? cellRect.top - tooltipHeight - 8 : cellRect.bottom + 8;

    const padding = 12;
    const left = Math.max(
      padding,
      Math.min(window.innerWidth - tooltipWidth - padding, cellCenterX - tooltipWidth / 2)
    );
    const arrowX = Math.max(16, Math.min(tooltipWidth - 16, cellCenterX - left));

    setTooltipPos({ top, left, isAbove, arrowX });
  }, [hoveredHoliday]);

  // Scroll to top on month view mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, []);

  // Dismiss holiday tooltip immediately on scroll, resize or when selecting
  useEffect(() => {
    if (!hoveredHoliday) return;
    const handleDismiss = () => setHoveredHoliday(null);
    window.addEventListener('scroll', handleDismiss, { passive: true });
    window.addEventListener('resize', handleDismiss, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleDismiss);
      window.removeEventListener('resize', handleDismiss);
    };
  }, [hoveredHoliday]);

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

  // Window-level mouseup listener so dragging outside the table never breaks the selection
  useEffect(() => {
    if (!isMouseDown) return;

    const handleGlobalMouseUp = () => {
      setIsMouseDown(false);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isMouseDown]);

  const handleCellMouseDown = (day: DayShiftInfo, e: React.MouseEvent) => {
    setHoveredHoliday(null);
    if (isReadOnly) return;
    if (e.button !== 0) return; // Only primary left-click
    setIsMouseDown(true);
    setRangeAnchor(day.dateStr);
    setRangeTarget(day.dateStr);
  };

  const handleCellMouseEnter = (day: DayShiftInfo, e: React.MouseEvent<HTMLDivElement>) => {
    if (isMouseDown) {
      setHoveredHoliday(null);
      if (!isReadOnly) {
        setRangeTarget(day.dateStr);
      }
      return;
    }

    if (day.holidayName) {
      const rect = e.currentTarget.getBoundingClientRect();
      const cellCenterX = rect.left + rect.width / 2;
      const isAbove = rect.top - 90 >= 10;
      const top = isAbove ? rect.top - 88 : rect.bottom + 8;
      const left = Math.max(12, Math.min(window.innerWidth - 272, cellCenterX - 130));
      const arrowX = Math.max(16, Math.min(244, cellCenterX - left));

      setTooltipPos({ top, left, isAbove, arrowX });
      setHoveredHoliday({ day, rect });
    } else {
      setHoveredHoliday(null);
    }
  };

  const handleCellMouseLeave = () => {
    setHoveredHoliday(null);
  };

  const handleCellMouseUp = (day: DayShiftInfo, e: React.MouseEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    if (isMouseDown) {
      setIsMouseDown(false);
      // Single click without dragging across multiple dates -> open DayModal Popover
      if (rangeAnchor === day.dateStr && rangeTarget === day.dateStr) {
        clearRange();
        setHoveredHoliday(null);
        const rect = e.currentTarget.getBoundingClientRect();
        onSelectDay(day, rect);
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
    <div
      style={{ viewTransitionName: 'active-calendar-surface' } as React.CSSProperties}
      className="bg-[#fcfaf7] rounded-2xl border border-[#e7ddcf] p-3 sm:p-5 shadow-[0_1px_3px_rgba(45,30,15,0.04)]"
    >
      {/* Single Horizontal Toolbar Line */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 mb-3 border-b border-[#e7ddcf] relative z-20">
        {/* Left: Back to Year, Navigation, Dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          {onBackToYear && (
            <button
              onClick={onBackToYear}
              className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#e7ddcf] bg-[#fbf9f5] hover:bg-[#f3ece2] text-xs font-semibold text-[#7b511c] transition shadow-2xs active:scale-95 cursor-pointer"
              title={`Вернуться к обзору ${year} года`}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={2} />
              <span>{year} год</span>
            </button>
          )}

          {/* Month & Year Navigation (Unified Segmented Control, exact h-8 height) */}
          <div className="inline-flex items-center h-8 bg-[#fbf9f5] border border-[#e7ddcf] rounded-lg p-0.5 shadow-2xs">
            <button
              onClick={onPrevMonth}
              className="w-7 h-7 flex items-center justify-center rounded text-[#81796e] hover:text-[#252320] hover:bg-white transition active:scale-95 cursor-pointer"
              title="Предыдущий месяц"
            >
              <ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>

            <MonthYearDropdown
              selectedYear={year}
              selectedMonth={month}
              onSelectYear={onSelectYear}
              onSelectMonth={onSelectMonth}
            />

            <button
              onClick={onNextMonth}
              className="w-7 h-7 flex items-center justify-center rounded text-[#81796e] hover:text-[#252320] hover:bg-white transition active:scale-95 cursor-pointer"
              title="Следующий месяц"
            >
              <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Right: Actions (Today Button & Action Buttons) */}
        <div className="flex items-center gap-2 ml-auto shrink-0 flex-wrap">
          {!isCurrentMonth && (
            <>
              <button
                onClick={onJumpToday}
                className="h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg border border-[#e7ddcf] bg-[#fbf9f5] hover:bg-[#f3ece2] text-[#736b60] hover:text-[#252320] text-xs font-medium shadow-2xs transition active:scale-95 cursor-pointer"
                title="Перейти к текущему месяцу"
              >
                <CalendarIcon className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
                <span className="hidden sm:inline">Текущий месяц</span>
              </button>

              <div className="h-4 w-px bg-[#e7ddcf] hidden sm:block" />
            </>
          )}

          {isReadOnly ? (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#f3e7d5] text-[#7b511c] border border-[#d8b57a]">
                <Eye className="w-3 h-3" strokeWidth={1.5} />
                <span className="hidden sm:inline">Просмотр</span>
              </span>
              {onExitReadOnly && (
                <button
                  onClick={onExitReadOnly}
                  className="h-8 inline-flex items-center gap-1.5 px-3 rounded-lg bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#2a1c0a] text-xs font-semibold border border-[#d8b57a] transition shadow-xs active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#7b511c]" strokeWidth={1.5} />
                  <span>Мой график</span>
                </button>
              )}
            </div>
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

      {/* Days Grid - Clean Horizontal Rectangular Cells (No Vertical Scroll) */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
        {/* Transparent blank slots */}
        {Array.from({ length: blankDaysCount }).map((_, i) => (
          <div
            key={`blank-${i}`}
            className="h-[58px] sm:h-[68px] lg:h-[74px] xl:h-[78px] rounded-xl opacity-0 pointer-events-none"
          />
        ))}

        {days.map((day) => {
          const def = SHIFT_DEFINITIONS[day.status];
          const isWeekend = day.dayOfWeek >= 6;
          const isInActiveRange = isDayInRange(day.dateStr);

          return (
            <div
              key={day.dateStr}
              onMouseDown={(e) => handleCellMouseDown(day, e)}
              onMouseEnter={(e) => handleCellMouseEnter(day, e)}
              onMouseLeave={handleCellMouseLeave}
              onMouseUp={(e) => handleCellMouseUp(day, e)}
              className={`relative flex flex-col justify-between h-[58px] sm:h-[68px] lg:h-[74px] xl:h-[78px] p-1.5 sm:p-2 rounded-xl border select-none cursor-pointer transition-all shadow-2xs ${
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
              {/* Day Header (Number on Left, 2X Tag / Note on Right) */}
              <div className="flex items-start justify-between gap-1 leading-none">
                <span
                  className={`text-sm sm:text-base font-bold tabular-nums ${
                    day.isToday
                      ? 'text-[#b68231]'
                      : isWeekend
                      ? 'text-[#9d4c37]'
                      : 'text-[#252320]'
                  }`}
                >
                  {day.dayNumber}
                </span>

                <div className="flex items-center gap-1 shrink-0">
                  {/* Note Indicator */}
                  {day.note && (
                    <span
                      title={`Заметка: ${day.note}`}
                      className="text-[#b68231] hover:text-[#7b511c]"
                    >
                      <FileText className="w-3 h-3" strokeWidth={2} />
                    </span>
                  )}

                  {/* 2X Double Pay Tag on Holidays */}
                  {day.isDoublePay && (
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#fbf4f0] text-[#9d4c37] border border-[#efc8b4] shrink-0">
                      2X
                    </span>
                  )}
                </div>
              </div>

              {/* Center Area: Colleague Vacations */}
              <div className="flex flex-col items-center justify-center my-auto w-full overflow-hidden">
                {day.colleagueVacations && day.colleagueVacations.length > 0 && (
                  <div className="flex flex-col gap-0.5 w-full">
                    {day.colleagueVacations.map((cv) => {
                      const theme = getColleagueTheme(cv.colorTheme);
                      return (
                        <div
                          key={cv.colleagueId + cv.vacationId}
                          className={`flex items-center justify-between px-1.5 py-0.5 rounded-md border text-[9px] sm:text-[10px] font-semibold leading-tight shadow-2xs truncate ${theme.cellBadgeBg} ${theme.cellBadgeBorder} ${theme.cellBadgeText}`}
                          title={`Отпуск коллеги: ${cv.colleagueName} (${cv.startDate} — ${cv.endDate}, день ${cv.dayIndex} из ${cv.totalDays})`}
                        >
                          <span className="truncate flex items-center gap-1">
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: theme.accentColor }}
                            />
                            <span className="truncate">{cv.colleagueName}</span>
                          </span>
                          <span className="text-[8px] sm:text-[9px] opacity-75 shrink-0 ml-1">отпуск</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bottom Slot (Reserved for Holiday text) */}
              <div className="h-3.5 sm:h-4 flex items-center justify-center overflow-hidden">
                {day.holidayName ? (
                  <span className="text-[9px] sm:text-[10px] text-[#9d4c37] font-semibold truncate leading-none block text-center">
                    {day.holidayName}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Range Action Bar (Visible when multiple days selected) */}
      {rangeMin && rangeMax && rangeMin !== rangeMax && (
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
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fef7db] hover:bg-[#fdefbd] text-[#7d5600] border border-[#f6dc84] transition shadow-2xs active:scale-95 cursor-pointer"
            >
              Отпуск
            </button>
            <button
              type="button"
              onClick={() => handleApplyRangeStatus('overtime')}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fbdcd9] hover:bg-[#f8c8c3] text-[#7f1d1d] border border-[#e57373] border-dashed transition shadow-2xs active:scale-95 cursor-pointer"
            >
              Подработка
            </button>
            <button
              type="button"
              onClick={() => handleApplyRangeStatus('work')}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#fdeeed] hover:bg-[#fbdcd9] text-[#93231c] border border-[#f5b8b2] transition shadow-2xs active:scale-95 cursor-pointer"
            >
              Работа
            </button>
            <button
              type="button"
              onClick={() => handleApplyRangeStatus('off')}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#eaf5ec] hover:bg-[#ddf0e0] text-[#215128] border border-[#b8deb9] transition shadow-2xs active:scale-95 cursor-pointer"
            >
              Выходной
            </button>
            <button
              type="button"
              onClick={handleResetRangeStatus}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-[#f3ede4] hover:bg-[#e7ddcf] text-[#252320] border border-[#d8b57a] transition shadow-2xs active:scale-95 flex items-center gap-1 cursor-pointer"
              title="Сбросить все дни диапазона к эталону 2/2"
            >
              <RotateCcw className="w-3 h-3 text-[#b68231]" strokeWidth={2} />
              <span>В эталон (Дефолт)</span>
            </button>
            <button
              type="button"
              onClick={clearRange}
              className="p-1 rounded-full text-[#81796e] hover:text-[#252320] hover:bg-[#f3ede4] transition ml-1 cursor-pointer"
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

      {/* Instant Holiday Tooltip (Old Money Styled) */}
      {hoveredHoliday && !isMouseDown && (
        <div
          ref={holidayTooltipRef}
          role="tooltip"
          className="fixed z-50 pointer-events-none w-max max-w-[280px] sm:max-w-xs px-3 py-2.5 bg-[#252320] text-[#faf8f4] border border-[#3e3830] rounded-xl shadow-[0_10px_28px_rgba(0,0,0,0.28)] flex flex-col gap-1.5 animate-in fade-in-0 zoom-in-95 duration-100"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
          }}
        >
          {/* Header: Title + Badge (No emojis) */}
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
            <span className="text-[11px] font-semibold text-[#f3e7d5]">
              {hoveredHoliday.day.holidayCategory === 'transfer'
                ? 'Перенос выходного'
                : 'Праздник РФ'}
            </span>
            {hoveredHoliday.day.isDoublePay ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-[#9d4c37] text-white shadow-2xs">
                2X Двойная оплата
              </span>
            ) : hoveredHoliday.day.holidayCategory === 'transfer' ? (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-white/10 text-[#d8cfc4]">
                Пост. Правительства РФ
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-white/10 text-[#d8cfc4]">
                ст. 112 ТК РФ
              </span>
            )}
          </div>

          {/* Holiday Name */}
          <div className="text-xs sm:text-[13px] font-bold text-[#faf8f4] leading-snug">
            {hoveredHoliday.day.holidayFullName || hoveredHoliday.day.holidayName}
          </div>

          {/* Subtitle / Reason / Law reference */}
          <div className="text-[10px] text-[#c4b5a0] leading-relaxed">
            {hoveredHoliday.day.holidayDescription ||
              (hoveredHoliday.day.isDoublePay
                ? 'Официальный праздничный день. Работа и подработка оплачиваются в двойном размере (2X).'
                : 'Официальный нерабочий праздничный день в соответствии с Трудовым кодексом РФ.')}
          </div>

          {/* Optional Note preview if present */}
          {hoveredHoliday.day.note && (
            <div className="flex items-center gap-1.5 pt-1 border-t border-white/10 text-[10px] text-[#d8b57a]">
              <FileText className="w-3 h-3 text-[#b68231] shrink-0" strokeWidth={1.5} />
              <span className="truncate">Заметка: {hoveredHoliday.day.note}</span>
            </div>
          )}

          {/* Caret Arrow pointing at hovered cell */}
          <div
            className={`absolute w-2.5 h-2.5 bg-[#252320] border-[#3e3830] rotate-45 -translate-x-1/2 ${
              tooltipPos.isAbove
                ? '-bottom-[6px] border-b border-r'
                : '-top-[6px] border-t border-l'
            }`}
            style={{ left: tooltipPos.arrowX }}
          />
        </div>
      )}
    </div>
  );
};
