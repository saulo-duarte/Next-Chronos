import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface StudyTopic {
  id: string;
  name: string;
  description?: string;
  position: number;
  subjectId: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = '/study-topics';

export function useStudyTopics(subjectId: string) {
  return useQuery<StudyTopic[]>({
    queryKey: ['study-topics', subjectId],
    queryFn: async () => {
      const res = await api.get(`/study-topics/subject/${subjectId}`);
      return res.data.topics;
    },
    enabled: !!subjectId,
  });
}

export function useStudyTopic(id: string) {
  return useQuery<StudyTopic>({
    queryKey: ['study-topic', id],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateStudyTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<StudyTopic, 'id' | 'createdAt' | 'updatedAt'>) => {
      const res = await api.post(API_URL, data);
      return res.data;
    },
    onSuccess: (newTopic) => {
      queryClient.invalidateQueries({ queryKey: ['study-topics', newTopic.subjectId] });
    },
  });
}

export function useUpdateStudyTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<StudyTopic> & { id: string }) => {
      const res = await api.put(`${API_URL}/${data.id}`, data);
      return res.data;
    },
    onSuccess: (updatedTopic) => {
      queryClient.setQueryData<StudyTopic>(['study-topic', updatedTopic.id], updatedTopic);
      queryClient.invalidateQueries({ queryKey: ['study-topics', updatedTopic.subjectId] });
    },
  });
}

export function useDeleteStudyTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await api.delete(`${API_URL}/${id}`);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['study-topics'] });
      queryClient.removeQueries({ queryKey: ['study-topic', id] });
    },
  });
}
