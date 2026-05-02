import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FinaleCore = ({ visible }) => {
  const group = useRef();
  const innerRef = useRef();
  const outerRef = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    
    group.current.rotation.y += 0.005;
    innerRef.current.rotation.x += 0.01;
    innerRef.current.rotation.z += 0.01;
    
    outerRef.current.rotation.y -= 0.005;
    outerRef.current.rotation.x -= 0.003;

    // Pulsing scale
    const pulse = 1 + Math.sin(t * 2) * 0.05;
    group.current.scale.set(pulse, pulse, pulse);
  });

  if (!visible) return null;

  return (
    <group ref={group}>
      {/* Central Orb */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#00f5ff" />
      </mesh>

      {/* Orbiting Rings */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI * i / 3, Math.PI / 4, 0]}>
          <torusGeometry args={[3, 0.02, 16, 100]} />
          <meshBasicMaterial color="#7b2fff" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* Inner Wireframe */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[3, 0]} />
        <meshBasicMaterial color="#ff2d78" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Outer Sphere */}
      <mesh ref={outerRef}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#00f5ff" wireframe transparent opacity={0.1} />
      </mesh>
    </group>
  );
};

export default FinaleCore;
