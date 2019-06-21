import path from 'path'
import { NodeVM, VMScript} from 'vm2'
// Important: load only types here!
// Otherwise it will mess up with the jest and the ref module that cannot be loaded twice.
import { Hermes, Done } from 'hermes-javascript'
import { Runner } from './types'

const bootstrap = new VMScript(`
    const _cwd = global.cwd
    delete global.cwd
    const _stdout = global.stdout
    delete global.stdout
    const _stderr = global.stderr
    delete global.stderr
    const _target = global.target
    delete global.target
    const _hermes = global.hermes
    delete global.hermes
    const _done = global.done
    delete global.done

    if(_stdout)
        process.stdout = _stdout
    if(_stderr)
        process.stderr = _stderr
    if(_cwd)
        process.cwd = () => _cwd

    global.__main__ = function main() {
        const index = require(_target);
        (index.default || index)({
            hermes: _hermes[0],
            done: _done[0]
        })
    }
`)
const script = new VMScript(`
    global.__main__()
`)

const reusableVMMap = new Map()

export const sandboxedRunner: Runner = function ({
    hermesOptions = {},
    runnerOptions = {}
} = {}) {
    let {
        target = path.join(process.cwd(), 'dist', 'index'),
        cwd = process.cwd(),
        id = 'index',
        reusable = true
    } = runnerOptions

    return new Promise((resolve, reject) => {
        // Important: Asynchronously load hermes-javascript to prevent ref/jest issues.
        require('hermes-javascript').withHermes((hermes: Hermes, done: Done) => {
            try {
                let vm
                if(reusable && reusableVMMap.has(target)) {
                    const vmData = reusableVMMap.get(target)
                    vm = vmData.vm
                    vmData.hermes[0] = hermes
                    vmData.done[0] = done
                } else {
                    let { sandbox } = require(path.join(cwd, 'package.json'))
                    const builtin: string[] = sandbox || []
                    sandbox = {
                        hermes: [ hermes ],
                        done: [ done ],
                        stdout: process.stdout,
                        stderr: process.stderr,
                        cwd,
                        target,
                        URLSearchParams
                    }
                    // Additional globals in test mode
                    if(global['__DEV__']) {
                        [
                            '__DEV__',
                            'SnipsToolkit'
                        ].forEach(prop => {
                            sandbox[prop] = global[prop]
                        })
                        Object.entries(global['SnipsToolkit']['globals'])
                            .forEach(([ key, value ]) => {
                                sandbox[key]= value
                            })
                    }
                    vm = new NodeVM({
                        sandbox,
                        wrapper: 'none',
                        require: {
                            external: true,
                            builtin,
                            root: cwd,
                            context: 'sandbox'
                        }
                    })
                    vm.run(bootstrap, id + '.js')
                    reusableVMMap.set(target, {
                        vm,
                        hermes: sandbox.hermes,
                        done: sandbox.done
                    })
                }
                vm.run(script, id + '.js')
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
