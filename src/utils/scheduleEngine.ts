import type {
  Colleague,
  ColleagueVacationOccurrence,
  DayOverride,
  DayShiftInfo,
  MonthStatistics,
  ShiftType,
  UserScheduleConfig,
  YearStatistics,
} from '../types/schedule';
import { getRussianHolidayInfo } from '../data/holidays';
import initialScheduleData from '../data/initialSchedule.json';
import LZString from 'lz-string';

export const RUSSIAN_MONTH_NAMES = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const RUSSIAN_DAY_OF_WEEK_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const DEFAULT_CONFIG: UserScheduleConfig = {
  scheduleName: 'Мой график (2/2 в ночь)',
  anchorDate: '2025-11-02',
  cycle: ['work', 'work', 'off', 'off'],
  shiftStartTime: '20:00',
  shiftEndTime: '08:00',
  shiftDurationHours: 12,
  nightHoursPerShift: 8,
  shiftRate: 0,
};

export function formatDateISO(year: number, month: number, day: number): string {
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function getTodayISO(): string {
  const now = new Date();
  return formatDateISO(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function daysBetween(dateStrA: string, dateStrB: string): number {
  const [yA, mA, dA] = dateStrA.split('-').map(Number);
  const [yB, mB, dB] = dateStrB.split('-').map(Number);
  const utcA = Date.UTC(yA, mA - 1, dA);
  const utcB = Date.UTC(yB, mB - 1, dB);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((utcB - utcA) / MS_PER_DAY);
}

export function addDaysToDate(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days - 1); // inclusive end date
  const resY = dt.getUTCFullYear();
  const resM = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const resD = String(dt.getUTCDate()).padStart(2, '0');
  return `${resY}-${resM}-${resD}`;
}

export function getColleagueVacationsForDate(
  dateStr: string,
  colleagues: Colleague[]
): ColleagueVacationOccurrence[] {
  const occurrences: ColleagueVacationOccurrence[] = [];

  for (const colleague of colleagues) {
    if (colleague.isSelf) continue; // User's own vacations are rendered in primary cells
    for (const vac of colleague.vacations) {
      if (dateStr >= vac.startDate && dateStr <= vac.endDate) {
        const dayIdx = daysBetween(vac.startDate, dateStr) + 1;
        occurrences.push({
          colleagueId: colleague.id,
          colleagueName: colleague.name,
          vacationId: vac.id,
          startDate: vac.startDate,
          endDate: vac.endDate,
          dayIndex: dayIdx,
          totalDays: vac.daysCount,
          colorTheme: colleague.colorTheme || (colleague.id === 'lekha' ? 'orange' : 'blue'),
        });
      }
    }
  }

  return occurrences;
}

export function loadInitialColleagues(): Colleague[] {
  return [
    {
      id: 'self',
      name: 'Я',
      role: 'Мой график',
      isSelf: true,
      colorTheme: 'amber',
      vacations: [
        {
          id: 'self-vac-2026-1',
          startDate: '2026-08-13',
          daysCount: 14,
          endDate: '2026-08-26',
          note: 'Летний отпуск',
        },
        {
          id: 'self-vac-2026-2',
          startDate: '2026-11-05',
          daysCount: 14,
          endDate: '2026-11-18',
          note: 'Осенний отпуск',
        },
        {
          id: 'self-vac-2027-1',
          startDate: '2027-05-16',
          daysCount: 14,
          endDate: '2027-05-29',
          note: 'Весенний отпуск',
        },
        {
          id: 'self-vac-2027-2',
          startDate: '2027-11-08',
          daysCount: 14,
          endDate: '2027-11-21',
          note: 'Осенний отпуск',
        },
      ],
    },
    {
      id: 'max',
      name: 'Макс',
      role: 'Напарник',
      colorTheme: 'blue',
      vacations: [
        {
          id: 'max-vac-2026-1',
          startDate: '2026-03-18',
          daysCount: 7,
          endDate: addDaysToDate('2026-03-18', 7),
          note: 'Весенний отпуск',
        },
        {
          id: 'max-vac-2026-2',
          startDate: '2026-07-04',
          daysCount: 23,
          endDate: addDaysToDate('2026-07-04', 23),
          note: 'Основной летний отпуск',
        },
        {
          id: 'max-vac-2026-3',
          startDate: '2026-10-04',
          daysCount: 7,
          endDate: addDaysToDate('2026-10-04', 7),
          note: 'Осенний отпуск',
        },
        {
          id: 'max-vac-1',
          startDate: '2027-03-17',
          daysCount: 7,
          endDate: addDaysToDate('2027-03-17', 7),
          note: 'Весенний отпуск',
        },
        {
          id: 'max-vac-2',
          startDate: '2027-06-01',
          daysCount: 23,
          endDate: addDaysToDate('2027-06-01', 23),
          note: 'Основной летний отпуск',
        },
        {
          id: 'max-vac-3',
          startDate: '2027-10-03',
          daysCount: 7,
          endDate: addDaysToDate('2027-10-03', 7),
          note: 'Осенний отпуск',
        },
      ],
    },
    {
      id: 'lekha',
      name: 'Лёха',
      role: 'Напарник',
      colorTheme: 'orange',
      vacations: [
        {
          id: 'lekha-vac-1',
          startDate: '2027-01-11',
          daysCount: 14,
          endDate: addDaysToDate('2027-01-11', 14),
          note: 'Зимний отпуск',
        },
        {
          id: 'lekha-vac-2',
          startDate: '2027-07-23',
          daysCount: 14,
          endDate: addDaysToDate('2027-07-23', 14),
          note: 'Летний отпуск',
        },
      ],
    },
  ];
}

export function getBaseCycleShift(dateStr: string, config: UserScheduleConfig): ShiftType {
  const diff = daysBetween(config.anchorDate, dateStr);
  const cycleLen = config.cycle.length;
  const mod = ((diff % cycleLen) + cycleLen) % cycleLen;
  return config.cycle[mod];
}

export function getMonthDays(
  year: number,
  month: number, // 1-12
  config: UserScheduleConfig,
  overrides: Record<string, DayOverride>,
  colleagues?: Colleague[]
): DayShiftInfo[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = getTodayISO();
  const days: DayShiftInfo[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateISO(year, month, d);
    const dayOfWeekIndex = new Date(year, month - 1, d).getDay();
    const dayOfWeek = dayOfWeekIndex === 0 ? 7 : dayOfWeekIndex;
    const dayOfWeekName = RUSSIAN_DAY_OF_WEEK_SHORT[dayOfWeek - 1];

    const holidayInfo = getRussianHolidayInfo(dateStr);
    const override = overrides[dateStr];
    const isOverridden = !!override;
    const baseStatus = getBaseCycleShift(dateStr, config);
    const status: ShiftType = override ? override.status : baseStatus;
    const isPast = dateStr < todayStr;
    const isToday = dateStr === todayStr;

    // Подработка в выходной день или смена в официальный праздник РФ оплачиваются в двойном размере (ст. 153 ТК РФ)
    const isDoublePay = status === 'overtime' || (holidayInfo.isDoublePayEligible && status === 'work');
    const colleagueVacations = colleagues ? getColleagueVacationsForDate(dateStr, colleagues) : undefined;

    days.push({
      dateStr,
      dayNumber: d,
      dayOfWeek,
      dayOfWeekName,
      status,
      baseStatus,
      isOverridden,
      isHoliday: holidayInfo.isHoliday,
      isDoublePay,
      holidayName: holidayInfo.name,
      holidayFullName: holidayInfo.fullName,
      holidayDescription: holidayInfo.description,
      holidayCategory: holidayInfo.category,
      note: override?.note,
      isToday,
      isPast,
      colleagueVacations,
    });
  }

  return days;
}

export function calculateMonthStatistics(
  days: DayShiftInfo[],
  config: UserScheduleConfig
): MonthStatistics {
  let workDaysCount = 0;
  let overtimeDaysCount = 0;
  let doublePayShiftsCount = 0;
  let vacationDaysCount = 0;
  let offDaysCount = 0;

  for (const day of days) {
    if (day.status === 'work') workDaysCount++;
    else if (day.status === 'overtime') overtimeDaysCount++;
    else if (day.status === 'vacation') vacationDaysCount++;
    else if (day.status === 'off') offDaysCount++;

    if (day.isDoublePay) {
      doublePayShiftsCount++;
    }
  }

  const totalNightShifts = workDaysCount + overtimeDaysCount;
  const estimatedHours = totalNightShifts * config.shiftDurationHours;
  const estimatedNightHours = totalNightShifts * config.nightHoursPerShift;

  let estimatedPay: number | undefined = undefined;
  if (config.shiftRate && config.shiftRate > 0) {
    estimatedPay = (totalNightShifts * config.shiftRate) + (doublePayShiftsCount * config.shiftRate);
  } else if (config.hourlyRate && config.hourlyRate > 0) {
    const regularPay = estimatedHours * config.hourlyRate;
    const nightSurcharge = estimatedNightHours * (config.hourlyRate * 0.2);
    const doublePayBonus = doublePayShiftsCount * config.shiftDurationHours * config.hourlyRate;
    estimatedPay = regularPay + nightSurcharge + doublePayBonus;
  }

  return {
    workDaysCount,
    overtimeDaysCount,
    totalNightShifts,
    doublePayShiftsCount,
    vacationDaysCount,
    offDaysCount,
    estimatedHours,
    estimatedNightHours,
    estimatedPay,
  };
}

export interface YearMonthData {
  month: number; // 1-12
  monthName: string;
  days: DayShiftInfo[];
  stats: MonthStatistics;
}

export function getYearMonthsData(
  year: number,
  config: UserScheduleConfig,
  overrides: Record<string, DayOverride>,
  colleagues?: Colleague[]
): YearMonthData[] {
  const months: YearMonthData[] = [];
  for (let m = 1; m <= 12; m++) {
    const days = getMonthDays(year, m, config, overrides, colleagues);
    const stats = calculateMonthStatistics(days, config);
    months.push({
      month: m,
      monthName: RUSSIAN_MONTH_NAMES[m - 1],
      days,
      stats,
    });
  }
  return months;
}

export function calculateYearStatistics(
  monthsData: YearMonthData[],
  config: UserScheduleConfig
): YearStatistics {
  let workDaysCount = 0;
  let overtimeDaysCount = 0;
  let doublePayShiftsCount = 0;
  let vacationDaysCount = 0;
  let offDaysCount = 0;

  for (const m of monthsData) {
    workDaysCount += m.stats.workDaysCount;
    overtimeDaysCount += m.stats.overtimeDaysCount;
    doublePayShiftsCount += m.stats.doublePayShiftsCount;
    vacationDaysCount += m.stats.vacationDaysCount;
    offDaysCount += m.stats.offDaysCount;
  }

  const totalNightShifts = workDaysCount + overtimeDaysCount;
  const estimatedHours = totalNightShifts * config.shiftDurationHours;
  const estimatedNightHours = totalNightShifts * config.nightHoursPerShift;

  let estimatedPay: number | undefined = undefined;
  if (config.shiftRate && config.shiftRate > 0) {
    estimatedPay = (totalNightShifts * config.shiftRate) + (doublePayShiftsCount * config.shiftRate);
  } else if (config.hourlyRate && config.hourlyRate > 0) {
    const regularPay = estimatedHours * config.hourlyRate;
    const nightSurcharge = estimatedNightHours * (config.hourlyRate * 0.2);
    const doublePayBonus = doublePayShiftsCount * config.shiftDurationHours * config.hourlyRate;
    estimatedPay = regularPay + nightSurcharge + doublePayBonus;
  }

  return {
    workDaysCount,
    overtimeDaysCount,
    totalNightShifts,
    doublePayShiftsCount,
    vacationDaysCount,
    offDaysCount,
    estimatedHours,
    estimatedNightHours,
    estimatedPay,
  };
}

export function loadInitialOverrides(): Record<string, DayOverride> {
  const result: Record<string, DayOverride> = {};
  const rawData = initialScheduleData as Record<string, { status: ShiftType; rawStatus: string; dow: string }>;

  for (const [dateStr, info] of Object.entries(rawData)) {
    result[dateStr] = {
      status: info.status,
    };
  }

  // Pre-fill user's planned 2027 vacations (16-29 мая and 8-21 ноября) as dynamic overrides
  const addRange = (startStr: string, count: number, status: ShiftType, note?: string) => {
    const [y, m, d] = startStr.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    for (let i = 0; i < count; i++) {
      const curY = dt.getUTCFullYear();
      const curM = String(dt.getUTCMonth() + 1).padStart(2, '0');
      const curD = String(dt.getUTCDate()).padStart(2, '0');
      result[`${curY}-${curM}-${curD}`] = { status, note };
      dt.setUTCDate(dt.getUTCDate() + 1);
    }
  };

  addRange('2027-05-16', 14, 'vacation', 'Весенний отпуск');
  addRange('2027-11-08', 14, 'vacation', 'Осенний отпуск');

  return result;
}

export function generateShareUrl(
  config: UserScheduleConfig,
  overrides: Record<string, DayOverride>,
  currentYear: number,
  currentMonth: number
): string {
  const payload = {
    c: {
      n: config.scheduleName,
      a: config.anchorDate,
      cy: config.cycle,
      st: config.shiftStartTime,
      et: config.shiftEndTime,
    },
    o: overrides,
    y: currentYear,
    m: currentMonth,
  };

  const jsonStr = JSON.stringify(payload);
  const compressed = LZString.compressToEncodedURIComponent(jsonStr);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#share=${compressed}`;
}

export function decodeSharePayload(hashStr: string): {
  config: Partial<UserScheduleConfig>;
  overrides: Record<string, DayOverride>;
  year?: number;
  month?: number;
} | null {
  try {
    const match = hashStr.match(/#share=([^&]+)/);
    if (!match) return null;
    const compressed = match[1];
    const decompressed = LZString.decompressFromEncodedURIComponent(compressed);
    if (!decompressed) return null;
    const parsed = JSON.parse(decompressed);

    return {
      config: {
        scheduleName: parsed.c?.n || 'Поделились графиком',
        anchorDate: parsed.c?.a || DEFAULT_CONFIG.anchorDate,
        cycle: parsed.c?.cy || DEFAULT_CONFIG.cycle,
        shiftStartTime: parsed.c?.st || '20:00',
        shiftEndTime: parsed.c?.et || '08:00',
      },
      overrides: parsed.o || {},
      year: parsed.y,
      month: parsed.m,
    };
  } catch (err) {
    console.error('Ошибка расшифровки ссылки:', err);
    return null;
  }
}

/**
 * Склонение существительных и прилагательных по правилам русского языка
 * @example pluralize(1, 'смена', 'смены', 'смен') => 'смена'
 * @example pluralize(2, 'двойная', 'двойные', 'двойных') => 'двойные'
 * @example pluralize(5, 'двойная', 'двойные', 'двойных') => 'двойных'
 */
export function pluralize(count: number, one: string, two: string, five: string): string {
  const abs = Math.abs(count);
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 19) {
    return five;
  }
  if (mod10 === 1) {
    return one;
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return two;
  }
  return five;
}
