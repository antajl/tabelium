import React from 'react';

export const LegendBar: React.FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2 px-3 sm:px-4 bg-[#201e1b] rounded-xl border border-[#2f2b26] text-xs">
      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
        {/* Смена */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#98a4ad] shrink-0" />
          <span className="text-[#ede7dc] font-medium">Смена</span>
          <span className="text-[#877f72] text-[11px]">(20:00 — 08:00)</span>
        </div>

        {/* Выходной */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#524b42] shrink-0" />
          <span className="text-[#9e9587] font-medium">Выходной</span>
        </div>

        {/* Подработка */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d19c52] shrink-0" />
          <span className="text-[#deb887] font-medium">Подработка</span>
          <span className="text-[#877f72] text-[11px]">(20:00)</span>
        </div>

        {/* Отпуск */}
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#6d9684] shrink-0" />
          <span className="text-[#a3c2b4] font-medium">Отпуск</span>
        </div>
      </div>

      {/* Праздник РФ / 2X */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#332719] border border-[#523d24] text-[#deb887] text-[11px]">
        <span className="font-semibold">2X Оплата</span>
        <span className="text-[#8a7a63] hidden sm:inline">• праздники РФ</span>
      </div>
    </div>
  );
};
