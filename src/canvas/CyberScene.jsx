import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float } from '@react-three/drei'; // Added for smooth movement
import { useToolStore } from '../state/useToolStore';
import { getTheme } from '../utils/theme';
import DnsNodes from './DnsNodes'; // 1. Import the new component

export default function CyberScene() {
  const meshRef = useRef();
  const dnsRef = useRef(); // reference to the DNS node group
  const [hovered, setHover] = useState(false);
  
  const activeTool = useToolStore((state) => state.activeTool);
  const dnsData = useToolStore((state) => state.dnsData); // 2. Watch DNS data
  const setActiveTool = useToolStore((state) => state.setActiveTool);
  const { primary: themeColor, accent } = getTheme(activeTool);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(0, 0, 0);
    }
  }, [activeTool]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;

    const baseScale = new THREE.Vector3(1, 1, 1);
    const hoverScale = new THREE.Vector3(1.2, 1.2, 1.2);
    const targetScale = hovered ? hoverScale : baseScale;
    
    // 3. HIDE MAIN MESH IF DNS MAP IS ACTIVE
    // If we have DNS data, we shrink the main shape to make room for the map
    if (dnsData && dnsData.length > 0) {
        targetScale.set(0, 0, 0);
    }

    meshRef.current.scale.lerp(targetScale, 0.08);

    const targetIntensity = hovered ? 6.0 : 0.5;
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      targetIntensity,
      0.02
    );

    const targetColor = new THREE.Color(hovered ? accent : themeColor);
    meshRef.current.material.color.lerp(targetColor, 0.1);

    // rotate DNS sphere slowly around Y only for better readability
    if (dnsRef.current && dnsData && dnsData.length > 0) {
      dnsRef.current.rotation.y += delta * 0.2;
      // leave x/z static so labels don't spin upside‑down
    }
  });

  const getGeometry = () => {
    switch (activeTool) {
      case 'recon': return <octahedronGeometry args={[2.2, 0]} />;
      case 'exploit': return <torusKnotGeometry args={[1.2, 0.4, 128, 16]} />;
      case 'osint': return <icosahedronGeometry args={[2, 1]} />;
      case 'audit': return <boxGeometry args={[2, 2, 2]} />;
      default: return <dodecahedronGeometry args={[2, 0]} />;
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (activeTool === 'recon') setActiveTool('exploit');
    else if (activeTool === 'exploit') setActiveTool('osint');
    else setActiveTool('recon');
  };

  return (
    <>
      {/* 4. MAIN CENTRAL GEOMETRY */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
        onPointerOut={() => setHover(false)}
        onClick={handleClick}
      >
        {getGeometry()}
        <meshStandardMaterial 
          wireframe
          color={themeColor} 
          emissive={themeColor} 
          emissiveIntensity={1}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* 5. THE VISUAL DNS MAP */}
      {/* We wrap it in a Float to give it a "floating in space" look */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group ref={dnsRef}>
          <DnsNodes />
        </group>
      </Float>
    </>
  );
}