const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');





module.exports = {
  entry: {
    bundle: './src/js/index.js',
    tilt: './src/js/tilt.js',
    news: './src/js/news.js',
    newsDetail: './src/js/news-detail.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ],
  mode: 'production',
  devServer: {
    writeToDisk: true,
  },
  module: {
    rules: [
      {
        test: /\.(sass|css|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: 'css',
            }
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true
            }
          },
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  //watch: true
};