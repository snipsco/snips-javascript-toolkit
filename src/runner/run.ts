import { sandboxedRunner } from './index'

sandboxedRunner({
    runnerOptions: {
        target: process.argv.length > 2 ? process.argv[2] : undefined
    }
})
