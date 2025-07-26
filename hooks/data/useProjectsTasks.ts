import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import api from '@/lib/api';
import { Task, TaskFilters } from '@/types/Task';
import { filterTasks } from '@/utils/filter-task';

export function useProjectTasks(projectId?: string) {
  return useQuery<Task[]>({
    queryKey: ['projectTasks', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const res = await api.get(`/project/${projectId}/tasks`);
      return res.data;
    },
    enabled: !!projectId,
  });
}

export function useFilteredProjectTasks(
  projectId?: string,
  filters?: Omit<TaskFilters, 'projectId'>
) {
  const { data: tasks, ...queryResult } = useProjectTasks(projectId);

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return filterTasks(tasks, filters);
  }, [tasks, filters]);

  return {
    ...queryResult,
    data: filteredTasks,
    tasks: filteredTasks,
  };
}
