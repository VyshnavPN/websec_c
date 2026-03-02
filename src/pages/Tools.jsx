import React, { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
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
    clearOutput,
    setDnsData 
  } = useToolStore()

  // Store Selectors for Conditional UI
  const dnsData = useToolStore((s) => s.dnsData);
  const hasDns = dnsData && dnsData.length > 0;
  const hasText = !hasDns && output && output.trim().length > 0;
  
  const { primary: themeColor, bg: themeBg, accent, panelBg } = getTheme(activeTool);
  const [target, setTarget] = useState('');
  const [subTool, setSubTool] = useState('nmap');
  const [canvasKey, setCanvasKey] = useState(0);
  const terminalRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  // Reset on tool change
  useEffect(() => {
    setTarget('');
    clearOutput();
    // Default subtools per module
    if (activeTool === 'recon') setSubTool('nmap');
    if (activeTool === 'exploit') setSubTool('headers');

    console.debug('TOOLS_PAGE: activeTool=', activeTool, 'subTool=', subTool);
  }, [activeTool, clearOutput]);

  // log actual subTool whenever it changes (so we know the state update took effect)
  useEffect(() => {
    console.debug('TOOLS_PAGE: subTool updated =>', subTool);
  }, [subTool]);

  /**
   * CORE LOGIC: handleExecute
   * Orchestrates the bridge between Vercel and Railway C2
   */
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
        // Routes subtool for both RECON and EXPLOIT modules
        subtool: (activeTool === 'recon' || activeTool === 'exploit') ? subTool : null 
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

      let accumulatedOutput = '';

      // Stream Handling with Fallback
      if (response.body && response.body.getReader) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          accumulatedOutput += chunk;
          appendOutput(chunk);
        }
      } else {
        accumulatedOutput = await response.text();
        appendOutput(accumulatedOutput);
      }

      // --- 3D VISUALIZATION LOGIC ---
      if (activeTool === 'recon' && subTool === 'dns') {
        const lines = accumulatedOutput.split('\n');
        const dnsRecords = lines.flatMap(line => {
          const trimmed = line.trim();
          if (!trimmed) return [];
          const parts = trimmed.split(/\s+/);

          // Pattern 1: "name has address x.x.x.x"
          const hasIdx = parts.indexOf('has');
          if (hasIdx > 0 && parts[hasIdx + 1] === 'address') {
            return [{ name: parts[0], type: 'A', val: parts[hasIdx + 2] }];
          }

          // Pattern 2: Structured "name TTL IN TYPE VALUE"
          if (parts.length >= 5 && parts[2] === 'IN') {
            return [{ name: parts[0], type: parts[3], val: parts[4] }];
          }

          return [];
        }).filter(r => r.val && r.type);

        console.log('DEBUG: DNS_RECORDS_PARSED', dnsRecords);
        setDnsData(dnsRecords);
      }
      
      appendOutput(`\n\n[SUCCESS] Operation completed successfully.\n`);
    } catch (error) {
      appendOutput(`\n[FATAL] C2_LINK_FAILED: ${error.message}\n`);
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
    <div style={{ width: '100%', minHeight: '100vh', background: themeBg, color: themeColor, fontFamily: 'monospace', paddingTop: '3.5rem', paddingBottom: '3.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
        
        {/* 3D ENGINE VIEWPORT */}
        <div style={{ 
          height: '80vh', position: 'relative',
          border: (hasDns || hasText) ? `2px solid ${accent}` : 'none',
          transition: 'border 0.5s ease'
        }}>
          <Canvas key={canvasKey} camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <OrbitControls enablePan={false} enableZoom={true} />
            <CyberScene />
          </Canvas>


          <div style={{ position: 'absolute', bottom: '20px', left: '20px', color: themeColor, opacity: 0.6, fontSize: '0.75rem', borderLeft: `2px solid ${accent}`, paddingLeft: '10px' }}>
            SYSTEM_STATUS: {isExecuting ? 'EXECUTING...' : 'IDLE'} <br />
            TARGET_ADDR: {target || 'AWAITING_INPUT'} <br />
            ACTIVE_GEOMETRY: {activeTool.toUpperCase()}
          </div>
        </div>

        {/* CONTROL PANEL */}
        <div style={{ display: 'flex', flexDirection: 'column', padding: '0 4rem', gap: '1.5rem', borderLeft: `1px solid ${accent}33` }}>
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {['recon', 'exploit', 'osint', 'audit'].map(t => (
              <button key={t} style={getBtnStyle(t)} onClick={() => setActiveTool(t)}>
                [ {t} ]
              </button>
            ))}
          </div>

          <div style={{ border: `1px solid ${accent}`, padding: '1rem', background: panelBg }}>
            <h2 style={{ color: themeColor, margin: 0, fontSize: '1.8rem', letterSpacing: '5px' }}>
              {activeTool.toUpperCase()}{activeTool === 'recon' || activeTool === 'exploit' ? ` - ${subTool.toUpperCase()}` : ''}
            </h2>
            {/* debug display of current subTool for visibility */}
            <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>
              DEBUG_SUBTOOL: {subTool}
            </div>
          </div>

          {/* Contextual Subtool Selector */}
          {(activeTool === 'recon' || activeTool === 'exploit') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{'>'} SELECT_SUBTOOL:</span>
              <select
                value={subTool}
                onChange={(e) => setSubTool(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.7)',
                  border: `2px solid ${accent}`,
                  padding: '0.8rem',
                  color: '#fff',
                  minWidth: '180px',
                  fontFamily: 'monospace',
                  zIndex: 10
                }}
              >
                {activeTool === 'recon' ? (
                  <>
                    <option value="nmap">nmap (Port Discovery)</option>
                    <option value="whois">whois (Registry)</option>
                    <option value="dns">dns (Topological Map)</option>
                  </>
                ) : (
                  <>
                    <option value="headers">Passive Header Audit</option>
                    <option value="clickjack">Clickjacking PoC</option>
                  </>
                )}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{'>'} DEFINE_TARGET:</span>
            <input 
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !isExecuting) handleExecute(); }}
              placeholder="IP_ADDRESS / DOMAIN"
              disabled={isExecuting}
              style={{ background: 'rgba(0,0,0,0.5)', border: `1px solid ${accent}`, padding: '0.8rem', color: themeColor, fontFamily: 'monospace' }}
            />
          </div>
          
          <div ref={terminalRef} style={{ height: '300px', background: '#020202', border: `1px solid ${accent}`, padding: '1rem', overflowY: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: accent }}>
            {output ? (
              output.split('\n').map((line, idx) => {
                let style = {};
                if (line.startsWith('[SAFE]')) style = { color: '#7CFC00' }; // lawn green
                else if (line.startsWith('[VULN]')) style = { color: '#FF4500' }; // orange red
                else if (line.startsWith('[ERROR]')) style = { color: '#FFD700' }; // gold
                else if (line.startsWith('[FATAL]') || line.startsWith('[SYSTEM_ERROR]')) style = { color: '#FFA500' };
                else if (line.startsWith('[SUCCESS]')) style = { color: '#00FF00' };
                else if (line.startsWith('[FOUND]')) style = { color: '#00CED1' }; // turquoise for osint hits
                return (<div key={idx} style={style}>{line || '\u00A0'}</div>);
              })
            ) : (
              '--- WEBSEC_STRIKE_TERMINAL READY ---'
            )}
          </div>

          <button 
            disabled={isExecuting}
            onClick={handleExecute}
            style={{ background: isExecuting ? 'transparent' : themeColor, border: `2px solid ${accent}`, color: isExecuting ? accent : '#000', padding: '1.2rem', cursor: isExecuting ? 'not-allowed' : 'pointer', fontWeight: '900' }}
          >
            {isExecuting ? 'TRANSMITTING...' : 'EXECUTE_STRIKE_V3.0'}
          </button>
        </div>
      </div>
    </div>
  )
}