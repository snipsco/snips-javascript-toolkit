/* eslint-disable no-console */

const fs = require('fs')
const { sandboxedRunner } = require('snips-toolkit-runner')

const configPath = process.argv.length > 3 && process.argv[3]

let config = {}
if(configPath) {
    try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        console.log('> Configuration file loaded from: ' + configPath)
    } catch (error) {
        console.error('!> Invalid configuration file format. Expected an utf-8 encoded JSON file.\n' + error.toString())
    }
}

sandboxedRunner({
    runnerOptions: {
        target: process.argv.length > 2 ? process.argv[2] : undefined
    },
    hermesOptions: {
        ...config
    }
})
