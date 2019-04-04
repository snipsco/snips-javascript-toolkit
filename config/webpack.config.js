const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

const nodeModulesPath = path.join(__dirname, '..', 'node_modules')

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
                loader: path.join(nodeModulesPath, 'babel-loader'),
                options: {
                    presets: [
                        [
                            path.join(nodeModulesPath, '@babel/preset-env'),
                            {
                                targets: {
                                    node: '8'
                                },
                                modules: false
                            }
                        ],
                        path.join(nodeModulesPath, '@babel/preset-typescript')
                    ],
                    plugins: [
                        path.join(nodeModulesPath, '@babel/plugin-proposal-class-properties'),
                        path.join(nodeModulesPath, '@babel/plugin-proposal-object-rest-spread')
                    ]
                }
            }
        }],
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
})