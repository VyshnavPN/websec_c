import React from 'react';
import { useToolStore } from '../state/useToolStore';
import Hero from '../components/Hero';

export default function Home() {
  const activeTool = useToolStore((s) => s.activeTool);
  const bgColor = activeTool === 'exploit' ? '#100000' : '#001000';

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: bgColor }}>
      <Hero />
    </div>
  );
}