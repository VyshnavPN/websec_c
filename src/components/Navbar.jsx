import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../state/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar({ themeColor }) {
  const user = auth.currentUser;
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
        <Link to="/" style={linkStyle}>HOME</Link>
        <Link to="/tools" style={linkStyle}>TOOLS</Link>
        {user ? (
          <button onClick={() => signOut(auth)} style={{ background: 'transparent', border: `1px solid ${themeColor || '#ff0033'}`, color: '#fff', padding: '5px 15px', cursor: 'pointer', fontFamily: 'monospace' }}>
            LOGOUT
          </button>
        ) : (
          <Link to="/auth" style={{ ...linkStyle, color: '#fff', border: `1px solid ${themeColor || '#00ff41'}`, padding: '5px 15px' }}>
            LOGIN_UPLINK
          </Link>
        )}
      </div>
    </nav>
  );
}