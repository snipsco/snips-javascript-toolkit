export declare type SnipsConfig = {
    [key: string]: string;
};
/**
 * Configuration utilities.
 */
export declare const config: {
    /**
     * Get the configuration.
     */
    get(): SnipsConfig;
    /**
     * Reads the configuration file located at `./config.ini`.
     */
    init(): SnipsConfig;
};
