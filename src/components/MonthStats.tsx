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
  config?: UserScheduleConfig;
}

export const MonthStats: React.FC<MonthStatsProps> = ({
  stats,
  month,
  year,
}) => {
  const monthName = RUSSIAN_MONTH_NAMES[month - 1];

  return (
    <div
      style={{ viewTransitionName: 'active-stats-surface' } as React.CSSProperties}
      className="bg-[#fcfaf7] rounded-2xl border border-[#e7ddcf] p-3 sm:p-3.5 shadow-[0_1px_3px_rgba(45,30,15,0.04)]"
    >
      {/* Compact Single Header Row */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e7ddcf]">
        <div className="flex items-baseline gap-1.5 min-w-0">
          <h3 className="text-xs font-bold text-[#252320]">
            Сводка
          </h3>
          <span className="text-[11px] text-[#81796e] truncate">
            {monthName} {year}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] text-[#81796e]">Рабочих смен:</span>
          <span className="px-2 py-0.5 rounded-full bg-[#fdeeed] text-[#93231c] border border-[#f5b8b2] text-xs font-bold tabular-nums">
            {stats.totalNightShifts}
          </span>
        </div>
      </div>

      {/* Compact 2x2 Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
        {/* Regular Work */}
        <div className="px-2.5 py-1.5 rounded-lg bg-[#fdeeed] border border-[#f5b8b2] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#d32f2f] shrink-0" />
            <span className="text-xs font-semibold text-[#93231c]">Работа</span>
          </div>
          <span className="text-xs font-bold tabular-nums text-[#93231c]">
            {stats.workDaysCount} <span className="text-[10px] font-normal text-[#b85a53]">см.</span>
          </span>
        </div>

        {/* Overtime */}
        <div className="px-2.5 py-1.5 rounded-lg bg-[#fbdcd9] border border-[#e57373] border-dashed flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#b71c1c] shrink-0" />
            <span className="text-xs font-semibold text-[#7f1d1d]">Подработка</span>
          </div>
          <span className="text-xs font-bold tabular-nums text-[#7f1d1d]">
            {stats.overtimeDaysCount} <span className="text-[10px] font-normal text-[#9c3e37]">см.</span>
          </span>
        </div>

        {/* Days Off */}
        <div className="px-2.5 py-1.5 rounded-lg bg-[#eaf5ec] border border-[#b8deb9] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2e7d32] shrink-0" />
            <span className="text-xs font-semibold text-[#215128]">Выходные</span>
          </div>
          <span className="text-xs font-bold tabular-nums text-[#215128]">
            {stats.offDaysCount} <span className="text-[10px] font-normal text-[#629769]">дн.</span>
          </span>
        </div>

        {/* Vacation */}
        <div className="px-2.5 py-1.5 rounded-lg bg-[#fef7db] border border-[#f6dc84] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#e5a100] shrink-0" />
            <span className="text-xs font-semibold text-[#7d5600]">Отпуск</span>
          </div>
          <span className="text-xs font-bold tabular-nums text-[#7d5600]">
            {stats.vacationDaysCount} <span className="text-[10px] font-normal text-[#a2802d]">дн.</span>
          </span>
        </div>
      </div>

      {/* Compact Hours Worked Row */}
      <div className="mt-2 px-2.5 py-1.5 rounded-lg bg-white border border-[#e7ddcf] shadow-2xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-[#81796e]">
          <Clock className="w-3.5 h-3.5 text-[#81796e] shrink-0" strokeWidth={1.5} />
          <span>Отработано: <strong className="text-[#252320] font-bold tabular-nums">{stats.estimatedHours} ч.</strong></span>
        </div>
        <span className="text-[11px] text-[#81796e]">
          в т.ч. ночных: <strong className="text-[#7b511c] font-bold tabular-nums">{stats.estimatedNightHours} ч.</strong>
        </span>
      </div>

      {/* Estimated Pay if configured */}
      {stats.estimatedPay !== undefined && stats.estimatedPay > 0 && (
        <div className="mt-1.5 px-2.5 py-1.5 rounded-lg bg-[#f3e7d5] border border-[#d8b57a] flex items-center justify-between text-xs text-[#7b511c] shadow-2xs">
          <div className="flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-[#b68231] shrink-0" strokeWidth={1.5} />
            <span className="font-semibold">Расчёт заработка:</span>
          </div>
          <strong className="text-xs font-bold tabular-nums">
            {stats.estimatedPay.toLocaleString('ru-RU')} ₽
          </strong>
        </div>
      )}

      {/* 2X Double Pay Notice (only when present) */}
      {stats.doublePayShiftsCount > 0 && (
        <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-[#fbf4f0] border border-[#efc8b4] text-xs text-[#9d4c37] flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#9d4c37]" strokeWidth={1.5} />
            <span className="font-semibold text-[11px]">
              {stats.doublePayShiftsCount} {stats.doublePayShiftsCount === 1 ? 'смена' : 'смены'} с оплатой 2X
            </span>
          </div>
          <span className="text-[10px] text-[#9d4c37]/80">ст. 153 ТК РФ</span>
        </div>
      )}
    </div>
  );
};