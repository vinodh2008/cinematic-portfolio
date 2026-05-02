varying vec2 vUv;
uniform float uTime;
uniform float uOpen;

void main() {
    vec2 uv = vUv - 0.5;
    float r = length(uv);
    float a = atan(uv.y, uv.x);
    
    // Swirling energy
    float swirl = sin(a * 8.0 + uTime * 4.0 - r * 20.0) * 0.5 + 0.5;
    
    // Expanding ring
    float ring = smoothstep(uOpen + 0.05, uOpen - 0.05, r)
               * (1.0 - smoothstep(uOpen - 0.15, uOpen - 0.25, r));
    
    // Glowing core
    float core = exp(-r * r * 30.0 / max(uOpen, 0.01)) * 0.8;
    
    // Color mix
    vec3 c1 = vec3(0.0, 0.95, 1.0);   // cyan
    vec3 c2 = vec3(0.48, 0.18, 1.0);  // purple
    vec3 c3 = vec3(1.0, 0.18, 0.47);  // pink
    vec3 col = mix(c1, c2, swirl);
    col = mix(col, c3, sin(a * 0.5 + uTime) * 0.5 + 0.5);
    
    float alpha = (ring + core) * uOpen;
    gl_FragColor = vec4(col * 1.5, alpha);
}
