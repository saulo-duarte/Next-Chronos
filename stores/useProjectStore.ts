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
  editingProjectId: string | null;
  selectedProjectTitle?: string | null;
  setEditingProjectId: (id: string | null) => void;
  setSelectedProjectTitle: (title?: string) => void;
  setIsAddModalOpen: (open: boolean) => void;
  setNewProjectForm: (data: Partial<NewProjectForm>) => void;
  resetNewProjectForm: () => void;
}

export const useProjectStore = create<ProjectUIState>((set, get) => ({
  selectedProjectTitle: null,
  isAddModalOpen: false,
  newProjectForm: {
    title: '',
    description: '',
    status: 'NOT_INITIALIZED',
  },
  editingProjectId: null,
  setSelectedProjectTitle: (title) => set({ selectedProjectTitle: title }),
  setEditingProjectId: (id) => set({ editingProjectId: id }),
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
