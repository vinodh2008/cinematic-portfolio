import React, { useMemo, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Effect } from 'postprocessing';
import * as THREE from 'three';
import fluidCursorFrag from '../../shaders/fluidCursor.frag.glsl';
import { useMouse } from '../../hooks/useMouse';

class FluidCursorEffectImpl extends Effect {
  constructor({ mousePositions, aspect }) {
    super('FluidCursorEffect', fluidCursorFrag, {
      uniforms: new Map([
        ['uTime', new THREE.Uniform(0)],
        ['uMouse', new THREE.Uniform(mousePositions)],
        ['uAspect', new THREE.Uniform(aspect)]
      ])
    });
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('uTime').value += deltaTime;
  }
}

export const FluidCursorEffect = () => {
  const mouse = useMouse();
  const { viewport } = useThree();
  const mouseHistory = useRef(Array(20).fill(new THREE.Vector2(-10, -10))); // Start off-screen
  
  // Note: we must map the array of Vector2s to what GLSL expects, which is fine with THREE.Uniform
  const effect = useMemo(() => new FluidCursorEffectImpl({ 
    mousePositions: mouseHistory.current,
    aspect: viewport.aspect
  }), [viewport.aspect]);

  useFrame(() => {
    // Convert useMouse coordinates (-1 to 1) to UV coordinates (0 to 1)
    const uvX = mouse.targetX * 0.5 + 0.5;
    const uvY = mouse.targetY * -0.5 + 0.5;
    
    const currentPos = new THREE.Vector2(uvX, uvY);
    
    // Shift history
    for (let i = 0; i < 19; i++) {
      mouseHistory.current[i].copy(mouseHistory.current[i + 1]);
    }
    // Update newest
    mouseHistory.current[19].copy(currentPos);
    
    // Pass to shader
    effect.uniforms.get('uMouse').value = mouseHistory.current;
    effect.uniforms.get('uAspect').value = viewport.aspect;
  });

  return <primitive object={effect} />;
};
