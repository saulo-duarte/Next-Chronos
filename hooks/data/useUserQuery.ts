import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

const API_URL = 'users';

export function useUser() {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await api.get(`${API_URL}/me`);
      return res.data;
    },
    staleTime: 1000 * 60 * 10,
  });
}
