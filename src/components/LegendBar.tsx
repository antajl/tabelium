import React from 'react';
import { Moon, Coffee, Zap, Palmtree } from 'lucide-react';

export const LegendBar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-3 sm:px-4 bg-slate-900/40 rounded-xl border border-slate-800/80 text-xs">
      <div className="flex flex-wrap items-center gap-3 sm:gap-5">
        {/* Работа */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
          <Moon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="text-slate-300 font-medium">Смена</span>
          <span className="text-slate-500 text-[11px]">(20:00 в ночь)</span>
        </div>

        {/* Выходной */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
          <Coffee className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="text-slate-400 font-medium">Выходной</span>
        </div>

        {/* Подработка */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-amber-300/90 font-medium">Подработка</span>
          <span className="text-slate-500 text-[11px]">(в ночь)</span>
        </div>

        {/* Отпуск */}
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <Palmtree className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-emerald-300/90 font-medium">Отпуск</span>
        </div>
      </div>

      {/* Праздник РФ / 2X Оплата */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
        <span className="font-semibold text-amber-300">2X Оплата</span>
        <span className="text-slate-400 hidden sm:inline">• ст. 112 ТК РФ</span>
      </div>
    </div>
  );
};
