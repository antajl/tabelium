export interface ColleagueTheme {
  id: string;
  name: string;
  avatarBg: string;
  avatarText: string;
  avatarBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  itemBg: string;
  itemBorder: string;
  itemText: string;
  cardBorder: string;
  cardBg: string;
  activeTagBg: string;
  cellBadgeBg: string;
  cellBadgeBorder: string;
  cellBadgeText: string;
  accentColor: string;
}

export const THEMES: Record<string, ColleagueTheme> = {
  amber: {
    id: 'amber',
    name: 'Золотистый (Я)',
    avatarBg: 'bg-[#fef7db]',
    avatarText: 'text-[#7d5600]',
    avatarBorder: 'border-[#f6dc84]',
    badgeBg: 'bg-[#fef7db]',
    badgeText: 'text-[#7d5600]',
    badgeBorder: 'border-[#f6dc84]',
    itemBg: 'bg-[#fef7db]',
    itemBorder: 'border-[#f6dc84]',
    itemText: 'text-[#7d5600]',
    cardBorder: 'border-[#e8d5b5]',
    cardBg: 'bg-[#fffdf9]',
    activeTagBg: 'bg-[#b68231]',
    cellBadgeBg: 'bg-[#fef7db]',
    cellBadgeBorder: 'border-[#f6dc84]',
    cellBadgeText: 'text-[#7d5600]',
    accentColor: '#b68231',
  },
  blue: {
    id: 'blue',
    name: 'Сапфировый',
    avatarBg: 'bg-[#eff6ff]',
    avatarText: 'text-[#1d4ed8]',
    avatarBorder: 'border-[#93c5fd]',
    badgeBg: 'bg-[#eff6ff]',
    badgeText: 'text-[#1e40af]',
    badgeBorder: 'border-[#93c5fd]',
    itemBg: 'bg-[#eff6ff]',
    itemBorder: 'border-[#bfdbfe]',
    itemText: 'text-[#1e40af]',
    cardBorder: 'border-[#bfdbfe]',
    cardBg: 'bg-[#f8faff]',
    activeTagBg: 'bg-[#2563eb]',
    cellBadgeBg: 'bg-[#eff6ff]',
    cellBadgeBorder: 'border-[#93c5fd]',
    cellBadgeText: 'text-[#1e40af]',
    accentColor: '#2563eb',
  },
  emerald: {
    id: 'emerald',
    name: 'Изумрудный',
    avatarBg: 'bg-[#ecfdf5]',
    avatarText: 'text-[#047857]',
    avatarBorder: 'border-[#6ee7b7]',
    badgeBg: 'bg-[#ecfdf5]',
    badgeText: 'text-[#065f46]',
    badgeBorder: 'border-[#6ee7b7]',
    itemBg: 'bg-[#ecfdf5]',
    itemBorder: 'border-[#a7f3d0]',
    itemText: 'text-[#065f46]',
    cardBorder: 'border-[#a7f3d0]',
    cardBg: 'bg-[#f6fcf8]',
    activeTagBg: 'bg-[#059669]',
    cellBadgeBg: 'bg-[#ecfdf5]',
    cellBadgeBorder: 'border-[#6ee7b7]',
    cellBadgeText: 'text-[#065f46]',
    accentColor: '#059669',
  },
  rose: {
    id: 'rose',
    name: 'Ягодный',
    avatarBg: 'bg-[#fff1f2]',
    avatarText: 'text-[#be123c]',
    avatarBorder: 'border-[#fca5a5]',
    badgeBg: 'bg-[#fff1f2]',
    badgeText: 'text-[#9f1239]',
    badgeBorder: 'border-[#fca5a5]',
    itemBg: 'bg-[#fff1f2]',
    itemBorder: 'border-[#fecdd3]',
    itemText: 'text-[#9f1239]',
    cardBorder: 'border-[#fca5a5]',
    cardBg: 'bg-[#fffbfb]',
    activeTagBg: 'bg-[#e11d48]',
    cellBadgeBg: 'bg-[#fff1f2]',
    cellBadgeBorder: 'border-[#fca5a5]',
    cellBadgeText: 'text-[#9f1239]',
    accentColor: '#e11d48',
  },
  purple: {
    id: 'purple',
    name: 'Аметистовый',
    avatarBg: 'bg-[#f5f3ff]',
    avatarText: 'text-[#6d28d9]',
    avatarBorder: 'border-[#c4b5fd]',
    badgeBg: 'bg-[#f5f3ff]',
    badgeText: 'text-[#5b21b6]',
    badgeBorder: 'border-[#c4b5fd]',
    itemBg: 'bg-[#f5f3ff]',
    itemBorder: 'border-[#ddd6fe]',
    itemText: 'text-[#5b21b6]',
    cardBorder: 'border-[#ddd6fe]',
    cardBg: 'bg-[#fcfaff]',
    activeTagBg: 'bg-[#7c3aed]',
    cellBadgeBg: 'bg-[#f5f3ff]',
    cellBadgeBorder: 'border-[#c4b5fd]',
    cellBadgeText: 'text-[#5b21b6]',
    accentColor: '#7c3aed',
  },
  orange: {
    id: 'orange',
    name: 'Терракотовый',
    avatarBg: 'bg-[#fff7ed]',
    avatarText: 'text-[#c2410c]',
    avatarBorder: 'border-[#fdba74]',
    badgeBg: 'bg-[#fff7ed]',
    badgeText: 'text-[#9a3412]',
    badgeBorder: 'border-[#fdba74]',
    itemBg: 'bg-[#fff7ed]',
    itemBorder: 'border-[#fed7aa]',
    itemText: 'text-[#9a3412]',
    cardBorder: 'border-[#fed7aa]',
    cardBg: 'bg-[#fffaf5]',
    activeTagBg: 'bg-[#ea580c]',
    cellBadgeBg: 'bg-[#fff7ed]',
    cellBadgeBorder: 'border-[#fdba74]',
    cellBadgeText: 'text-[#9a3412]',
    accentColor: '#ea580c',
  },
  teal: {
    id: 'teal',
    name: 'Бирюзовый',
    avatarBg: 'bg-[#ecfeff]',
    avatarText: 'text-[#0e7490]',
    avatarBorder: 'border-[#67e8f9]',
    badgeBg: 'bg-[#ecfeff]',
    badgeText: 'text-[#155e75]',
    badgeBorder: 'border-[#67e8f9]',
    itemBg: 'bg-[#ecfeff]',
    itemBorder: 'border-[#a5f3fc]',
    itemText: 'text-[#155e75]',
    cardBorder: 'border-[#a5f3fc]',
    cardBg: 'bg-[#f7fdfe]',
    activeTagBg: 'bg-[#0891b2]',
    cellBadgeBg: 'bg-[#ecfdf5]',
    cellBadgeBorder: 'border-[#67e8f9]',
    cellBadgeText: 'text-[#155e75]',
    accentColor: '#0891b2',
  },
};

export const AVAILABLE_THEME_KEYS = ['blue', 'emerald', 'rose', 'purple', 'orange', 'teal'];

export function getColleagueTheme(themeKey?: string, isSelf?: boolean): ColleagueTheme {
  if (isSelf) return THEMES.amber;
  if (themeKey && THEMES[themeKey]) return THEMES[themeKey];
  return THEMES.blue;
}
