const path = require('path')

module.exports = [
  {
    mode: 'production',
    entry: './src/gallery/gallery.jsx',
    output: {
      // put generated javascripts here to be picked up by jekyll
      path: path.resolve(__dirname, 'docs/js/gallery'),
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
    mode: 'production',
    entry: './src/another/another.jsx',
    output: {
      // put generated javascripts here to be picked up by jekyll
      path: path.resolve(__dirname, 'docs/js/another'),
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
    mode: 'production',
    entry: './src/boombox/boombox.js',
    output: {
      // put generated javascripts here to be picked up by jekyll
      path: path.resolve(__dirname, 'docs/js/boombox'),
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
