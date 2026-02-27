// src/ui/InfoPanel.jsx
import React from 'react'
import { useToolStore } from '../state/useToolStore'

export default function InfoPanel() {
  const { activeTool } = useToolStore()

  const content = {
    recon: "TARGET: RECONNAISSANCE",
    exploit: "TARGET: EXPLOITATION"
  }
  const themeColor = activeTool === 'exploit' ? '#ff0033' : '#00ff41';

  return (
    <>
      {/* Center H1 Text (Floating near the object) */}
      <div style={{ 
        position: 'absolute', 
        top: '30%', 
        left: '15%', 
        transform: 'translateY(-50%)',
        color: 'white', 
        pointerEvents: 'none' 
      }}>
        <h1 style={{ fontSize: '4rem', margin: 0, opacity: 0.1, color: themeColor }}>SYSTEM</h1>
        <h1 style={{ fontSize: '4rem', margin: 0, color: themeColor }}>{activeTool.toUpperCase()}</h1>
      </div>

      {/* Bottom Left: Contact Box */}
      <div style={{ 
        position: 'absolute', 
        bottom: '2rem', 
        left: '2rem', 
        border: '1px solid #333', 
        padding: '1rem',
        color: 'white',
        pointerEvents: 'auto',
        background: 'rgba(0,0,0,0.5)'
      }}>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.6 }}>CONTACT UPLINK</p>
        <p style={{ margin: '0.5rem 0 0' }}>secure@websec.agency</p>
      </div>

      {/* Bottom Center: Project Details */}
      <div style={{ 
        position: 'absolute', 
        bottom: '3rem', 
        left: '50%', 
        transform: 'translateX(-50%)',
        textAlign: 'center',
        color: 'white' 
      }}>
        <p style={{ fontSize: '0.8rem', letterSpacing: '1px', color: themeColor }}>
          {content[activeTool]} // STATUS: ACTIVE
        </p>
      </div>
    </>
  )
}