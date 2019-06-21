import debug from 'debug'
const { name } = require('../../package.json')

const _loggers = {
    info: debug(name + ':info'),
    debug: debug(name + ':debug'),
    error: debug(name + ':error'),
    enable(level: string){ return debug.enable(name + ':' + level) }
}

export const logger = {
    init(name: string) {
        _loggers.info = debug(name + ':info')
        _loggers.debug = debug(name + ':debug')
        _loggers.error = debug(name + ':error')
        _loggers.enable = level => debug.enable(name + ':' + level)
    },
    /**
     * Log. (info level)
     */
    info: (formatter, ...args: any[]) => _loggers.info(formatter, ...args),
    /**
     * Log. (debug level)
     */
    debug: (formatter, ...args: any[]) => _loggers.debug(formatter, ...args),
    /**
     * Log. (error level)
     */
    error: (formatter, ...args: any[]) => _loggers.error(formatter, ...args),
    /**
     * Enable logger level.
     */
    enable: (level: string) => _loggers.enable(level)
}