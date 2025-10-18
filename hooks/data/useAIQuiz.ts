import api from '@/lib/api';
import { useMutation } from '@tanstack/react-query';

export interface Question {
  tema: string;
  dificuldade: string;
  pergunta: string;
  alternativas: string[];
  resposta_correta: string;
}

export interface AIQuizPayload {
  tema: string;
  dificuldade: string;
  quantidade: number;
}

const API_URL = 'ai-quiz';

export function useAIQuiz() {
  return useMutation({
    mutationFn: async (data: AIQuizPayload) => {
      const res = await api.post(`${API_URL}/`, data);
      return res.data as Question[];
    },
  });
}
