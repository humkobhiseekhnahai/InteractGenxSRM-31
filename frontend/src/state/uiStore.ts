import { create } from "zustand";

interface UIState {
  // Spotlight search / command palette
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  toggleCommand: () => void;

  // Blog modal state
  blogModalOpen: boolean;
  currentBlogId: string | null;
  openBlogModal: (id: string) => void;
  closeBlogModal: () => void;

  // Navigation history
  history: string[];
  pushHistory: (id: string) => void;
  popHistory: () => string | null;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Spotlight Search
  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),
  toggleCommand: () => set((s) => ({ commandOpen: !s.commandOpen })),

  // Modal state
  blogModalOpen: false,
  currentBlogId: null,

  // 🚀 DO NOT push to history here
  openBlogModal: (id: string) =>
    set({
      blogModalOpen: true,
      currentBlogId: id,
    }),

  closeBlogModal: () =>
    set({
      blogModalOpen: false,
      currentBlogId: null,
    }),

  // Navigation stack
  history: [],

  pushHistory: (id: string) =>
    set((s) => ({
      history: [...s.history, id],
    })),

  popHistory: () => {
    const h = get().history;
    if (h.length === 0) return null;

    const newH = [...h];
    const prev = newH.pop();

    set({ history: newH });

    return prev ?? null;
  },
}));