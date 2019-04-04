import path from 'path'
import jest from 'jest'

const configLocation = path.join(__dirname, '../../jest.config.js')

export function test (files, { target }) {
    global['runnerTarget'] = target

    jest.run([
        `--config=${configLocation}`
    ], files)
}