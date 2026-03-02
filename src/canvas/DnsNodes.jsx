import React from 'react';
import { Sphere, Line, Text } from '@react-three/drei';
import { useToolStore } from '../state/useToolStore';

export default function DnsNodes() {
  const { dnsData } = useToolStore();

  // extra debug whenever the data changes
  React.useEffect(() => {
    console.debug('useEffect dnsData updated', dnsData);
  }, [dnsData]);

  if (!dnsData || dnsData.length === 0) {
    console.debug('DnsNodes: no data to render', dnsData);
    return null;
  }
  console.debug('DnsNodes rendering', dnsData.length, 'records');

  // configurable sizes so they are easier to see
  const hubRadius = 0.2;
  const nodeRadius = 0.2;
  const spreadRadius = 3.5;

  return (
    <group>
      {/* Central Hub representing the Target */}
      <Sphere args={[hubRadius, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#00f3ff" emissive="#00f3ff" emissiveIntensity={2} />
      </Sphere>
      {/* display count in center for debugging */}
      <Text position={[0, 0, 0]} fontSize={0.2} color="#fff" anchorX="center" anchorY="middle">
        {dnsData.length} records
      </Text>

      {/* Branching Nodes for each DNS Record */}
      {dnsData.map((record, i) => {
        // spread nodes on a sphere instead of a flat circle
        const theta = (i / dnsData.length) * Math.PI * 2;          // around equator
        const phi = Math.acos(1 - 2 * (i + 0.5) / dnsData.length); // from pole to pole

        const x = Math.sin(phi) * Math.cos(theta) * spreadRadius;
        const y = Math.sin(phi) * Math.sin(theta) * spreadRadius;
        const z = Math.cos(phi) * spreadRadius;
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
            
            {/* The Record Node (bumped size for visibility) */}
            <Sphere args={[nodeRadius, 16, 16]} position={pos}>
              <meshStandardMaterial color={nodeColor} emissive={nodeColor} emissiveIntensity={1.5} />
            </Sphere>

            {/* Optional: Small Label for the IP/Value */}
            <Text
              position={[x * 1.15, y * 1.15, z * 1.15]}
              fontSize={0.12}
              color="white"
              // removed font prop; default font will be used to avoid 404 errors
            >
              {record.type}: {record.val}
            </Text>
          </group>
        );
      })}
    </group>
  );
}