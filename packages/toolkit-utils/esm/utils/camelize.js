import camelcase from 'camelcase';
export const camelize = {
    /**
     *  Camelize a string.
     */
    camelize: (string, options) => camelcase(string, options),
    /**
     *  Returns a cloned object having camelized keys.
     */
    camelizeKeys: (obj) => {
        const clone = {};
        for (let key in obj) {
            clone[camelize.camelize(key)] = obj[key];
        }
        return clone;
    }
};
//# sourceMappingURL=camelize.js.map