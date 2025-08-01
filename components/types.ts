import { Task } from '@/types/Task';

export type CalendarView = 'mês' | 'semana' | 'dia' | 'agenda' | 'Lista do dia';

export interface CalendarEvent extends Task {
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: EventColor;
}

export type EventColor = 'lavender' | 'skyblue' | 'mint';
