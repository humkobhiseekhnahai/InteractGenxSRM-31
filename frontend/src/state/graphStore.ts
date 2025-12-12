import { create } from "zustand";
import type { GraphData } from "../types/graph";

interface GraphState {
  // === NEW: Graph Data for drilldown ===
  graphData: GraphData | null;
  setGraphData: (g: GraphData) => void;

  history: GraphData[];
  pushHistory: (g: GraphData) => void;
  popHistory: () => GraphData | null;

  // === EXISTING: Node selection ===
  selectedNodeId: string | null;
  highlightNodeId: string | null;

  setSelectedNode: (id: string | null) => void;
  setHighlightNode: (id: string | null) => void;

  // === EXISTING: Called by Cmd+K spotlight search ===
  focusNode: (id: string) => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  // === NEW ===
  graphData: null,
  setGraphData: (g) => set({ graphData: g }),

  history: [],
  pushHistory: (g) =>
    set((state) => ({
      history: [...state.history, g],
    })),

  popHistory: () => {
    const h = get().history;
    if (h.length === 0) return null;

    const newH = [...h];
    const last = newH.pop();
    set({ history: newH });
    return last ?? null;
  },

  // === EXISTING ===
  selectedNodeId: null,
  highlightNodeId: null,

  setSelectedNode: (id) => set({ selectedNodeId: id }),
  setHighlightNode: (id) => set({ highlightNodeId: id }),

  // Spotlight / Cmd+K uses this
  focusNode: (id) =>
    set({
      selectedNodeId: id,
      highlightNodeId: id,
    }),
}));