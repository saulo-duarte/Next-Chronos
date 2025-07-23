import { create } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatarUrl?: string;
};

type AuthStore = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));

import { useEffect } from 'react';

export function useFetchMe() {
  const setUser = useAuthStore((state) => state.setUser);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  const url = `${baseUrl}/api/v1/auth/me`;

  const query = useQuery<AuthUser>({
    queryKey: ['me'],
    queryFn: async () => {
      const response = await axios.get(url, {
        withCredentials: true,
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
    } else if (query.isError) {
      setUser(null);
    }
  }, [query.isSuccess, query.isError, query.data, setUser]);

  return query;
}
