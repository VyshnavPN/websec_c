// src/pages/Tools.jsx
import React from 'react'
import CyberScene from '../canvas/CyberScene'
import Navbar from '../components/Navbar'
import { useToolStore } from '../state/useToolStore'

export default function Tools() {
  const { activeTool } = useToolStore()

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Navbar />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        height: 'calc(100% - 80px)' 
      }}>
        {/* Left Side: 3D Model */}
        <div style={{ height: '100%' }}>
          <CyberScene />
        </div>

        {/* Right Side: Tool Interface */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          padding: '4rem',
          gap: '2rem'
        }}>
          <div style={{ border: '1px solid #00ff41', padding: '1rem', width: 'fit-content' }}>
            <h2 style={{ color: '#00ff41', margin: 0 }}>{activeTool.toUpperCase()}</h2>
          </div>
          
          <p style={{ fontSize: '1.2rem', lineHeight: '1.6', maxWidth: '400px' }}>
            Advanced diagnostic and execution module for {activeTool} operations. 
            Ensure target authorization before deployment.
          </p>

          <button style={{
            background: 'transparent',
            border: '1px solid #00ff41',
            color: '#00ff41',
            padding: '1rem 2rem',
            cursor: 'pointer',
            width: '200px',
            fontFamily: 'monospace',
            fontWeight: 'bold'
          }} onClick={() => alert(`Running ${activeTool}...`)}>
            RUN_TOOL_V1.0
          </button>
        </div>
      </div>
    </div>
  )
}