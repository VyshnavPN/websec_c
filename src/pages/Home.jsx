import React from 'react';
import { useToolStore } from '../state/useToolStore';
import { getTheme } from '../utils/theme';
import Hero from '../components/Hero';

export default function Home() {
  const activeTool = useToolStore((s) => s.activeTool);
  const { bg: bgColor, accent } = getTheme(activeTool);

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', overflow: 'auto', background: bgColor, color: accent }}>
      <Hero />
      {/* status banner shown when recon or exploit is active */}
      {(activeTool === 'recon' || activeTool === 'exploit') && (
        <>
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
          {/* larger fixed box on right side for additional info */}
          <div style={{
            position: 'absolute',
            top: '50%',
            right: '20px',
            transform: 'translateY(-50%)',
            width: '200px',
            minHeight: '120px',
            background: 'rgba(0,0,0,0.2)',
            border: `1px solid ${accent}`,
            padding: '1rem',
            borderRadius: '6px',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            color: accent,
            textAlign: 'center',
            lineHeight: '1.4'
          }}>
            {activeTool === 'recon' ? (
              <>
                ⚡ RECON MODE<br/>
                Info gathering &amp; attack surface mapping.<br/>
                Subdomains, IPs, ports, versions. (Octahedron)
              </>
            ) : (
              <>
                🛠 EXPLOIT MODE<br/>
                Vulnerability verification &amp; system entry.<br/>
                Overflows, injections, brute-force. (Torus Knot)
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}