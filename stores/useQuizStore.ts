import { create } from 'zustand';
import { Question } from '@/hooks/data/useAIQuiz';

interface QuizConfig {
  tema: string;
  dificuldade: string;
  quantidade: number;
}

interface QuizStore {
  config: QuizConfig | null;
  setConfig: (config: QuizConfig) => void;
  clearConfig: () => void;

  questions: Question[];
  setQuestions: (questions: Question[]) => void;

  selectedQuestions: Question[];
  addSelectedQuestion: (question: Question) => void;
  removeSelectedQuestion: (index: number) => void;
  clearSelectedQuestions: () => void;
  userAnswers: string[];
  setUserAnswer: (index: number, answer: string) => void;
  setUserAnswers: (answers: string[]) => void;

  reset: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  config: null,
  setConfig: (config) => set({ config }),
  clearConfig: () => set({ config: null }),

  questions: [],
  setQuestions: (questions) => set({ questions }),

  selectedQuestions: [],
  addSelectedQuestion: (question) =>
    set((state) => ({
      selectedQuestions: [...state.selectedQuestions, question],
    })),
  removeSelectedQuestion: (index) =>
    set((state) => ({
      selectedQuestions: state.selectedQuestions.filter((_, i) => i !== index),
    })),
  clearSelectedQuestions: () => set({ selectedQuestions: [] }),

  userAnswers: [],
  setUserAnswer: (index, answer) =>
    set((state) => {
      const newAnswers = [...state.userAnswers];
      newAnswers[index] = answer;
      return { userAnswers: newAnswers };
    }),
  setUserAnswers: (answers) => set({ userAnswers: answers }),

  reset: () =>
    set({
      config: null,
      questions: [],
      selectedQuestions: [],
      userAnswers: [],
    }),
}));
