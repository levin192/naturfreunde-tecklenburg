const path = require('path');

module.exports = function (config) {
  config.addPassthroughCopy('src/images')
  config.addFilter('relativeUrl', (url, page) => {
    if (!url.startsWith('/')) {
      throw new Error('URL is already relative')
    }
    const relativeUrl = path.relative(page.filePathStem, url)
    return path.relative('..', relativeUrl)
  })
  return {
    dir: {
      input: 'src',
      output: 'dist'
    }
  }
}

