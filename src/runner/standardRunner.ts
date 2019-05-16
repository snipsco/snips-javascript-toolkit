
import path from 'path'
// Important: load only types here!
// Otherwise it will mess up with the jest and the ref module that cannot be loaded twice.
import { Hermes, Done } from 'hermes-javascript'
import { Runner } from './types'

export const standardRunner: Runner = async function ({
    hermesOptions = {},
    runnerOptions = {}
} = {}) {
    let {
        target = path.join(process.cwd(), 'dist'),
        cwd = process.cwd()
    } = runnerOptions

    const { name } = require(path.join(cwd, 'package.json'))

    target = path.join(target, 'index')

    return new Promise((resolve, reject) => {
        // Important: Asynchronously load hermes-javascript to prevent ref/jest issues.
        require('hermes-javascript').withHermes((hermes: Hermes, done: Done) => {
            try {
                if(cwd)
                    process.cwd = () => cwd

                require('debug').enable(name + ':error')

                const index = require(target);

                (index.default || index)({
                    hermes,
                    done
                })
                resolve(done)
            } catch (error) {
                // eslint-disable-next-line
                console.error('Failed to execute script.', error.message)
                // eslint-disable-next-line
                console.error(error.stack)
                done()
                reject(error)
            }
        }, hermesOptions)
    })
}