import React from 'react';

export const LegendBar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 px-3 sm:px-4 bg-[#fcfaf7] rounded-xl border border-[#e7ddcf] text-xs shadow-sm">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Смена */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#55738a] shrink-0" />
          <span className="text-[#252320] font-medium">Смена</span>
          <span className="text-[#81796e] text-[11px]">(20:00 — 08:00)</span>
        </div>

        {/* Выходной */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#bcb7ad] shrink-0" />
          <span className="text-[#81796e] font-medium">Выходной</span>
        </div>

        {/* Подработка */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#b68231] shrink-0" />
          <span className="text-[#7b511c] font-medium">Подработка</span>
          <span className="text-[#81796e] text-[11px]">(20:00)</span>
        </div>

        {/* Отпуск */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#557658] shrink-0" />
          <span className="text-[#354a38] font-medium">Отпуск</span>
        </div>
      </div>

      {/* Праздники РФ (Терракота Old Money) */}
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fbf4f0] border border-[#efc8b4] text-[#9d4c37] text-[11px] font-semibold">
        <span>2X Оплата</span>
        <span className="text-[#81796e] font-normal hidden sm:inline">• праздники РФ</span>
      </div>
    </div>
  );
};
