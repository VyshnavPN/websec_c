// src/state/useToolStore.js
import { create } from 'zustand'

export const useToolStore = create((set) => ({
  activeTool: 'exploit', // start in exploit mode by default
  setActiveTool: (tool) => set({ activeTool: tool }),
}))