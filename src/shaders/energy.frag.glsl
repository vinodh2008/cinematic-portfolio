uniform float uTime;
uniform vec3 uColor;
uniform float uIntensity;
varying vec2 vUv;

void main() {
    vec2 uv = vUv - 0.5;
    float r = length(uv);
    
    // Ring shape
    float ring = smoothstep(0.48, 0.45, r) - smoothstep(0.35, 0.32, r);
    
    // Inner glow
    float glow = exp(-r * 8.0) * 0.5;
    
    // Pulse
    float pulse = sin(uTime * 2.0 + r * 20.0) * 0.5 + 0.5;
    
    gl_FragColor = vec4(uColor, (ring + glow * pulse) * uIntensity);
}
