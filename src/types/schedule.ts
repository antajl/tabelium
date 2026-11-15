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
    colorBg: 'bg-white hover:bg-[#f2f6f8]',
    colorBorder: 'border-[#d6e2e9]',
    colorText: 'text-[#333f4b]',
    badgeBg: 'bg-[#e2ebf0] text-[#333f4b] border-[#c8d9e3]',
    dotColor: 'bg-[#55738a]',
  },
  off: {
    type: 'off',
    label: 'Выходной',
    shortLabel: 'Вых',
    colorBg: 'bg-[#fcfaf7] hover:bg-[#f7f2ea]',
    colorBorder: 'border-[#e7ddcf]',
    colorText: 'text-[#81796e]',
    badgeBg: 'bg-[#eee5d6]/50 text-[#81796e] border-[#e7ddcf]',
    dotColor: 'bg-[#bcb7ad]',
  },
  overtime: {
    type: 'overtime',
    label: 'Подработка (20:00)',
    shortLabel: 'Подр',
    colorBg: 'bg-[#fffdf9] hover:bg-[#faf6f0]',
    colorBorder: 'border-[#d8b57a]',
    colorText: 'text-[#7b511c]',
    badgeBg: 'bg-[#f3e7d5] text-[#2a1c0a] border-[#d8b57a]',
    dotColor: 'bg-[#b68231]',
  },
  vacation: {
    type: 'vacation',
    label: 'Отпуск',
    shortLabel: 'Отпуск',
    colorBg: 'bg-[#fcfdfc] hover:bg-[#f0f5f0]',
    colorBorder: 'border-[#c8dcc9]',
    colorText: 'text-[#354a38]',
    badgeBg: 'bg-[#e3ede3] text-[#354a38] border-[#c8dcc9]',
    dotColor: 'bg-[#557658]',
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
