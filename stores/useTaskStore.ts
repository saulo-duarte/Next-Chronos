import { create } from 'zustand';

interface TaskUIState {
  selectedTaskId: string | null;
  isModalOpen: boolean;
  setSelectedTask: (id: string | null) => void;
  setModalOpen: (open: boolean) => void;
}

export const useTaskStore = create<TaskUIState>((set) => ({
  selectedTaskId: null,
  isModalOpen: false,
  setSelectedTask: (id) => set({ selectedTaskId: id }),
  setModalOpen: (open) => set({ isModalOpen: open }),
}));
