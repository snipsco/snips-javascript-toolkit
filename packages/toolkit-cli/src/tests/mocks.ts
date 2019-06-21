import fetchMock from 'fetch-mock'

global['SnipsToolkit'] = {
    fetch: fetchMock.sandbox(),
    config: {},
    setup: {},
    globals: {},
    mock: {
        http(mockCallback: (mock: fetchMock.FetchMockSandbox) => void) {
            mockCallback(global['SnipsToolkit'].fetch)
        },
        config(mockCallback: (currentConfig: {[key: string]: any}) => void) {
            mockCallback(global['SnipsToolkit'].config)
        },
        globals(mockCallback: (currentGlobals: {[key: string]: any}) => void) {
            mockCallback(global['SnipsToolkit'].globals)
        }
    }
}
