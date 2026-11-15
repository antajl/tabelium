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
    label: 'Смена 20:00',
    shortLabel: 'Смена',
    colorBg: 'bg-[#222324] hover:bg-[#282a2b]',
    colorBorder: 'border-[#383d42]',
    colorText: 'text-[#dce2e6]',
    badgeBg: 'bg-[#2a2f33] text-[#dce2e6] border-[#3e454a]',
    dotColor: 'bg-[#98a4ad]',
  },
  off: {
    type: 'off',
    label: 'Выходной',
    shortLabel: 'Вых',
    colorBg: 'bg-[#1b1a18] hover:bg-[#211f1c]',
    colorBorder: 'border-[#2d2925]',
    colorText: 'text-[#827a6e]',
    badgeBg: 'bg-[#24211d] text-[#827a6e] border-[#332f2a]',
    dotColor: 'bg-[#524b42]',
  },
  overtime: {
    type: 'overtime',
    label: 'Подработка 20:00',
    shortLabel: 'Подр',
    colorBg: 'bg-[#272019] hover:bg-[#2e261e]',
    colorBorder: 'border-[#52412e]',
    colorText: 'text-[#deb887]',
    badgeBg: 'bg-[#362b1e] text-[#deb887] border-[#59442c]',
    dotColor: 'bg-[#d19c52]',
  },
  vacation: {
    type: 'vacation',
    label: 'Отпуск',
    shortLabel: 'Отпуск',
    colorBg: 'bg-[#1b231f] hover:bg-[#212b26]',
    colorBorder: 'border-[#33463e]',
    colorText: 'text-[#a3c2b4]',
    badgeBg: 'bg-[#23312b] text-[#a3c2b4] border-[#3b5247]',
    dotColor: 'bg-[#6d9684]',
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
