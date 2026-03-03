import React, { useState } from 'react';
import { auth } from '../state/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useToolStore } from '../state/useToolStore';
import { getTheme } from '../utils/theme';


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const navigate = useNavigate();
  const activeTool = useToolStore((s) => s.activeTool);
  const { primary: themeColor, bg: themeBg, accent, panelBg } = getTheme(activeTool);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err) {
      if (err.code === 'auth/invalid-credential') {
        setError('ACCESS_DENIED: INVALID_CREDENTIALS');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('IDENTITY_EXISTS: PROCEED_TO_LOGIN');
      } else {
        setError('SYSTEM_ERROR: UPLINK_UNSTABLE');
      }
    }
  };

  const inputStyle = {
    background: 'transparent',
    border: `1px solid ${accent}`,
    borderBottom: `1px solid ${themeColor}`,
    color: '#fff',
    padding: '1rem',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'monospace',
    width: '100%'
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: themeBg || '#000', color: '#fff', fontFamily: 'monospace' }}>
      
      {/* Return Button Floating Top Left */}
      <Link to="/" style={{ 
        position: 'absolute', top: '2rem', left: '2rem', color: themeColor, 
        textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '2px',
        border: `1px solid ${themeColor}`, padding: '0.5rem 1rem'
      }}>
        [ &lt; RETURN_TO_BASE ]
      </Link>

      <div style={{ width: '400px', padding: '3rem', border: `1px solid ${accent}`, background: panelBg || '#050505' }}>
        <h2 style={{ letterSpacing: '4px', marginBottom: '2rem', fontSize: '1.2rem' }}>
          {isLogin ? '//_SECURE_LOGIN' : '//_ENROLL_NEW_AGENT'}
        </h2>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input type="email" placeholder="EMAIL_UPLINK" style={inputStyle} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="ACCESS_CODE" style={inputStyle} onChange={(e) => setPassword(e.target.value)} required />
          
          {error && <div style={{ color: '#ff4444', fontSize: '0.7rem' }}>{error}</div>}

          <button type="submit" style={{ background: themeColor, color: '#000', border: 'none', padding: '1rem', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px' }}>
            {isLogin ? 'INITIALIZE_SESSION' : 'REGISTER_IDENTITY'}
          </button>

          <p onClick={() => setIsLogin(!isLogin)} style={{ fontSize: '0.7rem', cursor: 'pointer', textAlign: 'center', opacity: 0.5 }}>
            {isLogin ? '>_REQUEST_NEW_UPLINK' : '>_BACK_TO_LOGIN'}
          </p>
        </form>
      </div>
    </div>
  );
}