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
    </div>
  );
}