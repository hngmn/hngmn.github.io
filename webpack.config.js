const path = require('path')

module.exports = [
  {
    mode: "development",
    entry: "./webpack/gallery/gallery.jsx",
    output: {
      // put generated javascripts here to be picked up by jekyll
      path: path.resolve(__dirname, 'src/assets/javascripts/gallery'),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react']
            }
          }
        }
      ]
    }
  },

  {
    mode: "development",
    entry: "./webpack/another/another.jsx",
    output: {
      // put generated javascripts here to be picked up by jekyll
      path: path.resolve(__dirname, 'src/assets/javascripts/another'),
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react']
            }
          }
        }
      ]
    }
  }
];
