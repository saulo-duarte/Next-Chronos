import { create } from 'zustand';
import { startOfWeek } from 'date-fns';
import { CalendarView } from '@/components';

interface CalendarState {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;

  calendarView: CalendarView;
  setCalendarView: (view: CalendarView) => void;

  currentWeekStart: Date;
  setCurrentWeekStart: (date: Date) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: new Date(),
  setSelectedDate: (date) => set({ selectedDate: date }),

  calendarView: 'Lista do dia',
  setCalendarView: (view) => set({ calendarView: view }),

  currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 0 }),
  setCurrentWeekStart: (date) => set({ currentWeekStart: date }),
}));
