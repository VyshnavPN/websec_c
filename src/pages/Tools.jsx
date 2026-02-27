import React from 'react'
import CyberScene from '../canvas/CyberScene'
import Navbar from '../components/Navbar'
import { useToolStore } from '../state/useToolStore'

export default function Tools() {
  // Pull both the current state and the setter function
  const { activeTool, setActiveTool } = useToolStore()

  // Styling for the Cyber-styled buttons
  const getBtnStyle = (toolName) => ({
    background: activeTool === toolName ? '#00ff41' : 'transparent',
    color: activeTool === toolName ? '#000' : '#00ff41',
    border: '1px solid #00ff41',
    padding: '0.6rem 1.2rem',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  })

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh', 
      background: '#000', 
      color: '#fff', 
      fontFamily: 'monospace',
      overflow: 'hidden' 
    }}>
      <Navbar />
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.2fr 1fr', 
        height: 'calc(100% - 80px)' 
      }}>
        
        {/* LEFT SIDE: 3D CANVAS */}
        <div style={{ height: '100%', position: 'relative' }}>
          <CyberScene />
          {/* Subtle overlay text for 3D view */}
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#00ff41', opacity: 0.5, fontSize: '0.8rem' }}>
            CORE_RENDERER_V3 // ACTIVE_GEOMETRY: {activeTool.toUpperCase()}
          </div>
        </div>

        {/* RIGHT SIDE: TOOL INTERFACE */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          padding: '0 4rem',
          gap: '2rem',
          borderLeft: '1px solid rgba(0, 255, 65, 0.2)'
        }}>
          
          {/* MODULE SELECTOR TABS */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              style={getBtnStyle('recon')} 
              onClick={() => setActiveTool('recon')}
            >
              Recon
            </button>
            <button 
              style={getBtnStyle('exploit')} 
              onClick={() => setActiveTool('exploit')}
            >
              Exploit
            </button>
            <button 
              style={getBtnStyle('default')} 
              onClick={() => setActiveTool('default')}
            >
              Reset
            </button>
          </div>

          {/* DYNAMIC HEADER */}
          <div style={{ border: '1px solid #00ff41', padding: '1.5rem', width: 'fit-content', background: 'rgba(0, 255, 65, 0.05)' }}>
            <h2 style={{ color: '#00ff41', margin: 0, fontSize: '2rem', letterSpacing: '4px' }}>
              {activeTool.toUpperCase()}
            </h2>
          </div>
          
          {/* DYNAMIC DESCRIPTION */}
          <p style={{ fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '450px', color: '#aaa' }}>
            Current state: <span style={{ color: '#00ff41' }}>ENCRYPTED_LINK_ESTABLISHED</span><br />
            Initializing the <span style={{ color: '#fff' }}>{activeTool}</span> logic gate. 
            All traffic is being routed through secure internal nodes. 
            Unauthorized use is strictly prohibited under WEBSEC protocols.
          </p>

          {/* EXECUTION BUTTON */}
          <button style={{
            background: '#00ff41',
            border: 'none',
            color: '#000',
            padding: '1.2rem 2.5rem',
            cursor: 'pointer',
            width: 'fit-content',
            fontFamily: 'monospace',
            fontWeight: '900',
            fontSize: '1rem',
            boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)'
          }} onClick={() => alert(`SYSTEM_NOTICE: Executing ${activeTool} protocols...`)}>
            EXECUTE_OPERATIONS_V1.0
          </button>
          
        </div>
      </div>
    </div>
  )
}