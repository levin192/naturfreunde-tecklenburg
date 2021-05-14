const HtmlMin = require('html-minifier');
const ErrorOverlay = require('eleventy-plugin-error-overlay');
const markdownIt = require("markdown-it");

module.exports = eleventyConfig => {
  eleventyConfig.addPassthroughCopy('src/images')
  //eleventyConfig.addPassthroughCopy('src/fonts')
  eleventyConfig.addPassthroughCopy('src/pdf')
  eleventyConfig.addPassthroughCopy('src/favicon')
  eleventyConfig.addPlugin(ErrorOverlay);

  const md = new markdownIt({
    html: true
  });


  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return md.render(content);
  });

  eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
    if (outputPath.endsWith('.html')) {
      return HtmlMin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
    }
    return content;
  });

  return {
    dir: {
      input: 'src',
      output: 'dist',
      data: '_data',
    },
    jsDataFileSuffix: '.data',
  }
}

