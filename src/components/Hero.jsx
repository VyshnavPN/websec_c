// src/components/Hero.jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import CyberScene from '../canvas/CyberScene'
import InfoPanel from '../ui/InfoPanel'
import { useToolStore } from '../state/useToolStore'

export default function Hero() {
  const activeTool = useToolStore((s) => s.activeTool);
  const themeBg = activeTool === 'exploit' ? '#100000' : '#001000';

  return (
    <>
      {/* Background 3D Object - Centered */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* Canvas must wrap any react-three/fiber scene component */}
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          style={{ background: themeBg }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              console.warn('WebGL context lost (hero)');
              setTimeout(() => window.location.reload(), 1000);
            });
          }}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
          <CyberScene />
        </Canvas>
      </div>

      {/* Foreground UI Elements */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <InfoPanel />
      </div>
    </>
  )
}