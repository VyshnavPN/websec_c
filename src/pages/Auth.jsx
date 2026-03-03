import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToolStore } from '../state/useToolStore';
import { getTheme } from '../utils/theme';


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [error, setError] = useState(''); 
  const navigate = useNavigate();
  const activeTool = useToolStore((s) => s.activeTool);
  const { primary: themeColor, bg: themeBg, accent, panelBg } = getTheme(activeTool);

  const setUser = useToolStore((s) => s.setUser);
  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const resp = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(txt);
      }
      const data = await resp.json();
      setUser(data);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.message.includes('exists')) {
        setError('IDENTITY_EXISTS: PROCEED_TO_LOGIN');
      } else if (err.message.includes('no_user') || err.message.includes('bad_pass')) {
        setError('ACCESS_DENIED: INVALID_CREDENTIALS');
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
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} placeholder="ACCESS_CODE" style={inputStyle} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background:'transparent',border:'none',color:'#fff',cursor:'pointer',fontSize:'0.8rem' }}>
              {showPass ? 'HIDE' : 'SHOW'}
            </button>
          </div>
          
          {error && <div style={{ color: '#ff4444', fontSize: '0.7rem' }}>{error}</div>}
          {isLogin && !forgot && <p style={{ fontSize:'0.7rem', opacity:0.6, cursor:'pointer' }} onClick={()=>setForgot(true)}>&gt;_FORGOT_PASSWORD</p>}

          <button type="submit" style={{ background: themeColor, color: '#000', border: 'none', padding: '1rem', cursor: 'pointer', fontWeight: 'bold', letterSpacing: '2px' }}>
            {isLogin ? 'INITIALIZE_SESSION' : 'REGISTER_IDENTITY'}
          </button>

          <p onClick={() => setIsLogin(!isLogin)} style={{ fontSize: '0.7rem', cursor: 'pointer', textAlign: 'center', opacity: 0.5 }}>
            {isLogin ? '>_REQUEST_NEW_UPLINK' : '>_BACK_TO_LOGIN'}
          </p>
        </form>
        {forgot && (
          <div style={{ position:'absolute', top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)', display:'flex',justifyContent:'center',alignItems:'center' }}>
            <div style={{ background:panelBg,padding:'2rem',border:`1px solid ${accent}`,width:'300px' }}>
              <h3>RESET ACCESS</h3>
              <p style={{fontSize:'0.8rem'}}>Send reset link to:</p>
              <input type="email" placeholder="EMAIL_UPLINK" style={inputStyle} onChange={(e)=>setEmail(e.target.value)} />
              <button onClick={()=>{alert('reset link sent');setForgot(false);}} style={{marginTop:'1rem',background:themeColor,color:'#000',padding:'0.8rem',border:'none',cursor:'pointer'}}>SEND</button>
              <p onClick={()=>setForgot(false)} style={{fontSize:'0.7rem',opacity:0.6,marginTop:'0.5rem',cursor:'pointer'}}>CANCEL</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}