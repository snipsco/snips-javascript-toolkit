import fetchMock from 'fetch-mock'

global['SnipsToolkit'] = {
    fetch: fetchMock.sandbox(),
    config: {},
    setup: {},
    mock: {
        http(mockCallback: (mock: fetchMock.FetchMockSandbox) => void) {
            mockCallback(global['SnipsToolkit'].fetch)
        },
        config(mockCallback: (currentConfig: {[key: string]: any}) => {[key: string]: any}) {
            mockCallback(global['SnipsToolkit'].config)
        }
    }
}
