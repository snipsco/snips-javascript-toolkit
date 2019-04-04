import { FetchMockSandbox } from 'fetch-mock'

declare global {
    export type Config = {[key: string]: any}
    export type HttpMockInitializer = (sandbox: FetchMockSandbox) => void
    export type ConfigMockInitializer = (conf?: Config) => Config

    export const SnipsToolkit : {
        fetch: FetchMockSandbox,
        config: Config,
        mock: {
            http(initializer: HttpMockInitializer): void,
            config(initializer: ConfigMockInitializer): void
        }
    }
}

export * from './tests'
export * from './utils'
export * from './defaults'
