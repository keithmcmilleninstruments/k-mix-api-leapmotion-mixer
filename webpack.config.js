// In webpack.config.js
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/app/index.html',
  filename: 'index.html',
  inject: true
});
var ExtractTextPluginConfig = new ExtractTextPlugin('styles.css', {
  allChunks: false
})
module.exports = {
  entry: [
    './app/app.js'
  ],
  output: {
    path: __dirname + '/dist',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        include: __dirname + '/app/styles',
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
      },
      { 
        test: /\.js$/, include: __dirname + '/app', loader: "babel-loader"
      },
      { test: /\.svg$/, 
        include: __dirname + '/app/svg',
        loader: 'inline?parentId=app' 
      }
    ]
  },
  resolve: {
    moduleDirectories: ['node_modules']
  },
  plugins: [ExtractTextPluginConfig, HTMLWebpackPluginConfig]
};
