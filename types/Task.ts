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
  name?: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  startDate?: string;
  doneAt?: string;
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
}
