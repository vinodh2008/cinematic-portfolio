import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './SceneText.module.css';

const SceneText = ({ scrollT }) => {
  const scenes = [
    { eyebrow: 'Scene I — Awakening', title: 'Every Journey Begins\nWith Curiosity.', description: '' },
    { eyebrow: 'Scene II — Discovery', title: 'Beyond The Known\nHorizon', description: 'Explore the edges of possibility' },
    { eyebrow: 'Scene III — Chaos', title: 'Order Dissolves\nInto Beautiful Entropy', description: '', glitch: true },
    { eyebrow: 'Scene IV — Transformation', title: 'From Chaos\nComes Form', description: '' },
    { eyebrow: 'Scene V — Finale', title: 'Imagination\nCreates Worlds', description: 'The universe is yours to shape' }
  ];

  const activeIdx = Math.min(4, Math.floor(scrollT * 5));

  const textRefs = useRef([]);

  useEffect(() => {
    // Reset all animations
    gsap.set(textRefs.current, { y: '100%', opacity: 0 });

    // Animate active scene text
    const activeRefs = textRefs.current.filter(ref => ref && ref.dataset.sceneindex == activeIdx);
    
    if (activeRefs.length > 0) {
      gsap.to(activeRefs, {
        y: '0%',
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.2
      });
    }
  }, [activeIdx]);

  return (
    <div className={styles.container}>
      {scenes.map((scene, i) => (
        <div 
          key={i} 
          className={`${styles.sceneOverlay} ${i === activeIdx ? styles.active : ''}`}
        >
          <div className={styles.eyebrow}>
            <span style={{ display: 'block', overflow: 'hidden' }}>
              <span ref={el => textRefs.current.push(el)} data-sceneindex={i} style={{ display: 'inline-block' }}>
                {scene.eyebrow}
              </span>
            </span>
          </div>
          <h1>
            {scene.title.split('\n').map((line, idx) => (
              <span key={idx} style={{ display: 'block', overflow: 'hidden' }}>
                <span ref={el => textRefs.current.push(el)} data-sceneindex={i} style={{ display: 'inline-block' }}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          {scene.description && (
            <div className={styles.description}>
              <span style={{ display: 'block', overflow: 'hidden' }}>
                <span ref={el => textRefs.current.push(el)} data-sceneindex={i} style={{ display: 'inline-block' }}>
                  {scene.description}
                </span>
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SceneText;
