import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { User, Sidequest, SidequestCompletion } from '@/types';

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;
  
  // Sidequests state
  sidequests: Sidequest[];
  setSidequests: (sidequests: Sidequest[]) => void;
  addSidequest: (sidequest: Sidequest) => void;
  
  // Completions state
  completions: SidequestCompletion[];
  setCompletions: (completions: SidequestCompletion[]) => void;
  addCompletion: (completion: SidequestCompletion) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // User state
        user: null,
        setUser: (user) => set({ user }),
        
        // Sidequests state
        sidequests: [],
        setSidequests: (sidequests) => set({ sidequests }),
        addSidequest: (sidequest) => 
          set((state) => ({ sidequests: [...state.sidequests, sidequest] })),
        
        // Completions state
        completions: [],
        setCompletions: (completions) => set({ completions }),
        addCompletion: (completion) =>
          set((state) => ({ completions: [...state.completions, completion] })),
        
        // UI state
        isLoading: false,
        setIsLoading: (isLoading) => set({ isLoading }),
      }),
      {
        name: 'sidequest-storage',
        partialize: (state) => ({
          user: state.user,
          completions: state.completions,
        }),
      }
    )
  )
);