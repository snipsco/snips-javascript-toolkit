export declare const camelize: {
    /**
     *  Camelize a string.
     */
    camelize: (string: string, options?: {
        pascalCase: boolean;
    } | undefined) => string;
    /**
     *  Returns a cloned object having camelized keys.
     */
    camelizeKeys: (obj: {
        [key: string]: any;
    }) => {
        [key: string]: any;
    };
};
