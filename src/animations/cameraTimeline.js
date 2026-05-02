import * as THREE from 'three';

export const getCameraPosition = (scrollT) => {
  let camX = 0, camY = 2, camZ = 30;
  let lookX = 0, lookY = 0, lookZ = 0;

  if (scrollT < 0.25) { // Scene 1
    camX = 0; camY = 2; camZ = 30 - (scrollT / 0.25) * 2;
  } else if (scrollT < 0.45) { // Scene 2
    const st = (scrollT - 0.25) / 0.2;
    camX = -3 * st; camY = 2 - st; camZ = 28 - 3 * st;
  } else if (scrollT < 0.65) { // Scene 3
    const st = (scrollT - 0.45) / 0.2;
    camX = -3 + 3 * st; camY = 1 - st; camZ = 25 + 3 * st;
  } else if (scrollT < 0.85) { // Scene 4
    const st = (scrollT - 0.65) / 0.2;
    camX = 0; camY = 0; camZ = 28 - 8 * st;
  } else { // Scene 5
    const st = (scrollT - 0.85) / 0.15;
    camX = 0; camY = 0; camZ = 20 - 5 * st;
  }

  return { 
    pos: new THREE.Vector3(camX, camY, camZ), 
    look: new THREE.Vector3(lookX, lookY, lookZ) 
  };
};
