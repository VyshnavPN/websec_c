// src/canvas/CyberScene.jsx
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, MeshDistortMaterial, Environment } from '@react-three/drei'
import { useToolStore } from '../state/useToolStore'

function CyberMesh() {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)
  const { activeTool, setActiveTool } = useToolStore()

  // Basic rotation animation
  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta * 0.2
    meshRef.current.rotation.y += delta * 0.2
  })

  // Change color based on the "tool" (just a demo)
  const colors = {
    recon: '#00ff88', // Green
    exploit: '#ff0055', // Red
    defense: '#00ccff' // Blue
  }

  return (
    <mesh 
      ref={meshRef}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => setActiveTool(activeTool === 'recon' ? 'exploit' : 'recon')} // Toggle for test
      scale={hovered ? 1.2 : 1}
    >
      <icosahedronGeometry args={[2, 0]} /> {/* The "Star" shape base */}
      {/* Inside src/canvas/CyberScene.jsx */}

<MeshDistortMaterial 
  color={activeTool === 'exploit' ? '#ff0033' : '#00ff41'} // Matrix Green vs. Alert Red
  wireframe={true}  // <--- This turns on the wireframe mode
  speed={2}         // How fast the "glitch" moves
  distort={0.6}     // Make it wobble more (like unstable data)
  roughness={0}
  metalness={1}
/>
    </mesh>
  )
}

// src/canvas/CyberScene.jsx
// ... (imports same as before)

export default function CyberScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 45 }}> {/* Adjusted Camera */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      
      {/* The Mesh is automatically at [0,0,0] which is center screen */}
      <CyberMesh /> 
      
      <Environment preset="city" />
      
      {/* Disable zoom so they don't get lost, enable rotate */}
      <OrbitControls enableZoom={false} /> 
    </Canvas>
  )
}