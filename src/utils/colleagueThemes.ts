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
    avatarText: 'text-[#2563eb]',
    avatarBorder: 'border-[#bfdbfe]',
    badgeBg: 'bg-[#eff6ff]',
    badgeText: 'text-[#1e40af]',
    badgeBorder: 'border-[#bfdbfe]',
    itemBg: 'bg-[#eff6ff]',
    itemBorder: 'border-[#bfdbfe]',
    itemText: 'text-[#1e40af]',
    cardBorder: 'border-[#d0e0fb]',
    cardBg: 'bg-[#fbfdff]',
    activeTagBg: 'bg-[#2563eb]',
    cellBadgeBg: 'bg-[#eff6ff]',
    cellBadgeBorder: 'border-[#bfdbfe]',
    cellBadgeText: 'text-[#1e40af]',
    accentColor: '#2563eb',
  },
  purple: {
    id: 'purple',
    name: 'Фиолетовый',
    avatarBg: 'bg-[#f5f3ff]',
    avatarText: 'text-[#7c3aed]',
    avatarBorder: 'border-[#ddd6fe]',
    badgeBg: 'bg-[#f5f3ff]',
    badgeText: 'text-[#5b21b6]',
    badgeBorder: 'border-[#ddd6fe]',
    itemBg: 'bg-[#f5f3ff]',
    itemBorder: 'border-[#ddd6fe]',
    itemText: 'text-[#5b21b6]',
    cardBorder: 'border-[#e3ddfc]',
    cardBg: 'bg-[#fdfcff]',
    activeTagBg: 'bg-[#7c3aed]',
    cellBadgeBg: 'bg-[#f5f3ff]',
    cellBadgeBorder: 'border-[#ddd6fe]',
    cellBadgeText: 'text-[#5b21b6]',
    accentColor: '#7c3aed',
  },
  teal: {
    id: 'teal',
    name: 'Бирюзовый',
    avatarBg: 'bg-[#ecfeff]',
    avatarText: 'text-[#0891b2]',
    avatarBorder: 'border-[#a5f3fc]',
    badgeBg: 'bg-[#ecfeff]',
    badgeText: 'text-[#0e7490]',
    badgeBorder: 'border-[#a5f3fc]',
    itemBg: 'bg-[#ecfeff]',
    itemBorder: 'border-[#a5f3fc]',
    itemText: 'text-[#0e7490]',
    cardBorder: 'border-[#c1f0f7]',
    cardBg: 'bg-[#fafffe]',
    activeTagBg: 'bg-[#0891b2]',
    cellBadgeBg: 'bg-[#ecfeff]',
    cellBadgeBorder: 'border-[#a5f3fc]',
    cellBadgeText: 'text-[#0e7490]',
    accentColor: '#0891b2',
  },
  rose: {
    id: 'rose',
    name: 'Ягодный',
    avatarBg: 'bg-[#fff1f2]',
    avatarText: 'text-[#e11d48]',
    avatarBorder: 'border-[#fecdd3]',
    badgeBg: 'bg-[#fff1f2]',
    badgeText: 'text-[#9f1239]',
    badgeBorder: 'border-[#fecdd3]',
    itemBg: 'bg-[#fff1f2]',
    itemBorder: 'border-[#fecdd3]',
    itemText: 'text-[#9f1239]',
    cardBorder: 'border-[#fad3d8]',
    cardBg: 'bg-[#fffcfc]',
    activeTagBg: 'bg-[#e11d48]',
    cellBadgeBg: 'bg-[#fff1f2]',
    cellBadgeBorder: 'border-[#fecdd3]',
    cellBadgeText: 'text-[#9f1239]',
    accentColor: '#e11d48',
  },
};

export const AVAILABLE_THEME_KEYS = ['blue', 'purple', 'teal', 'rose'];

export function getColleagueTheme(themeKey?: string, isSelf?: boolean): ColleagueTheme {
  if (isSelf) return THEMES.amber;
  if (themeKey && THEMES[themeKey]) return THEMES[themeKey];
  return THEMES.blue;
}
