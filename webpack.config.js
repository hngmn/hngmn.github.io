const path = require('path')

const MODULES = [
  'boombox',
  'gallery',
  'stepsequencer'
]

/**
 * Given a module name, return a compile target for Bundle.
 * Entry point will be at /src/${bundle name}/entry.js and /docs/js/${bundle name}
 */
module.exports = MODULES.map((moduleName) => {
  return {
    mode: 'production',
    entry: `./src/${moduleName}/entry.js`,
    output: {
      // put generated javascripts here to be picked up by jekyll
      path: path.resolve(__dirname, `docs/js/${moduleName}`),
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
        },
        { test: /\.tsx?$/, loader: 'ts-loader' },
        {
          test: /\.(css)$/,
          use: ['style-loader', 'css-loader'],
        }
      ]
    },
    resolve: {
      extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    },
    watch: true,
    watchOptions: {
      ignored: /node_modules/,
    },
  }
});

