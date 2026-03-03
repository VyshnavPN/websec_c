import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, Text } from '@react-three/drei'; // Added for smooth movement and text rendering
import { useToolStore } from '../state/useToolStore';
import { getTheme } from '../utils/theme';
import DnsNodes from './DnsNodes'; // 1. Import the new component

export default function CyberScene() {
  const meshRef = useRef();
  const dnsRef = useRef(); // reference to the DNS node group
  const [hovered, setHover] = useState(false);
  
  const activeTool = useToolStore((state) => state.activeTool);
  const dnsData = useToolStore((state) => state.dnsData); // 2. Watch DNS data
  const output = useToolStore((state) => state.output); // text output from tools
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

    // determine whether we have something to display in place of the mesh
    const hasDns = dnsData && dnsData.length > 0;
    const hasText = !hasDns && output && output.trim().length > 0;

    if (hasDns || hasText) {
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
    if (dnsRef.current && hasDns) {
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

  const hasDns = dnsData && dnsData.length > 0;
  // text should be shown whenever we have output (and no DNS records).
  // previously we limited this to recon only; the requirement is to paint
  // results on the canvas for *all* scans just like recon does.  limit the
  // number of lines so long dumps (exploit stack traces, osint walls) don't
  // swamp the geometry.
  const hasText = !hasDns && output && output.trim().length > 0;
  const show3DText = hasText; // no longer restrict by activeTool
  const displayOutput = show3DText
    ? output.split('\n').slice(-20).join('\n')
    : '';

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

      {/* 5. VISUALIZATION AREA */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        {hasDns ? (
          <group ref={dnsRef}>
            <DnsNodes />
          </group>
        ) : show3DText ? (
          <Text
            fontSize={0.24}
            color={themeColor}
            maxWidth={6}
            lineHeight={1.2}
            anchorX="center"
            anchorY="middle"
          >
            {displayOutput}
          </Text>
        ) : null}
      </Float>
    </>
  );
}