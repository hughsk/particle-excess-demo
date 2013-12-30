var createShader = require('gl-shader')

module.exports = init

function init(gl) {
  var shaders = {}

  shaders.logic = createShader(gl
    , require('./logic.vert')
    , require('./logic.frag')
  )

  shaders.render = createShader(gl
    , require('./render.vert')
    , require('./render.frag')
  )

  return shaders
}
