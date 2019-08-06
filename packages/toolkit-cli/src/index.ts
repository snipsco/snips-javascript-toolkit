import program from 'commander'
import * as actions from './actions'

program
    .command('dev')
    .description('Automatically rebuilds and run the action on file change.')
    .option('-e, --entry <file>', 'A filename which act as the entry point to build your project.')
    .option('-o, --output <path>', 'A path for the bundled file to be saved in.')
    .option('-c, --config-path <path>', 'Path to the configuration file.')
    .option('-ns, --no-sandbox', 'Disables the sandbox.')
    .action(actions.dev)
program
    .command('build')
    .description('Builds your Snips action.')
    .option('-e, --entry <file>', 'A filename which act as the entry point to build your project.')
    .option('-o, --output <path>', 'A path for the bundled file to be saved in.')
    .action(actions.build)
program
    .command('test [files]')
    .description('Runs your test suite.')
    .allowUnknownOption()
    .option('-t, --target <path>', 'The path to the directory containing the built action.')
    .option('-s, --sandbox', 'Run tests in sandboxed mode.')
    .action(actions.test)
program
    .command('run')
    .description('Runs your Snips action.')
    .option('-t, --target <path>', 'The path to the directory containing the built action.')
    .option('-c, --config-path <path>', 'Path to the configuration file.')
    .option('-ns, --no-sandbox', 'Disables the sandbox.')
    .action(actions.run)

program.parse(process.argv)
