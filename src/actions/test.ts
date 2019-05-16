import path from 'path'
import jest from 'jest'

const configLocation = path.join(__dirname, '../../jest.config.js')

export function test (files, { target, sandbox }) {
    global['runnerTarget'] = target
    global['sandboxedRunner'] = !!sandbox

    jest.run([
        `--config=${configLocation}`
    ], files)
}