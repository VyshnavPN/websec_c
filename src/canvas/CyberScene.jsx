import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useToolStore } from '../state/useToolStore';

export default function CyberScene() {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  
  // Use a selector for better performance
  const activeTool = useToolStore((state) => state.activeTool);

  // Transition effect on tool change
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(0, 0, 0);
    }
  }, [activeTool]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // 1. ROTATION
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;

    // 2. GROW TRANSITION
    meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);

    // 3. SLOW HOVER HIGHLIGHT (LERP)
    const targetIntensity = hovered ? 4.0 : 0.5;
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      targetIntensity,
      0.02 // This is the speed of the "glow"
    );

    // 4. COLOR LERP
    const targetColor = new THREE.Color(hovered ? '#00ff41' : '#001a00');
    meshRef.current.material.color.lerp(targetColor, 0.05);
  });

  // Geometry Logic
  const getGeometry = () => {
    switch (activeTool) {
      case 'recon':
        return <octahedronGeometry args={[2.2, 0]} />;
      case 'exploit':
        return <torusKnotGeometry args={[1.2, 0.4, 128, 16]} />;
      default:
        return <icosahedronGeometry args={[2, 1]} />;
    }
  };

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}
    >
      {getGeometry()}
      <meshStandardMaterial 
        // make the object clearly visible against the pitch‑black background
        wireframe={false}      // solid geometry looks easier to spot
        color="#00ff41"      // bright neon green
        emissive="#00ff41" 
        emissiveIntensity={1}
        transparent={false}
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
}