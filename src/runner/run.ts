import runner from './index'

runner({
    runnerOptions: {
        target: process.argv.length > 2 ? process.argv[2] : undefined
    }
})
