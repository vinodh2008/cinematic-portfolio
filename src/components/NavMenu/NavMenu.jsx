import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './NavMenu.module.css';

const NavMenu = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);
  const itemsRef = useRef([]);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        autoAlpha: 1,
        duration: 0.5,
        ease: 'power2.out'
      });
      
      gsap.to(itemsRef.current, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.2
      });
    } else {
      gsap.to(itemsRef.current, {
        y: '100%',
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.in'
      });
      
      gsap.to(overlayRef.current, {
        opacity: 0,
        autoAlpha: 0,
        duration: 0.5,
        ease: 'power2.in',
        delay: 0.3
      });
    }
  }, [isOpen]);

  const menuItems = ['Work', 'Studio', 'News', 'Contact'];

  return (
    <div ref={overlayRef} className={styles.menuOverlay} style={{ pointerEvents: isOpen ? 'all' : 'none' }}>
      <button className={styles.closeBtn} onClick={onClose}>
        CLOSE [X]
      </button>
      
      <div className={styles.menuList}>
        {menuItems.map((item, index) => (
          <div key={item} className={styles.menuItem}>
            <span ref={el => itemsRef.current[index] = el}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NavMenu;
