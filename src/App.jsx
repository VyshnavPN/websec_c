import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './state/firebase';

// Page Imports
import Home from './pages/Home';
import Tools from './pages/Tools';
import Auth from './pages/Auth';
import Navbar from './components/Navbar';

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

    // fallback: if auth never responds within 5s, unblock UI to avoid permanent black screen
    const timer = setTimeout(() => {
      if (loading) {
        console.warn('Firebase auth timeout – forcing load with user=', user);
        setLoading(false);
      }
    }, 5000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
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
      {/* global navigation always present */}
      <Navbar />
      <div className="app-container" style={{ width: '100vw', height: '100vh', overflow: 'hidden', paddingTop: '3.5rem' }}>
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