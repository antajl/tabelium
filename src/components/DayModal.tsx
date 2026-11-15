import React, { useState } from 'react';
import {
  X,
  Moon,
  Coffee,
  Zap,
  Palmtree,
  Sparkles,
  RotateCcw,
  Clock,
  Check,
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
    icon: React.ReactNode;
    color: string;
    border: string;
    activeBg: string;
  }[] = [
    {
      type: 'work',
      label: 'Работа',
      sublabel: 'Смена в ночь (20:00 — 08:00)',
      icon: <Moon className="w-5 h-5 text-indigo-400" />,
      color: 'text-indigo-300',
      border: 'border-indigo-500/40',
      activeBg: 'bg-indigo-950/80 border-indigo-500 ring-2 ring-indigo-500/50',
    },
    {
      type: 'off',
      label: 'Выходной',
      sublabel: 'Ночь отдыха (не иду на работу)',
      icon: <Coffee className="w-5 h-5 text-slate-400" />,
      color: 'text-slate-300',
      border: 'border-slate-700',
      activeBg: 'bg-slate-800 border-slate-500 ring-2 ring-slate-500/50',
    },
    {
      type: 'overtime',
      label: 'Подработка',
      sublabel: 'Доп. смена в ночь (20:00 — 08:00)',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      color: 'text-amber-300',
      border: 'border-amber-500/40',
      activeBg: 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/50',
    },
    {
      type: 'vacation',
      label: 'Отпуск',
      sublabel: 'Ежегодный или доп. отпуск',
      icon: <Palmtree className="w-5 h-5 text-emerald-400" />,
      color: 'text-emerald-300',
      border: 'border-emerald-500/40',
      activeBg: 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-white">
                {Number(dayStr)} {monthName} {yearStr}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                {day.dayOfWeekName}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Время смены: с 20:00 до 08:00 утра</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {day.isHoliday && (
          <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/15 to-yellow-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-300">
                {day.holidayName || 'Официальный нерабочий праздничный день РФ'}
              </p>
              <p className="text-slate-300 text-[11px] mt-0.5">
                По ст. 153 ТК РФ работа в этот день оплачивается не менее чем в двойном размере (2X)!
              </p>
            </div>
          </div>
        )}

        {isReadOnly ? (
          <div className="py-6 text-center text-sm text-slate-400">
            Статус дня:{' '}
            <strong className="text-white text-base">
              {day.status === 'work'
                ? 'Работа (в ночь)'
                : day.status === 'off'
                ? 'Выходной'
                : day.status === 'overtime'
                ? 'Подработка (в ночь)'
                : 'Отпуск'}
            </strong>
            {day.note && <p className="mt-2 text-xs text-slate-400">Заметка: {day.note}</p>}
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Выберите статус дня:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {statusOptions.map((opt) => {
                  const isSelected = selectedStatus === opt.type;
                  return (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setSelectedStatus(opt.type)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? opt.activeBg
                          : `bg-slate-800/40 ${opt.border} hover:bg-slate-800/80`
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">{opt.icon}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-bold ${opt.color}`}>{opt.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                          {opt.sublabel}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Заметка к смене (необязательно):
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Например: подменил Иванова, смена с 21:00..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-4 border-t border-slate-800">
              {day.isOverridden ? (
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition"
                  title="Вернуть статус по базовому графику 2/2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Сбросить к графику 2/2</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 transition"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-none px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition active:scale-95"
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
