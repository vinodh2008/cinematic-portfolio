import { useState, useEffect } from 'react';

export const useMouse = () => {
  const [mouse, setMouse] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMouse(prev => ({
        ...prev,
        targetX: (e.clientX / window.innerWidth - 0.5) * 2,
        targetY: (e.clientY / window.innerHeight - 0.5) * 2
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mouse;
};
