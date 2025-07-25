'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { MdAssignmentAdd } from 'react-icons/md';
import { useTaskStore } from '@/stores/useTaskStore';
import { CalendarEvent, CalendarView } from './types';
import { EventGap, EventHeight, WeekCellsHeight } from './constants';
import { MonthView } from './month-view';
import { WeekView } from './week-view';
import { DayView } from './day-view';
import { AgendaView } from './agenda-view';
import { EventDialog } from './event-dialog';
import { CalendarDndProvider } from './calendar-dnd-context';
import { CalendarHeader } from './calendar-header';
import { useCalendarNavigation } from '@/hooks/calendar/useCalendarNavigation';
import { useViewTitle } from '@/hooks/calendar/useViewTitle';
import { roundToNearest15 } from '@/utils/date-utils';
import { useCalendarStore } from '@/stores/useCalendarStore';

export interface EventCalendarProps {
  events?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
  initialView?: CalendarView;
}

export function EventCalendar({ events = [], onEventUpdate, className }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { calendarView: view, setCalendarView: setView } = useCalendarStore();
  const { setSelectedTask, setModalOpen } = useTaskStore();

  const { handleNext, handlePrevious } = useCalendarNavigation(view, currentDate, setCurrentDate);
  const viewTitle = useViewTitle(view, currentDate);

  const handleEventSelect = (event: CalendarEvent) => {
    setSelectedTask(event.id);
    setModalOpen(true);
  };

  const handleEventCreate = (startTime: Date) => {
    roundToNearest15(startTime);
    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleEventUpdateInternal = (updatedEvent: CalendarEvent) => {
    onEventUpdate?.(updatedEvent);
    toast(`Evento "${updatedEvent.title}" movido`, {
      description: format(new Date(updatedEvent.start), 'MMM d, yyyy'),
      position: 'bottom-left',
    });
  };

  return (
    <div
      className="flex flex-col rounded-lg has-data-[slot=month-view]:flex-1"
      style={
        {
          '--event-height': `${EventHeight}px`,
          '--event-gap': `${EventGap}px`,
          '--week-cells-height': `${WeekCellsHeight}px`,
        } as React.CSSProperties
      }
    >
      <CalendarDndProvider onEventUpdate={handleEventUpdateInternal}>
        <CalendarHeader
          view={view}
          setView={(v: string) => setView(v as CalendarView)}
          viewTitle={viewTitle}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onNewEvent={() => {
            setSelectedTask(null);
            setModalOpen(true);
          }}
          className={className}
        />

        <div className="flex flex-1 flex-col">
          {view === 'mês' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === 'semana' && (
            <WeekView
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === 'dia' && (
            <DayView
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === 'agenda' && (
            <AgendaView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
            />
          )}
        </div>

        <EventDialog />
      </CalendarDndProvider>

      <div className="min-[480px]:hidden">
        <button
          type="button"
          className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition hover:bg-primary/90"
          onClick={() => {
            setSelectedTask(null);
            setModalOpen(true);
          }}
          aria-label="Novo evento"
        >
          <MdAssignmentAdd size={24} />
        </button>
      </div>
    </div>
  );
}
