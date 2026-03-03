import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// auth replaced by backend API
import { useToolStore } from './state/useToolStore';
import { getTheme } from './utils/theme';

// Page Imports
import Home from './pages/Home';
import Tools from './pages/Tools';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';

// Styles
import './style.css';

export default function App() {
  const storeUser = useToolStore((s) => s.user);
  const setUser = useToolStore((s) => s.setUser);
  const clearUser = useToolStore((s) => s.clearUser);
  const [loading, setLoading] = useState(true);
  const activeTool = useToolStore((s) => s.activeTool);

  // derive colours from central palette
  const { primary: themeColor, bg: themeBg } = getTheme(activeTool);

  // apply theme to document root for CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-primary', themeColor);
    document.documentElement.style.setProperty('--theme-background', themeBg);
    document.documentElement.style.setProperty('--theme-accent', getTheme(activeTool).accent);
    document.body.style.background = themeBg;
  }, [themeColor, themeBg, activeTool]);

  // initialize user from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    setLoading(false);
  }, [setUser]);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: themeColor, fontFamily: 'monospace' }}>
        [ INITIALIZING_SECURE_SESSION... ]
      </div>
    );
  }

  return (
    <Router>
      {/* global navigation always present */}
      <Navbar themeColor={themeColor} />
      <div className="app-container" style={{ width: '100%', minHeight: '100vh', overflow: 'auto', paddingTop: '3.5rem', background: themeBg }}>
        <Routes>
          {/* Home is the default landing page */}
          <Route path="/" element={<Home />} />
          
          {/* Tools requires auth */}
          <Route path="/tools" element={storeUser ? <Tools /> : <Navigate to="/auth" />} />

          {/* Auth is only for logged-out users */}
          <Route path="/auth" element={!storeUser ? <Auth /> : <Navigate to="/" />} />

          {/* admin dashboard */}
          <Route path="/dashboard/admin" element={storeUser && storeUser.role === 'admin' ? <Admin /> : <Navigate to="/" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}