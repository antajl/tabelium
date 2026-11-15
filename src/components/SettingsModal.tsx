import React, { useState } from 'react';
import { X, Settings, RotateCcw, Clock, Coins } from 'lucide-react';
import type { UserScheduleConfig } from '../types/schedule';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserScheduleConfig;
  onSaveConfig: (newConfig: UserScheduleConfig) => void;
  onRestoreGoogleSheetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onRestoreGoogleSheetData,
}) => {
  if (!isOpen) return null;

  const [scheduleName, setScheduleName] = useState(config.scheduleName);
  const [anchorDate, setAnchorDate] = useState(config.anchorDate);
  const [shiftStartTime, setShiftStartTime] = useState(config.shiftStartTime);
  const [shiftEndTime, setShiftEndTime] = useState(config.shiftEndTime);
  const [shiftRate, setShiftRate] = useState(config.shiftRate ? String(config.shiftRate) : '');
  const [hourlyRate, setHourlyRate] = useState(config.hourlyRate ? String(config.hourlyRate) : '');
  const [confirmRestore, setConfirmRestore] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      scheduleName: scheduleName.trim() || 'Мой график',
      anchorDate,
      shiftStartTime,
      shiftEndTime,
      shiftRate: shiftRate ? Number(shiftRate) : undefined,
      hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252320]/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#fcfaf7] border border-[#e7ddcf] rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e7ddcf]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#f3e7d5] text-[#7b511c] border border-[#d8b57a] flex items-center justify-center shadow-sm">
              <Settings className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-[#252320]">
              Настройки графика
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-sm"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-[#81796e] block mb-1">
              Название графика
            </label>
            <input
              type="text"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              className="w-full bg-white border border-[#e7ddcf] rounded-xl px-3 py-2 text-[#252320] text-xs focus:border-[#d8b57a] focus:outline-none shadow-2xs"
            />
          </div>

          <div>
            <label className="font-semibold text-[#81796e] block mb-1">
              Опорная дата (День 1 смены 2/2)
            </label>
            <input
              type="date"
              value={anchorDate}
              onChange={(e) => setAnchorDate(e.target.value)}
              className="w-full bg-white border border-[#e7ddcf] rounded-xl px-3 py-2 text-[#252320] text-xs focus:border-[#d8b57a] focus:outline-none shadow-2xs"
            />
            <p className="text-[11px] text-[#bcb7ad] mt-1">
              От этой даты математически строится регулярный цикл 2/2 на любые годы вперёд.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-[#81796e] block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#81796e]" strokeWidth={1.5} />
                Начало смены
              </label>
              <input
                type="text"
                value={shiftStartTime}
                onChange={(e) => setShiftStartTime(e.target.value)}
                className="w-full bg-white border border-[#e7ddcf] rounded-xl px-3 py-2 text-[#252320] text-xs focus:border-[#d8b57a] focus:outline-none shadow-2xs"
                placeholder="20:00"
              />
            </div>
            <div>
              <label className="font-semibold text-[#81796e] block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#81796e]" strokeWidth={1.5} />
                Конец смены
              </label>
              <input
                type="text"
                value={shiftEndTime}
                onChange={(e) => setShiftEndTime(e.target.value)}
                className="w-full bg-white border border-[#e7ddcf] rounded-xl px-3 py-2 text-[#252320] text-xs focus:border-[#d8b57a] focus:outline-none shadow-2xs"
                placeholder="08:00"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#e7ddcf]">
            <span className="font-semibold text-[#252320] block mb-2 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
              Калькулятор заработка (необязательно)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-[#81796e] font-medium block mb-1">
                  Ставка за 1 смену (₽)
                </label>
                <input
                  type="number"
                  value={shiftRate}
                  onChange={(e) => setShiftRate(e.target.value)}
                  placeholder="Напр. 5000"
                  className="w-full bg-white border border-[#e7ddcf] rounded-xl px-3 py-2 text-[#252320] text-xs focus:border-[#d8b57a] focus:outline-none shadow-2xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-[#81796e] font-medium block mb-1">
                  Или ставка в час (₽/ч)
                </label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="Напр. 450"
                  className="w-full bg-white border border-[#e7ddcf] rounded-xl px-3 py-2 text-[#252320] text-xs focus:border-[#d8b57a] focus:outline-none shadow-2xs"
                />
              </div>
            </div>
            <p className="text-[11px] text-[#bcb7ad] mt-1">
              В расчете автоматически учитывается двойная оплата (2X) в официальные праздники РФ.
            </p>
          </div>

          <div className="pt-3 border-t border-[#e7ddcf]">
            <span className="font-semibold text-[#81796e] block mb-1.5">
              Данные из Google Таблицы:
            </span>
            {confirmRestore ? (
              <div className="p-2.5 rounded-xl bg-[#fbf4f0] border border-[#efc8b4]">
                <p className="text-[11px] text-[#9d4c37] mb-2 font-medium">
                  Это восстановит исходные 426 отметок (ноябрь 2025 – декабрь 2026), заполнив подработки и отпуска, как в таблице. Продолжить?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onRestoreGoogleSheetData();
                      setConfirmRestore(false);
                      onClose();
                    }}
                    className="px-3.5 py-1.5 rounded-full bg-[#f3e7d5] text-[#2a1c0a] font-semibold text-xs border border-[#d8b57a]"
                  >
                    Восстановить
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmRestore(false)}
                    className="px-3.5 py-1.5 rounded-full bg-white text-[#81796e] text-xs border border-[#e7ddcf]"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmRestore(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-[#f7f2ea] border border-[#e7ddcf] text-[#252320] text-xs font-medium transition shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
                <span>Восстановить данные из Google Таблицы</span>
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-[#e7ddcf] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-medium bg-white hover:bg-[#f7f2ea] text-[#81796e] border border-[#e7ddcf] transition shadow-2xs"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full text-xs font-semibold bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#2a1c0a] border border-[#d8b57a] transition shadow-sm"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
