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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">
              Настройки графика
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="font-medium text-slate-300 block mb-1">
              Название графика
            </label>
            <input
              type="text"
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-medium text-slate-300 block mb-1">
              Опорная дата (День 1 смены 2/2)
            </label>
            <input
              type="date"
              value={anchorDate}
              onChange={(e) => setAnchorDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              От этой даты математически строится регулярный цикл 2/2 на любые годы вперёд.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-medium text-slate-300 block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Начало смены
              </label>
              <input
                type="text"
                value={shiftStartTime}
                onChange={(e) => setShiftStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                placeholder="20:00"
              />
            </div>
            <div>
              <label className="font-medium text-slate-300 block mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Конец смены
              </label>
              <input
                type="text"
                value={shiftEndTime}
                onChange={(e) => setShiftEndTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                placeholder="08:00"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <span className="font-semibold text-slate-200 block mb-2 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-slate-400" />
              Калькулятор заработка (необязательно)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Ставка за 1 смену (₽)
                </label>
                <input
                  type="number"
                  value={shiftRate}
                  onChange={(e) => setShiftRate(e.target.value)}
                  placeholder="Напр. 5000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Или ставка в час (₽/ч)
                </label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="Напр. 450"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 text-xs focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              В расчете автоматически учитывается двойная оплата (2X) в официальные праздники РФ.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <span className="font-medium text-slate-400 block mb-1.5">
              Данные из Google Таблицы:
            </span>
            {confirmRestore ? (
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-[11px] text-amber-300 mb-2">
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
                    className="px-3 py-1.5 rounded bg-amber-500 text-slate-950 font-semibold text-xs"
                  >
                    Восстановить
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmRestore(false)}
                    className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmRestore(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs transition"
              >
                <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Восстановить данные из Google Таблицы</span>
              </button>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
