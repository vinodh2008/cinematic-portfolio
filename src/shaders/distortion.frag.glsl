uniform float uTime;
uniform float uIntensity;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Chromatic aberration
    float aberr = uIntensity * 0.01;
    float r = texture2D(inputBuffer, uv + vec2(aberr, 0.0)).r;
    float g = texture2D(inputBuffer, uv).g;
    float b = texture2D(inputBuffer, uv - vec2(aberr, 0.0)).b;
    
    // Scan line glitch
    float scanLine = floor(uv.y * 200.0);
    float glitchChance = random(vec2(scanLine, floor(uTime * 20.0)));
    if(glitchChance > 0.97) {
        float shift = (random(vec2(scanLine, uTime)) - 0.5) * 0.1 * uIntensity;
        r = texture2D(inputBuffer, uv + vec2(shift + aberr, 0.0)).r;
        b = texture2D(inputBuffer, uv + vec2(shift - aberr, 0.0)).b;
    }
    
    outputColor = vec4(r, g, b, 1.0);
}
