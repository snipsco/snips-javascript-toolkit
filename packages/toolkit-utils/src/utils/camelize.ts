import camelcase from 'camelcase'

export const camelize = {
    /**
     *  Camelize a string.
     */
    camelize: (string: string, options?: { pascalCase: boolean }) => camelcase(string, options),
    /**
     *  Returns a cloned object having camelized keys.
     */
    camelizeKeys: (obj: {[ key: string ]: any }) => {
        const clone: {[ key: string ]: any } = {}
        for(let key in obj){
            clone[camelize.camelize(key)] = obj[key]
        }
        return clone
    }
}
