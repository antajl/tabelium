import React, { useRef, useState } from 'react';
import { X, Download, Upload, FileJson, Check, AlertCircle } from 'lucide-react';
import type { Colleague, DayOverride, UserScheduleConfig } from '../types/schedule';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: UserScheduleConfig;
  overrides: Record<string, DayOverride>;
  colleagues?: Colleague[];
  onImportData: (data: {
    config: UserScheduleConfig;
    overrides: Record<string, DayOverride>;
    colleagues?: Colleague[];
  }) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  config,
  overrides,
  colleagues,
  onImportData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = {
      version: '1.1',
      exportedAt: new Date().toISOString(),
      config,
      overrides,
      colleagues,
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
        if (!parsed.overrides && !parsed.config) {
          throw new Error('Некорректный формат файла бэкапа');
        }
        onImportData({
          config: parsed.config || config,
          overrides: parsed.overrides || {},
          colleagues: parsed.colleagues,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252320]/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#fcfaf7] border border-[#e7ddcf] rounded-2xl p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#e7ddcf]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#f3e7d5] text-[#7b511c] border border-[#d8b57a] flex items-center justify-center shadow-sm">
              <FileJson className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-[#252320]">
              Экспорт и импорт данных
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-sm"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-[#f0f5f0] border border-[#c8dcc9] text-[#354a38] text-xs font-medium flex items-center gap-2 shadow-2xs">
            <Check className="w-4 h-4 text-[#557658] shrink-0" strokeWidth={2} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-[#fbf4f0] border border-[#efc8b4] text-[#9d4c37] text-xs font-medium flex items-center gap-2 shadow-2xs">
            <AlertCircle className="w-4 h-4 text-[#9d4c37] shrink-0" strokeWidth={1.5} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-4 space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-[#e7ddcf] shadow-2xs">
            <h4 className="font-semibold text-[#252320] mb-1 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#b68231]" strokeWidth={1.5} />
              Скачать резервную копию (JSON)
            </h4>
            <p className="text-[#81796e] text-xs mb-3">
              Сохраняет все смены, подработки, отпуска и настройки в JSON файл на компьютер или телефон.
            </p>
            <button
              onClick={handleExport}
              className="w-full py-2 px-3 rounded-full bg-[#f3e7d5] hover:bg-[#e7d1ab] text-[#2a1c0a] font-semibold text-xs transition border border-[#d8b57a] flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Скачать файл бэкапа</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#e7ddcf] shadow-2xs">
            <h4 className="font-semibold text-[#252320] mb-1 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#557658]" strokeWidth={1.5} />
              Восстановить из файла
            </h4>
            <p className="text-[#81796e] text-xs mb-3">
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
              className="w-full py-2 px-3 rounded-full bg-white hover:bg-[#f7f2ea] border border-[#e7ddcf] text-[#252320] font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
            >
              <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Выбрать файл с устройства</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#e7ddcf] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#f7f2ea] text-[#81796e] hover:text-[#252320] border border-[#e7ddcf] transition shadow-2xs"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
