import { create } from 'zustand';

interface NewStudyTopicForm {
  name: string;
  description: string;
}

interface StudyTopicUIState {
  isTopicModalOpen: boolean;
  editingTopicId: string | null;
  parentSubjectId: string | null;
  newStudyTopicForm: NewStudyTopicForm;

  setIsTopicModalOpen: (open: boolean) => void;
  setEditingTopicId: (id: string | null) => void;
  setParentSubjectId: (id: string | null) => void;
  setNewStudyTopicForm: (data: Partial<NewStudyTopicForm>) => void;
  resetNewStudyTopicForm: () => void;
}

export const useStudyTopicStore = create<StudyTopicUIState>((set) => ({
  isTopicModalOpen: false,
  editingTopicId: null,
  parentSubjectId: null,
  newStudyTopicForm: {
    name: '',
    description: '',
  },

  setIsTopicModalOpen: (open) => set({ isTopicModalOpen: open }),
  setEditingTopicId: (id) => set({ editingTopicId: id }),
  setParentSubjectId: (id) => set({ parentSubjectId: id }),

  setNewStudyTopicForm: (data) =>
    set((state) => ({
      newStudyTopicForm: {
        ...state.newStudyTopicForm,
        ...data,
      },
    })),

  resetNewStudyTopicForm: () =>
    set({
      newStudyTopicForm: {
        name: '',
        description: '',
      },
    }),
}));
