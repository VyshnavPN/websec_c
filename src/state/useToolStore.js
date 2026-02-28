// src/state/useToolStore.js
import { create } from 'zustand'

export const useToolStore = create((set) => ({
  // default up front
  activeTool: 'recon',
  isExecuting: false,
  output: '',

  setActiveTool: (tool) => set({ activeTool: tool }),
  setExecuting: (flag) => set({ isExecuting: flag }),
  appendOutput: (text) => set((state) => ({ output: state.output + text })),
  clearOutput: () => set({ output: '' }),
}))