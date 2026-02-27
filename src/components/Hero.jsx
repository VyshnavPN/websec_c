// src/components/Hero.jsx
import React from 'react'
import CyberScene from '../canvas/CyberScene'
import InfoPanel from '../ui/InfoPanel'

export default function Hero() {
  return (
    <>
      {/* Background 3D Object - Centered */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <CyberScene />
      </div>

      {/* Foreground UI Elements */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <InfoPanel />
      </div>
    </>
  )
}