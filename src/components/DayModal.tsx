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
      label: 'Смена',
      sublabel: 'Смена в ночь с 20:00 до 08:00',
      dotColor: 'bg-[#98a4ad]',
      color: 'text-[#dce2e6]',
      border: 'border-[#383d42]',
      activeBg: 'bg-[#292d30] border-[#5e666e] ring-1 ring-[#5e666e]',
    },
    {
      type: 'off',
      label: 'Выходной',
      sublabel: 'Ночь отдыха',
      dotColor: 'bg-[#524b42]',
      color: 'text-[#827a6e]',
      border: 'border-[#2d2925]',
      activeBg: 'bg-[#2b2723] border-[#4f483f] ring-1 ring-[#4f483f]',
    },
    {
      type: 'overtime',
      label: 'Подработка',
      sublabel: 'Дополнительная смена с 20:00 до 08:00',
      dotColor: 'bg-[#d19c52]',
      color: 'text-[#deb887]',
      border: 'border-[#52412e]',
      activeBg: 'bg-[#382b1c] border-[#8a6839] ring-1 ring-[#8a6839]',
    },
    {
      type: 'vacation',
      label: 'Отпуск',
      sublabel: 'Ежегодный или дополнительный отпуск',
      dotColor: 'bg-[#6d9684]',
      color: 'text-[#a3c2b4]',
      border: 'border-[#33463e]',
      activeBg: 'bg-[#23332c] border-[#4d6e5f] ring-1 ring-[#4d6e5f]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#201e1b] border border-[#332e27] rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#2d2924]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-semibold text-[#ede7dc]">
                {Number(dayStr)} {monthName} {yearStr}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#272420] text-[#999081] font-medium border border-[#36312a]">
                {day.dayOfWeekName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#999081] mt-1">
              <Clock className="w-3.5 h-3.5 text-[#736b5e]" strokeWidth={1.5} />
              <span>Время смены: с 20:00 до 08:00 утра</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#272420] hover:bg-[#332f2a] text-[#999081] hover:text-[#ede7dc] transition"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Holiday Notice */}
        {day.isHoliday && (
          <div className="mt-3 p-3 rounded-xl bg-[#292218] border border-[#4a3924] text-xs text-[#deb887] flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#d19c52] shrink-0 mt-0.5" strokeWidth={1.5} />
            <div>
              <p className="font-medium text-[#f0c377]">
                {day.holidayName || 'Государственный праздник РФ'}
              </p>
              <p className="text-[#a3947f] text-[11px] mt-0.5">
                По ст. 153 ТК РФ работа в этот день оплачивается не менее чем в двойном размере.
              </p>
            </div>
          </div>
        )}

        {isReadOnly ? (
          <div className="py-6 text-center text-sm text-[#999081]">
            Статус дня:{' '}
            <strong className="text-[#ede7dc] font-medium">
              {day.status === 'work'
                ? 'Смена в ночь'
                : day.status === 'off'
                ? 'Выходной'
                : day.status === 'overtime'
                ? 'Подработка в ночь'
                : 'Отпуск'}
            </strong>
            {day.note && <p className="mt-2 text-xs text-[#999081]">Заметка: {day.note}</p>}
          </div>
        ) : (
          <>
            {/* Status Select */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-medium text-[#999081] block">
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
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-colors ${
                        isSelected
                          ? opt.activeBg
                          : `bg-[#24211d] ${opt.border} hover:bg-[#2b2723]`
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${opt.dotColor}`} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${opt.color}`}>{opt.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-[#ede7dc]" strokeWidth={1.5} />}
                        </div>
                        <span className="text-xs text-[#736b5e] block mt-0.5 leading-snug">
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
              <label className="text-xs font-medium text-[#999081] block mb-1">
                Заметка к смене
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Например: подмена коллеги, смена с 21:00"
                className="w-full bg-[#181715] border border-[#332f2a] rounded-xl px-3.5 py-2 text-xs text-[#ede7dc] placeholder-[#6b6355] focus:outline-none focus:border-[#deb887]"
              />
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-4 border-t border-[#2d2924]">
              {day.isOverridden ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#999081] hover:text-[#ede7dc] bg-[#272420] hover:bg-[#302c27] transition"
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
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-medium text-[#999081] hover:text-[#ede7dc] bg-[#272420] hover:bg-[#302c27] transition"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-semibold text-[#181715] bg-[#deb887] hover:bg-[#ebd0a7] transition"
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
