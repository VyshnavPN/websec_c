import React from 'react';
import { useToolStore } from '../state/useToolStore';
import { getTheme } from '../utils/theme';
import Hero from '../components/Hero';

export default function Home() {
  const activeTool = useToolStore((s) => s.activeTool);
  const { bg: bgColor, accent } = getTheme(activeTool);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: bgColor, color: accent }}>
      <Hero />
      {/* status banner shown when recon or exploit is active */}
      {(activeTool === 'recon' || activeTool === 'exploit') && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.3)',
          padding: '0.4rem 0.8rem',
          border: `1px solid ${accent}`,
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          {activeTool === 'recon' ? 'RECON MODE ACTIVE' : 'EXPLOIT MODE ACTIVE'}
        </div>
      )}
    </div>
  );
}