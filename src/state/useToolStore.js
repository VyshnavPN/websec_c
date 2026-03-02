import { create } from 'zustand'

export const useToolStore = create((set) => ({
  // Core UI State
  activeTool: 'recon',
  isExecuting: false,
  output: '',
  
  // 3D Visualization Data
  dnsData: [], // Stores objects like { name, type, val }

  // Actions
  setActiveTool: (tool) => set({ 
    activeTool: tool, 
    output: '', 
    dnsData: [] // Clear visual data when switching tools
  }),
  
  setExecuting: (flag) => set({ isExecuting: flag }),
  
  appendOutput: (text) => set((state) => ({ 
    output: state.output + text 
  })),
  
  clearOutput: () => set({ 
    output: '', 
    dnsData: [] 
  }),

  // Action to push new DNS records to the 3D scene
  setDnsData: (data) => {
    console.debug('useToolStore.setDnsData called', data);
    set({ dnsData: data });
  },
}))