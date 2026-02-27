import React from 'react'
import { Canvas } from '@react-three/fiber'
import CyberScene from '../canvas/CyberScene'
import { useToolStore } from '../state/useToolStore'

export default function Tools() {
  const { activeTool, setActiveTool } = useToolStore()

  // Dynamic styling for selection buttons
  const getBtnStyle = (toolName) => {
    const isActive = activeTool === toolName;
    const color = toolName === 'exploit' ? '#ff0033' : '#00ff41';
    return {
      background: isActive ? color : 'transparent',
      color: isActive ? '#000' : color,
      border: `1px solid ${color}`,
      padding: '0.6rem 1.2rem',
      cursor: 'pointer',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    };
  };

  return (
    <div style={{ 
      width: '100vw', 
      minHeight: '100vh', /* allow extra padding without cutting */
      background: '#000', 
      color: '#fff', 
      fontFamily: 'monospace',
      /* allow scrolling when content exceeds viewport */
      overflow: 'auto',
      paddingTop: '3.5rem', /* make room for global navbar */
      paddingBottom: '3.5rem' /* avoid content being hidden under bottom */
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.2fr 1fr', 
        minHeight: 'calc(100vh - 3.5rem)' 
      }}>
        
        {/* LEFT SIDE: 3D RENDERER */}
        <div style={{ height: '100%', position: 'relative' }}>
          
          {/* THE CANVAS: This provides the 3D context for CyberScene */}
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
            
            <CyberScene />
          </Canvas>

          {/* HUD Overlay for the 3D View */}
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            left: '20px', 
            color: '#00ff41', 
            opacity: 0.6, 
            fontSize: '0.75rem',
            borderLeft: '2px solid #00ff41',
            paddingLeft: '10px'
          }}>
            SYSTEM_STATUS: ONLINE <br />
            GEOMETRY_BUFFER: {activeTool.toUpperCase()} <br />
            RENDER_PIPELINE: V3.0.4
          </div>
        </div>

        {/* RIGHT SIDE: CONTROL INTERFACE */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start', /* start at top so bottom button is reachable */
          padding: '0 4rem',
          gap: '2rem',
          borderLeft: '1px solid rgba(0, 255, 65, 0.15)',
          overflowY: 'auto' /* scroll if not enough vertical space */
        }}>
          
          {/* MODULE SWITCHER */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button style={getBtnStyle('recon')} onClick={() => setActiveTool('recon')}>
              [ RECON ]
            </button>
            <button style={getBtnStyle('exploit')} onClick={() => setActiveTool('exploit')}>
              [ EXPLOIT ]
            </button>
            <button style={getBtnStyle('default')} onClick={() => setActiveTool('default')}>
              [ RESET ]
            </button>
          </div>

          {/* TOOL HEADER */}
          <div style={{ 
            border: `1px solid ${activeTool === 'exploit' ? '#ff0033' : '#00ff41'}`, 
            padding: '1.5rem', 
            width: 'fit-content', 
            background: activeTool === 'exploit' ? 'rgba(255, 0, 51, 0.03)' : 'rgba(0, 255, 65, 0.03)',
            boxShadow: `inset 0 0 15px ${activeTool === 'exploit' ? 'rgba(255,0,51,0.1)' : 'rgba(0,255,65,0.1)'}`
          }}>
            <h2 style={{ color: activeTool === 'exploit' ? '#ff0033' : '#00ff41', margin: 0, fontSize: '2.2rem', letterSpacing: '5px' }}>
              {activeTool.toUpperCase()}
            </h2>
          </div>
          
          {/* TOOL DESCRIPTION */}
          <p style={{ fontSize: '1rem', lineHeight: '1.8', maxWidth: '450px', color: '#888' }}>
            <span style={{ color: '#00ff41' }}>{'>'}</span> Initializing {activeTool} protocols... <br />
            Accessing decentralized nodes for encrypted data packets. 
            The system is currently scanning for vulnerabilities and establishing 
            a secure bridge to the target environment.
          </p>

          {/* ACTION BUTTON */}
          <button style={{
            background: '#00ff41',
            border: 'none',
            color: '#000',
            padding: '1.2rem 2.8rem',
            cursor: 'pointer',
            width: 'fit-content',
            fontFamily: 'monospace',
            fontWeight: '900',
            fontSize: '0.9rem',
            letterSpacing: '2px',
            boxShadow: '0 0 25px rgba(0, 255, 65, 0.2)'
          }} onClick={() => alert(`CRITICAL: Initiating ${activeTool.toUpperCase()} sequence.`)}>
            LAUNCH_MODULE_V1.0
          </button>
          
        </div>
      </div>
    </div>
  )
}