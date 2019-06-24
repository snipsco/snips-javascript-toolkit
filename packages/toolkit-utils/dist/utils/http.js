"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wretch_1 = __importDefault(require("wretch"));
const node_fetch_1 = __importDefault(require("node-fetch"));
// Re-export types
__export(require("wretch"));
/**
 * Get an http client instance. (see [wretch](https://github.com/elbywan/wretch) for the API documentation)
 * @param url Base url.
 * @param options Fetch options.
 */
function http(url, options) {
    return wretch_1.default(url, options)
        .polyfills({
        fetch: global['__DEV__'] ? global['SnipsToolkit'].fetch : node_fetch_1.default
    });
}
exports.http = http;
//# sourceMappingURL=http.js.map