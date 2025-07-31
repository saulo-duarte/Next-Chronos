import { create } from 'zustand';
import { TaskFilters, TaskPriority, TaskStatus, TaskType } from '@/types/Task';

interface TaskUIState {
  selectedTaskId: string | null;
  selectedTopicId: string | null;
  isModalOpen: boolean;

  filters: TaskFilters;

  setSelectedTask: (id: string | null) => void;
  setSelectedTopicId: (id: string | null) => void;
  setModalOpen: (open: boolean) => void;

  setStatusFilter: (status: TaskStatus | TaskStatus[] | undefined) => void;
  setTypeFilter: (type: TaskType | TaskType[] | undefined) => void;
  setPriorityFilter: (priority: TaskPriority | TaskPriority[] | undefined) => void;
  setProjectFilter: (projectId: string | undefined) => void;
  setSearchFilter: (search: string | undefined) => void;
  setDateRangeFilter: (dateRange: { start?: string; end?: string } | undefined) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;

  hasActiveFilters: () => boolean;
}

export const useTaskStore = create<TaskUIState>((set, get) => ({
  selectedTaskId: null,
  selectedTopicId: null,
  isModalOpen: false,
  filters: {},

  setSelectedTask: (id) => set({ selectedTaskId: id }),
  setSelectedTopicId: (id) => set({ selectedTopicId: id }),
  setModalOpen: (open) => set({ isModalOpen: open }),

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
