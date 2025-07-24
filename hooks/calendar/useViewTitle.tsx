import { useMemo } from 'react';
import { format, isSameMonth, startOfWeek, endOfWeek, addDays } from 'date-fns';
import { AgendaDaysToShow } from '@/components';
import { CalendarView } from '@/components';

export function useViewTitle(view: CalendarView, currentDate: Date) {
  return useMemo(() => {
    if (!(currentDate instanceof Date) || isNaN(currentDate.getTime())) {
      return 'Data inválida';
    }

    if (view === 'mês') return format(currentDate, 'MMMM yyyy');

    if (view === 'semana') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return isSameMonth(start, end)
        ? format(start, 'MMMM yyyy')
        : `${format(start, 'MMM')} - ${format(end, 'MMM yyyy')}`;
    }

    if (view === 'dia') {
      return (
        <>
          <span className="min-[480px]:hidden" aria-hidden="true">
            {format(currentDate, 'MMM d, yyyy')}
          </span>
          <span className="max-[479px]:hidden min-md:hidden" aria-hidden="true">
            {format(currentDate, 'MMMM d, yyyy')}
          </span>
          <span className="max-md:hidden">{format(currentDate, 'EEE MMMM d, yyyy')}</span>
        </>
      );
    }

    if (view === 'agenda') {
      const start = currentDate;
      const end = addDays(currentDate, AgendaDaysToShow - 1);
      if (isNaN(end.getTime())) return format(currentDate, 'MMMM yyyy');

      return isSameMonth(start, end)
        ? format(start, 'MMMM yyyy')
        : `${format(start, 'MMM')} - ${format(end, 'MMM yyyy')}`;
    }

    return format(currentDate, 'MMMM yyyy');
  }, [view, currentDate]);
}
