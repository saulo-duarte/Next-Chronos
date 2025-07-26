import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import api from '@/lib/api';

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
  projectId?: string;
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

const API_URL = 'project/tasks';

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get(API_URL);
      return res.data;
    },
  });
}

export function useFilteredTasks(filters?: TaskFilters) {
  const { data: allTasks, ...queryResult } = useTasks();

  const filteredTasks = useMemo(() => {
    if (!allTasks || !filters) return allTasks || [];

    return allTasks.filter((task) => {
      if (filters.status) {
        const statusFilter = Array.isArray(filters.status) ? filters.status : [filters.status];
        if (!statusFilter.includes(task.status)) return false;
      }

      if (filters.type) {
        const typeFilter = Array.isArray(filters.type) ? filters.type : [filters.type];
        if (!typeFilter.includes(task.type)) return false;
      }

      if (filters.priority) {
        const priorityFilter = Array.isArray(filters.priority)
          ? filters.priority
          : [filters.priority];
        if (!priorityFilter.includes(task.priority)) return false;
      }

      if (filters.projectId && task.projectId !== filters.projectId) {
        return false;
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesName = task.name.toLowerCase().includes(searchTerm);
        const matchesDescription = task.description?.toLowerCase().includes(searchTerm);
        if (!matchesName && !matchesDescription) return false;
      }

      if (filters.dateRange) {
        const taskDate = new Date(task.dueDate || task.created_at);

        if (filters.dateRange.start) {
          const startDate = new Date(filters.dateRange.start);
          if (taskDate < startDate) return false;
        }

        if (filters.dateRange.end) {
          const endDate = new Date(filters.dateRange.end);
          if (taskDate > endDate) return false;
        }
      }

      return true;
    });
  }, [allTasks, filters]);

  return {
    ...queryResult,
    data: filteredTasks,
    tasks: filteredTasks,
  };
}

export const tasks = (filters?: TaskFilters) => {
  const queryClient = useQueryClient();
  const allTasks = queryClient.getQueryData<Task[]>(['tasks']) || [];

  if (!filters) return allTasks;

  return allTasks.filter((task) => {
    if (filters.status) {
      const statusFilter = Array.isArray(filters.status) ? filters.status : [filters.status];
      if (!statusFilter.includes(task.status)) return false;
    }

    if (filters.type) {
      const typeFilter = Array.isArray(filters.type) ? filters.type : [filters.type];
      if (!typeFilter.includes(task.type)) return false;
    }

    if (filters.priority) {
      const priorityFilter = Array.isArray(filters.priority)
        ? filters.priority
        : [filters.priority];
      if (!priorityFilter.includes(task.priority)) return false;
    }

    if (filters.projectId && task.projectId !== filters.projectId) {
      return false;
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesName = task.name.toLowerCase().includes(searchTerm);
      const matchesDescription = task.description?.toLowerCase().includes(searchTerm);
      if (!matchesName && !matchesDescription) return false;
    }

    if (filters.dateRange) {
      const taskDate = new Date(task.dueDate || task.created_at);

      if (filters.dateRange.start) {
        const startDate = new Date(filters.dateRange.start);
        if (taskDate < startDate) return false;
      }

      if (filters.dateRange.end) {
        const endDate = new Date(filters.dateRange.end);
        if (taskDate > endDate) return false;
      }
    }

    return true;
  });
};

export function useTask(id: string) {
  return useQuery<Task>({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<TaskPayload, 'id' | 'createdAt' | 'updatedAt'>) => {
      console.log('Creating task with data:', data);
      const res = await api.post(API_URL, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & UpdateTaskPayload) => {
      const res = await api.put(`${API_URL}/${id}`, data);
      return res.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });
}
