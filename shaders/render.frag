#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D uTexture;
varying vec2 vIndex;

void main() {
  gl_FragColor = vec4(
      sin(vIndex.x * 10.0)
    , 0.5
    , 1.0 - vIndex.y
    , 1.0
  ) * 0.165;
}
