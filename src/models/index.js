const req = require.context('.', true, /\.\/[^/]+\/index\.js$/)

req.keys().forEach((key) => {
  const componentName = key.replace(/^.+\/([^/]+)\/index\.js/, '$1')
  const file = req(key).default
  module.exports[componentName] = file
  window[componentName] = file
})
