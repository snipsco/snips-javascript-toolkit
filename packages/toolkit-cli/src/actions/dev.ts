/* eslint-disable no-console */

import path from 'path'
import webpack from 'webpack'
import chalk from 'chalk'

const defaultEntry = path.join(process.cwd(), 'src', 'index')
const defaultOutput = path.join(process.cwd(), 'dist')

export function dev ({ entry = defaultEntry, output = defaultOutput }) {
    console.log(chalk.bold('> Running in dev mode…\n'))

    const webpackConfig = require('../../config/webpack.dev.js')({
        entry,
        output
    })

    return webpack(webpackConfig, (_, stats) => {
        console.log(stats.toString({
            chunks: false,
            colors: true
        }) + '\n')
    })
}
