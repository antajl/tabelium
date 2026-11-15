import React, { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import type {
  Colleague,
  DayOverride,
  DayShiftInfo,
  ShiftType,
  UserScheduleConfig,
  YearLayoutMode,
} from './types/schedule';
import {
  addDaysToDate,
  calculateMonthStatistics,
  decodeSharePayload,
  DEFAULT_CONFIG,
  formatDateISO,
  generateShareUrl,
  getMonthDays,
  loadInitialColleagues,
  loadInitialOverrides,
} from './utils/scheduleEngine';
import { CalendarGrid } from './components/CalendarGrid';
import { MonthStats } from './components/MonthStats';
import { ColleaguesVacationsCard } from './components/ColleaguesVacationsCard';
import { YearView } from './components/YearView';
import { DayModal } from './components/DayModal';
import { ShareModal } from './components/ShareModal';
import { SettingsModal } from './components/SettingsModal';
import { ExportImportModal } from './components/ExportImportModal';

const CONFIG_STORAGE_KEY = 'smenograf_config_v1';
const OVERRIDES_STORAGE_KEY = 'smenograf_overrides_v1';
const COLLEAGUES_STORAGE_KEY = 'smenograf_colleagues_v1';

function parseRoute(
  pathname: string,
  search: string
): { view: 'month' | 'year'; year: number; month: number } {
  const now = new Date();
  const defaultYear = now.getFullYear();
  const defaultMonth = now.getMonth() + 1;

  if (typeof window === 'undefined') {
    return { view: 'year', year: defaultYear, month: defaultMonth };
  }

  // 1. Path-based routing: /YYYY or /YYYY/MM (e.g. /2025, /2026, /2026/10, /2026/05, /2026/5)
  // Strip optional base path prefix (e.g. /tabelium/)
  const basePath = (import.meta.env.BASE_URL || '/').replace(/^\/+|\/+$/g, '');
  let cleanPath = pathname.replace(/^\/+|\/+$/g, '');
  if (basePath && (cleanPath === basePath || cleanPath.startsWith(basePath + '/'))) {
    cleanPath = cleanPath.slice(basePath.length).replace(/^\/+|\/+$/g, '');
  }

  if (cleanPath) {
    const parts = cleanPath.split('/');
    // Format /YYYY
    if (parts.length === 1 && /^\d{4}$/.test(parts[0])) {
      const year = parseInt(parts[0], 10);
      if (year >= 1970 && year <= 2100) {
        return { view: 'year', year, month: defaultMonth };
      }
    }
    // Format /YYYY/MM
    if (parts.length === 2 && /^\d{4}$/.test(parts[0]) && /^\d{1,2}$/.test(parts[1])) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      if (year >= 1970 && year <= 2100 && month >= 1 && month <= 12) {
        return { view: 'month', year, month };
      }
    }
  }

  // 2. Backward compatibility fallback for legacy query strings ?year=YYYY&month=M
  if (search) {
    const params = new URLSearchParams(search);
    const yearParam = params.get('year');
    const monthParam = params.get('month');
    const viewParam = params.get('view');

    const year = yearParam ? parseInt(yearParam, 10) || defaultYear : defaultYear;
    const month = monthParam
      ? Math.min(12, Math.max(1, parseInt(monthParam, 10) || defaultMonth))
      : defaultMonth;
    const view: 'month' | 'year' = monthParam
      ? 'month'
      : viewParam === 'month'
      ? 'month'
      : 'year';

    return { view, year, month };
  }

  return { view: 'year', year: defaultYear, month: defaultMonth };
}

function formatRouteUrl(view: 'month' | 'year', year: number, month: number): string {
  const rawBase = (import.meta.env.BASE_URL || '/').replace(/^\/+|\/+$/g, '');
  const prefix = rawBase ? `/${rawBase}` : '';
  if (view === 'month') {
    const mStr = String(month).padStart(2, '0');
    return `${prefix}/${year}/${mStr}`;
  }
  return `${prefix}/${year}`;
}

