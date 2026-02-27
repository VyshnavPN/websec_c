import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useToolStore } from '../state/useToolStore';

export default function CyberScene() {
  const meshRef = useRef();
  const [hovered, setHover] = useState(false);
  
  // Connect to your tool state
  const { activeTool } = useToolStore();

  // Reset scale when tool changes to trigger the "grow" animation
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(0, 0, 0);
    }
  }, [activeTool]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    // 1. CONSTANT ROTATION
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x += delta * 0.1;

    // 2. SMOOTH SCALE TRANSITION (The "Grow" effect)
    // Brings scale from 0 back to 1 smoothly
    meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.05);

    // 3. BREATHING PULSE (Subtle life)
    const pulse = 1 + Math.sin(time * 1.5) * 0.01;
    meshRef.current.scale.multiplyScalar(pulse);

    // 4. THE SILKY SLOW HOVER (The fix you requested)
    // Speed 0.02 is very deliberate and slow
    const targetIntensity = hovered ? 3.5 : 0.6;
    const lerpSpeed = 0.02; 
    
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      targetIntensity,
      lerpSpeed
    );

    // 5. COLOR INTERPOLATION
    const targetColor = new THREE.Color(hovered ? '#00ff41' : '#002200');
    meshRef.current.material.color.lerp(targetColor, lerpSpeed);
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
      {/* GEOMETRY SELECTOR */}
      {activeTool === 'recon' ? (
        // Recon looks like a satellite/scanner
        <dodecahedronGeometry args={[2, 0]} />
      ) : activeTool === 'exploit' ? (
        // Exploit looks complex and aggressive
        <torusKnotGeometry args={[1.2, 0.4, 128, 16]} />
      ) : (
        // Default Home / Dashboard shape
        <icosahedronGeometry args={[2, 1]} />
      )}

      <meshStandardMaterial 
        wireframe 
        color="#002200" 
        emissive="#00ff41" 
        emissiveIntensity={0.6}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide} // Adds depth to the wireframe
      />
    </mesh>
  );
}