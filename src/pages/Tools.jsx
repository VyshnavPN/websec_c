import React from 'react'
import { Canvas } from '@react-three/fiber'
import CyberScene from '../canvas/CyberScene'
import { useToolStore } from '../state/useToolStore'
import { getTheme } from '../utils/theme'

export default function Tools() {
  const { activeTool, setActiveTool } = useToolStore()
  const { primary: themeColor, bg: themeBg, accent, panelBg } = getTheme(activeTool);

  // key bump lets us remount canvas on context loss instead of doing full page reload
  const [canvasKey, setCanvasKey] = React.useState(0);

  // Dynamic styling for selection buttons using palette colours
  const getBtnStyle = (toolName) => {
    const isActive = activeTool === toolName;
    const { primary: toolColor } = getTheme(toolName);
    return {
      background: isActive ? toolColor : 'transparent',
      color: isActive ? '#000' : toolColor,
      border: `1px solid ${toolColor}`,
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
      background: themeBg, 
      color: themeColor, 
      fontFamily: 'monospace',
      /* allow scrolling when content exceeds viewport */
      overflow: 'auto',
      paddingTop: '3.5rem', /* make room for global navbar */
      paddingBottom: '3.5rem' /* avoid content being hidden under bottom */
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.2fr 1fr' 
        /* allow content to determine height; outer wrapper scrolls */
      }}>
        
        {/* LEFT SIDE: 3D RENDERER */}
        <div style={{ height: '100%', position: 'relative' }}>
          
          {/* THE CANVAS: This provides the 3D context for CyberScene */}
          <Canvas
            key={canvasKey}
            camera={{ position: [0, 0, 6], fov: 45 }}
            style={{ background: themeBg }}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
            onCreated={({ gl }) => {
              // listen for lost context and bump key to remount canvas
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                console.warn('WebGL context lost');
                setTimeout(() => setCanvasKey(k => k + 1), 1000);
              });
            }}
          >
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
            color: themeColor, 
            opacity: 0.6, 
            fontSize: '0.75rem',
            borderLeft: `2px solid ${accent}`,
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
          borderLeft: `1px solid ${accent}33`,
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
            border: `1px solid ${accent}`, 
            padding: '1.5rem', 
            width: 'fit-content', 
            background: panelBg,
            boxShadow: `inset 0 0 15px ${accent}33`
          }}>
            <h2 style={{ color: themeColor, margin: 0, fontSize: '2.2rem', letterSpacing: '5px' }}>
              {activeTool.toUpperCase()}
            </h2>
          </div>
          
          {/* TOOL DESCRIPTION */}
          <p style={{ fontSize: '1rem', lineHeight: '1.8', maxWidth: '450px', color: accent }}>
            <span style={{ color: themeColor }}>{'>'}</span> Initializing {activeTool} protocols... <br />
            Accessing decentralized nodes for encrypted data packets. 
            The system is currently scanning for vulnerabilities and establishing 
            a secure bridge to the target environment.
          </p>

          {/* ACTION BUTTON */}
          <button style={{
            background: themeColor,
            border: `2px solid ${accent}`,
            color: '#000',
            padding: '1.2rem 2.8rem',
            cursor: 'pointer',
            width: 'fit-content',
            fontFamily: 'monospace',
            fontWeight: '900',
            fontSize: '0.9rem',
            letterSpacing: '2px',
            boxShadow: `0 0 25px ${accent}33`
          }} onClick={() => alert(`CRITICAL: Initiating ${activeTool.toUpperCase()} sequence.`)}>
            LAUNCH_MODULE_V1.0
          </button>
          
        </div>
      </div>
    </div>
  )
}