import { create } from 'zustand';

interface NewStudySubjectForm {
  name: string;
  description: string;
}

interface StudySubjectUIState {
  isAddModalOpen: boolean;
  editingSubjectId: string | null;
  selectedSubjectName?: string | null;
  newStudySubjectForm: NewStudySubjectForm;
  editingStudySubjectId: string | null;

  setEditingStudySubjectId: (id: string | null) => void;
  setIsAddModalOpen: (open: boolean) => void;
  setEditingSubjectId: (id: string | null) => void;
  setSelectedSubjectName: (name?: string) => void;
  setNewStudySubjectForm: (data: Partial<NewStudySubjectForm>) => void;
  resetNewStudySubjectForm: () => void;
}

export const useStudySubjectStore = create<StudySubjectUIState>((set) => ({
  isAddModalOpen: false,
  editingSubjectId: null,
  selectedSubjectName: null,
  editingStudySubjectId: null,
  newStudySubjectForm: {
    name: '',
    description: '',
  },
  setIsAddModalOpen: (open) => set({ isAddModalOpen: open }),
  setEditingSubjectId: (id) => set({ editingSubjectId: id }),
  setEditingStudySubjectId: (id) => set({ editingStudySubjectId: id }),
  setSelectedSubjectName: (name) => set({ selectedSubjectName: name }),
  setNewStudySubjectForm: (data) =>
    set((state) => ({
      newStudySubjectForm: {
        ...state.newStudySubjectForm,
        ...data,
      },
    })),
  resetNewStudySubjectForm: () =>
    set({
      newStudySubjectForm: {
        name: '',
        description: '',
      },
    }),
}));
