import React, { useRef, useState } from 'react';
import { X, Download, Upload, FileJson, Check, AlertCircle } from 'lucide-react';
import type { DayOverride, UserScheduleConfig } from '../types/schedule';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserScheduleConfig;
  overrides: Record<string, DayOverride>;
  onImportData: (data: { config: UserScheduleConfig; overrides: Record<string, DayOverride> }) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  config,
  overrides,
  onImportData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      config,
      overrides,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smenograf_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setSuccessMsg('Файл резервной копии сохранен');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (!parsed.overrides) {
          throw new Error('Некорректный формат файла бэкапа');
        }
        onImportData({
          config: parsed.config || config,
          overrides: parsed.overrides || {},
        });
        setSuccessMsg('График успешно импортирован');
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 1500);
      } catch (err: any) {
        setErrorMsg('Ошибка чтения файла: ' + (err?.message || 'Неверный JSON'));
        setTimeout(() => setErrorMsg(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileJson className="w-4 h-4" />
            </div>
            <h3 className="text-base font-semibold text-slate-100">
              Экспорт и импорт данных
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successMsg && (
          <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-4 space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              Скачать резервную копию (JSON)
            </h4>
            <p className="text-slate-400 text-xs mb-3">
              Сохраняет все смены, подработки, отпуска и настройки в JSON файл на компьютер или телефон.
            </p>
            <button
              onClick={handleExport}
              className="w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Скачать файл бэкапа</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              Восстановить из файла
            </h4>
            <p className="text-slate-400 text-xs mb-3">
              Загрузите сохраненный JSON файл для восстановления или переноса графика.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-medium text-xs transition flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Выбрать файл с устройства</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
