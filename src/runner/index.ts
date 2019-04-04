import path from 'path'
import { NodeVM } from 'vm2'
// Important: load only types here!
// Otherwise it will mess up with the jest and the ref module that cannot be loaded twice.
import { Hermes, Done } from 'hermes-javascript'

const { name, sandbox } = require(path.join(process.cwd(), 'package.json'))
const builtin: string[] = sandbox || []

export type RunnerOptions = {
    target?: string
}

export default async function ({
    hermesOptions = {},
    runnerOptions = {}
} = {}) : Promise<() => void> {
    let {
        target = path.join(process.cwd(), 'dist')
    } = (runnerOptions as RunnerOptions)

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
                    // Additional globals for test mode
                    __DEV__: global['__DEV__'],
                    SnipsToolkit: global['SnipsToolkit']
                },
                wrapper: 'none',
                require: {
                    external: true,
                    builtin,
                    root: process.cwd(),
                    context: 'sandbox'
                }
            })

            try {
                vm.run(`
                    if(global.stdout) process.stdout = stdout
                    if(global.stderr) process.stderr = stderr

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
