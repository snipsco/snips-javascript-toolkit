var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs';
import path from 'path';
import i18next from 'i18next';
import { DEFAULT_LOCALE } from '../defaults';
const assetsPath = path.join(process.cwd(), 'assets', 'i18n');
/**
 * Translation utilities.
 */
export const i18n = {
    /**
     * Get a translation. (see https://www.i18next.com/overview/api#t)
     */
    translate: undefined,
    /**
     * Reads the `./assets/i18n/<locale>.json` translation file and initializes an i18next instance.
     * @param locale Locale to use (defaults to 'en').
     */
    init(locale = DEFAULT_LOCALE) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // If we are mocking.
                if (global['__DEV__']) {
                    // Stringify the key and options instead of using i18next.
                    i18n.translate = function (key, options) {
                        return JSON.stringify({
                            key,
                            options
                        });
                    };
                    return i18n.translate;
                }
                if (!i18n.translate) {
                    const file = fs.readFileSync(path.join(assetsPath, `${locale}.json`), 'utf-8');
                    const resources = {
                        [locale]: {
                            translation: JSON.parse(file)
                        }
                    };
                    i18n.translate = yield i18next.init({
                        lng: locale,
                        fallbackLng: DEFAULT_LOCALE,
                        resources
                    });
                }
                return i18n.translate;
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
            if (!i18n.translate) {
                yield i18n.init();
            }
            if (i18n.translate) {
                return i18n.translate([`error.${error.message}`, 'error.unspecific']);
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
        if (!i18n) {
            throw new Error('error.unspecific');
        }
        const possibleValues = i18n.translate(key, Object.assign({ returnObjects: true }, opts));
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
                joinedString += ' ' + i18n.translate(separatorKey, { something: element }) + ' ';
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