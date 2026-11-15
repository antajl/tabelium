import React from 'react';
import {
  Clock,
  Coins,
  AlertCircle,
  CalendarCheck2,
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
    <div className="bg-[#fcfaf7] rounded-2xl border border-[#e7ddcf] p-4 sm:p-5 shadow-[0_1px_3px_rgba(45,30,15,0.04)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e7ddcf]">
        <div>
          <h3 className="text-base font-bold text-[#252320]">
            Сводка за месяц
          </h3>
          <p className="text-xs text-[#81796e] mt-0.5">
            {monthName} {year}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#81796e] block">Всего рабочих смен</span>
          <span className="text-lg font-bold text-[#93231c] tabular-nums">
            {stats.totalNightShifts}
          </span>
        </div>
      </div>

      {/* 2x2 Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Regular Work */}
        <div className="p-3 rounded-xl bg-[#fdeeed] border border-[#f5b8b2] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-[#93231c] text-xs font-semibold">
            <span>Работа</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#d32f2f]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold tabular-nums text-[#93231c]">
              {stats.workDaysCount}
            </span>
            <span className="text-xs text-[#b85a53]">смен</span>
          </div>
        </div>

        {/* Overtime */}
        <div className="p-3 rounded-xl bg-[#fbdcd9] border border-[#e57373] border-dashed flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-[#7f1d1d] text-xs font-semibold">
            <span>Подработка</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#b71c1c]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold tabular-nums text-[#7f1d1d]">
              {stats.overtimeDaysCount}
            </span>
            <span className="text-xs text-[#9c3e37]">смен</span>
          </div>
        </div>

        {/* Days Off */}
        <div className="p-3 rounded-xl bg-[#eaf5ec] border border-[#b8deb9] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-[#215128] text-xs font-semibold">
            <span>Выходные</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#2e7d32]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold tabular-nums text-[#215128]">
              {stats.offDaysCount}
            </span>
            <span className="text-xs text-[#629769]">дней</span>
          </div>
        </div>

        {/* Vacation */}
        <div className="p-3 rounded-xl bg-[#fef7db] border border-[#f6dc84] flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between text-[#7d5600] text-xs font-semibold">
            <span>Отпуск</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#e5a100]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl font-bold tabular-nums text-[#7d5600]">
              {stats.vacationDaysCount}
            </span>
            <span className="text-xs text-[#a2802d]">дней</span>
          </div>
        </div>
      </div>

      {/* Hours Worked */}
      <div className="mt-3.5 p-3 rounded-xl bg-white border border-[#e7ddcf] shadow-2xs flex flex-col gap-1.5 text-xs">
        <div className="flex items-center justify-between text-[#81796e]">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#81796e]" strokeWidth={1.5} />
            Отработано часов:
          </span>
          <strong className="text-[#252320] tabular-nums font-bold">
            {stats.estimatedHours} ч.
          </strong>
        </div>
        <div className="flex items-center justify-between text-[#81796e] pl-5">
          <span>в т.ч. ночных (с 22:00 до 06:00):</span>
          <strong className="text-[#7b511c] tabular-nums font-semibold">
            {stats.estimatedNightHours} ч.
          </strong>
        </div>
      </div>

      {/* Estimated Pay if configured */}
      {stats.estimatedPay !== undefined && stats.estimatedPay > 0 && (
        <div className="mt-2.5 p-3 rounded-xl bg-[#f3e7d5] border border-[#d8b57a] flex items-center justify-between text-xs text-[#7b511c] shadow-2xs">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#b68231]" strokeWidth={1.5} />
            <span className="font-semibold">Расчёт заработка:</span>
          </div>
          <strong className="text-sm font-bold tabular-nums">
            {stats.estimatedPay.toLocaleString('ru-RU')} ₽
          </strong>
        </div>
      )}

      {/* 2X Double Pay Holidays Notice */}
      {stats.doublePayShiftsCount > 0 ? (
        <div className="mt-2.5 flex items-start gap-2 p-2.5 rounded-xl bg-[#fbf4f0] border border-[#efc8b4] text-xs text-[#9d4c37]">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#9d4c37] mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="font-semibold">
              {stats.doublePayShiftsCount} {stats.doublePayShiftsCount === 1 ? 'смена' : 'смены'} с оплатой 2X
            </p>
            <p className="text-[11px] text-[#7d3d2c] mt-0.5 leading-snug">
              Выпадают на праздники РФ и по ст. 153 ТК РФ оплачиваются в двойном размере.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-2.5 p-2 rounded-xl bg-[#fcfaf7] border border-[#e7ddcf] text-[11px] text-[#81796e] flex items-center gap-1.5">
          <CalendarCheck2 className="w-3.5 h-3.5 text-[#81796e]" strokeWidth={1.5} />
          <span>В этом месяце нет праздничных смен с 2X оплатой</span>
        </div>
      )}
    </div>
  );
};
