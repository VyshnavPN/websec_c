import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../state/firebase';
import { signOut } from 'firebase/auth';
import { useToolStore } from '../state/useToolStore';
import { getTheme } from '../utils/theme';

export default function Navbar({ themeColor }) {
  const user = auth.currentUser;
  // if themeColor not passed, derive from store
  const activeTool = useToolStore((s) => s.activeTool);
  const { accent } = getTheme(activeTool);
  const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.8rem',
    letterSpacing: '2px'
  };

  return (
    <nav style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '2rem 4rem', position: 'fixed', top: 0, left: 0, width: '100%', 
      zIndex: 100, pointerEvents: 'auto', background: 'rgba(0,0,0,0.4)' 
    }}>
      <div style={{ fontWeight: 'bold', letterSpacing: '4px' }}>
        <Link to="/" style={{ color: themeColor || 'white', textDecoration: 'none', fontSize: '1.2rem' }}>WEBSEC</Link>
      </div>
      <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
        <Link to="/" style={linkStyle} onClick={() => window.location.reload()}>HOME</Link>
        <Link to="/tools" style={linkStyle}>TOOLS</Link>
        {user ? (
          <button onClick={() => signOut(auth)} style={{ background: 'transparent', border: `1px solid ${accent}`, color: '#fff', padding: '5px 15px', cursor: 'pointer', fontFamily: 'monospace' }}>
            LOGOUT
          </button>
        ) : (
          <Link to="/auth" style={{ ...linkStyle, color: '#fff', border: `1px solid ${accent}`, padding: '5px 15px' }}>
            LOGIN_UPLINK
          </Link>
        )}
      </div>
    </nav>
  );
}