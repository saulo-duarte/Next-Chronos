import { useCallback } from 'react';
import { addDays, addMonths, addWeeks, subMonths, subWeeks } from 'date-fns';
import { CalendarView } from '@/components';
import { AgendaDaysToShow } from '@/components';

export function useCalendarNavigation(
  view: CalendarView,
  currentDate: Date,
  setDate: (date: Date) => void
) {
  const handlePrevious = useCallback(() => {
    if (view === 'mês') setDate(subMonths(currentDate, 1));
    else if (view === 'semana') setDate(subWeeks(currentDate, 1));
    else if (view === 'dia') setDate(addDays(currentDate, -1));
    else if (view === 'agenda') setDate(addDays(currentDate, -AgendaDaysToShow));
  }, [view, currentDate, setDate]);

  const handleNext = useCallback(() => {
    if (view === 'mês') setDate(addMonths(currentDate, 1));
    else if (view === 'semana') setDate(addWeeks(currentDate, 1));
    else if (view === 'dia') setDate(addDays(currentDate, 1));
    else if (view === 'agenda') setDate(addDays(currentDate, AgendaDaysToShow));
  }, [view, currentDate, setDate]);

  return { handlePrevious, handleNext };
}
