import React, { useState, useEffect } from 'react';
import type {
  DayOverride,
  DayShiftInfo,
  ShiftType,
  UserScheduleConfig,
} from './types/schedule';
import {
  calculateMonthStatistics,
  decodeSharePayload,
  DEFAULT_CONFIG,
  generateShareUrl,
  getMonthDays,
  loadInitialOverrides,
} from './utils/scheduleEngine';
import { Navbar } from './components/Navbar';
import { LegendBar } from './components/LegendBar';
import { CalendarGrid } from './components/CalendarGrid';
import { MonthStats } from './components/MonthStats';
import { DayModal } from './components/DayModal';
import { ShareModal } from './components/ShareModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportImportModal } from './components/ExportImportModal';

const CONFIG_STORAGE_KEY = 'smenograf_config_v1';
const OVERRIDES_STORAGE_KEY = 'smenograf_overrides_v1';

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

  const [isReadOnly, setIsReadOnly] = useState<boolean>(false);

  const [selectedDay, setSelectedDay] = useState<DayShiftInfo | null>(null);
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

  const monthDays = getMonthDays(currentYear, currentMonth, config, overrides);
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Navbar
        scheduleName={config.scheduleName}
        isReadOnly={isReadOnly}
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onExportImport={() => setIsExportImportOpen(true)}
        onExitReadOnly={handleExitReadOnly}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 space-y-4">
        <LegendBar />

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
          onSelectDay={(day) => setSelectedDay(day)}
        />

        <MonthStats
          stats={monthStats}
          month={currentMonth}
          year={currentYear}
          config={config}
        />
      </main>

      <footer className="py-5 border-t border-slate-900 text-center text-xs text-slate-500">
        <p>Сменограф • График 2/2 в ночь • ст. 112 и 153 ТК РФ</p>
      </footer>

      <DayModal
        day={selectedDay}
        isOpen={!!selectedDay}
        isReadOnly={isReadOnly}
        onClose={() => setSelectedDay(null)}
        onSave={handleSaveDay}
        onReset={handleResetDay}
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
        onImportData={({ config: newCfg, overrides: newOvr }) => {
          setConfig(newCfg);
          setOverrides(newOvr);
        }}
      />
    </div>
  );
};

export default App;
