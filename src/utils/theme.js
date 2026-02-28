// central colour palettes for easy experimentation
export const themePalettes = {
  exploit: {
    primary: '#ad0013',   // deep red
    bg: '#121312',        // very dark maroon / almost black
    accent: '#a67d43',    // gold
    panelBg: 'rgba(173, 0, 19, 0.1)', // translucent red for subtle panels
  },
  recon: {
    primary: '#32CD32',   // vivid lime
    bg: '#00000E',        // very dark navy
    accent: '#E1EBC8',    // cream
    panelBg: 'rgba(50, 205, 50, 0.1)', // translucent green for panels
  },
  osint: {
    primary: '#1E90FF',   // dodger blue
    bg: '#000020',        // very dark blue
    accent: '#FFD700',    // gold/yellow
    panelBg: 'rgba(30, 144, 255, 0.1)', // translucent blue
  },
  audit: {
    // new greyish palette from second image
    primary: '#15152c',   // medium grey
    bg: '#4a4a45',        // off-white grey
    accent: '#6b7853',    // dark charcoal
    panelBg: 'rgba(109, 109, 113, 0.1)', // translucent grey
  }
};

export function getTheme(tool = 'exploit') {
  return themePalettes[tool] || themePalettes.exploit;
}
