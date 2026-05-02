varying vec3 vColor;
varying float vAlpha;

void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    if(d > 0.5) discard;
    
    float alpha = (1.0 - smoothstep(0.2, 0.5, d)) * vAlpha;
    float glow = exp(-d * 8.0) * 0.8;
    vec3 col = vColor + glow * vColor * 2.0;
    
    gl_FragColor = vec4(col, alpha);
}
