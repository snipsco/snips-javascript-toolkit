import { Wretcher, WretcherOptions } from 'wretch';
export * from 'wretch';
/**
 * Get an http client instance. (see [wretch](https://github.com/elbywan/wretch) for the API documentation)
 * @param url Base url.
 * @param options Fetch options.
 */
export declare function http(url?: string, options?: WretcherOptions): Wretcher;
