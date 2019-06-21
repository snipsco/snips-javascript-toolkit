const path = require('path')

module.exports = {
    roots: [process.cwd(), __dirname],
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: [
        path.join(__dirname, 'dist', 'tests', 'mocks')
    ],
    setupFilesAfterEnv: [
        path.join(__dirname, 'dist', 'tests', 'hooks')
    ],
    testPathIgnorePatterns: ['/node_modules/', '/src/', '/dist/', '/esm/'],
    globals: {
        __DEV__: true,
        runnerTarget: global['runnerTarget'] ? path.resolve(global['runnerTarget']) : undefined,
        sandboxedRunner: global['sandboxedRunner'] ? true : undefined
    }
}
