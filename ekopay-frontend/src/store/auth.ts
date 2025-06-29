// src/store/auth.ts
import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  clearToken: () => {
    localStorage.removeItem('token');
    set({ token: null });
  },
}));

export const getAuthToken = () => {
  const { token } = useAuthStore.getState(); // not a hook
  return token;
};
