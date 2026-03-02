import React from 'react';
import { Sphere, Line, Text } from '@react-three/drei';
import { useToolStore } from '../state/useToolStore';

export default function DnsNodes() {
  const { dnsData } = useToolStore();

  if (!dnsData || dnsData.length === 0) return null;

  return (
    <group>
      {/* Central Hub representing the Target */}
      <Sphere args={[0.15, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
      </Sphere>

      {/* Branching Nodes for each DNS Record */}
      {dnsData.map((record, i) => {
        // spread nodes on a sphere instead of a flat circle
        const radius = 3.5;
        const theta = (i / dnsData.length) * Math.PI * 2;          // around equator
        const phi = Math.acos(1 - 2 * (i + 0.5) / dnsData.length); // from pole to pole

        const x = Math.sin(phi) * Math.cos(theta) * radius;
        const y = Math.sin(phi) * Math.sin(theta) * radius;
        const z = Math.cos(phi) * radius;
        const pos = [x, y, z];

        // Color coding based on record type
        const nodeColor = record.type === 'A' ? '#ff0055' : 
                         record.type === 'MX' ? '#ffaa00' : '#00ffaa';

        return (
          <group key={i}>
            {/* Connection Line to Center */}
            <Line 
              points={[[0, 0, 0], pos]} 
              color="#00f3ff" 
              lineWidth={0.5} 
              transparent 
              opacity={0.4} 
            />
            
            {/* The Record Node */}
            <Sphere args={[0.08, 16, 16]} position={pos}>
              <meshStandardMaterial color={nodeColor} emissive={nodeColor} emissiveIntensity={1.5} />
            </Sphere>

            {/* Optional: Small Label for the IP/Value */}
            <Text
              position={[x * 1.15, y * 1.15, z * 1.15]}
              fontSize={0.12}
              color="white"
              font="/fonts/GeistMono-Bold.ttf" // Use your project's mono font path
            >
              {record.type}: {record.val}
            </Text>
          </group>
        );
      })}
    </group>
  );
}