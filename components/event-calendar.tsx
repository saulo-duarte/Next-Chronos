'use client';

import { useMemo, useState } from 'react';
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CalendarEvent, CalendarView } from './types';
import { AgendaDaysToShow, EventGap, EventHeight, WeekCellsHeight } from './constants';
export { AgendaDaysToShow } from './constants';
import { CalendarDndProvider } from './calendar-dnd-context';
import { MonthView } from './month-view';
import { WeekView } from './week-view';
import { DayView } from './day-view';
import { AgendaView } from './agenda-view';
import { EventDialog } from './event-dialog';
import { useTaskStore } from '@/stores/useTaskStore';

export interface EventCalendarProps {
  events?: CalendarEvent[];
  onEventAdd?: (event: CalendarEvent) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
  className?: string;
  initialView?: CalendarView;
}

export function EventCalendar({
  events = [],
  onEventUpdate,
  className,
  initialView = 'month',
}: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(initialView);
  const { setSelectedTask, setModalOpen } = useTaskStore();

  const handlePrevious = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, -1));
    } else if (view === 'agenda') {
      setCurrentDate(addDays(currentDate, -AgendaDaysToShow));
    }
  };

  const handleNext = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (view === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else if (view === 'day') {
      setCurrentDate(addDays(currentDate, 1));
    } else if (view === 'agenda') {
      // For agenda view, go forward 30 days (a full month)
      setCurrentDate(addDays(currentDate, AgendaDaysToShow));
    }
  };

  const handleEventSelect = (event: CalendarEvent) => {
    console.log('Event selected:', event);
    setSelectedTask(event.id);
    setModalOpen(true);
  };

  const handleEventCreate = (startTime: Date) => {
    console.log('Creating new event at:', startTime);

    // Arredonda para o múltiplo de 15 mais próximo
    const minutes = startTime.getMinutes();
    const remainder = minutes % 15;
    if (remainder !== 0) {
      if (remainder < 7.5) {
        startTime.setMinutes(minutes - remainder);
      } else {
        startTime.setMinutes(minutes + (15 - remainder));
      }
      startTime.setSeconds(0);
      startTime.setMilliseconds(0);
    }

    setSelectedTask(null);
    setModalOpen(true);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    onEventUpdate?.(updatedEvent);

    // Show toast notification when an event is updated via drag and drop
    toast(`Event "${updatedEvent.title}" moved`, {
      description: format(new Date(updatedEvent.start), 'MMM d, yyyy'),
      position: 'bottom-left',
    });
  };

  const viewTitle = useMemo(() => {
    if (view === 'month') {
      return format(currentDate, 'MMMM yyyy');
    } else if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      if (isSameMonth(start, end)) {
        return format(start, 'MMMM yyyy');
      } else {
        return `${format(start, 'MMM')} - ${format(end, 'MMM yyyy')}`;
      }
    } else if (view === 'day') {
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
    } else if (view === 'agenda') {
      // Show the month range for agenda view
      const start = currentDate;
      const end = addDays(currentDate, AgendaDaysToShow - 1);

      if (isSameMonth(start, end)) {
        return format(start, 'MMMM yyyy');
      } else {
        return `${format(start, 'MMM')} - ${format(end, 'MMM yyyy')}`;
      }
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  }, [currentDate, view]);

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
      <CalendarDndProvider onEventUpdate={handleEventUpdate}>
        <div className={cn('flex items-center justify-between p-2 sm:p-0', className)}>
          <div className="flex items-center gap-1 sm:gap-1 max-[479px]:hidden">
            <div className="flex items-center sm:gap-2">
              <Button variant="ghost" size="icon" onClick={handlePrevious} aria-label="Previous">
                <ChevronLeftIcon size={16} aria-hidden="true" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNext} aria-label="Next">
                <ChevronRightIcon size={16} aria-hidden="true" />
              </Button>
            </div>
            <h2 className="text-sm font-semibold sm:text-[6px] md:text-xl">{viewTitle}</h2>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn('gap-1 max-[479px]:h-8', 'min-[480px]:w-auto max-[479px]:w-24')}
                >
                  <span className="md:text-md" aria-hidden="true">
                    {view.charAt(0).toUpperCase() + view.slice(1)}
                  </span>
                  <ChevronDownIcon className="-me-1 opacity-60" size={16} aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-32">
                <DropdownMenuItem onClick={() => setView('month')}>
                  Month <DropdownMenuShortcut>M</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('week')}>
                  Week <DropdownMenuShortcut>W</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('day')}>
                  Day <DropdownMenuShortcut>D</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setView('agenda')}>
                  Agenda <DropdownMenuShortcut>A</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="max-[479px]:hidden">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedTask(null);
                  setModalOpen(true);
                }}
              >
                <PlusIcon className="opacity-60 sm:-ms-1" size={16} aria-hidden="true" />
                <span className="max-sm:sr-only">Novo Evento</span>
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          {view === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventSelect={handleEventSelect}
              onEventCreate={handleEventCreate}
            />
          )}
          {view === 'day' && (
            <DayView
              currentDate={currentDate}
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
          aria-label="New event"
        >
          <PlusIcon size={24} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
