'use client';

import { useMemo } from 'react';
import { addDays, format, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarEvent } from './types';
import { AgendaDaysToShow } from './constants';
import { getAgendaEventsForDay } from './utils';
import { EventItem } from './event-item';
import Image from 'next/image';

interface AgendaViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventSelect: (event: CalendarEvent) => void;
}

export function AgendaView({ currentDate, events, onEventSelect }: AgendaViewProps) {
  const days = useMemo(() => {
    return Array.from({ length: AgendaDaysToShow }, (_, i) => addDays(new Date(currentDate), i));
  }, [currentDate]);

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventSelect(event);
  };

  const hasEvents = days.some((day) => getAgendaEventsForDay(events, day).length > 0);

  return (
    <div className="px-0 sm:px-4 -mt-8">
      {!hasEvents ? (
        <div className="flex min-h-[70svh] flex-col items-center justify-center py-16 text-center">
          <Image
            src="/svg/Empty Calendar.svg"
            alt="Calendário vazio"
            width={250}
            height={250}
            className="mb-4"
          />
          <h3 className="text-2xl font-semibold text-primary mb-2">Bem-vindo à sua Agenda!</h3>
          <p className="text-foreground/90 text-md mb-2">
            Comece adicionando seus primeiros eventos para organizar seus compromissos.
          </p>
        </div>
      ) : (
        days.map((day) => {
          const dayEvents = getAgendaEventsForDay(events, day);
          if (dayEvents.length === 0) return null;

          return (
            <div key={day.toString()} className="border-border/70 relative my-12 border-t">
              <span
                className="bg-background absolute -top-3 left-0 flex h-6 items-center pe-4 text-[10px] uppercase data-today:font-medium sm:pe-4 sm:text-xs"
                data-today={isToday(day) || undefined}
              >
                {format(day, 'd MMM, EEEE', { locale: ptBR })}
              </span>
              <div className="mt-6 space-y-2">
                {dayEvents.map((event) => (
                  <EventItem
                    key={event.id}
                    event={event}
                    view="agenda"
                    onClick={(e) => handleEventClick(event, e)}
                  />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
