import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './state/firebase';

// Page Imports
import Home from './pages/Home';
import Tools from './pages/Tools';
import Auth from './pages/Auth';

// Styles
import './style.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#000', color: '#00ff41', fontFamily: 'monospace' }}>
        [ INITIALIZING_SECURE_SESSION... ]
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container" style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Routes>
          {/* Home is the default landing page */}
          <Route path="/" element={<Home />} />
          
          {/* Tools requires auth */}
          <Route path="/tools" element={user ? <Tools /> : <Navigate to="/auth" />} />

          {/* Auth is only for logged-out users */}
          <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}