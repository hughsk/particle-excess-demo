#ifdef GL_ES
precision mediump float;
#endif

#pragma glslify: simplex = require(../node_modules/glsl-noise/simplex/3d)

uniform sampler2D uState;
uniform float uTime;

const vec3 OFFSET = vec3(2399.24849823098, 3299.9028381, 389.09338327);
const float SPEED = 2.0;

void main() {
  vec3 sampled = texture2D(uState, gl_FragCoord.xy / vec2(512.0)).rgb;
  vec2 nextPosition = sampled.xy;

  float t = uTime * 0.013849829389;

  nextPosition += vec2(
      simplex(vec3(nextPosition * 0.005, 9280.03992092039 + t + gl_FragCoord.x / 110.0) + OFFSET)
    , simplex(vec3(nextPosition * 0.005, 3870.73392092039 - t - gl_FragCoord.y / 110.0) + OFFSET)
  ) * SPEED;

  float radius = length(nextPosition);
  float rad = 0.00002 * radius;
  nextPosition = vec2(
      nextPosition.x * cos(rad) - nextPosition.y * sin(rad)
    , nextPosition.y * cos(rad) + nextPosition.x * sin(rad)
  );

  nextPosition *= 0.9999;

  gl_FragColor = vec4(vec3(nextPosition, 1.0), 1.0);
}
