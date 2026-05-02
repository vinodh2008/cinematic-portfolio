import React, { useState, Suspense, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

import Loader from './components/Loader/Loader';
import HUD from './components/HUD/HUD';
import SceneText from './components/SceneText/SceneText';
import ParticleSystem from './particles/ParticleSystem';
import StarField from './particles/StarField';
import DiscoveryElements from './scenes/Discovery';
import FinaleCore from './components/Finale/Finale';
import NavMenu from './components/NavMenu/NavMenu';
import { FluidCursorEffect } from './components/FluidCursor/FluidCursorEffect';
import { audioController } from './utils/AudioController';
import { useScroll } from './hooks/useScroll';
import { useMouse } from './hooks/useMouse';
import { getCameraPosition } from './animations/cameraTimeline';
import { getQualitySettings } from './utils/performanceMonitor';
import distortionFrag from './shaders/distortion.frag.glsl';
import { Effect } from 'postprocessing';
import './mobile.css';

class DistortionEffectImpl extends Effect {
  constructor({ intensity = 0, time = 0 }) {
    super('DistortionEffect', distortionFrag, {
      uniforms: new Map([
        ['uIntensity', new THREE.Uniform(intensity)],
        ['uTime', new THREE.Uniform(time)]
      ])
    });
  }

  update(renderer, inputBuffer, deltaTime) {
    this.uniforms.get('uTime').value += deltaTime;
  }
}

const DistortionEffect = ({ intensity }) => {
  const effect = useMemo(() => new DistortionEffectImpl({ intensity }), []);
  useEffect(() => {
    effect.uniforms.get('uIntensity').value = intensity;
  }, [intensity, effect]);
  return <primitive object={effect} />;
};

const SceneContent = ({ scrollT, mouse, isMobile }) => {
  const cameraRef = useRef();

  useFrame((state) => {
    const { camera } = state;
    
    // Camera Path Logic
    const { pos, look } = getCameraPosition(scrollT);
    
    // Mouse Parallax (disabled on mobile for performance)
    const parallaxX = isMobile ? 0 : mouse.targetX * 1.5;
    const parallaxY = isMobile ? 0 : mouse.targetY * 1.0;
    const targetPos = new THREE.Vector3(pos.x + parallaxX, pos.y - parallaxY, pos.z);
    camera.position.lerp(targetPos, 0.08);
    camera.lookAt(
      look.x + (isMobile ? 0 : mouse.targetX * 0.5),
      look.y - (isMobile ? 0 : mouse.targetY * 0.3),
      look.z
    );
  });

  return (
    <>
      <fogExp2 attach="fog" args={['#000005', 0.012]} />
      <ParticleSystem scrollT={scrollT} isMobile={isMobile} />
      <StarField isMobile={isMobile} />
      
      <DiscoveryElements visible={scrollT > 0.2 && scrollT < 0.7} />
      <FinaleCore visible={scrollT > 0.8} />
    </>
  );
};

function App() {
  const [loaded, setLoaded] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const scroll = useScroll();
  const mouse = useMouse();
  const quality = useMemo(() => getQualitySettings(), []);

  // Bug 6 — Scene 4 overlay: control via JS
  const scene4OverlayRef = useRef(null);
  useEffect(() => {
    if (!scene4OverlayRef.current) return;
    const inScene4 = scroll.t > 0.65 && scroll.t < 0.85;
    scene4OverlayRef.current.style.opacity = inScene4 ? '1' : '0';
  }, [scroll.t]);

  const isMobile = quality.isMobile;

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      
      <HUD visible={loaded} scrollT={scroll.t} />
      <SceneText scrollT={scroll.t} />

      {/* Bug 6 — Scene 4 dark teal atmospheric overlay */}
      <div
        id="scene-bg-overlay"
        ref={scene4OverlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 2s ease',
          background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(0,80,80,0.25) 0%, rgba(0,30,40,0.15) 50%, transparent 100%)'
        }}
      />

      {/* Bug 5 — Nav: responsive layout */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        padding: isMobile ? '14px 16px' : '40px 80px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
        boxSizing: 'border-box'
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: 'Orbitron',
          fontSize: isMobile ? '10px' : '11px',
          letterSpacing: isMobile ? '3px' : '4px',
          lineHeight: 1.3,
          flexShrink: 0
        }}>
          ACTIVE THEORY
        </div>

        {/* Right nav group */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'flex-end',
          gap: isMobile ? '4px' : '40px'
        }}>
          <button
            onClick={() => setSoundOn(audioController.toggleMute())}
            style={{
              background: 'transparent',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Orbitron',
              fontSize: isMobile ? '9px' : '11px',
              letterSpacing: isMobile ? '2px' : '2px',
              opacity: 0.6
            }}
          >
            SOUND [{soundOn ? 'ON' : 'OFF'}]
          </button>
          <button
            className="nav-btn"
            onClick={() => setIsNavOpen(true)}
            onMouseEnter={() => audioController.playHoverSound()}
            style={{
              background: 'transparent',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Orbitron',
              fontSize: isMobile ? '10px' : '11px',
              letterSpacing: '2px'
            }}
          >
            {isMobile ? 'MENU' : 'WORK ——— CONTACT'}
          </button>
        </div>
      </nav>

      <NavMenu isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      {/* Bug 2 — Sidebar: hidden on mobile via quality.isMobile */}
      {!isMobile && (
        <div id="sidebar" style={{
          position: 'fixed',
          left: '40px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 55,
          display: 'flex',
          flexDirection: 'column',
          gap: '15px'
        }}>
          {['WEBSITES', 'INSTALLATIONS', 'XR / VR / AI', 'MULTIPLAYER', 'GAMES'].map(item => (
            <div
              key={item}
              className="sidebar-item"
              onMouseEnter={() => audioController.playHoverSound()}
              style={{ fontFamily: 'Orbitron', fontSize: '11px', letterSpacing: '3px', opacity: 0.6, cursor: 'pointer' }}
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {/* Bug 7 — Progress dots: responsive position */}
      <div id="nav-dots" style={{
        position: 'fixed',
        right: isMobile ? '10px' : '40px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '10px' : '20px'
      }}>
        {[0, 0.25, 0.45, 0.65, 0.85].map((t, i) => {
          const isActive = Math.min(4, Math.floor(scroll.t * 5)) === i;
          return (
            <div
              key={i}
              className={`dot ${isActive ? 'active' : ''}`}
              onClick={() => window.scrollTo({ top: t * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'smooth' })}
              style={{
                width: isMobile ? '5px' : '8px',
                height: isMobile ? '5px' : '8px',
                borderRadius: '50%',
                border: `1px solid ${isActive ? 'rgba(0,245,255,0.8)' : 'rgba(255,255,255,0.3)'}`,
                boxShadow: isActive ? '0 0 6px rgba(0,245,255,0.6)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          );
        })}
      </div>

      <Canvas
        camera={{ fov: 45, position: [0, 2, 30] }}
        gl={{ antialias: quality?.antialias ?? true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000005'); // Bug 6 — always dark, never solid teal
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <Suspense fallback={null}>
          <SceneContent scrollT={scroll.t} mouse={mouse} isMobile={quality.isMobile} />
          <EffectComposer>
            <FluidCursorEffect />
            <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
            <DistortionEffect
              intensity={scroll.t > 0.45 && scroll.t < 0.65 ? (scroll.t - 0.45) / 0.2 : 0}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <footer style={{
        position: 'fixed',
        bottom: '0',
        width: '100%',
        height: '100vh',
        pointerEvents: scroll.t > 0.95 ? 'all' : 'none',
        opacity: scroll.t > 0.95 ? 1 : 0,
        transition: 'opacity 1s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 5,
        background: '#000005'
      }}>
        <div style={{
          fontFamily: 'Orbitron',
          fontSize: isMobile ? '12vw' : '15vw',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.1)',
          whiteSpace: isMobile ? 'normal' : 'nowrap',
          textAlign: 'center',
          padding: isMobile ? '0 16px' : '0'
        }}>
          LAX → NYC → AMS
        </div>
        <a href="mailto:hello@activetheory.net" style={{
          fontFamily: 'Orbitron',
          fontSize: isMobile ? '14px' : '24px',
          color: '#fff',
          textDecoration: 'underline',
          marginTop: '40px'
        }}>
          hello@activetheory.net
        </a>
      </footer>
    </>
  );
}

export default App;
