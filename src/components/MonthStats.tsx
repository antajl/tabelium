import React from 'react';
import {
  Clock,
  Coins,
  AlertCircle,
} from 'lucide-react';
import type { MonthStatistics, UserScheduleConfig } from '../types/schedule';
import { RUSSIAN_MONTH_NAMES } from '../utils/scheduleEngine';

interface MonthStatsProps {
  stats: MonthStatistics;
  month: number;
  year: number;
  config: UserScheduleConfig;
}

export const MonthStats: React.FC<MonthStatsProps> = ({
  stats,
  month,
  year,
  config,
}) => {
  const monthName = RUSSIAN_MONTH_NAMES[month - 1];

  return (
    <div className="bg-[#fcfaf7] rounded-2xl border border-[#e7ddcf] p-4 sm:p-5 shadow-[0_1px_3px_rgba(45,30,15,0.04)]">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#e7ddcf]">
        <h3 className="text-sm sm:text-base font-semibold text-[#252320]">
          Сводка за {monthName} {year}
        </h3>
        <span className="text-xs text-[#81796e]">
          Смены ({config.shiftStartTime} — {config.shiftEndTime}): <strong className="text-[#252320] font-bold tabular-nums">{stats.totalNightShifts}</strong>
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Regular Work */}
        <div className="p-3 rounded-xl bg-[#edf4f9] border border-[#bcd4e6] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-[#184260] text-xs font-semibold">
            <span>Основные смены</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#1e6f9f]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-bold tabular-nums text-[#184260]">{stats.workDaysCount}</span>
            <span className="text-xs text-[#527a99]">смен</span>
          </div>
        </div>

        {/* Overtime */}
        <div className="p-3 rounded-xl bg-[#fdeeed] border border-[#f5b8b2] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-[#93231c] text-xs font-semibold">
            <span>Подработки</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#d32f2f]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-bold tabular-nums text-[#93231c]">{stats.overtimeDaysCount}</span>
            <span className="text-xs text-[#b85a53]">смен</span>
          </div>
        </div>

        {/* 2X Holidays */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between shadow-2xs ${
          stats.doublePayShiftsCount > 0
            ? 'bg-[#fbf4f0] border-[#efc8b4]'
            : 'bg-white border-[#e7ddcf]'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className={stats.doublePayShiftsCount > 0 ? 'text-[#9d4c37] font-semibold' : 'text-[#81796e]'}>
              2X Праздничные
            </span>
            <span className="text-[11px] font-bold text-[#9d4c37]">2X</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-bold tabular-nums text-[#9d4c37]">
              {stats.doublePayShiftsCount}
            </span>
            <span className="text-xs text-[#bcb7ad]">смен (2x)</span>
          </div>
        </div>

        {/* Vacation */}
        <div className="p-3 rounded-xl bg-[#fef7db] border border-[#f6dc84] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-[#7d5600] text-xs font-semibold">
            <span>Отпуск</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#e5a100]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-bold tabular-nums text-[#7d5600]">{stats.vacationDaysCount}</span>
            <span className="text-xs text-[#a2802d]">дней</span>
          </div>
        </div>
      </div>

      {/* Hours and Estimated Pay */}
      <div className="mt-3 pt-3 border-t border-[#e7ddcf] flex flex-wrap items-center justify-between gap-3 text-xs text-[#81796e]">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#81796e]" strokeWidth={1.5} />
          <span>
            Отработано: <strong className="text-[#252320] tabular-nums">{stats.estimatedHours} ч.</strong> (включая ночные: <strong className="text-[#7b511c] tabular-nums">{stats.estimatedNightHours} ч.</strong>)
          </span>
        </div>

        {stats.estimatedPay !== undefined && stats.estimatedPay > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f3e7d5] border border-[#d8b57a] text-[#7b511c] text-xs font-semibold shadow-sm">
            <Coins className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
            <span>Ориентировочно: <strong className="tabular-nums">{stats.estimatedPay.toLocaleString('ru-RU')} ₽</strong></span>
          </div>
        )}
      </div>

      {/* Note about Article 153 */}
      {stats.doublePayShiftsCount > 0 && (
        <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-xl bg-[#fbf4f0] border border-[#efc8b4] text-xs text-[#9d4c37]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#9d4c37]" strokeWidth={1.5} />
          <span>
            В этом месяце {stats.doublePayShiftsCount} {stats.doublePayShiftsCount === 1 ? 'смена выпадает' : 'смены выпадают'} на государственные праздники РФ. По ст. 153 ТК РФ они оплачиваются в двойном размере.
          </span>
        </div>
      )}
    </div>
  );
};
