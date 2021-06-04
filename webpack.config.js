const path = require('path')

module.exports = [
  {
    mode: 'development',
    entry: './src/gallery/gallery.jsx',
    output: {
      // put generated javascripts here to be picked up by jekyll
      path: path.resolve(__dirname, 'site/js/gallery'),
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
    mode: 'development',
    entry: './src/another/another.jsx',
    output: {
      // put generated javascripts here to be picked up by jekyll
      path: path.resolve(__dirname, 'site/js/another'),
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
