import { useState, useEffect } from 'react';

export const useScroll = () => {
  const [scroll, setScroll] = useState({
    y: 0,
    targetY: 0,
    t: 0 // normalized 0-1
  });

  useEffect(() => {
    // Desktop scroll handler
    const handleScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(prev => ({
        ...prev,
        targetY: y,
        t: maxScroll > 0 ? y / maxScroll : 0
      }));
    };

    // Touch / swipe handler (mobile)
    let touchStartY = 0;
    let accumulatedScroll = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const touchCurrentY = e.touches[0].clientY;
      const delta = touchStartY - touchCurrentY;
      touchStartY = touchCurrentY;

      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      // Accumulate scroll offset and clamp
      accumulatedScroll = Math.max(0, Math.min(maxScroll, window.scrollY + delta * 1.5));
      window.scrollTo(0, accumulatedScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return scroll;
};
