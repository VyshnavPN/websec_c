import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import CyberScene from '../canvas/CyberScene'
import { OrbitControls } from '@react-three/drei';
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
    clearOutput,
    setDnsData // Added from updated store
  } = useToolStore()
  
  const { primary: themeColor, bg: themeBg, accent, panelBg } = getTheme(activeTool);
  const [target, setTarget] = useState('');
  const [subTool, setSubTool] = useState('nmap');
  const [canvasKey, setCanvasKey] = useState(0);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    setTarget('');
    clearOutput();
    if (activeTool === 'recon') {
      setSubTool('nmap');
    }
  }, [activeTool, clearOutput]);

  const handleExecute = async () => {
    if (!target) return alert("CRITICAL_ERROR: TARGET_SPECIFICATION_REQUIRED");
    
    setExecuting(true);
    clearOutput();
    appendOutput(`[INIT] Initializing ${activeTool.toUpperCase()} sequence...\n`);
    appendOutput(`[TARGET] ${target}\n`);
    appendOutput(`[PIPELINE] Establishing encrypted bridge to C2 server...\n\n`);

    try {
      const payload = { 
        target, 
        tool: activeTool,
        subtool: activeTool === 'recon' ? subTool : null 
      };

      const response = await fetch('https://websecbackend-production.up.railway.app/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`SERVER_REJECTED: ${response.status} - ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedOutput = ''; // Track full string for parsing

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        accumulatedOutput += chunk;
        appendOutput(chunk);
      }
      
      // --- 3D VISUALIZATION LOGIC ---
      if (activeTool === 'recon' && subTool === 'dns') {
        // Parse the accumulated text for DNS records
        const lines = accumulatedOutput.split('\n');
        const dnsRecords = lines
          .filter(line => line.includes('IN')) // DNS lines usually contain 'IN'
          .map(line => {
            const parts = line.split(/\s+/);
            // Indexing based on 'host -a' output format
            return { 
              name: parts[0], 
              type: parts[3], 
              val: parts[4] 
            };
          })
          .filter(record => record.val && record.type);

        setDnsData(dnsRecords);
      }
      
      appendOutput(`\n\n[SUCCESS] Operation completed successfully.`);
    } catch (error) {
      appendOutput(`\n[FATAL] C2_LINK_FAILED: ${error.message}\n`);
    } finally {
      setExecuting(false);
    }
  };

  // ... (getBtnStyle and return block remain exactly the same as your previous version)
  // Just ensure CyberScene is within the Canvas as you already have it.

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
      paddingTop: '3.5rem', 
      paddingBottom: '3.5rem',
      transition: 'background 0.5s ease'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
        
        {/* LEFT SIDE: 3D ENGINE VIEWPORT */}
        <div style={{ height: '80vh', position: 'relative' }}>
          <Canvas
            key={canvasKey}
            camera={{ position: [0, 0, 6], fov: 45 }}
            gl={{ antialias: true }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                console.warn('WEBSEC_RENDERER: Context lost. Attempting recovery...');
                setTimeout(() => setCanvasKey(k => k + 1), 1000);
              });
            }}
          >
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />
            {/* allow user to orbit/zoom the scene */}
            <OrbitControls enablePan={false} enableZoom={true} />
            <CyberScene />
          </Canvas>

          <div style={{ 
            position: 'absolute', bottom: '20px', left: '20px', 
            color: themeColor, opacity: 0.6, fontSize: '0.75rem',
            borderLeft: `2px solid ${accent}`, paddingLeft: '10px'
          }}>
            SYSTEM_STATUS: {isExecuting ? 'EXECUTING...' : 'IDLE'} <br />
            TARGET_ADDR: {target || 'AWAITING_INPUT'} <br />
            ACTIVE_GEOMETRY: {activeTool.toUpperCase()} <br />
            PIPELINE_V3: SECURE_LINK
          </div>
        </div>

        {/* RIGHT SIDE: CONTROL PANEL */}
        <div style={{ 
          display: 'flex', flexDirection: 'column', 
          padding: '0 4rem', gap: '1.5rem',
          borderLeft: `1px solid ${accent}33`
        }}>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {['recon', 'exploit', 'osint', 'audit'].map(t => (
              <button key={t} style={getBtnStyle(t)} onClick={() => setActiveTool(t)}>
                [ {t} ]
              </button>
            ))}
          </div>

          <div style={{ border: `1px solid ${accent}`, padding: '1rem', background: panelBg }}>
            <h2 style={{ color: themeColor, margin: 0, fontSize: '1.8rem', letterSpacing: '5px' }}>
              {activeTool.toUpperCase()}{activeTool === 'recon' ? ` - ${subTool.toUpperCase()}` : ''}
            </h2>
          </div>

          {activeTool === 'recon' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{'>'} SELECT_SUBTOOL:</span>
              <select
                value={subTool}
                onChange={(e) => setSubTool(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  border: `1px solid ${accent}`,
                  padding: '0.8rem',
                  color: themeColor,
                  fontFamily: 'monospace',
                  outline: 'none'
                }}
              >
                <option value="nmap">nmap (Port Discovery)</option>
                <option value="whois">whois (Domain Registry)</option>
                <option value="dns">dns (Host Lookup)</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{'>'} DEFINE_TARGET:</span>
            <input 
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder={activeTool === 'audit' ? 'SCANNING_INTERNAL_NODE...' : 'IP_ADDRESS / DOMAIN'}
              disabled={activeTool === 'audit' || isExecuting}
              style={{
                background: activeTool === 'audit' ? '#111' : 'rgba(0,0,0,0.5)',
                border: `1px solid ${accent}`,
                padding: '0.8rem',
                color: themeColor,
                fontFamily: 'monospace',
                outline: 'none',
                opacity: isExecuting ? 0.5 : 1
              }}
            />
          </div>
          
          <div 
            ref={terminalRef}
            style={{ 
              height: '300px', 
              background: '#020202', 
              border: `1px solid ${accent}`, 
              padding: '1rem', 
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              fontSize: '0.85rem',
              color: accent,
              boxShadow: `inset 0 0 20px #000`,
              lineHeight: '1.4'
            }}
          >
            {output || '--- WEBSEC_STRIKE_TERMINAL READY ---'}
          </div>

          {activeTool === 'audit' ? (
            <button
              style={{
                background: themeColor,
                border: `2px solid ${accent}`,
                color: '#000',
                padding: '1.2rem',
                cursor: 'pointer',
                fontWeight: '900',
                fontSize: '0.9rem',
                letterSpacing: '2px',
                boxShadow: `0 0 20px ${accent}66`
              }}
              onClick={() => {
                const content = output || 'NO_AUDIT_DATA_FOUND';
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `audit-report-${Date.now()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              DOWNLOAD_FORENSIC_REPORT
            </button>
          ) : (
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
                boxShadow: isExecuting ? 'none' : `0 0 25px ${accent}66`,
                transition: 'all 0.3s ease'
              }} 
              onClick={handleExecute}
            >
              {isExecuting ? 'TRANSMITTING_PAYLOAD...' : 'EXECUTE_OPERATIONS_V1.0'}
            </button>
          )}
          
        </div>
      </div>
    </div>
  )
}