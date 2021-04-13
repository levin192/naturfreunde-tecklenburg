
module.exports = function (config) {
  config.addPassthroughCopy('src/images')
  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  }
}

