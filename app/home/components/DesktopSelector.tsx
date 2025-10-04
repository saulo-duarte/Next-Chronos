import { format, startOfWeek, addWeeks, subWeeks, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { useCallback, useMemo, useEffect, useState } from 'react';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function MonthWeekNavigator() {
  const { selectedDate, setSelectedDate } = useCalendarStore();

  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(selectedDate, { weekStartsOn: 0 })
  );

  useEffect(() => {
    setCurrentWeekStart(startOfWeek(selectedDate, { weekStartsOn: 0 }));
  }, [selectedDate]);

  const handlePrevWeek = useCallback(() => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  }, []);

  const handleNextWeek = useCallback(() => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  }, []);

  const handleDaySelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
    },
    [setSelectedDate]
  );

  const renderWeekDays = useMemo(() => {
    const days = [];
    let day = currentWeekStart;
    for (let i = 0; i < 7; i++) {
      days.push(day);
      day = addDays(day, 1);
    }
    return days;
  }, [currentWeekStart]);

  const formattedRange = useMemo(() => {
    const start = format(currentWeekStart, 'MMMM dd', { locale: ptBR });
    const end = format(addDays(currentWeekStart, 6), 'MMMM dd', { locale: ptBR });
    return `${start} - ${end}`;
  }, [currentWeekStart]);

  return (
    <div className="mt-4 p-3 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <Button variant="ghost" size="icon" onClick={handlePrevWeek} className="size-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold text-sm capitalize text-foreground/80">
          {formattedRange}
        </span>
        <Button variant="ghost" size="icon" onClick={handleNextWeek} className="size-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex justify-between">
        {renderWeekDays.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);

          return (
            <button
              key={index}
              onClick={() => handleDaySelect(date)}
              className={cn(
                'flex flex-col items-center text-xs transition-colors p-1 rounded-md',
                isSelected ? 'bg-primary text-foreground font-bold' : 'hover:bg-accent/50'
              )}
            >
              <span className="text-muted-foreground">{weekDays[index].substring(0, 3)}</span>
              <span className="mt-1 w-6 h-6 flex items-center justify-center rounded-full">
                {format(date, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
