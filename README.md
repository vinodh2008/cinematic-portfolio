# Cinematic WebGL Portfolio

A premium, immersive WebGL portfolio inspired by `activetheory.net`.

## Tech Stack
- **Frontend**: React 18.2 + Vite 5
- **3D Engine**: Three.js r160
- **Animation**: GSAP 3.12.4
- **Post-processing**: @react-three/postprocessing
- **Shaders**: Custom GLSL (vite-plugin-glsl)

## Features
- **5 Scroll-driven Scenes**: Awakening -> Discovery -> Chaos -> Transformation -> Finale.
- **12k GPU Particles**: Noise-driven drift and sphere assembly.
- **Cinematic Loader**: Concentric rings with progress animation.
- **HUD Overlays**: Corner brackets and scene indicators.
- **Post-processing**: Bloom and custom distortion effects.
- **Responsive**: Adaptive particle counts and layout.

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Standalone Demo
Open `demo.html` in any modern browser for a self-contained, zero-setup preview of the experience.

## Controls
- **Scroll**: Transition between scenes.
- **Mouse**: Parallax camera movement.
- **Space**: Skip loading screen.
