const { sandboxedRunner } = require('snips-toolkit-runner')

sandboxedRunner({
    runnerOptions: {
        target: process.argv.length > 2 ? process.argv[2] : undefined
    }
})
