'use client';

import { useState, useMemo } from 'react';
import { addDays, parseISO } from 'date-fns';
import { EventCalendar } from './event-calendar';
import { CalendarEvent } from './types';
import { TaskType, useTasks } from '@/hooks/data/useTasksQuery';
import { Task } from '@/hooks/data/useTasksQuery';
import { useCalendarStore } from '@/stores/useCalendarStore';
import { WeekSelector } from './WeekSelector';

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
  let startDate: Date;
  if (task.dueDate) {
    startDate = parseISO(task.dueDate);
  } else if (task.created_at) {
    startDate = parseISO(task.created_at);
  } else {
    startDate = new Date();
  }

  const isAllDay = task.dueDate ? !task.dueDate.includes('T') : true;

  const start = startDate;
  const end = isAllDay ? startDate : addDays(start, 0);

  return {
    id: task.id,
    title: task.name,
    description: task.description || '',
    start: task.startDate ? parseISO(task.startDate) : start,
    end: task.dueDate ? parseISO(task.dueDate) : end,
    allDay: isAllDay,
    color: getTaskTypeColor(task.type),
    location: task.projectId ? `Projeto: ${task.projectId}` : undefined,

    type: task.type,
    status: task.status,
    priority: task.priority,
  };
};

export default function TaskCalendar() {
  const { data: tasks, isLoading, isError, error, refetch } = useTasks();
  const { calendarView } = useCalendarStore();

  const calendarEvents = useMemo(() => {
    if (!tasks) return [];
    return tasks.map(taskToCalendarEvent);
  }, [tasks]);

  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useMemo(() => {
    setEvents(calendarEvents);
  }, [calendarEvents]);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents([...events, event]);
    console.log('Nova task a ser criada:', event);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)));
    console.log('Task a ser atualizada:', updatedEvent);
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
    console.log('Task a ser excluída:', eventId);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold mb-4">Calendário de Tarefas</h1>
        <p>Carregando tarefas...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Calendário de Tarefas</h1>
        <p className="text-red-500">Erro ao carregar tarefas: {String(error)}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mt-2">
      {calendarView === 'semana' || calendarView === 'dia' ? (
        <div className="max-w-7xl mx-auto px-4 mb-4">
          <WeekSelector />
        </div>
      ) : null}

      <EventCalendar
        events={events}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  );
}
