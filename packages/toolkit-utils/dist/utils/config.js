"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ini_1 = __importDefault(require("ini"));
const camelize_1 = require("../utils/camelize");
const logger_1 = require("../utils/logger");
const defaults_1 = require("../defaults");
let _config = {};
/**
 * Configuration utilities.
 */
exports.config = {
    /**
     * Get the configuration.
     */
    get() {
        return _config;
    },
    /**
     * Reads the configuration file located at `./config.ini`.
     */
    init() {
        try {
            // Get the config file.
            const configFilePath = path_1.default.join(process.cwd(), 'config.ini');
            const iniConfig = ini_1.default.parse(fs_1.default.readFileSync(configFilePath, 'utf8'));
            // Assume that the file keys are in snake case, and camelize them.
            for (let section in iniConfig) {
                _config = Object.assign({}, _config, camelize_1.camelize.camelizeKeys(iniConfig[section]));
            }
            // When in dev mode, add mocks.
            if (global['__DEV__']) {
                const initialConfig = Object.assign({}, _config);
                const mockedConfig = Object.assign({}, global['SnipsToolkit'].config);
                _config = global['SnipsToolkit'].config;
                Object.assign(_config, initialConfig, mockedConfig);
            }
            // If no locale is specified, add default locale.
            if (!_config.locale) {
                _config.locale = defaults_1.DEFAULT_LOCALE;
            }
        }
        catch (error) {
            logger_1.logger.error(error);
            throw new Error('config');
        }
        return _config;
    }
};
//# sourceMappingURL=config.js.map