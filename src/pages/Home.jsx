import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
      <Navbar />
      <Hero />
    </div>
  );
}