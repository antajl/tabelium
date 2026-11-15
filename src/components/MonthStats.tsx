import React from 'react';
import {
  Moon,
  Zap,
  Sparkles,
  Palmtree,
  Clock,
  Coins,
  ShieldAlert,
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
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 sm:p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <span>Сводка за {monthName} {year}</span>
        </h3>
        <span className="text-xs text-slate-400">
          Смены ({config.shiftStartTime} — {config.shiftEndTime}): <strong className="text-indigo-400 font-bold">{stats.totalNightShifts}</strong>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-300 text-xs">
            <span>Основные</span>
            <Moon className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-white">{stats.workDaysCount}</span>
            <span className="text-xs text-slate-400">смен</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-300 text-xs">
            <span>Подработки</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-amber-300">{stats.overtimeDaysCount}</span>
            <span className="text-xs text-slate-400">смен</span>
          </div>
        </div>

        <div className={`p-3 rounded-xl border flex flex-col justify-between ${
          stats.doublePayShiftsCount > 0
            ? 'bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
            : 'bg-slate-800/30 border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-amber-300 text-xs font-semibold">
            <span>2X Праздничные</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              {stats.doublePayShiftsCount}
            </span>
            <span className="text-xs text-slate-400">смен (2x)</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-300 text-xs">
            <span>Отпуск</span>
            <Palmtree className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-white">{stats.vacationDaysCount}</span>
            <span className="text-xs text-slate-400">дней</span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>
            Отработано: <strong className="text-slate-200">{stats.estimatedHours} ч.</strong> (из них ночных: <strong className="text-indigo-300">{stats.estimatedNightHours} ч.</strong>)
          </span>
        </div>

        {stats.estimatedPay !== undefined && stats.estimatedPay > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>Ориентировочно: {stats.estimatedPay.toLocaleString('ru-RU')} ₽</span>
          </div>
        )}
      </div>

      {stats.doublePayShiftsCount > 0 && (
        <div className="mt-2.5 flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-amber-400" />
          <span>
            В этом месяце {stats.doublePayShiftsCount} {stats.doublePayShiftsCount === 1 ? 'смена выпадает' : 'смены выпадают'} на официальные нерабочие праздники РФ. По ст. 153 ТК РФ они оплачиваются не менее чем в двойном размере!
          </span>
        </div>
      )}
    </div>
  );
};
