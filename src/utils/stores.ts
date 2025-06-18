import { create } from 'zustand'

interface AuthState {
    token: string | null;
    setToken: (token: string) => void;
    clearToken: () => void;
  }
  
export const useAuthStore = create<AuthState>((set) => ({
token: null,
setToken: (token) => set({ token }),
clearToken: () => set({ token: null }),
}));

interface ResultLanguage {
    language: string;
    setLanguage: (language : string) => void;
}
export const useLanguage = create<ResultLanguage>((set) => ({
    language: 'en',
    setLanguage: (v) => set({
        language: v
    })
}))