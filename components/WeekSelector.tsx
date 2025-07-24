'use client';

import { useEffect } from 'react';
import { format, startOfWeek, addWeeks, subWeeks, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { Button } from './ui/button';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { useSwipeable } from 'react-swipeable';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function WeekSelector() {
  const { selectedDate, setSelectedDate, currentWeekStart, setCurrentWeekStart } =
    useCalendarStore();

  useEffect(() => {
    setCurrentWeekStart(startOfWeek(selectedDate, { weekStartsOn: 0 }));
  }, [selectedDate, setCurrentWeekStart]);

  const handlePrevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => setCurrentWeekStart(addWeeks(currentWeekStart, 1)),
    onSwipedRight: () => setCurrentWeekStart(subWeeks(currentWeekStart, 1)),
    delta: 50,
  });

  return (
    <div className="text-white space-y-2">
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevWeek}
          className="text-xl px-2 hover:text-blue-400 bg-background text-white"
        >
          &lt;
        </Button>
        <span className="font-semibold">
          {format(currentWeekStart, 'MMMM dd', { locale: ptBR })} -{' '}
          {format(addDays(currentWeekStart, 6), 'MMMM dd', { locale: ptBR })}
        </span>
        <Button
          onClick={handleNextWeek}
          className="text-xl px-2 hover:text-blue-400 bg-background text-white"
          {...handlers}
        >
          &gt;
        </Button>
      </div>

      <div className="flex justify-between">
        {weekDays.map((day, index) => {
          const date = addDays(currentWeekStart, index);
          const isSelected = isSameDay(date, selectedDate);

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={clsx(
                'flex flex-col items-center text-sm transition-colors',
                isSelected ? 'text-white' : 'text-white/70 hover:text-white'
              )}
            >
              <span>{day}</span>
              <span
                className={clsx(
                  'mt-1 w-8 h-8 flex items-center justify-center rounded-md',
                  isSelected ? 'bg-primary text-black' : ''
                )}
              >
                {format(date, 'd')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
