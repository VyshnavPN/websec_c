import React, { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function CyberScene() {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // 1. BASE ROTATION
    meshRef.current.rotation.y += delta * 0.2

    // 2. THE SLOW HOVER CALCULATION (Lerp)
    // ---------------------------------------------------------
    // targetValue: where we want to be
    // speed: how fast we get there (0.02 is very slow/smooth)
    const targetIntensity = hovered ? 3.5 : 0.5 
    const speed = 0.02 

    // We manually move the intensity toward the target by a tiny fraction each frame
    meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
      meshRef.current.material.emissiveIntensity,
      targetIntensity,
      speed
    )
    // ---------------------------------------------------------

    // 3. SLOW COLOR SHIFT
    // This transitions the wireframe color from dark to bright matrix green
    const targetColor = new THREE.Color(hovered ? '#00ff41' : '#002200')
    meshRef.current.material.color.lerp(targetColor, speed)
  })

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <icosahedronGeometry args={[2, 1]} /> 
      <meshStandardMaterial 
        wireframe 
        color="#002200" 
        emissive="#00ff41" 
        emissiveIntensity={0.5} // Initial state
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}