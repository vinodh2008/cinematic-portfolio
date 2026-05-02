import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import styles from './Loader.module.css';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.random() * 2;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setTimeout(handleComplete, 500);
      }
      setProgress(Math.floor(current));
    }, 50);

    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        current = 100;
        setProgress(100);
        clearInterval(interval);
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleComplete = () => {
    const tl = gsap.timeline({
      onComplete: onComplete
    });

    tl.to(`.${styles.rings}`, {
      scale: 0,
      opacity: 0,
      duration: 0.8,
      ease: 'back.in'
    })
    .to(`.${styles.container}`, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut'
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.title}>GENESIS</div>
        <div className={styles.subtitle}>Initializing Universe</div>
        
        <div className={styles.rings}>
          <div className={`${styles.ring} ${styles.ring1}`}></div>
          <div className={`${styles.ring} ${styles.ring2}`}></div>
          <div className={`${styles.ring} ${styles.ring3}`}></div>
          <div className={`${styles.ring} ${styles.ring4}`}></div>
          <div className={styles.percentage}>{progress}%</div>
        </div>

        <div className={styles.progressLabel}>Loading Experience</div>
        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill} 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
