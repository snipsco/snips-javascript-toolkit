"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const i18next_1 = __importDefault(require("i18next"));
const defaults_1 = require("../defaults");
const assetsPath = path_1.default.join(process.cwd(), 'assets', 'i18n');
/**
 * Translation utilities.
 */
exports.i18n = {
    /**
     * Get a translation. (see https://www.i18next.com/overview/api#t)
     */
    translate: undefined,
    /**
     * Reads the `./assets/i18n/<locale>.json` translation file and initializes an i18next instance.
     * @param locale Locale to use (defaults to 'en').
     */
    init(locale = defaults_1.DEFAULT_LOCALE) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If we are mocking.
                if (global['__DEV__']) {
                    // Stringify the key and options instead of using i18next.
                    exports.i18n.translate = function (key, options) {
                        return JSON.stringify({
                            key,
                            options
                        });
                    };
                    return exports.i18n.translate;
                }
                if (!exports.i18n.translate) {
                    const file = fs_1.default.readFileSync(path_1.default.join(assetsPath, `${locale}.json`), 'utf-8');
                    const resources = {
                        [locale]: {
                            translation: JSON.parse(file)
                        }
                    };
                    exports.i18n.translate = yield i18next_1.default.init({
                        lng: locale,
                        fallbackLng: defaults_1.DEFAULT_LOCALE,
                        resources
                    });
                }
                return exports.i18n.translate;
            }
            catch (error) {
                throw new Error('localisation');
            }
        });
    },
    /**
     * Get the translation for an error message.
     * Assumes that the translation file contains the key 'error.<error message>'.
     * @param error An error to translate
     */
    errorMessage(error) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!exports.i18n.translate) {
                yield exports.i18n.init();
            }
            if (exports.i18n.translate) {
                return exports.i18n.translate([`error.${error.message}`, 'error.unspecific']);
            }
            else {
                return 'Oops, something went wrong.';
            }
        });
    },
    /**
     * Get a random translation for a given key.
     * Assumes that the translation file maps an array of possible translations to the key.
     * @param key Key or array of keys to translate.
     * @param opts i18next options and variables.
     */
    randomTranslation(key, opts) {
        if (!exports.i18n) {
            throw new Error('error.unspecific');
        }
        const possibleValues = exports.i18n.translate(key, Object.assign({ returnObjects: true }, opts));
        if (typeof possibleValues === 'string')
            return possibleValues;
        const randomIndex = Math.floor(Math.random() * possibleValues.length);
        return possibleValues[randomIndex];
    },
    /**
     * Combines text fragments into a full sentence.
     * @param list A list of words.
     * @param separatorKey Key in the i18n translation file mapping to the separator.
     */
    joinTerms(list, separatorKey) {
        if (!list || list.length < 2)
            return list && list[0] || '';
        let joinedString = '';
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (i === (list.length - 1)) {
                joinedString += ' ' + exports.i18n.translate(separatorKey, { something: element }) + ' ';
                continue;
            }
            else if (i > 0) {
                joinedString += ', ';
            }
            joinedString += element;
        }
        return joinedString;
    }
};
//# sourceMappingURL=i18n.js.map