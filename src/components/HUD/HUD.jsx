import React from 'react';
import styles from './HUD.module.css';

const HUD = ({ visible, scrollT }) => {
  const currentScene = Math.min(4, Math.floor(scrollT * 5)) + 1;
  const sceneLabels = ['AWAKENING', 'DISCOVERY', 'CHAOS', 'TRANSFORMATION', 'FINALE'];

  return (
    <div className={`${styles.hud} ${visible ? styles.visible : ''}`}>
      <div className={`${styles.bracket} ${styles.topLeft}`}></div>
      <div className={`${styles.bracket} ${styles.topRight}`}></div>
      <div className={`${styles.bracket} ${styles.bottomLeft}`}></div>
      <div className={`${styles.bracket} ${styles.bottomRight}`}></div>

      <div className={styles.sceneIndicator}>
        <span className={styles.sceneNumber}>0{currentScene}</span>
        <span className={styles.sceneLabel}>{sceneLabels[currentScene - 1]}</span>
      </div>

      <div className={styles.scrollHint}>
        SCROLL TO EXPLORE
      </div>
    </div>
  );
};

export default HUD;
