import { Task, TaskFilters } from '@/types/Task';

export function filterTasks(tasks: Task[], filters?: TaskFilters): Task[] {
  if (!filters) return tasks;

  return tasks.filter((task) => {
    const matchStatus =
      !filters.status || filters.status.length === 0 || filters.status.includes(task.status);

    const matchType =
      !filters.type || filters.type.length === 0 || filters.type.includes(task.type);

    const matchPriority =
      !filters.priority ||
      filters.priority.length === 0 ||
      filters.priority.includes(task.priority);

    const matchProject = !filters.projectId || task.projectId === filters.projectId;

    const matchSearch = (() => {
      if (!filters.search) return true;
      const term = filters.search.toLowerCase();
      return (
        task.name.toLowerCase().includes(term) || task.description?.toLowerCase().includes(term)
      );
    })();

    const matchDate = (() => {
      if (!filters.dateRange) return true;

      const taskDate = new Date(task.dueDate || task.created_at);
      const start = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
      const end = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

      if (start && taskDate < start) return false;
      if (end && taskDate > end) return false;

      return true;
    })();

    return matchStatus && matchType && matchPriority && matchProject && matchSearch && matchDate;
  });
}
