import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Calendar,
  X,
  UserCheck,
} from 'lucide-react';
import type { Colleague, ColleagueVacation } from '../types/schedule';
import { addDaysToDate, RUSSIAN_MONTH_NAMES } from '../utils/scheduleEngine';
import { getColleagueTheme, AVAILABLE_THEME_KEYS } from '../utils/colleagueThemes';

interface ColleaguesVacationsCardProps {
  colleagues: Colleague[];
  currentYear: number;
  currentMonth: number;
  isReadOnly: boolean;
  onUpdateColleagues: (colleagues: Colleague[]) => void;
  onNavigateToPeriod?: (year: number, month: number) => void;
  onAddUserVacationOverride?: (startDate: string, daysCount: number) => void;
  onDeleteUserVacationOverride?: (startDate: string, daysCount: number) => void;
}

export const ColleaguesVacationsCard: React.FC<ColleaguesVacationsCardProps> = ({
  colleagues,
  currentYear,
  currentMonth,
  isReadOnly,
  onUpdateColleagues,
  onNavigateToPeriod,
  onAddUserVacationOverride,
  onDeleteUserVacationOverride,
}) => {
  // Year selector inside the card (defaults to current calendar year, but can be switched)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);

  useEffect(() => {
    setSelectedYear(currentYear);
  }, [currentYear]);

  // Modal / Form state for adding a colleague
  const [isAddingColleague, setIsAddingColleague] = useState<boolean>(false);
  const [newColleagueName, setNewColleagueName] = useState<string>('');
  const [newColleagueRole, setNewColleagueRole] = useState<string>('Напарник');

  // Modal / Form state for adding a vacation to a specific colleague
  const [activeColleagueIdForVacation, setActiveColleagueIdForVacation] = useState<string | null>(null);
  const [newVacStartDate, setNewVacStartDate] = useState<string>(`${selectedYear}-01-01`);
  const [newVacDays, setNewVacDays] = useState<number>(14);
  const [newVacNote, setNewVacNote] = useState<string>('');

  // Format YYYY-MM-DD into "17 мар 2027"
  const formatDateFriendly = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const shortMonth = RUSSIAN_MONTH_NAMES[m - 1]?.slice(0, 3).toLowerCase();
    return `${d} ${shortMonth} ${y}`;
  };

  const handleAddColleague = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColleagueName.trim() || isReadOnly) return;

    const usedThemes = colleagues.filter((c) => !c.isSelf).map((c) => c.colorTheme);
    const nextTheme =
      AVAILABLE_THEME_KEYS.find((t) => !usedThemes.includes(t)) ||
      AVAILABLE_THEME_KEYS[colleagues.length % AVAILABLE_THEME_KEYS.length];

    const newPerson: Colleague = {
      id: `colleague-${Date.now()}`,
      name: newColleagueName.trim(),
      role: newColleagueRole.trim() || 'Коллега',
      colorTheme: nextTheme,
      vacations: [],
    };

    onUpdateColleagues([...colleagues, newPerson]);
    setNewColleagueName('');
    setIsAddingColleague(false);
  };

  const handleDeleteColleague = (id: string) => {
    if (isReadOnly) return;
    onUpdateColleagues(colleagues.filter((c) => c.id !== id));
  };

  const handleAddVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeColleagueIdForVacation || newVacDays <= 0 || !newVacStartDate || isReadOnly) return;

    const endDate = addDaysToDate(newVacStartDate, newVacDays);
    const newVac: ColleagueVacation = {
      id: `vac-${Date.now()}`,
      startDate: newVacStartDate,
      daysCount: newVacDays,
      endDate,
      note: newVacNote.trim() || undefined,
    };

    // If adding vacation for self ("Я"), also apply override to calendar
    if (activeColleagueIdForVacation === 'self' && onAddUserVacationOverride) {
      onAddUserVacationOverride(newVacStartDate, newVacDays);
    }

    const updated = colleagues.map((colleague) => {
      if (colleague.id === activeColleagueIdForVacation) {
        const nextVacations = [...colleague.vacations, newVac].sort((a, b) =>
          a.startDate.localeCompare(b.startDate)
        );
        return {
          ...colleague,
          vacations: nextVacations,
        };
      }
      return colleague;
    });

    onUpdateColleagues(updated);
    setActiveColleagueIdForVacation(null);
    setNewVacNote('');
  };

  const handleDeleteVacation = (colleagueId: string, vac: ColleagueVacation) => {
    if (isReadOnly) return;

    // If deleting vacation for self ("Я"), reset override in calendar
    if (colleagueId === 'self' && onDeleteUserVacationOverride) {
      onDeleteUserVacationOverride(vac.startDate, vac.daysCount);
    }

    const updated = colleagues.map((colleague) => {
      if (colleague.id === colleagueId) {
        return {
          ...colleague,
          vacations: colleague.vacations.filter((v) => v.id !== vac.id),
        };
      }
      return colleague;
    });
    onUpdateColleagues(updated);
  };

  // Filter vacations for the selected year
  const getVacationsForYear = (vacations: ColleagueVacation[]) => {
    return vacations.filter((v) => {
      const startY = Number(v.startDate.split('-')[0]);
      const endY = Number(v.endDate.split('-')[0]);
      return startY === selectedYear || endY === selectedYear;
    });
  };

  // Check if vacation period intersects with current viewed month
  const isVacationInCurrentMonth = (vac: ColleagueVacation) => {
    const startY = Number(vac.startDate.split('-')[0]);
    const startM = Number(vac.startDate.split('-')[1]);
    const endY = Number(vac.endDate.split('-')[0]);
    const endM = Number(vac.endDate.split('-')[1]);

    const currentKey = currentYear * 12 + currentMonth;
    const startKey = startY * 12 + startM;
    const endKey = endY * 12 + endM;

    return currentKey >= startKey && currentKey <= endKey;
  };

  return (
    <div className="bg-[#fcfaf7] rounded-2xl border border-[#e7ddcf] p-3 sm:p-4 shadow-[0_1px_3px_rgba(45,30,15,0.04)]">
      {/* Single Compact Header Line */}
      <div className="flex items-center justify-between gap-1.5 pb-2.5 border-b border-[#e7ddcf]">
        {/* Left: Title with icon & count */}
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="p-1 rounded-md bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe] shrink-0">
            <Users className="w-3.5 h-3.5" strokeWidth={2} />
          </div>
          <h3 className="text-xs font-bold text-[#252320] truncate">Отпуска</h3>
          <span className="text-[10px] text-[#81796e] bg-[#f3ede4] px-1.5 py-0.2 rounded-full border border-[#e7ddcf] shrink-0">
            {colleagues.length}
          </span>
        </div>

        {/* Right: Year pills + Add Colleague Button */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="flex items-center gap-0.5 bg-[#f3ede4] p-0.5 rounded-lg border border-[#e7ddcf]">
            {[2025, 2026, 2027, 2028].map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => {
                  setSelectedYear(y);
                  if (onNavigateToPeriod) {
                    onNavigateToPeriod(y, currentMonth);
                  }
                }}
                className={`px-1.5 sm:px-2 py-0.5 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                  selectedYear === y
                    ? 'bg-white text-[#b68231] border border-[#d8b57a] shadow-xs'
                    : 'text-[#81796e] hover:text-[#252320]'
                }`}
              >
                {y}
              </button>
            ))}
          </div>

          {!isReadOnly && (
            <button
              type="button"
              onClick={() => setIsAddingColleague(true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-[#eff6ff] hover:bg-[#dbeafe] text-[#1d4ed8] border border-[#bfdbfe] transition shadow-2xs cursor-pointer active:scale-95"
              title="Добавить напарника"
            >
              <Plus className="w-3 h-3" strokeWidth={2} />
              <span className="hidden sm:inline">Коллега</span>
            </button>
          )}
        </div>
      </div>

      {/* Add Colleague Form Modal/Inline */}
      {isAddingColleague && (
        <form
          onSubmit={handleAddColleague}
          className="mt-3 p-3 bg-[#f8f5ee] border border-[#d8b57a] rounded-xl flex flex-col gap-2 animate-in fade-in-0"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#252320]">Новый коллега</span>
            <button
              type="button"
              onClick={() => setIsAddingColleague(false)}
              className="text-[#81796e] hover:text-[#252320]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-[#81796e] block mb-0.5">Имя</label>
              <input
                type="text"
                required
                value={newColleagueName}
                onChange={(e) => setNewColleagueName(e.target.value)}
                placeholder="Например: Андрей"
                className="w-full bg-white border border-[#e7ddcf] rounded-lg px-2.5 py-1 text-xs text-[#252320] focus:outline-none focus:border-[#d8b57a]"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#81796e] block mb-0.5">Роль</label>
              <input
                type="text"
                value={newColleagueRole}
                onChange={(e) => setNewColleagueRole(e.target.value)}
                placeholder="Напарник / Сменщик"
                className="w-full bg-white border border-[#e7ddcf] rounded-lg px-2.5 py-1 text-xs text-[#252320] focus:outline-none focus:border-[#d8b57a]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-1.5 mt-1">
            <button
              type="button"
              onClick={() => setIsAddingColleague(false)}
              className="px-2.5 py-1 text-xs text-[#81796e] hover:bg-white rounded-lg transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-semibold bg-[#b68231] text-white rounded-lg hover:bg-[#9a6c25] transition shadow-2xs"
            >
              Сохранить
            </button>
          </div>
        </form>
      )}

      {/* Add Vacation Modal/Inline Form */}
      {activeColleagueIdForVacation && (
        <form
          onSubmit={handleAddVacation}
          className="mt-3 p-3 bg-[#eff6ff] border border-[#bfdbfe] rounded-xl flex flex-col gap-2 animate-in fade-in-0"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1e40af]">
              Отпуск для:{' '}
              {colleagues.find((c) => c.id === activeColleagueIdForVacation)?.name === 'Я'
                ? 'Себя (Я)'
                : colleagues.find((c) => c.id === activeColleagueIdForVacation)?.name}
            </span>
            <button
              type="button"
              onClick={() => setActiveColleagueIdForVacation(null)}
              className="text-[#81796e] hover:text-[#252320]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-semibold text-[#1e40af] block mb-0.5">
                Дата начала
              </label>
              <input
                type="date"
                required
                value={newVacStartDate}
                onChange={(e) => setNewVacStartDate(e.target.value)}
                className="w-full bg-white border border-[#bfdbfe] rounded-lg px-2 py-1 text-xs text-[#252320] focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#1e40af] block mb-0.5">
                Дней отпуска
              </label>
              <input
                type="number"
                min={1}
                max={60}
                required
                value={newVacDays}
                onChange={(e) => setNewVacDays(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white border border-[#bfdbfe] rounded-lg px-2 py-1 text-xs text-[#252320] focus:outline-none focus:border-[#2563eb]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-semibold text-[#1e40af] block mb-0.5">
              Примечание (необязательно)
            </label>
            <input
              type="text"
              value={newVacNote}
              onChange={(e) => setNewVacNote(e.target.value)}
              placeholder="Основной, дополнительный..."
              className="w-full bg-white border border-[#bfdbfe] rounded-lg px-2.5 py-1 text-xs text-[#252320] focus:outline-none focus:border-[#2563eb]"
            />
          </div>

          <div className="text-[10px] text-[#1e40af]/80">
            Период: {formatDateFriendly(newVacStartDate)} —{' '}
            {formatDateFriendly(addDaysToDate(newVacStartDate, newVacDays))} ({newVacDays} дн.)
          </div>

          <div className="flex justify-end gap-1.5 mt-1">
            <button
              type="button"
              onClick={() => setActiveColleagueIdForVacation(null)}
              className="px-2.5 py-1 text-xs text-[#81796e] hover:bg-white rounded-lg transition"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs font-semibold bg-[#2563eb] text-white rounded-lg hover:bg-[#1d4ed8] transition shadow-2xs"
            >
              Добавить отпуск
            </button>
          </div>
        </form>
      )}

      {/* Colleagues and Self List */}
      <div className="mt-2 flex flex-col gap-1.5">
        {colleagues.map((person) => {
          const isSelf = person.isSelf;
          const theme = getColleagueTheme(person.colorTheme, isSelf);
          const yearVacations = getVacationsForYear(person.vacations);
          const totalDaysInYear = yearVacations.reduce((acc, v) => acc + v.daysCount, 0);

          return (
            <div
              key={person.id}
              className={`rounded-xl border p-2 shadow-2xs transition ${theme.cardBg} ${theme.cardBorder}`}
            >
              {/* Person Header */}
              <div className="flex items-center justify-between pb-1 border-b border-[#e7ddcf]/50">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 ${theme.avatarBg} ${theme.avatarText} ${theme.avatarBorder}`}
                  >
                    {isSelf ? (
                      <UserCheck className="w-3 h-3 text-[#b68231]" />
                    ) : (
                      person.name[0]?.toUpperCase() || 'К'
                    )}
                  </span>
                  <div className="truncate flex items-baseline gap-1">
                    <span className="text-xs font-bold text-[#252320]">
                      {isSelf ? 'Я (Мой график)' : person.name}
                    </span>
                    {person.role && !isSelf && (
                      <span className="text-[10px] text-[#81796e] truncate">({person.role})</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
                    title={`Всего дней отпуска в ${selectedYear} г.`}
                  >
                    {totalDaysInYear} дн. ({selectedYear})
                  </span>

                  {!isReadOnly && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveColleagueIdForVacation(person.id);
                          setNewVacStartDate(`${selectedYear}-01-01`);
                        }}
                        className="p-1 rounded-md transition cursor-pointer text-[#81796e] hover:text-[#252320] hover:bg-white"
                        title="Добавить отпуск"
                      >
                        <Plus className="w-3 h-3" />
                      </button>

                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => handleDeleteColleague(person.id)}
                          className="p-1 rounded-md text-[#81796e] hover:text-[#93231c] hover:bg-[#fdeeed] transition cursor-pointer"
                          title="Удалить коллегу"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Vacations for this person in selectedYear */}
              <div className="mt-1 flex flex-col gap-1">
                {yearVacations.length === 0 ? (
                  <span className="text-[10px] text-[#81796e]/70 italic py-0.5 text-center block">
                    Нет отпусков в {selectedYear} г.
                  </span>
                ) : (
                  yearVacations.map((vac) => {
                    const inCurrentMonth = isVacationInCurrentMonth(vac);
                    const [vYear, vMonth] = vac.startDate.split('-').map(Number);

                    return (
                      <div
                        key={vac.id}
                        className={`flex items-center justify-between px-2 py-0.5 rounded-lg text-xs transition border ${
                          inCurrentMonth
                            ? `${theme.itemBg} ${theme.itemBorder} ${theme.itemText}`
                            : 'bg-white hover:bg-[#faf8f4] text-[#252320] border-[#e7ddcf]/70'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onNavigateToPeriod && onNavigateToPeriod(vYear, vMonth)}
                          className="flex items-center gap-1.5 text-left cursor-pointer flex-1 truncate"
                          title="Нажмите, чтобы открыть этот месяц в календаре"
                        >
                          <Calendar
                            className="w-3 h-3 shrink-0 opacity-80"
                            strokeWidth={1.5}
                          />
                          <span className="font-semibold text-[11px] truncate">
                            {formatDateFriendly(vac.startDate)} — {formatDateFriendly(vac.endDate)}
                          </span>
                          <span className="text-[10px] text-[#81796e] shrink-0">
                            ({vac.daysCount} дн.)
                          </span>
                          {inCurrentMonth && (
                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.2 rounded-full text-white shrink-0 ${theme.activeTagBg}`}
                            >
                              сейчас
                            </span>
                          )}
                        </button>

                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => handleDeleteVacation(person.id, vac)}
                            className="text-[#81796e] hover:text-[#93231c] p-0.5 transition ml-1 cursor-pointer shrink-0"
                            title="Удалить период"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};