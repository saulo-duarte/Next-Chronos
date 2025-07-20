'use client';

import { useState } from 'react';
import { format, startOfWeek, addWeeks, subWeeks, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { Button } from './ui/button';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function WeekSelector() {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevWeek = () => {
    setCurrentWeekStart((prev) => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart((prev) => addWeeks(prev, 1));
  };

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
          {format(currentWeekStart, 'MMMM dd', { locale: ptBR }).charAt(0).toUpperCase() +
            format(currentWeekStart, 'MMMM dd', { locale: ptBR }).slice(1)}
          -{' '}
          {format(addDays(currentWeekStart, 6), 'MMMM dd', { locale: ptBR })
            .charAt(0)
            .toUpperCase() +
            format(addDays(currentWeekStart, 6), 'MMMM dd', { locale: ptBR }).slice(1)}
        </span>
        <button onClick={handleNextWeek} className="text-xl px-2 hover:text-blue-400">
          &gt;
        </button>
      </div>

      <div className="flex justify-between">
        {weekDays.map((day, index) => {
          const date = addDays(currentWeekStart, index);
          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

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
                  isSelected ? 'bg-blue-500 text-white' : ''
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
