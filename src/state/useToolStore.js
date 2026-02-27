// src/state/useToolStore.js
import { create } from 'zustand'

export const useToolStore = create((set) => ({
  activeTool: 'recon', // Default state
  setActiveTool: (tool) => set({ activeTool: tool }),
}))