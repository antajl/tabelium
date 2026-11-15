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
    label: 'Работа',
    shortLabel: 'Работа',
    colorBg: 'bg-[#fdeeed] hover:bg-[#fbdcd9]',
    colorBorder: 'border-[#f5b8b2]',
    colorText: 'text-[#93231c]',
    badgeBg: 'bg-[#fad9d5] text-[#93231c] border-[#f5b8b2]',
    dotColor: 'bg-[#d32f2f]',
  },
  off: {
    type: 'off',
    label: 'Выходной',
    shortLabel: 'Вых',
    colorBg: 'bg-[#eaf5ec] hover:bg-[#ddf0e0]',
    colorBorder: 'border-[#b8deb9]',
    colorText: 'text-[#215128]',
    badgeBg: 'bg-[#daf0dd] text-[#215128] border-[#b8deb9]',
    dotColor: 'bg-[#2e7d32]',
  },
  overtime: {
    type: 'overtime',
    label: 'Подработка',
    shortLabel: 'Подр.',
    colorBg: 'bg-[#fbdcd9] hover:bg-[#f8c8c3]',
    colorBorder: 'border-[#e57373] border-dashed',
    colorText: 'text-[#7f1d1d]',
    badgeBg: 'bg-[#f8c8c3] text-[#7f1d1d] border-[#e57373]',
    dotColor: 'bg-[#b71c1c]',
  },
  vacation: {
    type: 'vacation',
    label: 'Отпуск',
    shortLabel: 'Отпуск',
    colorBg: 'bg-[#fef7db] hover:bg-[#fdefbd]',
    colorBorder: 'border-[#f6dc84]',
    colorText: 'text-[#7d5600]',
    badgeBg: 'bg-[#faeead] text-[#7d5600] border-[#f6dc84]',
    dotColor: 'bg-[#e5a100]',
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
  baseStatus: ShiftType;
  isOverridden: boolean;
  isHoliday: boolean;
  isDoublePay: boolean;
  holidayName?: string;
  note?: string;
  isToday: boolean;
  isPast: boolean;
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
