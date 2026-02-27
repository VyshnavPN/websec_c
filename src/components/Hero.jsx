// src/components/Hero.jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import CyberScene from '../canvas/CyberScene'
import InfoPanel from '../ui/InfoPanel'

export default function Hero() {
  return (
    <>
      {/* Background 3D Object - Centered */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {/* Canvas must wrap any react-three/fiber scene component */}
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
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