function updateBrowserUrl(
  view: 'month' | 'year',
  year: number,
  month: number,
  replace = false
) {
  if (typeof window === 'undefined') return;
  const targetPath = formatRouteUrl(view, year, month);
  const targetUrl = targetPath + window.location.hash;

  const currentPathWithHash = window.location.pathname + window.location.hash;
  if (currentPathWithHash === targetUrl && !window.location.search) {
    return;
  }

  const stateObj = { view, year, month };
  if (replace) {
    window.history.replaceState(stateObj, '', targetUrl);
  } else {
    window.history.pushState(stateObj, '', targetUrl);
  }
}

function startMorphTransition(updateCallback: () => void) {
  if (typeof document !== 'undefined' && 'startViewTransition' in document) {
    (document as any).startViewTransition(() => {
      flushSync(() => {
        updateCallback();
      });
    });
  } else {
    updateCallback();
  }
}

export const App: React.FC = () => {
  const initialRoute = useRef(
    parseRoute(
      typeof window !== 'undefined' ? window.location.pathname : '',
      typeof window !== 'undefined' ? window.location.search : ''
    )
  ).current;
  const [currentYear, setCurrentYear] = useState<number>(initialRoute.year);
  const [currentMonth, setCurrentMonth] = useState<number>(initialRoute.month);
  const [viewMode, setViewMode] = useState<'month' | 'year'>(initialRoute.view);
  const [activeTransitionMonth, setActiveTransitionMonth] = useState<number>(initialRoute.month);
  const [yearLayout] = useState<YearLayoutMode>('fit-screen');

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
    const defaultList = loadInitialColleagues();
    try {
      const saved = localStorage.getItem(COLLEAGUES_STORAGE_KEY);
      if (saved) {
        const parsed: Colleague[] = JSON.parse(saved);
        const merged = defaultList.map((def) => {
          const existing = parsed.find((p) => p.id === def.id || (def.isSelf && p.isSelf));
          if (!existing) return def;
          const existingVacIds = new Set(existing.vacations.map((v) => v.id));
          const newVacs = def.vacations.filter((v) => !existingVacIds.has(v.id));
          let colorTheme = existing.colorTheme || def.colorTheme;
          let role = existing.role || def.role;
          if (existing.id === 'lekha' && existing.colorTheme === 'purple') {
            colorTheme = 'emerald';
          }
          if (existing.id === 'lekha' && existing.role === 'Коллега') {
            role = 'Напарник';
          }
          return {
            ...existing,
            role,
            colorTheme,
            vacations: [...existing.vacations, ...newVacs].sort((a, b) =>
              a.startDate.localeCompare(b.startDate)
            ),
          };
        });
        const defaultIds = new Set(defaultList.map((d) => d.id));
        const customColleagues = parsed.filter(
          (p) => !defaultIds.has(p.id) && !p.isSelf && p.id !== 'self'
        );
        return [...merged, ...customColleagues];
      }
    } catch (e) {
      console.error(e);
    }
    return defaultList;
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
    updateBrowserUrl(viewMode, currentYear, currentMonth, true);

    const handlePopState = () => {
      const route = parseRoute(window.location.pathname, window.location.search);
      setActiveTransitionMonth(route.month);
      startMorphTransition(() => {
        setCurrentYear(route.year);
        setCurrentMonth(route.month);
        setViewMode(route.view);
      });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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

  const handleOpenMonthFromYear = (month: number) => {
    setActiveTransitionMonth(month);
    updateBrowserUrl('month', currentYear, month, false);
    startMorphTransition(() => {
      setCurrentMonth(month);
      setViewMode('month');
    });
  };

  const handleBackToYear = () => {
    setActiveTransitionMonth(currentMonth);
    updateBrowserUrl('year', currentYear, currentMonth, false);
    startMorphTransition(() => {
      setViewMode('year');
    });
  };

  const handleSelectYear = (newYear: number) => {
    setCurrentYear(newYear);
    updateBrowserUrl(viewMode, newYear, currentMonth, false);
  };

  const handleSelectMonth = (newMonth: number) => {
    setCurrentMonth(newMonth);
    setActiveTransitionMonth(newMonth);
    updateBrowserUrl('month', currentYear, newMonth, false);
  };

  const handlePrevMonth = () => {
    let newM = currentMonth - 1;
    let newY = currentYear;
    if (newM === 0) {
      newM = 12;
      newY = currentYear - 1;
    }
    setCurrentMonth(newM);
    setCurrentYear(newY);
    setActiveTransitionMonth(newM);
    updateBrowserUrl('month', newY, newM, false);
  };

  const handleNextMonth = () => {
    let newM = currentMonth + 1;
    let newY = currentYear;
    if (newM === 13) {
      newM = 1;
      newY = currentYear + 1;
    }
    setCurrentMonth(newM);
    setCurrentYear(newY);
    setActiveTransitionMonth(newM);
    updateBrowserUrl('month', newY, newM, false);
  };

  const handleJumpToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    setCurrentYear(y);
    setCurrentMonth(m);
    setActiveTransitionMonth(m);
    updateBrowserUrl(viewMode, y, m, false);
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

  const handleAddUserVacationOverride = (startDate: string, daysCount: number) => {
    const endDate = addDaysToDate(startDate, daysCount);
    handleApplyRange(startDate, endDate, 'vacation');
  };

  const handleDeleteUserVacationOverride = (startDate: string, daysCount: number) => {
    const endDate = addDaysToDate(startDate, daysCount);
    handleResetRange(startDate, endDate);
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
    <div
      className={`bg-[#faf8f4] text-[#252320] flex flex-col font-sans antialiased min-h-screen ${
        viewMode === 'year'
          ? 'overflow-y-auto xl:h-screen xl:overflow-hidden'
          : ''
      }`}
    >
      <main
        className={`flex-1 max-w-[1700px] w-full mx-auto px-2 sm:px-4 lg:px-6 ${
          viewMode === 'year'
            ? 'p-1.5 sm:p-2.5 flex flex-col xl:h-full'
            : 'p-3 sm:py-4'
        }`}
      >
        {viewMode === 'month' ? (
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
                onSelectYear={handleSelectYear}
                onSelectMonth={handleSelectMonth}
                onJumpToday={handleJumpToday}
                onSelectDay={(day, rect) => setSelectedDayInfo({ day, rect })}
                onBackToYear={handleBackToYear}
                onApplyRange={handleApplyRange}
                onResetRange={handleResetRange}
                onOpenShare={() => setIsShareModalOpen(true)}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
                onExportImport={() => setIsExportImportOpen(true)}
                onExitReadOnly={handleExitReadOnly}
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
                  handleSelectYear(y);
                  handleSelectMonth(m);
                }}
                onAddUserVacationOverride={handleAddUserVacationOverride}
                onDeleteUserVacationOverride={handleDeleteUserVacationOverride}
              />

              <div className="text-center text-[11px] text-[#81796e]/70 py-1">
                Табелиум • График смен • ст. 112 и 153 ТК РФ
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 min-h-0 h-full flex flex-col">
            <YearView
              year={currentYear}
              config={config}
              overrides={overrides}
              colleagues={colleagues}
              isReadOnly={isReadOnly}
              layoutMode={yearLayout}
              activeTransitionMonth={activeTransitionMonth}
              onSelectYear={handleSelectYear}
              onJumpToday={handleJumpToday}
              onOpenMonth={handleOpenMonthFromYear}
              onSelectDay={(day, rect) => setSelectedDayInfo({ day, rect })}
              onOpenShare={() => setIsShareModalOpen(true)}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onExportImport={() => setIsExportImportOpen(true)}
              onExitReadOnly={handleExitReadOnly}
            />
          </div>
        )}
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
