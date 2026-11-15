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
    <div className="bg-[#1e1c19] rounded-2xl border border-[#2e2a25] p-4 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2d2924]">
        <h3 className="text-sm sm:text-base font-semibold text-[#ede7dc]">
          Сводка за {monthName} {year}
        </h3>
        <span className="text-xs text-[#999081]">
          Смены ({config.shiftStartTime} — {config.shiftEndTime}): <strong className="text-[#ede7dc] font-semibold tabular-nums">{stats.totalNightShifts}</strong>
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Regular Work */}
        <div className="p-3 rounded-xl bg-[#24211d] border border-[#332f2a] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#999081] text-xs">
            <span>Основные смены</span>
            <span className="w-2 h-2 rounded-full bg-[#98a4ad]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-semibold tabular-nums text-[#ede7dc]">{stats.workDaysCount}</span>
            <span className="text-xs text-[#736b5e]">смен</span>
          </div>
        </div>

        {/* Overtime */}
        <div className="p-3 rounded-xl bg-[#27211a] border border-[#4a3927] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#deb887] text-xs">
            <span>Подработки</span>
            <span className="w-2 h-2 rounded-full bg-[#d19c52]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-semibold tabular-nums text-[#f0c377]">{stats.overtimeDaysCount}</span>
            <span className="text-xs text-[#8a7251]">смен</span>
          </div>
        </div>

        {/* 2X Holidays */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          stats.doublePayShiftsCount > 0
            ? 'bg-[#2b2216] border-[#61492b]'
            : 'bg-[#24211d] border-[#332f2a]'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <span className={stats.doublePayShiftsCount > 0 ? 'text-[#f0c377] font-medium' : 'text-[#999081]'}>
              2X Праздничные
            </span>
            <span className="text-[11px] font-bold text-[#f0c377]">2X</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-semibold tabular-nums text-[#f0c377]">
              {stats.doublePayShiftsCount}
            </span>
            <span className="text-xs text-[#736b5e]">смен (2x)</span>
          </div>
        </div>

        {/* Vacation */}
        <div className="p-3 rounded-xl bg-[#1d2521] border border-[#304239] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#a3c2b4] text-xs">
            <span>Отпуск</span>
            <span className="w-2 h-2 rounded-full bg-[#6d9684]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-semibold tabular-nums text-[#c5ded3]">{stats.vacationDaysCount}</span>
            <span className="text-xs text-[#5f7a6e]">дней</span>
          </div>
        </div>
      </div>

      {/* Hours and Estimated Pay */}
      <div className="mt-3 pt-3 border-t border-[#2d2924] flex flex-wrap items-center justify-between gap-3 text-xs text-[#999081]">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#736b5e]" strokeWidth={1.5} />
          <span>
            Отработано: <strong className="text-[#ede7dc] tabular-nums">{stats.estimatedHours} ч.</strong> (включая ночные: <strong className="text-[#deb887] tabular-nums">{stats.estimatedNightHours} ч.</strong>)
          </span>
        </div>

        {stats.estimatedPay !== undefined && stats.estimatedPay > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#26231f] border border-[#3b352c] text-[#ede7dc] text-xs font-medium">
            <Coins className="w-3.5 h-3.5 text-[#deb887]" strokeWidth={1.5} />
            <span>Ориентировочно: <strong className="text-[#deb887] tabular-nums">{stats.estimatedPay.toLocaleString('ru-RU')} ₽</strong></span>
          </div>
        )}
      </div>

      {/* Note about Article 153 */}
      {stats.doublePayShiftsCount > 0 && (
        <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-lg bg-[#292218] border border-[#4a3924] text-xs text-[#deb887]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#d19c52]" strokeWidth={1.5} />
          <span>
            В этом месяце {stats.doublePayShiftsCount} {stats.doublePayShiftsCount === 1 ? 'смена выпадает' : 'смены выпадают'} на государственные праздники РФ. По ст. 153 ТК РФ они оплачиваются в двойном размере.
          </span>
        </div>
      )}
    </div>
  );
};
