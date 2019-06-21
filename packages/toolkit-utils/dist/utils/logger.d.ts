export declare const logger: {
    init(name: string): void;
    /**
     * Log. (info level)
     */
    info: (formatter: any, ...args: any[]) => void;
    /**
     * Log. (debug level)
     */
    debug: (formatter: any, ...args: any[]) => void;
    /**
     * Log. (error level)
     */
    error: (formatter: any, ...args: any[]) => void;
    /**
     * Enable logger level.
     */
    enable: (level: string) => void;
};
