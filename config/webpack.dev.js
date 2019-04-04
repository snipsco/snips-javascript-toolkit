const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const NodemonPlugin = require('nodemon-webpack-plugin')
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
    // Development mode would be nice to have, but there are issues
    // between sandboxing and treeshaking that does not remove
    // unnecessary node.js requires.
    mode: 'production',
    devtool: 'source-map',
    watch: true,
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
                                }
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
        new CleanWebpackPlugin(),
        new NodemonPlugin({
            script: path.join(__dirname, '..', 'dist', 'runner', 'run'),
            args: [ path.resolve(output) ]
        })
    ]
})
