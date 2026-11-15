export type ShiftType = 'work' | 'off' | 'overtime' | 'vacation';

export interface ShiftDefinition {
  type: ShiftType;
  label: string;
  shortLabel: string;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  badgeBg: string;
  dotColor: string;
}

export const SHIFT_DEFINITIONS: Record<ShiftType, ShiftDefinition> = {
  work: {
    type: 'work',
    label: 'Смена (20:00 — 08:00)',
    shortLabel: 'Смена',
    colorBg: 'bg-slate-900/90 hover:bg-slate-850',
    colorBorder: 'border-indigo-500/30',
    colorText: 'text-indigo-300',
    badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    dotColor: 'bg-indigo-400',
  },
  off: {
    type: 'off',
    label: 'Выходной',
    shortLabel: 'Вых',
    colorBg: 'bg-slate-900/40 hover:bg-slate-850/50',
    colorBorder: 'border-slate-800/80',
    colorText: 'text-slate-400',
    badgeBg: 'bg-slate-800/40 text-slate-400 border-slate-700/40',
    dotColor: 'bg-slate-600',
  },
  overtime: {
    type: 'overtime',
    label: 'Подработка (20:00 — 08:00)',
    shortLabel: 'Подр',
    colorBg: 'bg-slate-900/90 hover:bg-slate-850',
    colorBorder: 'border-amber-500/40',
    colorText: 'text-amber-300',
    badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    dotColor: 'bg-amber-400',
  },
  vacation: {
    type: 'vacation',
    label: 'Отпуск',
    shortLabel: 'Отп',
    colorBg: 'bg-slate-900/90 hover:bg-slate-850',
    colorBorder: 'border-emerald-500/30',
    colorText: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    dotColor: 'bg-emerald-400',
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
