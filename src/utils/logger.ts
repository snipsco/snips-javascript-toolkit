import debug from 'debug'
const { name } = require('../../package.json')
const infoLogger = debug(name + ':info')
const debugLogger = debug(name + ':debug')
const errorLogger = debug(name + ':error')

export const logger = {
    /**
     * Log. (info level)
     */
    info: (formatter, ...args: any[]) => infoLogger(formatter, ...args),
    /**
     * Log. (debug level)
     */
    debug: (formatter, ...args: any[]) => debugLogger(formatter, ...args),
    /**
     * Log. (error level)
     */
    error: (formatter, ...args: any[]) => errorLogger(formatter, ...args),
    /**
     * Enable logger level.
     */
    enable: (level: string) => debug.enable(name + ':' + level)
}