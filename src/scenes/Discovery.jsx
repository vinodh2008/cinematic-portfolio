import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import ProjectPortals from '../components/ProjectPortals/ProjectPortals';

const DiscoveryElements = ({ visible }) => {
  const group = useRef();

  useFrame((state) => {
    if (!group.current || !visible) return;
    const t = state.clock.elapsedTime;
    
    group.current.children.forEach((mesh, i) => {
      mesh.rotation.y += 0.01;
      mesh.rotation.x += 0.005;
      mesh.position.y += Math.sin(t + i) * 0.01;
    });
  });

  if (!visible) return null;

  return (
    <group ref={group}>
      <ProjectPortals visible={visible} />
      <mesh position={[8, 2, -5]}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#00f5ff" wireframe opacity={0.15} transparent />
      </mesh>
      <mesh position={[-7, -1, -8]}>
        <octahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color="#7b2fff" wireframe opacity={0.15} transparent />
      </mesh>
      <mesh position={[0, 5, -12]}>
        <tetrahedronGeometry args={[2.5, 0]} />
        <meshBasicMaterial color="#ff2d78" wireframe opacity={0.15} transparent />
      </mesh>
      <mesh position={[12, -3, -3]}>
        <octahedronGeometry args={[2, 0]} />
        <meshBasicMaterial color="#7b2fff" wireframe opacity={0.15} transparent />
      </mesh>
      <mesh position={[-10, 3, -6]}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#00f5ff" wireframe opacity={0.15} transparent />
      </mesh>
    </group>
  );
};

export default DiscoveryElements;
