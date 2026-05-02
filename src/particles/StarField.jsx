import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const StarField = ({ isMobile }) => {
  const stars = useRef();
  const count = isMobile ? 1500 : 4000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 80 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame(() => {
    if (stars.current) {
      stars.current.rotation.y += 0.0005;
    }
  });

  return (
    <points ref={stars}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.5} color="#ffffff" transparent opacity={0.3} />
    </points>
  );
};

export default StarField;
