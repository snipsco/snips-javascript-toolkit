export declare type I18nFunction = (key: string | string[], options?: {
    [key: string]: any;
}) => string & string[];
/**
 * Translation utilities.
 */
export declare const i18n: {
    /**
     * Get a translation. (see https://www.i18next.com/overview/api#t)
     */
    translate: I18nFunction;
    /**
     * Reads the `./assets/i18n/<locale>.json` translation file and initializes an i18next instance.
     * @param locale Locale to use (defaults to 'en').
     */
    init(locale?: string): Promise<I18nFunction>;
    /**
     * Get the translation for an error message.
     * Assumes that the translation file contains the key 'error.<error message>'.
     * @param error An error to translate
     */
    errorMessage(error: Error): Promise<string>;
    /**
     * Get a random translation for a given key.
     * Assumes that the translation file maps an array of possible translations to the key.
     * @param key Key or array of keys to translate.
     * @param opts i18next options and variables.
     */
    randomTranslation(key: string | string[], opts: {
        [key: string]: any;
    }): string;
    /**
     * Combines text fragments into a full sentence.
     * @param list A list of words.
     * @param separatorKey Key in the i18n translation file mapping to the separator.
     */
    joinTerms(list: string[], separatorKey: string): string;
};
