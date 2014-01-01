#ifdef GL_ES
precision mediump float;
#endif

attribute vec2 aIndex;

uniform vec2 uScreen;
uniform sampler2D uState;

varying vec2 vIndex;

void main() {
  vIndex = aIndex;
  gl_PointSize = 1.0;
  gl_Position = vec4(texture2D(uState, aIndex).xy / uScreen, 1.0, 1.0);
}
