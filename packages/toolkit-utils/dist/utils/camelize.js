"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const camelcase_1 = __importDefault(require("camelcase"));
exports.camelize = {
    /**
     *  Camelize a string.
     */
    camelize: (string, options) => camelcase_1.default(string, options),
    /**
     *  Returns a cloned object having camelized keys.
     */
    camelizeKeys: (obj) => {
        const clone = {};
        for (let key in obj) {
            clone[exports.camelize.camelize(key)] = obj[key];
        }
        return clone;
    }
};
//# sourceMappingURL=camelize.js.map