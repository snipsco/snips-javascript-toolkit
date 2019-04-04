const path = require('path')

module.exports = {
    roots: [process.cwd(), __dirname],
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: [
        path.join(__dirname, 'dist', 'tests', 'setup', 'mocks')
    ],
    setupFilesAfterEnv: [
        path.join(__dirname, 'dist', 'tests', 'setup', 'hooks')
    ],
    testPathIgnorePatterns: ['/node_modules/', '/src/', '/dist/', '/esm/'],
    globals: {
        __DEV__: true,
        runnerTarget: global['runnerTarget'] ? path.resolve(global['runnerTarget']) : undefined
    }
}
