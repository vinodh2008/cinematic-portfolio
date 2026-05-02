export const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const mapRange = (value, low1, high1, low2, high2) => {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
};
