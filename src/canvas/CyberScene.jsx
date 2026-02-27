import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useToolStore } from '../state/useToolStore';

export default function CyberScene() {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  
  // Pulling activeTool from your Zustand store
  const { activeTool } = useToolStore();

  // Reset scale for a "pop-in" effect whenever the tool changes
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(0, 0, 0);
    }
  }, [activeTool]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // 1. DYNAMIC ROTATION
    // Exploit rotates faster and more aggressively
    const rotSpeed = activeTool === 'exploit' ? 0.8 : 0.2;
    meshRef.current.rotation.y += delta * rotSpeed;
    meshRef.current.rotation.x += delta * (rotSpeed / 2);

    // 2. GROWTH ANIMATION
    // Smoothly scales from 0 to 1 after a tool switch
    meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.08);

    // 3. THE "SILKY" HOVER TRANSITION
    // We use a very low lerp factor (0.02) to ensure the glow ramps up slowly
    const targetIntensity = hovered ? 4.5 : 0.5;
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      targetIntensity,
      0.02 
    );

    // 4. COLOR MORPHING
    // Deep green for Recon/Default, but shifts to a sharper Cyan for Exploit
    const baseColor = activeTool === 'exploit' ? '#003333' : '#001a00';
    const highlightColor = activeTool === 'exploit' ? '#00ffff' : '#00ff41';
    
    const targetColor = new THREE.Color(hovered ? highlightColor : baseColor);
    meshRef.current.material.color.lerp(targetColor, 0.02);
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
      }}
      onPointerOut={() => setHover(false)}
    >
      {/* MESH LOGIC:
          RECON: Octahedron (Minimalist, sharp blip)
          EXPLOIT: TorusKnot (Complex, tangled system)
          DEFAULT: Icosahedron (Global network star)
      */}
      {activeTool === 'recon' ? (
        <octahedronGeometry args={[2.2, 0]} />
      ) : activeTool === 'exploit' ? (
        <torusKnotGeometry args={[1.2, 0.4, 128, 16]} />
      ) : (
        <icosahedronGeometry args={[2, 1]} />
      )}

      <meshStandardMaterial 
        wireframe 
        transparent
        opacity={0.8}
        color="#001a00" 
        emissive="#00ff41" 
        emissiveIntensity={0.5}
        side={THREE.DoubleSide} 
      />
    </mesh>
  );
}