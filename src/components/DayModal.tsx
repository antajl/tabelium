import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  Clock,
  Check,
  AlertCircle,
} from 'lucide-react';
import type { DayShiftInfo, ShiftType } from '../types/schedule';
import { RUSSIAN_MONTH_NAMES } from '../utils/scheduleEngine';

interface DayModalProps {
  day: DayShiftInfo | null;
  isOpen: boolean;
  isReadOnly: boolean;
  onClose: () => void;
  onSave: (dateStr: string, status: ShiftType, note?: string) => void;
  onReset: (dateStr: string) => void;
}

export const DayModal: React.FC<DayModalProps> = ({
  day,
  isOpen,
  isReadOnly,
  onClose,
  onSave,
  onReset,
}) => {
  if (!isOpen || !day) return null;

  const [selectedStatus, setSelectedStatus] = useState<ShiftType>(day.status);
  const [note, setNote] = useState<string>(day.note || '');

  const [yearStr, monthStr, dayStr] = day.dateStr.split('-');
  const monthName = RUSSIAN_MONTH_NAMES[Number(monthStr) - 1];

  const handleSave = () => {
    onSave(day.dateStr, selectedStatus, note.trim() || undefined);
    onClose();
  };

  const handleReset = () => {
    onReset(day.dateStr);
    onClose();
  };

  const statusOptions: {
    type: ShiftType;
    label: string;
    sublabel: string;
    dotColor: string;
    color: string;
    border: string;
    activeBg: string;
  }[] = [
    {
      type: 'work',
      label: 'Работа',
      sublabel: 'Плановая работа в ночь',
      dotColor: 'bg-[#d32f2f]',
      color: 'text-[#93231c]',
      border: 'border-[#f5b8b2]',
      activeBg: 'bg-[#fdeeed] border-[#d32f2f] ring-1 ring-[#d32f2f]',
    },
    {
      type: 'off',
      label: 'Выходной',
      sublabel: 'Ночь отдыха',
      dotColor: 'bg-[#2e7d32]',
      color: 'text-[#215128]',
      border: 'border-[#b8deb9]',
      activeBg: 'bg-[#eaf5ec] border-[#2e7d32] ring-1 ring-[#2e7d32]',
    },
    {
      type: 'overtime',
      label: 'Подработка',
      sublabel: 'Дополнительная работа в ночь',
      dotColor: 'bg-[#b71c1c]',
      color: 'text-[#7f1d1d]',
      border: 'border-[#e57373] border-dashed',
      activeBg: 'bg-[#fbdcd9] border-[#b71c1c] ring-1 ring-[#b71c1c]',
    },
    {
      type: 'vacation',
      label: 'Отпуск',
      sublabel: 'Ежегодный или дополнительный отпуск',
      dotColor: 'bg-[#e5a100]',
      color: 'text-[#7d5600]',
      border: 'border-[#f6dc84]',
      activeBg: 'bg-[#fef7db] border-[#e5a100] ring-1 ring-[#e5a100]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#252320]/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#fcfaf7] border border-[#e7ddcf] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#e7ddcf]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-[#252320]">
                {Number(dayStr)} {monthName} {yearStr}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f3ede4] text-[#81796e] font-semibold border border-[#e7ddcf]">
                {day.dayOfWeekName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#81796e] mt-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#81796e]" strokeWidth={1.5} />
              <span>Время смены: с 20:00 до 08:00 утра</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-sm"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Holiday Notice */}
        {day.isHoliday && (
          <div className="mt-3 p-3 rounded-xl bg-[#fbf4f0] border border-[#efc8b4] text-xs text-[#9d4c37] flex items-start gap-2.5 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-[#9d4c37] shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="font-semibold text-[#9d4c37]">
                {day.holidayName || 'Государственный праздник РФ'}
              </p>
              <p className="text-[#7d3d2c] text-[11px] mt-0.5">
                По ст. 153 ТК РФ работа в этот день оплачивается не менее чем в двойном размере.
              </p>
            </div>
          </div>
        )}

        {isReadOnly ? (
          <div className="py-6 text-center text-sm text-[#81796e]">
            Статус дня:{' '}
            <strong className="text-[#252320] font-semibold">
              {day.status === 'work'
                ? 'Работа'
                : day.status === 'off'
                ? 'Выходной'
                : day.status === 'overtime'
                ? 'Подработка'
                : 'Отпуск'}
            </strong>
            {day.note && <p className="mt-2 text-xs text-[#81796e]">Заметка: {day.note}</p>}
          </div>
        ) : (
          <>
            {/* Status Select */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold text-[#81796e] block">
                Статус дня
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {statusOptions.map((opt) => {
                  const isSelected = selectedStatus === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setSelectedStatus(opt.type)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors shadow-2xs ${
                        isSelected
                          ? opt.activeBg
                          : `bg-white ${opt.border} hover:bg-[#faf6f0]`
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${opt.dotColor}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-semibold ${opt.color}`}>{opt.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#252320]" strokeWidth={2} />}
                        </div>
                        <span className="text-xs text-[#81796e] block mt-0.5 leading-snug">
                          {opt.sublabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Note input */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-[#81796e] block mb-1">
                Заметка к смене
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Например: подмена коллеги, смена с 21:00"
                className="w-full bg-white border border-[#e7ddcf] rounded-xl px-3.5 py-2 text-xs text-[#252320] placeholder-[#bcb7ad] focus:outline-none focus:border-[#d8b57a] shadow-2xs"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-4 border-t border-[#e7ddcf]">
              {day.isOverridden ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium text-[#81796e] hover:text-[#252320] bg-white hover:bg-[#f7f2ea] border border-[#e7ddcf] transition shadow-2xs"
                  title="Вернуть статус по базовому циклу 2/2"
                >
                  <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span>Сбросить к циклу 2/2</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-full text-xs font-medium text-[#81796e] hover:text-[#252320] bg-white hover:bg-[#f7f2ea] border border-[#e7ddcf] transition shadow-2xs"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-full text-xs font-semibold text-[#2a1c0a] bg-[#f3e7d5] hover:bg-[#e7d1ab] border border-[#d8b57a] shadow-sm transition active:scale-95"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
