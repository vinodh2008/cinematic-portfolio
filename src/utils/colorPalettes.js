export const PALETTE = {
  primary: '#00f5ff',
  secondary: '#7b2fff',
  accent: '#ff2d78',
  gold: '#ffd700',
  bg: '#000005',
  text: '#ffffff',
  muted: 'rgba(255, 255, 255, 0.33)'
};

export const SCENE_COLORS = [
  { primary: PALETTE.primary, secondary: PALETTE.secondary },
  { primary: PALETTE.secondary, secondary: PALETTE.accent },
  { primary: PALETTE.accent, secondary: PALETTE.primary },
  { primary: PALETTE.primary, secondary: PALETTE.gold },
  { primary: PALETTE.gold, secondary: PALETTE.primary }
];
