import { Project } from '@/hooks/data/useProjectQuery';
import { StudyTopic } from '@/hooks/data/useStudyTopicQuery';
import { Task } from '@/types/Task';

export type CalendarView = 'mês' | 'semana' | 'dia' | 'agenda' | 'Lista do dia';

export interface CalendarEvent extends Task {
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: EventColor;
  studyTopic: StudyTopic;
  project: Project;
}

export type EventColor = 'lavender' | 'skyblue' | 'mint';
