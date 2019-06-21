/* eslint no-console: off */
import path from 'path'
import chalk from 'chalk'
import { sandboxedRunner } from 'snips-toolkit-runner'

export function run({ target }) {
    console.log(chalk.bold('> Running your action…'))
    if(target)
        console.log('Target directory is', target)
    console.log()
    sandboxedRunner({
        runnerOptions: {
            target: target ? path.resolve(target) : undefined
        }
    })
}