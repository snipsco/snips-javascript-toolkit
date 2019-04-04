const fs = require('fs')
const path = require('path')

const nodeModulesPath = path.join(__dirname, '..', 'node_modules')

module.exports = {
    getModulePath(moduleName) {
        const innerPath = path.join(nodeModulesPath, moduleName)
        if(fs.existsSync(innerPath))
            return innerPath
        return moduleName
    }
}