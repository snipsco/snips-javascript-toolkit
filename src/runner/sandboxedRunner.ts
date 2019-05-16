import path from 'path'
import { NodeVM } from 'vm2'
// Important: load only types here!
// Otherwise it will mess up with the jest and the ref module that cannot be loaded twice.
import { Hermes, Done } from 'hermes-javascript'
import { Runner } from './types'

export const sandboxedRunner: Runner = async function ({
    hermesOptions = {},
    runnerOptions = {}
} = {}) {
    let {
        target = path.join(process.cwd(), 'dist'),
        cwd = process.cwd()
    } = runnerOptions

    const { name, sandbox } = require(path.join(cwd, 'package.json'))
    const builtin: string[] = sandbox || []

    target = path.join(target, 'index')

    return new Promise((resolve, reject) => {
        // Important: Asynchronously load hermes-javascript to prevent ref/jest issues.
        require('hermes-javascript').withHermes((hermes: Hermes, done: Done) => {
            const vm = new NodeVM({
                sandbox: {
                    hermes,
                    done,
                    moduleName: name,
                    stdout: process.stdout,
                    stderr: process.stderr,
                    cwd,
                    URLSearchParams,
                    // Additional globals for test mode
                    __DEV__: global['__DEV__'],
                    Date: global['__DEV__'] ? Date : null,
                    SnipsToolkit: global['__DEV__'] ? global['SnipsToolkit'] : null
                },
                wrapper: 'none',
                require: {
                    external: true,
                    builtin,
                    root: cwd,
                    context: 'sandbox'
                }
            })

            try {
                vm.run(`
                    if(global.stdout) process.stdout = stdout
                    if(global.stderr) process.stderr = stderr
                    const _cwd = global.cwd
                    if(global.cwd) process.cwd = function() { return _cwd }

                    delete global.stdout
                    delete global.stderr
                    delete global.cwd

                    if(global.moduleName)
                        require('debug').enable(global.moduleName + ':error')

                    const index = require('${target}');

                    (index.default || index)({
                        hermes,
                        done
                    })
                `, 'index.js')
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
