export type ShiftType = 'work' | 'off' | 'overtime' | 'vacation';

export interface ShiftDefinition {
  type: ShiftType;
  label: string;
  shortLabel: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
}

export const SHIFT_DEFINITIONS: Record<ShiftType, ShiftDefinition> = {
  work: {
    type: 'work',
    label: 'Работа (в ночь)',
    shortLabel: 'Смена',
    colorBg: 'bg-indigo-950/60 hover:bg-indigo-900/70',
    colorBorder: 'border-indigo-500/50',
    colorText: 'text-indigo-200',
    icon: 'Moon',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    badgeText: 'Смена 20:00',
  },
  off: {
    type: 'off',
    label: 'Выходной',
    shortLabel: 'Вых',
    colorBg: 'bg-slate-800/40 hover:bg-slate-800/70',
    colorBorder: 'border-slate-700/40',
    colorText: 'text-slate-400',
    icon: 'Coffee',
    badgeBg: 'bg-slate-700/30 text-slate-400 border-slate-600/30',
    badgeText: 'Выходной',
  },
  overtime: {
    type: 'overtime',
    label: 'Подработка (в ночь)',
    shortLabel: 'Подр',
    colorBg: 'bg-amber-950/60 hover:bg-amber-900/70',
    colorBorder: 'border-amber-500/50',
    colorText: 'text-amber-200',
    icon: 'Zap',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    badgeText: 'Подработка',
  },
  vacation: {
    type: 'vacation',
    label: 'Отпуск',
    shortLabel: 'Отп',
    colorBg: 'bg-emerald-950/60 hover:bg-emerald-900/70',
    colorBorder: 'border-emerald-500/50',
    colorText: 'text-emerald-200',
    icon: 'Palmtree',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    badgeText: 'Отпуск',
  },
};

export interface DayOverride {
  status: ShiftType;
  note?: string;
}

export interface UserScheduleConfig {
  scheduleName: string;
  anchorDate: string; // '2025-11-02'
  cycle: ShiftType[]; // ['work', 'work', 'off', 'off']
  shiftStartTime: string; // '20:00'
  shiftEndTime: string; // '08:00'
  shiftDurationHours: number; // 12
  nightHoursPerShift: number; // 8 (22:00 - 06:00)
  hourlyRate?: number;
  shiftRate?: number;
}

export interface DayShiftInfo {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  dayOfWeek: number; // 1 (Пн) .. 7 (Вс)
  dayOfWeekName: string; // 'Пн', 'Вт'...
  status: ShiftType;
  isOverridden: boolean;
  isHoliday: boolean;
  isDoublePay: boolean;
  holidayName?: string;
  note?: string;
  isToday: boolean;
}

export interface MonthStatistics {
  workDaysCount: number;
  overtimeDaysCount: number;
  totalNightShifts: number;
  doublePayShiftsCount: number;
  vacationDaysCount: number;
  offDaysCount: number;
  estimatedHours: number;
  estimatedNightHours: number;
  estimatedPay?: number;
}
