import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import portalFrag from '../../shaders/portal.frag.glsl';
import { audioController } from '../../utils/AudioController';
import gsap from 'gsap';

// Simple vertex shader for portals
const portalVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const Portal = ({ position, label }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const [hovered, setHovered] = useState(false);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpen: { value: 0.1 } // baseline closed
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    // Hover sway
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.2;
    }
  });

  const handlePointerOver = () => {
    setHovered(true);
    audioController.playHoverSound();
    gsap.to(materialRef.current.uniforms.uOpen, { value: 1.0, duration: 0.5, ease: 'back.out' });
  };

  const handlePointerOut = () => {
    setHovered(false);
    gsap.to(materialRef.current.uniforms.uOpen, { value: 0.1, duration: 0.5, ease: 'power2.inOut' });
  };

  return (
    <group position={position}>
      <mesh 
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <planeGeometry args={[3, 3]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={portalVert}
          fragmentShader={portalFrag}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const ProjectPortals = ({ visible }) => {
  if (!visible) return null;

  return (
    <group position={[0, 0, 0]}>
      <Portal position={[-6, 1, 0]} label="PROJECT A" />
      <Portal position={[0, -1, -2]} label="PROJECT B" />
      <Portal position={[6, 2, -1]} label="PROJECT C" />
    </group>
  );
};

export default ProjectPortals;
