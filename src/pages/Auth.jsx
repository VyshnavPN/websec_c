import React, { useState } from 'react';
import { auth } from '../state/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useToolStore } from '../state/useToolStore';
import { getTheme } from '../utils/theme';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const navigate = useNavigate();
  const activeTool = useToolStore((s) => s.activeTool);
  const { primary: themeColor, bg: themeBg, accent, panelBg } = getTheme(activeTool);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err) {
      handleErrors(err);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return setError('ERROR: EMAIL_REQUIRED_FOR_RECOVERY');
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo('RECOVERY_LINK_SENT: CHECK_INBOX');
    } catch (err) {
      setError('RECOVERY_FAILED: TARGET_NOT_FOUND');
    }
  };

  const handleErrors = (err) => {
    if (err.code === 'auth/invalid-credential') setError('ACCESS_DENIED: INVALID_CREDENTIALS');
    else if (err.code === 'auth/email-already-in-use') setError('IDENTITY_EXISTS: PROCEED_TO_LOGIN');
    else setError('SYSTEM_ERROR: UPLINK_UNSTABLE');
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
      <Link to="/" style={{ position: 'absolute', top: '2rem', left: '2rem', color: themeColor, textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '2px', border: `1px solid ${themeColor}`, padding: '0.5rem 1rem' }}>
        [ &lt; RETURN_TO_BASE ]
      </Link>

      <div style={{ width: '400px', padding: '3rem', border: `1px solid ${accent}`, background: panelBg || '#050505' }}>
        <h2 style={{ letterSpacing: '4px', marginBottom: '2rem', fontSize: '1.2rem' }}>
          {isLogin ? '//_SECURE_LOGIN' : '//_ENROLL_NEW_AGENT'}
        </h2>

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <input type="email" placeholder="EMAIL_UPLINK" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} required />
          
          <div style={{ position: 'relative' }}>
            <input type={showPassword ? "text" : "password"} placeholder="ACCESS_CODE" style={inputStyle} value={password} onChange={(e) => setPassword(e.target.value)} required />
            <span 
              onClick={() => setShowPassword(!showPassword)} 
              style={{ position: 'absolute', right: '10px', top: '30%', cursor: 'pointer', fontSize: '0.6rem', color: themeColor, opacity: 0.7 }}
            >
              {showPassword ? '[_HIDE_]' : '[_SHOW_]'}
            </span>
          </div>
          
          {error && <div style={{ color: '#ff4444', fontSize: '0.7rem', borderLeft: '2px solid #ff4444', paddingLeft: '5px' }}>{error}</div>}
          {info && <div style={{ color: themeColor, fontSize: '0.7rem', borderLeft: `2px solid ${themeColor}`, paddingLeft: '5px' }}>{info}</div>}

          <button type="submit" style={{ background: themeColor, color: '#000', border: 'none', padding: '1rem', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px', marginTop: '1rem' }}>
            {isLogin ? 'INITIALIZE_SESSION' : 'REGISTER_IDENTITY'}
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem', textAlign: 'center' }}>
            <p onClick={() => setIsLogin(!isLogin)} style={{ fontSize: '0.6rem', cursor: 'pointer', opacity: 0.5 }}>
              {isLogin ? '>_REQUEST_NEW_UPLINK' : '>_BACK_TO_LOGIN'}
            </p>
            {isLogin && (
              <p onClick={handleForgotPassword} style={{ fontSize: '0.6rem', cursor: 'pointer', color: themeColor, opacity: 0.8 }}>
                RECOVER_ACCESS_CODE?
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}