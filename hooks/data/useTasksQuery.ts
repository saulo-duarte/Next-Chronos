import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import api from '@/lib/api';
import { Task, TaskFilters, TaskPayload, UpdateTaskPayload } from '@/types/Task';
import { filterTasks } from '@/utils/filter-task';

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
    if (!allTasks) return [];
    return filterTasks(allTasks, filters);
  }, [allTasks, filters]);

  return {
    ...queryResult,
    data: filteredTasks,
    tasks: filteredTasks,
  };
}

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
      const res = await api.post(API_URL, data);
      return res.data;
    },
    onSuccess: (createdTask) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      if (createdTask.projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projectTasks', createdTask.projectId],
        });
      }
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
    onSuccess: (updatedTask, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });

      if (updatedTask.projectId) {
        queryClient.invalidateQueries({ queryKey: ['projectTasks', updatedTask.projectId] });
      }
    },
  });
}

type DeleteTaskPayload = {
  id: string;
  projectId?: string;
};

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteTaskPayload) => {
      await api.delete(`${API_URL}/${id}`);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (variables?.projectId) {
        queryClient.invalidateQueries({ queryKey: ['projectTasks', variables.projectId] });
      }
    },
  });
}
