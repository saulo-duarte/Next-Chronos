import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export interface StudySubject {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const API_URL = 'study-subjects';

export function useStudySubjects() {
  return useQuery<StudySubject[]>({
    queryKey: ['study-subjects'],
    queryFn: async () => {
      const res = await api.get(API_URL);
      console.log('response from useStudySubjects:', res);
      return res.data.subjects;
    },
  });
}

export function useStudySubject(id: string) {
  return useQuery<StudySubject>({
    queryKey: ['study-subjects', id],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateStudySubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<StudySubject, 'id' | 'createdAt' | 'updatedAt'>) => {
      const res = await api.post(API_URL, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-subjects'] });
    },
  });
}

export function useUpdateStudySubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<StudySubject> & { id: string }) => {
      const res = await api.put(`${API_URL}/${id}`, data);
      return res.data;
    },
    onSuccess: (updatedSubject) => {
      queryClient.setQueryData<StudySubject[]>(['study-subjects'], (old) =>
        old?.map((s) => (s.id === updatedSubject.id ? updatedSubject : s))
      );

      queryClient.setQueryData<StudySubject>(['study-subjects', updatedSubject.id], updatedSubject);
    },
  });
}

export function useDeleteStudySubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`${API_URL}/${id}`);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<StudySubject[]>(['study-subjects'], (old) =>
        old?.filter((s) => s.id !== id)
      );
      queryClient.invalidateQueries({ queryKey: ['study-subjects'] });
    },
  });
}
