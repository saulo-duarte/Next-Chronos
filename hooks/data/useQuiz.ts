import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Quiz {
  id: string;
  subject_id: string;
  topic: string;
  total_questions: number;
  user_id: string;
  correct_count: number;
  created_at: string;
}

export interface QuizWithQuestionsDTO {
  quiz: {
    id: string;
    user_id: string;
    subject_id: string;
    topic: string;
    total_questions: number;
    correct_count: number;
    created_at: string;
  };
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  content: string;
  correct_answer: string;
  explanation: string;
  order_index: number;
  created_at: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
}

export interface CreateQuizPayload {
  quiz: Omit<Quiz, 'id' | 'created_at' | 'completed_at' | 'total_questions'>;
  questions: Omit<QuizQuestion, 'id' | 'quiz_id' | 'created_at'>[];
}

const API_URL = 'quizzes';

export function useQuizzes(subjectId?: string) {
  return useQuery<Quiz[]>({
    queryKey: ['quizzes', subjectId],
    queryFn: async () => {
      const res = await api.get(API_URL, {
        params: subjectId ? { subject_id: subjectId } : undefined,
      });
      return res.data.quizzes ?? res.data;
    },
  });
}

export function useQuiz(id: string) {
  return useQuery<Quiz>({
    queryKey: ['quizzes', id],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useQuizQuestions(quizId: string) {
  return useQuery<QuizQuestion[]>({
    queryKey: ['quizzes', quizId, 'questions'],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/${quizId}/questions`);
      return res.data.questions ?? res.data;
    },
    enabled: !!quizId,
  });
}

export function useCreateQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateQuizPayload) => {
      const res = await api.post(API_URL, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
}

export function useDeleteQuiz() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (quizId: string) => {
      await api.delete(`${API_URL}/${quizId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
}

export function useAddQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      quizId,
      question,
    }: {
      quizId: string;
      question: Omit<QuizQuestion, 'id' | 'created_at'>;
    }) => {
      const res = await api.post(`${API_URL}/${quizId}/questions`, question);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quizzes', variables.quizId, 'questions'] });
    },
  });
}

export function useRemoveQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (questionId: string) => {
      await api.delete(`questions/${questionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
}

export function useQuizWithQuestions(quizId: string) {
  return useQuery<QuizWithQuestionsDTO>({
    queryKey: ['quizzes', quizId, 'withQuestions'],
    queryFn: async () => {
      const res = await api.get(`quizzes/${quizId}`);
      return res.data as QuizWithQuestionsDTO;
    },
    enabled: !!quizId,
  });
}

export function useListQuizzes() {
  return useQuery<Quiz[]>({
    queryKey: ['quizzes'],
    queryFn: async () => {
      const res = await api.get('quizzes');
      return res.data.quizzes ?? res.data;
    },
  });
}
