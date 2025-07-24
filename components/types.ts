import { TaskPriority, TaskStatus, TaskType } from '@/hooks/data/useTasksQuery';

export type CalendarView = 'mês' | 'semana' | 'dia' | 'agenda';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: EventColor;
  location?: string;

  type?: TaskType;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export type EventColor = 'lavender' | 'skyblue' | 'mint';
