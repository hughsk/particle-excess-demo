#ifdef GL_ES
precision mediump float;
#endif

attribute vec2 aPosition;

void main() {
  gl_Position = vec4(aPosition.xy, 1.0, 1.0);
}
