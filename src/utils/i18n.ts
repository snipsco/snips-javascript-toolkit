import fs from 'fs'
import path from 'path'
import i18next from 'i18next'
import { DEFAULT_LOCALE } from '../defaults'

const assetsPath = path.join(process.cwd(), 'assets', 'i18n')

export type I18nFunction = (key: string | string[], options?: {[key: string]: any}) => string & string[]

/**
 * Translation utilities.
 */
export const i18n = {
    /**
     * Get a translation. (see https://www.i18next.com/overview/api#t)
     */
    translate: undefined as unknown as I18nFunction,
    /**
     * Reads the `./assets/i18n/<locale>.json` translation file and initializes an i18next instance.
     * @param locale Locale to use (defaults to 'en').
     */
    async init(locale = DEFAULT_LOCALE) : Promise<I18nFunction> {
        try {
            // If we are mocking.
            if(global['__DEV__']) {
                // Stringify the key and options instead of using i18next.
                i18n.translate = function (key, options) {
                    return JSON.stringify({
                        key,
                        options
                    })
                } as I18nFunction
                return i18n.translate
            }
            if(!i18n.translate) {
                const file = fs.readFileSync(path.join(assetsPath, `${locale}.json`), 'utf-8')
                const resources = {
                    [locale]: {
                        translation: JSON.parse(file)
                    }
                }
                i18n.translate = await i18next.init({
                    lng: locale,
                    fallbackLng: DEFAULT_LOCALE,
                    resources
                })
            }
            return i18n.translate
        } catch (error) {
            throw new Error('localisation')
        }
    },
    /**
     * Get the translation for an error message.
     * Assumes that the translation file contains the key 'error.<error message>'.
     * @param error An error to translate
     */
    async errorMessage(error: Error): Promise<string> {
        if(!i18n.translate) {
            await i18n.init()
        }

        if(i18n.translate) {
            return i18n.translate([`error.${error.message}`, 'error.unspecific'])
        } else {
            return 'Oops, something went wrong.'
        }
    },
    /**
     * Get a random translation for a given key.
     * Assumes that the translation file maps an array of possible translations to the key.
     * @param key Key or array of keys to translate.
     * @param opts i18next options and variables.
     */
    randomTranslation(key: string | string[], opts: {[key: string]: any}): string {
        if(!i18n) {
            throw new Error('error.unspecific')
        }
        const possibleValues = i18n.translate(key, { returnObjects: true, ...opts })
        if(typeof possibleValues === 'string')
            return possibleValues
        const randomIndex = Math.floor(Math.random() * possibleValues.length)
        return possibleValues[randomIndex]
    }
}
