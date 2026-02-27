import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CyberScene() {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)

  useFrame((state) => {
    // 1. SAFETY: Exit if the mesh hasn't loaded yet
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime()

    // 2. STABLE PULSE
    // We use a fixed base scale of 1.0 to prevent it from disappearing
    const pulseAmount = Math.sin(time * 1.5) * 0.03
    meshRef.current.scale.setScalar(1 + pulseAmount)

    // 3. STABLE ROTATION
    meshRef.current.rotation.y += 0.01
    meshRef.current.rotation.x += 0.005

    // 4. STABLE LERP (Manual calculation to avoid THREE.MathUtils errors)
    const targetIntensity = hovered ? 2.5 : 0.8
    const currentIntensity = meshRef.current.material.emissiveIntensity
    
    // Manual lerp: current + (target - current) * speed
    meshRef.current.material.emissiveIntensity += (targetIntensity - currentIntensity) * 0.05

    // 5. STABLE COLOR LERP
    const targetColor = new THREE.Color(hovered ? '#00ff41' : '#002200')
    meshRef.current.material.color.lerp(targetColor, 0.05)
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation() // Prevent events from bubbling up
        setHover(true)
      }}
      onPointerOut={() => setHover(false)}
    >
      <icosahedronGeometry args={[2, 1]} /> 
      <meshStandardMaterial 
        wireframe 
        color="#002200" 
        emissive="#00ff41" 
        emissiveIntensity={0.8}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  )
}