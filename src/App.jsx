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
    
    // Mouse Parallax
    const targetPos = new THREE.Vector3(pos.x + mouse.targetX * 1.5, pos.y - mouse.targetY * 1.0, pos.z);
    camera.position.lerp(targetPos, 0.08);
    camera.lookAt(look.x + mouse.targetX * 0.5, look.y - mouse.targetY * 0.3, look.z);

    // Chaos Shake removed to prevent continuous violent screen shaking.
    // The distortion post-processing effect handles the chaos aesthetic instead.
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

  return (
    <>
      {!loaded && <Loader onComplete={() => setLoaded(true)} />}
      
      <HUD visible={loaded} scrollT={scroll.t} />
      <SceneText scrollT={scroll.t} />

      {/* Nav Elements */}
      <nav style={{ position: 'fixed', top: '40px', width: '100%', padding: '0 80px', display: 'flex', justifyContent: 'space-between', zIndex: 100 }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: '11px', letterSpacing: '4px' }}>ACTIVE THEORY</div>
        <div style={{ display: 'flex', gap: '40px' }}>
          <button 
            onClick={() => setSoundOn(audioController.toggleMute())} 
            style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Orbitron', letterSpacing: '2px', opacity: 0.6 }}
          >
            SOUND [ {soundOn ? 'ON' : 'OFF'} ]
          </button>
          <button 
            className="nav-btn" 
            onClick={() => setIsNavOpen(true)} 
            onMouseEnter={() => audioController.playHoverSound()}
            style={{ background: 'transparent', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Orbitron', letterSpacing: '2px' }}
          >
            WORK ——— CONTACT
          </button>
        </div>
      </nav>

      <NavMenu isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <div id="sidebar" style={{ position: 'fixed', left: '40px', top: '50%', transform: 'translateY(-50%)', zIndex: 55, display: quality.isMobile ? 'none' : 'flex', flexDirection: 'column', gap: '15px' }}>
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

      <div id="nav-dots" style={{ position: 'fixed', right: '40px', top: '50%', transform: 'translateY(-50%)', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {[0, 0.25, 0.45, 0.65, 0.85].map((t, i) => (
          <div 
            key={i} 
            className={`dot ${Math.min(4, Math.floor(scroll.t * 5)) === i ? 'active' : ''}`}
            onClick={() => window.scrollTo({ top: t * (document.documentElement.scrollHeight - window.innerHeight), behavior: 'smooth' })}
            style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}
          />
        ))}
      </div>

      <Canvas
        camera={{ fov: 45, position: [0, 2, 30] }}
        gl={{ antialias: quality?.antialias ?? true }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000005');
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

      <footer style={{ position: 'fixed', bottom: '0', width: '100%', height: '100vh', pointerEvents: scroll.t > 0.95 ? 'all' : 'none', opacity: scroll.t > 0.95 ? 1 : 0, transition: 'opacity 1s ease', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 5, background: '#000005' }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: '15vw', fontWeight: 300, color: 'rgba(255,255,255,0.1)', whiteSpace: 'nowrap' }}>
          LAX → NYC → AMS
        </div>
        <a href="mailto:hello@activetheory.net" style={{ fontFamily: 'Orbitron', fontSize: '24px', color: '#fff', textDecoration: 'underline', marginTop: '40px' }}>
          hello@activetheory.net
        </a>
      </footer>
    </>
  );
}

export default App;
