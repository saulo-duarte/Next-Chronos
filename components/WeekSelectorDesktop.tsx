'use client';

import { useEffect } from 'react';
import { format, startOfWeek, addWeeks, subWeeks, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { Button } from './ui/button';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export function WeekSelectorDesktop() {
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

  return (
    <div className="hidden md:flex flex-col text-white space-y-4 w-full p-2">
      <div className="flex items-center justify-between">
        <Button
          onClick={handlePrevWeek}
          variant="ghost"
          size="icon"
          className="hover:text-blue-400 text-white"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <span className="font-semibold text-xs">
          {format(currentWeekStart, "dd 'de' MMMM", { locale: ptBR })} –{' '}
          {format(addDays(currentWeekStart, 6), "dd 'de' MMMM", {
            locale: ptBR,
          })}
        </span>

        <Button
          onClick={handleNextWeek}
          variant="ghost"
          size="icon"
          className="hover:text-blue-400 text-white"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex justify-between border-t border-white/10 pt-2">
        {weekDays.map((day, index) => {
          const date = addDays(currentWeekStart, index);
          const isSelected = isSameDay(date, selectedDate);

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={clsx(
                'flex flex-col items-center px-2 py-1 rounded-md transition-colors w-12',
                isSelected
                  ? 'bg-primary text-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <span className="text-xs font-medium">{day}</span>
              <span className="text-xs font-semibold leading-none">{format(date, 'd')}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
