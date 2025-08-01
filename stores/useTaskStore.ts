import { create } from 'zustand';
import { Task, TaskFilters, TaskPriority, TaskStatus, TaskType } from '@/types/Task';

interface TaskUIState {
  selectedTaskId: string | null;
  selectedTask: Task | null;
  selectedTopicId: string | null;
  isModalOpen: boolean;
  isEditDrawerOpen: boolean;
  editingTaskId: string | null;
  filters: TaskFilters;
  setSelectedTask: (task: Task | null) => void;
  setSelectedTopicId: (id: string | null) => void;
  setModalOpen: (open: boolean) => void;
  setEditDrawerOpen: (open: boolean) => void;
  setEditingTask: (id: string | null) => void;
  setStatusFilter: (status: TaskStatus | TaskStatus[] | undefined) => void;
  setTypeFilter: (type: TaskType | TaskType[] | undefined) => void;
  setPriorityFilter: (priority: TaskPriority | TaskPriority[] | undefined) => void;
  setProjectFilter: (projectId: string | undefined) => void;
  setSearchFilter: (search: string | undefined) => void;
  setDateRangeFilter: (dateRange: { start?: string; end?: string } | undefined) => void;
  setOverdueFilter: (overdue: boolean | undefined) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
}

export const useTaskStore = create<TaskUIState>((set, get) => ({
  selectedTaskId: null,
  selectedTask: null,
  selectedTopicId: null,
  isModalOpen: false,
  isEditDrawerOpen: false,
  editingTaskId: null,
  filters: {},
  setSelectedTask: (task) => set({ selectedTask: task }),
  setSelectedTopicId: (id) => set({ selectedTopicId: id }),
  setModalOpen: (open) => set({ isModalOpen: open }),
  setEditDrawerOpen: (open) => set({ isEditDrawerOpen: open }),
  setEditingTask: (id) => set({ editingTaskId: id }),
  setStatusFilter: (status) =>
    set((state) => ({
      filters: { ...state.filters, status },
    })),
  setTypeFilter: (type) =>
    set((state) => ({
      filters: { ...state.filters, type },
    })),
  setPriorityFilter: (priority) =>
    set((state) => ({
      filters: { ...state.filters, priority },
    })),
  setProjectFilter: (projectId) =>
    set((state) => ({
      filters: { ...state.filters, projectId },
    })),
  setSearchFilter: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
    })),
  setDateRangeFilter: (dateRange) =>
    set((state) => ({
      filters: { ...state.filters, dateRange },
    })),
  setOverdueFilter: () => {
    const now = new Date();
    const isoNow = now.toISOString();
    set((state) => ({
      filters: {
        ...state.filters,
        status: ['TODO', 'IN_PROGRESS'],
        dateRange: {
          end: isoNow,
        },
      },
    }));
  },
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  clearFilters: () => set({ filters: {} }),
  hasActiveFilters: () => {
    const { filters } = get();
    return Object.keys(filters).some((key) => {
      const value = filters[key as keyof TaskFilters];
      return value !== undefined && value !== null && value !== '';
    });
  },
}));
