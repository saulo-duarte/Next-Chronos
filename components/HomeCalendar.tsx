'use client';
import { useMemo } from 'react';
import { parseISO } from 'date-fns';
import { EventCalendar } from './event-calendar';
import { CalendarEvent } from './types';
import { useFilteredTasks } from '@/hooks/data/useTasksQuery';
import { Task } from '@/types/Task';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { useTaskStore } from '@/stores/useTaskStore';
import { WeekSelector } from './WeekSelector';
import { TaskType } from '@/types/Task';

const getTaskTypeColor = (taskType: TaskType): CalendarEvent['color'] => {
  switch (taskType) {
    case 'EVENT':
      return 'mint';
    case 'PROJECT':
      return 'skyblue';
    case 'STUDY':
      return 'lavender';
  }
};

const taskToCalendarEvent = (task: Task): CalendarEvent => {
  const startDate = task.startDate ? parseISO(task.startDate) : new Date();
  const endDate = task.dueDate ? parseISO(task.dueDate) : startDate;
  const isAllDay = task.dueDate ? !task.dueDate.includes('T') : true;

  return {
    ...task,
    start: startDate,
    end: endDate,
    allDay: isAllDay,
    color: getTaskTypeColor(task.type),
  };
};

export default function TaskCalendar() {
  const { filters } = useTaskStore();

  const { data: filteredTasks, isLoading, isError, error, refetch } = useFilteredTasks(filters);

  const { calendarView } = useCalendarStore();

  const events = useMemo(() => {
    if (!filteredTasks) return [];
    return filteredTasks.map(taskToCalendarEvent);
  }, [filteredTasks]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold mb-4">Calendário de Tarefas</h1>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Carregando tarefas...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Calendário de Tarefas</h1>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive font-medium">Erro ao carregar tarefas</p>
          <p className="text-destructive/80 text-sm mt-1">{String(error)}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-2 px-2">
      {(calendarView === 'semana' || calendarView === 'dia' || calendarView === 'Lista do dia') && (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <WeekSelector />
        </div>
      )}

      <EventCalendar events={events} />
    </div>
  );
}
