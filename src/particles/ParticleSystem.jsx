import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import vertexShader from '../shaders/particle.vert.glsl';
import fragmentShader from '../shaders/particle.frag.glsl';

const ParticleSystem = ({ scrollT, isMobile }) => {
  const points = useRef();
  const count = isMobile ? 4000 : 12000;

  const [positions, sizes, colors, phases, targets] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const s = new Float32Array(count);
    const c = new Float32Array(count * 3);
    const p = new Float32Array(count);
    const t = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color('#00f5ff'),
      new THREE.Color('#7b2fff'),
      new THREE.Color('#ff2d78')
    ];

    for (let i = 0; i < count; i++) {
      // Spiral Galaxy formation
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 20;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      s[i] = 1.0 + Math.random() * 2.0;

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;

      p[i] = Math.random() * Math.PI * 2;

      // Sphere target (Scene 4)
      const phi = Math.acos(-1 + (2 * i) / count);
      const theta = Math.sqrt(count * Math.PI) * phi;
      t[i * 3] = 8 * Math.cos(theta) * Math.sin(phi);
      t[i * 3 + 1] = 8 * Math.sin(theta) * Math.sin(phi);
      t[i * 3 + 2] = 8 * Math.cos(phi);
    }

    return [pos, s, c, p, t];
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScatter: { value: 1.0 },
    uGlitch: { value: 0.0 },
    uAssemble: { value: 0.0 }
  }), []);

  useFrame((state) => {
    const { clock } = state;
    uniforms.uTime.value = clock.elapsedTime;

    // Transition Logic based on scrollT
    if (scrollT < 0.25) {
      uniforms.uScatter.value = 1.0;
      uniforms.uGlitch.value = 0.0;
      uniforms.uAssemble.value = 0.0;
    } else if (scrollT < 0.45) {
      const st = (scrollT - 0.25) / 0.2;
      uniforms.uScatter.value = 1.0 + st * 1.5;
    } else if (scrollT < 0.65) {
      const st = (scrollT - 0.45) / 0.2;
      uniforms.uGlitch.value = st * 0.8;
    } else if (scrollT < 0.85) {
      const st = (scrollT - 0.65) / 0.2;
      uniforms.uScatter.value = 2.5 - st * 2.2;
      uniforms.uGlitch.value = 0.8 * (1 - st);
      uniforms.uAssemble.value = st;
    } else {
      uniforms.uAssemble.value = 1.0;
      // Fade out for finale
      if (points.current) {
        points.current.material.opacity = Math.max(0, 1 - (scrollT - 0.85) / 0.1 * 2);
      }
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aSize" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-aColor" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-aPhase" count={count} array={phases} itemSize={1} />
        <bufferAttribute attach="attributes-aTarget" count={count} array={targets} itemSize={3} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleSystem;
