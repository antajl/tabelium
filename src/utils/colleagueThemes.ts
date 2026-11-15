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
    name: 'Синий',
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
  orange: {
    id: 'orange',
    name: 'Оранжевый',
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
  pink: {
    id: 'pink',
    name: 'Розовый',
    avatarBg: 'bg-[#fdf2f8]',
    avatarText: 'text-[#be185d]',
    avatarBorder: 'border-[#f472b6]',
    badgeBg: 'bg-[#fdf2f8]',
    badgeText: 'text-[#9d174d]',
    badgeBorder: 'border-[#f472b6]',
    itemBg: 'bg-[#fdf2f8]',
    itemBorder: 'border-[#fbcfe8]',
    itemText: 'text-[#9d174d]',
    cardBorder: 'border-[#fbcfe8]',
    cardBg: 'bg-[#fdf7fa]',
    activeTagBg: 'bg-[#db2777]',
    cellBadgeBg: 'bg-[#fdf2f8]',
    cellBadgeBorder: 'border-[#f472b6]',
    cellBadgeText: 'text-[#9d174d]',
    accentColor: '#db2777',
  },
  purple: {
    id: 'purple',
    name: 'Фиолетовый',
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
  cyan: {
    id: 'cyan',
    name: 'Голубой',
    avatarBg: 'bg-[#f0f9ff]',
    avatarText: 'text-[#0369a1]',
    avatarBorder: 'border-[#7dd3fc]',
    badgeBg: 'bg-[#f0f9ff]',
    badgeText: 'text-[#075985]',
    badgeBorder: 'border-[#7dd3fc]',
    itemBg: 'bg-[#f0f9ff]',
    itemBorder: 'border-[#bae6fd]',
    itemText: 'text-[#075985]',
    cardBorder: 'border-[#bae6fd]',
    cardBg: 'bg-[#f8fcff]',
    activeTagBg: 'bg-[#0284c7]',
    cellBadgeBg: 'bg-[#f0f9ff]',
    cellBadgeBorder: 'border-[#7dd3fc]',
    cellBadgeText: 'text-[#075985]',
    accentColor: '#0284c7',
  },
};

export const AVAILABLE_THEME_KEYS = ['blue', 'orange', 'pink', 'purple', 'cyan'];

export function getColleagueTheme(themeKey?: string, isSelf?: boolean): ColleagueTheme {
  if (isSelf) return THEMES.amber;
  if (themeKey && THEMES[themeKey]) return THEMES[themeKey];
  return THEMES.blue;
}
