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
    // moody blues palette
    primary: '#7D8491',   // slate blue
    bg: '#1A1D29',        // midnight blue
    accent: '#B1B2B5',    // silver
    panelBg: 'rgba(61, 63, 74, 0.2)', // translucent charcoal gray
  }
};

export function getTheme(tool = 'exploit') {
  return themePalettes[tool] || themePalettes.exploit;
}
