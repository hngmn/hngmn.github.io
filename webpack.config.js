const path = require('path')

module.exports = {
  mode: "development",
  entry: "./webpack/entry.js",
  output: {
    // put generated javascripts here to be picked up by jekyll
    path: path.resolve(__dirname, 'src/assets/javascripts'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
}
