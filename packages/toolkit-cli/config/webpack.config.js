const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const { getModulePath } = require('./tools')

module.exports = ({ entry, output }) => ({
    entry,
    output: {
        path: path.resolve(output),
        filename: 'index.js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    target: 'node',
    mode: 'production',
    devtool: 'source-map',
    node: {
        __dirname: false,
        __filename: true
    },
    module: {
        rules: [{
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            use: {
                loader: getModulePath('babel-loader'),
                options: {
                    presets: [
                        [
                            getModulePath('@babel/preset-env'),
                            {
                                targets: {
                                    node: '8'
                                },
                                modules: false
                            }
                        ],
                        getModulePath('@babel/preset-typescript')
                    ],
                    plugins: [
                        getModulePath('@babel/plugin-proposal-class-properties'),
                        getModulePath('@babel/plugin-proposal-object-rest-spread')
                    ]
                }
            }
        }],
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
})
