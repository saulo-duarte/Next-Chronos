import { Project } from '@/hooks/data/useProjectQuery';
import { StudyTopic } from '@/hooks/data/useStudyTopicQuery';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskType = 'PROJECT' | 'STUDY' | 'EVENT';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  dueDate?: string;
  startDate?: string;
  doneAt?: string;
  created_at: string;
  updatedAt: string;
  projectName?: string;
  projectId?: string;
  studyTopicId?: string;
  studyTopicName?: string;
  project: Project;
  studyTopic: StudyTopic;
}

export interface TaskPayload {
  name: string;
  description?: string;
  status: TaskStatus;
  type: TaskType;
  priority: TaskPriority;
  dueDate?: string;
  startDate?: string;
  projectId?: string;
  studyTopicId?: string;
}

export interface UpdateTaskPayload {
  id: string;
  name?: string | null;
  description?: string | null;
  status: TaskStatus;
  priority?: TaskPriority | null;
  startDate?: string | null;
  dueDate?: string | null;
  removeDueDate?: boolean;
  doneAt?: string | null;
}

export interface TaskFilters {
  status?: TaskStatus | TaskStatus[];
  type?: TaskType | TaskType[];
  priority?: TaskPriority | TaskPriority[];
  projectId?: string;
  search?: string;
  dateRange?: {
    start?: string;
    end?: string;
  };
  overdue?: boolean;
}

export interface DashboardInfo {
  last_tasks: Task[];
  month: Task[];
  stats: {
    total: number;
    done: number;
    todo: number;
    in_progress: number;
    overdue: number;
  };
  type: {
    event: number;
    project: number;
    study: number;
  };
}
