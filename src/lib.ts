import { FetchMockSandbox } from 'fetch-mock'

declare global {
    export type GenericObj = {[key: string]: any}
    export type HttpMockInitializer = (sandbox: FetchMockSandbox) => void
    export type ConfigMockInitializer = (config: GenericObj) => void
    export type GlobalsMockInitializer = (date: GenericObj) => void

    export const SnipsToolkit : {
        fetch: FetchMockSandbox,
        config: GenericObj,
        globals: GenericObj,
        mock: {
            http(initializer: HttpMockInitializer): void,
            config(initializer: ConfigMockInitializer): void,
            globals(initializer: GlobalsMockInitializer): void
        }
    }
}

export * from './tests'
export * from './utils'
export * from './defaults'
