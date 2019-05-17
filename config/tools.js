const path = require('path')

const rootPath = path.join(__dirname, '..')

module.exports = {
    getModulePath(moduleName) {
        const innerPath = require.resolve(moduleName, {
            paths: [ rootPath ]
        })
        return innerPath || moduleName
    }
}