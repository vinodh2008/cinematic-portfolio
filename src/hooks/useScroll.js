import { useState, useEffect } from 'react';

export const useScroll = () => {
  const [scroll, setScroll] = useState({
    y: 0,
    targetY: 0,
    t: 0 // normalized 0-1
  });

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(prev => ({
        ...prev,
        targetY: y,
        t: y / maxScroll
      }));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scroll;
};
