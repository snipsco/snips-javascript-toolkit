import wretch from 'wretch';
import fetch from 'node-fetch';
// Re-export types
export * from 'wretch';
/**
 * Get an http client instance. (see [wretch](https://github.com/elbywan/wretch) for the API documentation)
 * @param url Base url.
 * @param options Fetch options.
 */
export function http(url, options) {
    return wretch(url, options)
        .polyfills({
        fetch: global['__DEV__'] ? global['SnipsToolkit'].fetch : fetch
    });
}
//# sourceMappingURL=http.js.map