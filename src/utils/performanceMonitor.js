export const getQualitySettings = () => {
  const isMobile = window.innerWidth < 768;
  const isLowEnd = !window.matchMedia('(min-width: 1024px)').matches;

  return {
    particleCount: isMobile ? 4000 : 12000,
    starCount: isMobile ? 1500 : 4000,
    antialias: !isMobile,
    bloomIntensity: isLowEnd ? 0.8 : 1.5,
    isMobile
  };
};
