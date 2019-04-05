/* eslint-disable no-console */

import path from 'path'
import webpack from 'webpack'
import chalk from 'chalk'

const defaultEntry = path.join(process.cwd(), 'src', 'index')
const defaultOutput = path.join(process.cwd(), 'dist')

export async function build ({ entry = defaultEntry, output = defaultOutput }) {
    console.log(chalk.bold('> Building…\n'))
    const webpackConfig = require('../../config/webpack.config.js')({
        entry,
        output
    })
    return new Promise((resolve, reject) => {
        webpack(webpackConfig, (err, stats) => {
            if (err) {
                console.error(chalk.red(err.stack || err))
                if (err.details) {
                  console.error(chalk.red(err.details))
                }
                return reject(err)
            }

            const info = stats.toJson()

            if (stats.hasErrors()) {
                info.errors.forEach(error => console.error(chalk.red(error)))
                return reject()
            }

            if (stats.hasWarnings()) {
                info.warnings.forEach(warning => console.error(chalk.yellow(warning)))
            }

            console.log(stats.toString({
                chunks: false,
                colors: true
            }) + '\n')

            const externalModules = info
                .chunks
                .reduce((modules, chunk) => [ ...modules, ...chunk.modules], [])
                .filter(module => module.name.startsWith('external'))
                .sort((a,b) => a.name.localeCompare(b.name))

            if(externalModules.length > 0) {
                console.log(chalk.bold.yellow('We found the following node.js core modules that seem to be required in the action code.\n'))
                externalModules.forEach(module => {
                    const name = module.name.substring(10, module.name.length - 1)
                    console.log(chalk.bold('- ' + name))
                    module.issuerPath.forEach(issuer => {
                        console.log('\t' + issuer.name)
                    })
                })
                console.log(
                    '\n' +
                    chalk.bold.yellow('Do not forget to add these in your package.json file under the "sandbox" key.\n')
                )
                console.log(JSON.stringify(
                    externalModules.map(module =>
                        module.name.substring(10, module.name.length - 1)
                    ), null, 2)
                )
            }

            resolve()
        })
    })
    .then(() => console.log(chalk.bold.green('\n> Build succeeded!')))
    .catch(error => error && error.message && console.error(chalk.bold.red('\n> Build failed…\n\n', error)))
}