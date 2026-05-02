uniform float uTime;
uniform vec2 uMouse[20];
uniform float uAspect;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 st = uv;
    st.x *= uAspect;
    
    vec4 baseColor = texture2D(inputBuffer, uv);
    
    float fluidIntensity = 0.0;
    
    // Calculate influence from recent mouse positions
    for(int i = 0; i < 20; i++) {
        vec2 m = uMouse[i];
        m.x *= uAspect;
        
        // Distance to point
        float dist = length(st - m);
        
        // Age of point (i=0 is oldest, i=19 is newest)
        float age = float(i) / 19.0;
        
        // Smooth falloff
        float influence = smoothstep(0.15 * age, 0.0, dist) * age;
        fluidIntensity += influence;
    }
    
    fluidIntensity = clamp(fluidIntensity, 0.0, 1.0);
    
    // Add glowing trail and subtle RGB shift displacement
    vec2 displacement = normalize(st - vec2(0.5)) * fluidIntensity * 0.02;
    
    float r = texture2D(inputBuffer, uv + displacement).r;
    float g = texture2D(inputBuffer, uv).g;
    float b = texture2D(inputBuffer, uv - displacement).b;
    
    vec3 fluidColor = vec3(r, g, b);
    
    // Add primary color glow to the trail
    vec3 glowColor = vec3(0.0, 0.96, 1.0); // #00f5ff (primary)
    fluidColor += glowColor * fluidIntensity * 0.3;
    
    outputColor = vec4(fluidColor, baseColor.a);
}
