var createBuffer = require('gl-buffer')
var createShell  = require('gl-now')
var createFBO    = require('gl-fbo')
var createVAO    = require('gl-vao')

var ndarray = require('ndarray')
var fill    = require('ndarray-fill')

var particleVertices
var screenVertices
var nextState
var prevState
var shaders

var t = 0
var shell = createShell({
  clearColor: [0,0,0,1]
})

shell.on('gl-render', render)
shell.on('gl-init', init)

function init() {
  var gl = shell.gl

  shaders = require('./shaders')(gl)

  nextState = createFBO(gl, 512, 512, { 'float': true })
  prevState = createFBO(gl, 512, 512, { 'float': true })

  var initialState = ndarray(new Float32Array(512 * 512 * 4), [512, 512, 4])
  fill(initialState, function(x, y, ch) {
    if (ch > 2) return 1
    return (Math.random() - 0.5) * 800.6125
  })

  nextState.color.setPixels(initialState)
  prevState.color.setPixels(initialState)

  screenVertices = createVAO(gl, null, [{
      type: gl.FLOAT
    , size: 2
    , buffer: createBuffer(gl, new Float32Array([
      -1, -1,  +1, -1,  -1, +1,
      -1, +1,  +1, -1,  +1, +1,
    ]))
  }])

  var index = new Float32Array(512 * 512 * 2)
  var i = 0
  for (var x = 0; x < 512; x++)
  for (var y = 0; y < 512; y++) {
    index[i++] = x / 512
    index[i++] = y / 512
  }

  particleVertices = createVAO(gl, null, [{
      type: gl.FLOAT
    , size: 2
    , buffer: createBuffer(gl, index)
  }])
}

var cleared = false

function render() {
  var gl = shell.gl

  // Switch to clean FBO for GPGPU
  // particle motion
  nextState.bind()
  gl.disable(gl.DEPTH_TEST)
  gl.viewport(0, 0, 512, 512)

  var shader = shaders.logic
  shader.bind()
  shader.uniforms.uState = prevState.color.bind(0)
  shader.uniforms.uTime = t++
  screenVertices.bind()
  gl.drawArrays(gl.TRIANGLES, 0, 6)

  // Reset, draw to screen
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.disable(gl.DEPTH_TEST)
  gl.viewport(0, 0, shell.width, shell.height)

  var shader = shaders.render
  shader.bind()
  shader.uniforms.uState = nextState.color.bind(0)
  shader.uniforms.uScreen = [shell.width, shell.height]

  particleVertices.bind()

  // Additive blending!
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.ONE, gl.ONE)
  gl.drawArrays(gl.POINTS, 0, 512 * 512)
  gl.disable(gl.BLEND)

  // Switch
  var tmp = prevState
  prevState = nextState
  nextState = tmp
}
