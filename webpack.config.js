const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

const MODULES = [
    'boombox',
    'gallery',
    'stepsequencer',
    'chorder',
    'viz'
];

/**
 * Entry point per module under src/
 * Entry point is at /src/${moduleName}/entry.js and output to /docs/js/${bundle name}.bundle.js
 */
module.exports = {
    mode: 'production',
    entry: MODULES.reduce((acc, moduleName) => ({ ...acc, [moduleName]: `./src/${moduleName}/entry.js` }), {}),
    output: {
        // put generated javascripts here to be picked up by jekyll
        path: path.resolve(__dirname, `docs/js/`),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            },
            {
                test: /\.(css)$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    plugins: [new ESLintPlugin({})],
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx'],
    },
    watch: false,
    watchOptions: {
        ignored: /node_modules/,
    },
};

