import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useToolStore } from '../state/useToolStore';
import { getTheme } from '../utils/theme';

export default function CyberScene() {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  
  // store selectors
  const activeTool = useToolStore((state) => state.activeTool);
  const setActiveTool = useToolStore((state) => state.setActiveTool);
  const { primary: themeColor, accent } = getTheme(activeTool);

  // Transition effect on tool change
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(0, 0, 0);
    }
  }, [activeTool]);

  // rotate + color + grow
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. ROTATION
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;

    // 2. GROW TRANSITION / hover scale
    const baseScale = new THREE.Vector3(1, 1, 1);
    const hoverScale = new THREE.Vector3(1.2, 1.2, 1.2);
    const targetScale = hovered ? hoverScale : baseScale;
    meshRef.current.scale.lerp(targetScale, 0.08);

    // 3. SLOW HOVER HIGHLIGHT (LERP)
    const targetIntensity = hovered ? 6.0 : 0.5;
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      targetIntensity,
      0.02 // This is the speed of the "glow"
    );

    // 4. COLOR LERP - now based on palette values
    const base = themeColor;
    const hoverTint = hovered ? accent : base;
    const targetColor = new THREE.Color(hoverTint);
    meshRef.current.material.color.lerp(targetColor, 0.1);
  });

  // Geometry Logic
  const getGeometry = () => {
    switch (activeTool) {
      case 'recon':
        return <octahedronGeometry args={[2.2, 0]} />;
      case 'exploit':
        return <torusKnotGeometry args={[1.2, 0.4, 128, 16]} />;
      case 'osint':
        // slightly simpler shape for OSINT
        return <icosahedronGeometry args={[2, 1]} />;
      default:
        // fallback for audit or any other unexpected value
        return <dodecahedronGeometry args={[2, 0]} />;
    }
  };

  // rotate through recon → exploit → osint on click (audit is not included)
  const handleClick = (e) => {
    e.stopPropagation();
    if (activeTool === 'recon') setActiveTool('exploit');
    else if (activeTool === 'exploit') setActiveTool('osint');
    else setActiveTool('recon');
  };

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
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
  );
}