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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#201e1b] border border-[#332e27] rounded-2xl p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#2d2924]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#272420] text-[#deb887] border border-[#38332c] flex items-center justify-center">
              <FileJson className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-semibold text-[#ede7dc]">
              Экспорт и импорт данных
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#272420] hover:bg-[#332f2a] text-[#999081] hover:text-[#ede7dc] transition"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {successMsg && (
          <div className="mt-3 p-3 rounded-lg bg-[#1f2b24] border border-[#364d3f] text-[#a3c2b4] text-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-[#6d9684] shrink-0" strokeWidth={1.5} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mt-3 p-3 rounded-lg bg-[#30201e] border border-[#543632] text-[#dcaaa4] text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#c97b71] shrink-0" strokeWidth={1.5} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="mt-4 space-y-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#24211d] border border-[#332f2a]">
            <h4 className="font-semibold text-[#ede7dc] mb-1 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-[#deb887]" strokeWidth={1.5} />
              Скачать резервную копию (JSON)
            </h4>
            <p className="text-[#999081] text-xs mb-3">
              Сохраняет все смены, подработки, отпуска и настройки в JSON файл на компьютер или телефон.
            </p>
            <button
              onClick={handleExport}
              className="w-full py-2 px-3 rounded-lg bg-[#deb887] hover:bg-[#ebd0a7] text-[#181715] font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Скачать файл бэкапа</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-[#24211d] border border-[#332f2a]">
            <h4 className="font-semibold text-[#ede7dc] mb-1 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#a3c2b4]" strokeWidth={1.5} />
              Восстановить из файла
            </h4>
            <p className="text-[#999081] text-xs mb-3">
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
              className="w-full py-2 px-3 rounded-lg bg-[#2b2722] hover:bg-[#36312a] border border-[#3d3730] text-[#ede7dc] font-medium text-xs transition flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Выбрать файл с устройства</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#2d2924] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#272420] hover:bg-[#332f2a] text-[#999081] hover:text-[#ede7dc] transition"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
