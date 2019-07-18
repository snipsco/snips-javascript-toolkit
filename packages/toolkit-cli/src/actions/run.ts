/* eslint no-console: off */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { sandboxedRunner } from 'snips-toolkit-runner'

export function run({ target, configPath }) {
    console.log(chalk.bold('> Running your action…'))
    if(target)
        console.log('Target directory is', target)
    let config = {}
    if(configPath) {
        try {
            config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
            console.log('> Configuration file loaded from: ' + configPath)
        } catch (error) {
            console.error('!> Invalid configuration file format. Expected an utf-8 encoded JSON file.\n' + error.toString())
        }
    }
    console.log()
    sandboxedRunner({
        runnerOptions: {
            target: target ? path.resolve(target) : undefined
        },
        hermesOptions: {
            ...config
        }
    })
}