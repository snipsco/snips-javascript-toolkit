/* eslint-disable no-console */

const fs = require('fs')
const { sandboxedRunner, standardRunner } = require('snips-toolkit-runner')

const target = process.argv[2]
const configPath = process.argv[3] === '-noconf' ? null : process.argv[3]
const sandbox = process.argv[4] === '-sandbox'

let config = {}
if(configPath) {
    try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        console.log('> Configuration file loaded from: ' + configPath)
    } catch (error) {
        console.error('!> Invalid configuration file format. Expected an utf-8 encoded JSON file.\n' + error.toString())
    }
}

(sandbox ? sandboxedRunner : standardRunner)({
    runnerOptions: {
        target
    },
    hermesOptions: {
        ...config
    }
})
