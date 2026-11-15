import React, { useState, useEffect } from 'react';
import type {
  Colleague,
  DayOverride,
  DayShiftInfo,
  ShiftType,
  UserScheduleConfig,
} from './types/schedule';
import {
  calculateMonthStatistics,
  decodeSharePayload,
  DEFAULT_CONFIG,
  formatDateISO,
  generateShareUrl,
  getMonthDays,
  loadInitialColleagues,
  loadInitialOverrides,
} from './utils/scheduleEngine';
import { Navbar } from './components/Navbar';
import { CalendarGrid } from './components/CalendarGrid';
import { MonthStats } from './components/MonthStats';
import { ColleaguesVacationsCard } from './components/ColleaguesVacationsCard';
import { DayModal } from './components/DayModal';
import { ShareModal } from './components/ShareModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportImportModal } from './components/ExportImportModal';

const CONFIG_STORAGE_KEY = 'smenograf_config_v1';
const OVERRIDES_STORAGE_KEY = 'smenograf_overrides_v1';
const COLLEAGUES_STORAGE_KEY = 'smenograf_colleagues_v1';

export const App: React.FC = () => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(() => {
    return today.getFullYear();
  });
  const [currentMonth, setCurrentMonth] = useState<number>(() => {
    return today.getMonth() + 1; // 1-12
  });

  const [config, setConfig] = useState<UserScheduleConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CONFIG;
  });

  const [overrides, setOverrides] = useState<Record<string, DayOverride>>(() => {
    try {
      const saved = localStorage.getItem(OVERRIDES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return loadInitialOverrides();
  });

  const [colleagues, setColleagues] = useState<Colleague[]>(() => {
    try {
      const saved = localStorage.getItem(COLLEAGUES_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return loadInitialColleagues();
  });

  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  const [selectedDayInfo, setSelectedDayInfo] = useState<{
    day: DayShiftInfo;
    rect: DOMRect;
  } | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isExportImportOpen, setIsExportImportOpen] = useState<boolean>(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('#share=')) {
      const sharedData = decodeSharePayload(hash);
      if (sharedData) {
        setIsReadOnly(true);
        if (sharedData.config) {
          setConfig((prev) => ({ ...prev, ...sharedData.config }));
        }
        if (sharedData.overrides) {
          setOverrides(sharedData.overrides);
        }
        if (sharedData.year) setCurrentYear(sharedData.year);
        if (sharedData.month) setCurrentMonth(sharedData.month);
      }
    }
  }, []);

  useEffect(() => {
    if (!isReadOnly) {
      try {
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
      } catch (e) {
        console.error(e);
      }
    }
  }, [config, isReadOnly]);

  useEffect(() => {
    if (!isReadOnly) {
      try {
        localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
      } catch (e) {
        console.error(e);
      }
    }
  }, [overrides, isReadOnly]);

  useEffect(() => {
    if (!isReadOnly) {
      try {
        localStorage.setItem(COLLEAGUES_STORAGE_KEY, JSON.stringify(colleagues));
      } catch (e) {
        console.error(e);
      }
    }
  }, [colleagues, isReadOnly]);

  const monthDays = getMonthDays(currentYear, currentMonth, config, overrides, colleagues);
  const monthStats = calculateMonthStatistics(monthDays, config);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
  };

  const handleSaveDay = (dateStr: string, status: ShiftType, note?: string) => {
    if (isReadOnly) return;
    setOverrides((prev) => ({
      ...prev,
      [dateStr]: {
        status,
        note,
      },
    }));
  };

  const handleResetDay = (dateStr: string) => {
    if (isReadOnly) return;
    setOverrides((prev) => {
      const updated = { ...prev };
      delete updated[dateStr];
      return updated;
    });
  };

  // Range Actions (Point 6)
  const handleApplyRange = (startStr: string, endStr: string, status: ShiftType) => {
    if (isReadOnly) return;
    const [minStr, maxStr] = startStr <= endStr ? [startStr, endStr] : [endStr, startStr];
    setOverrides((prev) => {
      const next = { ...prev };
      const [yA, mA, dA] = minStr.split('-').map(Number);
      const [yB, mB, dB] = maxStr.split('-').map(Number);
      const curr = new Date(Date.UTC(yA, mA - 1, dA));
      const end = new Date(Date.UTC(yB, mB - 1, dB));

      while (curr <= end) {
        const dStr = formatDateISO(
          curr.getUTCFullYear(),
          curr.getUTCMonth() + 1,
          curr.getUTCDate()
        );
        next[dStr] = { status };
        curr.setUTCDate(curr.getUTCDate() + 1);
      }
      return next;
    });
  };

  const handleResetRange = (startStr: string, endStr: string) => {
    if (isReadOnly) return;
    const [minStr, maxStr] = startStr <= endStr ? [startStr, endStr] : [endStr, startStr];
    setOverrides((prev) => {
      const next = { ...prev };
      const [yA, mA, dA] = minStr.split('-').map(Number);
      const [yB, mB, dB] = maxStr.split('-').map(Number);
      const curr = new Date(Date.UTC(yA, mA - 1, dA));
      const end = new Date(Date.UTC(yB, mB - 1, dB));

      while (curr <= end) {
        const dStr = formatDateISO(
          curr.getUTCFullYear(),
          curr.getUTCMonth() + 1,
          curr.getUTCDate()
        );
        delete next[dStr];
        curr.setUTCDate(curr.getUTCDate() + 1);
      }
      return next;
    });
  };

  const handleRestoreGoogleSheet = () => {
    const initial = loadInitialOverrides();
    setOverrides(initial);
  };

  const handleExitReadOnly = () => {
    window.location.hash = '';
    setIsReadOnly(false);
    try {
      const savedConfig = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (savedConfig) setConfig(JSON.parse(savedConfig));
      const savedOverrides = localStorage.getItem(OVERRIDES_STORAGE_KEY);
      if (savedOverrides) setOverrides(JSON.parse(savedOverrides));
      else setOverrides(loadInitialOverrides());
    } catch (e) {
      console.error(e);
    }
  };

  const shareUrl = generateShareUrl(config, overrides, currentYear, currentMonth);

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#252320] flex flex-col font-sans antialiased">
      <Navbar
        scheduleName={config.scheduleName}
        isReadOnly={isReadOnly}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onExportImport={() => setIsExportImportOpen(true)}
        onExitReadOnly={handleExitReadOnly}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Left Column: Calendar (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            <CalendarGrid
              year={currentYear}
              month={currentMonth}
              days={monthDays}
              isReadOnly={isReadOnly}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onSelectYear={setCurrentYear}
              onSelectMonth={setCurrentMonth}
              onJumpToday={handleJumpToday}
              onSelectDay={(day, rect) => setSelectedDayInfo({ day, rect })}
              onApplyRange={handleApplyRange}
              onResetRange={handleResetRange}
            />
          </div>

          {/* Right Column: Month Summary & Colleagues Vacations (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <MonthStats
              stats={monthStats}
              month={currentMonth}
              year={currentYear}
              config={config}
            />

            <ColleaguesVacationsCard
              colleagues={colleagues}
              currentYear={currentYear}
              currentMonth={currentMonth}
              isReadOnly={isReadOnly}
              onUpdateColleagues={setColleagues}
              onNavigateToPeriod={(y, m) => {
                setCurrentYear(y);
                setCurrentMonth(m);
              }}
            />

            <div className="text-center text-[11px] text-[#81796e]/70 py-1">
              Сменограф • График смен • ст. 112 и 153 ТК РФ
            </div>
          </div>
        </div>
      </main>

      <DayModal
        day={selectedDayInfo?.day || null}
        anchorRect={selectedDayInfo?.rect || null}
        isOpen={!!selectedDayInfo}
        isReadOnly={isReadOnly}
        onClose={() => setSelectedDayInfo(null)}
        onSave={handleSaveDay}
        onReset={handleResetDay}
        onSetAnchorDate={(dateStr) => {
          if (isReadOnly) return;
          setConfig((prev) => ({
            ...prev,
            anchorDate: dateStr,
          }));
        }}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={config}
        onSaveConfig={setConfig}
        onRestoreGoogleSheetData={handleRestoreGoogleSheet}
      />

      <ExportImportModal
        isOpen={isExportImportOpen}
        onClose={() => setIsExportImportOpen(false)}
        config={config}
        overrides={overrides}
        colleagues={colleagues}
        onImportData={({ config: newCfg, overrides: newOvr, colleagues: newColleagues }) => {
          setConfig(newCfg);
          setOverrides(newOvr);
          if (newColleagues) setColleagues(newColleagues);
        }}
      />
    </div>
  );
};

export default App;
