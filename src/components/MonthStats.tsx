import React from 'react';
import {
  Moon,
  Zap,
  Palmtree,
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
    <div className="bg-slate-900/40 rounded-2xl border border-slate-800/80 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800/80">
        <h3 className="text-sm sm:text-base font-semibold text-slate-100">
          Сводка за {monthName} {year}
        </h3>
        <span className="text-xs text-slate-400">
          Смены ({config.shiftStartTime} — {config.shiftEndTime}): <strong className="text-indigo-300 font-semibold tabular-nums">{stats.totalNightShifts}</strong>
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {/* Regular Work */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Основные</span>
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-semibold tabular-nums text-slate-100">{stats.workDaysCount}</span>
            <span className="text-xs text-slate-500">смен</span>
          </div>
        </div>

        {/* Overtime */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Подработки</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-semibold tabular-nums text-amber-300">{stats.overtimeDaysCount}</span>
            <span className="text-xs text-slate-500">смен</span>
          </div>
        </div>

        {/* 2X Holidays */}
        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          stats.doublePayShiftsCount > 0
            ? 'bg-amber-500/5 border-amber-500/30'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className={stats.doublePayShiftsCount > 0 ? 'text-amber-300/90 font-medium' : ''}>
              2X Праздничные
            </span>
            <span className="text-xs font-semibold text-amber-400">2X</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-semibold tabular-nums text-amber-300">
              {stats.doublePayShiftsCount}
            </span>
            <span className="text-xs text-slate-500">смен (2x)</span>
          </div>
        </div>

        {/* Vacation */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Отпуск</span>
            <Palmtree className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-lg sm:text-xl font-semibold tabular-nums text-slate-100">{stats.vacationDaysCount}</span>
            <span className="text-xs text-slate-500">дней</span>
          </div>
        </div>
      </div>

      {/* Hours and Estimated Pay */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>
            Отработано: <strong className="text-slate-200 tabular-nums">{stats.estimatedHours} ч.</strong> (включая ночные: <strong className="text-indigo-300 tabular-nums">{stats.estimatedNightHours} ч.</strong>)
          </span>
        </div>

        {stats.estimatedPay !== undefined && stats.estimatedPay > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium">
            <Coins className="w-3.5 h-3.5 text-slate-400" />
            <span>Ориентировочно: <strong className="text-emerald-400 tabular-nums">{stats.estimatedPay.toLocaleString('ru-RU')} ₽</strong></span>
          </div>
        )}
      </div>

      {/* Note about Article 153 */}
      {stats.doublePayShiftsCount > 0 && (
        <div className="mt-2.5 flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs text-amber-300/90">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>
            В этом месяце {stats.doublePayShiftsCount} {stats.doublePayShiftsCount === 1 ? 'смена выпадает' : 'смены выпадают'} на государственные праздники РФ. По ст. 153 ТК РФ они оплачиваются в двойном размере.
          </span>
        </div>
      )}
    </div>
  );
};
