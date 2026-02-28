import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import CyberScene from '../canvas/CyberScene'
import { useToolStore } from '../state/useToolStore'
import { getTheme } from '../utils/theme'

export default function Tools() {
  const { 
    activeTool, 
    setActiveTool, 
    isExecuting, 
    setExecuting, 
    output, 
    appendOutput, 
    clearOutput 
  } = useToolStore()
  
  const { primary: themeColor, bg: themeBg, accent, panelBg } = getTheme(activeTool);
  
  const [target, setTarget] = useState('');
  const [canvasKey, setCanvasKey] = useState(0);
  const terminalRef = useRef(null);

  // Auto-scroll terminal to bottom when output updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // The Live Execution Logic
  const handleExecute = async () => {
    if (!target) return alert("CRITICAL_ERROR: TARGET_SPECIFICATION_REQUIRED");
    
    setExecuting(true);
    clearOutput();
    appendOutput(`[INIT] Initializing ${activeTool.toUpperCase()} on ${target}...\n`);

    try {
      // REPLACE THIS URL with your hosted backend URL once deployed
      const response = await fetch('http://localhost:5000/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, tool: activeTool })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        appendOutput(decoder.decode(value));
      }
    } catch (error) {
      appendOutput(`\n[FATAL] C2_LINK_FAILED: Ensure backend server is online.\n`);
    } finally {
      setExecuting(false);
    }
  };

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
      width: '100%',
      minHeight: '100vh', 
      background: themeBg, 
      color: themeColor, 
      fontFamily: 'monospace',
      /* let the body handle overflow */
      paddingTop: '3.5rem', 
      paddingBottom: '3.5rem' 
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
        
        {/* LEFT SIDE: 3D RENDERER */}
        <div style={{ height: '80vh', position: 'relative' }}>
          <Canvas
            key={canvasKey}
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{ antialias: true }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                setTimeout(() => setCanvasKey(k => k + 1), 1000);
              });
            }}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <CyberScene />
          </Canvas>

          <div style={{ 
            position: 'absolute', bottom: '20px', left: '20px', 
            color: themeColor, opacity: 0.6, fontSize: '0.75rem',
            borderLeft: `2px solid ${accent}`, paddingLeft: '10px'
          }}>
            SYSTEM_STATUS: {isExecuting ? 'EXECUTING...' : 'IDLE'} <br />
            TARGET_ADDR: {target || 'NONE'} <br />
            PIPELINE: V3.0.4
          </div>
        </div>

        {/* RIGHT SIDE: CONTROL INTERFACE */}
        <div style={{ 
          display: 'flex', flexDirection: 'column', 
          padding: '0 4rem', gap: '1.5rem',
          borderLeft: `1px solid ${accent}33`
        }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['recon', 'exploit', 'default'].map(t => (
              <button key={t} style={getBtnStyle(t)} onClick={() => setActiveTool(t)}>
                [ {t} ]
              </button>
            ))}
          </div>

          <div style={{ border: `1px solid ${accent}`, padding: '1rem', background: panelBg }}>
            <h2 style={{ color: themeColor, margin: 0, fontSize: '1.8rem', letterSpacing: '5px' }}>
              {activeTool.toUpperCase()}
            </h2>
          </div>

          {/* TARGET INPUT FIELD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{'>'} DEFINE_TARGET:</span>
            <input 
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="IP_ADDRESS / DOMAIN"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: `1px solid ${accent}`,
                padding: '0.8rem',
                color: themeColor,
                fontFamily: 'monospace',
                outline: 'none'
              }}
            />
          </div>
          
          {/* TERMINAL OUTPUT */}
          <div 
            ref={terminalRef}
            style={{ 
              height: '250px', 
              background: '#050505', 
              border: `1px solid ${accent}`, 
              padding: '1rem', 
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              fontSize: '0.85rem',
              color: accent,
              boxShadow: `inset 0 0 10px #000`
            }}
          >
            {output || 'SYSTEM_READY... AWAITING_COMMAND'}
          </div>

          <button 
            disabled={isExecuting}
            style={{
              background: isExecuting ? 'transparent' : themeColor,
              border: `2px solid ${accent}`,
              color: isExecuting ? accent : '#000',
              padding: '1.2rem',
              cursor: isExecuting ? 'not-allowed' : 'pointer',
              fontWeight: '900',
              fontSize: '0.9rem',
              letterSpacing: '2px',
              boxShadow: isExecuting ? 'none' : `0 0 20px ${accent}66`
            }} 
            onClick={handleExecute}
          >
            {isExecuting ? 'PROCESS_RUNNING...' : 'EXECUTE_STRIKE_V1.0'}
          </button>
          
        </div>
      </div>
    </div>
  )
}