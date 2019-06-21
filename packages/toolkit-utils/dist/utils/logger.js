"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const { name } = require('../../package.json');
const _loggers = {
    info: debug_1.default(name + ':info'),
    debug: debug_1.default(name + ':debug'),
    error: debug_1.default(name + ':error'),
    enable(level) { return debug_1.default.enable(name + ':' + level); }
};
exports.logger = {
    init(name) {
        _loggers.info = debug_1.default(name + ':info');
        _loggers.debug = debug_1.default(name + ':debug');
        _loggers.error = debug_1.default(name + ':error');
        _loggers.enable = level => debug_1.default.enable(name + ':' + level);
    },
    /**
     * Log. (info level)
     */
    info: (formatter, ...args) => _loggers.info(formatter, ...args),
    /**
     * Log. (debug level)
     */
    debug: (formatter, ...args) => _loggers.debug(formatter, ...args),
    /**
     * Log. (error level)
     */
    error: (formatter, ...args) => _loggers.error(formatter, ...args),
    /**
     * Enable logger level.
     */
    enable: (level) => _loggers.enable(level)
};
//# sourceMappingURL=logger.js.map