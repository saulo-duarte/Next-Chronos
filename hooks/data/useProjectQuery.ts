import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export type ProjectStatus = 'NOT_INITIALIZED' | 'IN_PROGRESS' | 'COMPLETED';

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: ProjectStatus;
  created_at: string;
}

const API_URL = 'project';

export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get(API_URL);
      console.log('Fetched projects:', res.data);
      return res.data;
    },
  });
}

export function useProject(id: string) {
  return useQuery<Project>({
    queryKey: ['projects', id],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Project, 'id' | 'createdAt'>) => {
      const res = await api.post(API_URL, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Project> & { id: string }) => {
      const res = await api.put(`${API_URL}/${id}`, data);
      return res.data;
    },
    onSuccess: (updatedProject) => {
      queryClient.setQueryData<Project[]>(['projects'], (oldProjects) =>
        oldProjects?.map((project) => (project.id === updatedProject.id ? updatedProject : project))
      );

      queryClient.setQueryData<Project>(['projects', updatedProject.id], updatedProject);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`${API_URL}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}
