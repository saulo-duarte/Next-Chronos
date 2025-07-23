import { create } from 'zustand';
import { ProjectStatus } from '@/hooks/data/useProjectQuery';

interface NewProjectForm {
  title: string;
  description: string;
  status: ProjectStatus;
}

interface ProjectUIState {
  isAddModalOpen: boolean;
  newProjectForm: NewProjectForm;
  setIsAddModalOpen: (open: boolean) => void;
  setNewProjectForm: (data: Partial<NewProjectForm>) => void;
  resetNewProjectForm: () => void;
}

export const useProjectStore = create<ProjectUIState>((set, get) => ({
  isAddModalOpen: false,
  newProjectForm: {
    title: '',
    description: '',
    status: 'NOT_INITIALIZED',
  },
  setIsAddModalOpen: (open) => set({ isAddModalOpen: open }),
  setNewProjectForm: (data) =>
    set((state) => ({
      newProjectForm: {
        ...state.newProjectForm,
        ...data,
      },
    })),
  resetNewProjectForm: () =>
    set({
      newProjectForm: {
        title: '',
        description: '',
        status: 'NOT_INITIALIZED',
      },
    }),
}));
