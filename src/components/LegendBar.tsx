import React from 'react';
import { Moon, Coffee, Zap, Palmtree, Sparkles } from 'lucide-react';

export const LegendBar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 py-2 px-3 sm:px-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Работа */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-indigo-500 flex items-center justify-center text-white">
            <Moon className="w-2 h-2" />
          </span>
          <span className="text-slate-200 font-medium">Работа</span>
          <span className="text-slate-500 text-[11px]">(20:00 в ночь)</span>
        </div>

        {/* Выходной */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-slate-700 flex items-center justify-center text-slate-300">
            <Coffee className="w-2 h-2" />
          </span>
          <span className="text-slate-300 font-medium">Выходной</span>
        </div>

        {/* Подработка */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-500 flex items-center justify-center text-slate-950 font-bold">
            <Zap className="w-2 h-2" />
          </span>
          <span className="text-amber-300 font-medium">Подработка</span>
          <span className="text-slate-500 text-[11px]">(в ночь)</span>
        </div>

        {/* Отпуск */}
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-500 flex items-center justify-center text-white">
            <Palmtree className="w-2 h-2" />
          </span>
          <span className="text-emerald-300 font-medium">Отпуск</span>
        </div>
      </div>

      {/* Праздник РФ / 2X Оплата */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 text-amber-300">
        <Sparkles className="w-3 h-3 text-amber-400" />
        <span className="font-semibold">2X Оплата</span>
        <span className="text-slate-400 text-[11px] hidden sm:inline">(Праздники РФ ст. 112 ТК)</span>
      </div>
    </div>
  );
};
