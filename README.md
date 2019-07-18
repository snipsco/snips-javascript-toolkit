# Snips Toolkit

### Everything you need in order to write Snips actions.

## Setup

```sh
npm i snips-toolkit
```

Then use it in your package.json file scripts.

```json
"scripts": {
    "build": "snips-toolkit build",
    "dev": "snips-toolkit dev",
    "test": "snips-toolkit test '^.*\\.spec\\.[jt]s$'",
    "launch": "snips-toolkit run"
}
```

Assumes that your action is structured in the following way by default:

```sh
.
├── src               # sources folder
|   └── index.[jt]s   # the action code entry point
|
├── dist              # the action build output folder
|
├── tests             # tests folder
|   └── *.spec.[tj]s  # any number of test files
|
├── package.json      # with an extra "sandbox" key, highlighted lower in the documentation
|
├── config.ini        # action configuration file
|
└── assets
    └── i18n          # internationalization folder
        └── <locale>.json # translation file for a given language
```

## Command line

#### `snips-toolkit --help`

Displays a help message and exits.

#### `snips-toolkit build`

Builds your action to `./dist/index.js` using [webpack](https://webpack.js.org/).

This command will warn if your action code uses node.js native modules, and they will be automatically added to your `package.json` file under the `sandbox` key.

```json
// Example:
"sandbox": [
  "fs",
  "http",
  "https",
  "os",
  "path",
  "stream",
  "tty",
  "url",
  "util",
  "zlib"
]
```

#### `snips-toolkit dev`

Automatically rebuilds and run the Snips action on file change.

You can debug the action by connecting a debugger to the 9229 port.
Check [the node.js website](https://nodejs.org/de/docs/guides/debugging-getting-started/) for more details.

Use the `-c/--config-path` if you need to use custom hermes options.

#### `snips-toolkit test [files]`

Runs your test suite with [jest](https://jestjs.io/).

Use the `-s/--sandbox` flag to run the tests in a sandboxed environment.

#### `snips-toolkit run`

Runs your Snips action.

Use the `-c/--config-path` if you need to use custom hermes options.

## Utils

#### `import { config } from 'snips-toolkit'`

Initialize once by calling `.init`, then use `.get` to retrieve the configuration.

```js
// Reads the configuration file located at `./config.ini`.
config.init()
```

```js
// Get the configuration.
const configuration = config.get()
```

*Depends on node.js modules `fs`, `path`.*

#### `import { i18n } from 'snips-toolkit'`

Initialize once by calling `.init`.

Uses the [i18next](https://www.i18next.com) library under the hood.

```js
// Reads the `./assets/i18n/en.json` translation file and initializes an i18next instance.
await i18n.init('en')
```

```js
// Get a translation. (see https://www.i18next.com/overview/api#t)
const translation = i18n.translate(keys, options)
```

```js
// Get the translation for an error message.
// Assumes that the translation file contains the key 'error.<error message>'.
const errorTranslation = await i18n.errorMessage(error)
```

```js
// Get a random translation for a given key.
// Assumes that the translation file maps an array of possible translations to the key.
const translation = i18n.randomTranslation(keys, options)
```

*Depends on node.js modules `fs`, `path`.*

#### `import { http } from 'snips-toolkit'`

An http client using [wretch](https://github.com/elbywan/wretch).

```js
const pokeapi = http('https://pokeapi.co/api/v2')

const bulbasaur = await pokeapi
    .url('/pokemon/1')
    .get()
    .json()
```

*Depends on node.js modules `http`, `https`, `stream`, `zlib`, `url`.*

#### `import { logger } from 'snips-toolkit'`

A logger using [debug](https://github.com/visionmedia/debug).

```js
// Enables error printing. You can use * as a wildcard.
logger.enable('error')
```

```js
// Logs to <actionName>:error
logger.debug('error')
// Logs to <actionName>:info
logger.info('info')
// Logs to <actionName>:debug
logger.error('debug')
```

*Depends on node.js modules `tty`, `util`, `os`.*

#### `import { handler } from 'snips-toolkit'`

Utilities for handling hermes callbacks.

```js
// Wrap a dialogue handler to gracefully capture and log errors.
handler.wrap((msg, flow) => {
    // ... //
})
```

*Depends on internal modules `i18n`, `logger`.*

#### `import { message } from 'snips-toolkit'`

Utilities for parsing hermes messages.

```js
// Get slots matching the slot name.
const mySlot = message.getSlotsByName(
    // The message instance
    msg,
    // The slot name
    'mySlotName',
    {
        // If true, returns only the slot with the highest confidence.
        onlyMostConfident: true,
        // If specified, returns only slots having a confidence higher than this threshold.
        threshold: 0.5
    }
)
```

```js
// Calculates the ASR confidence.
const confidence = message.getAsrConfidence(msg)
```

#### `import { camelize } from 'snips-toolkit'`

Camelcase utilities using the [camelcase](https://github.com/sindresorhus/camelcase) package.

```js
// Camelize a string
const camelizedKey = camelize(key)
```

```js
// Returns a cloned object having camelized keys.
const camelizedObject = camelizeKeys(object)
```

## Hermes configuration

In order to pass custom [hermes options](https://github.com/snipsco/hermes-protocol/tree/develop/platforms/hermes-javascript#hermes-class), you can use the `-c` flag to specify the path to a configuration file.

For instance, if you are using an mqtt broker running on a different machine, you could add options in a file named `hermes_config.json`.

```json
{
    "address": "ip:port"
}
```

And add the `-c` flag in the `package.json` file.

```json
"scripts": {
    "dev": "snips-toolkit dev -c ./hermes_config.json",
    "launch": "snips-toolkit run -c ./hermes_config.json"
}
```

## Unit tests

During unit tests, your action code is run is parallel with the tests and i18n/http utils are mocked.

### Mocks

#### http

You can use the provided `SnipsToolkit.mock.http` global function to override http calls automatically during tests.

```js
// Place this code in the root of the test file to mock.
SnipsToolkit.mock.http(fetchMock => {
    // Define as many mocks as you need.
    // See http://www.wheresrhys.co.uk/fetch-mock for API details
    fetchMock.mock('https://my.super.api/route', {
        hello: "world"
    })
})
```

#### i18n

The `i18n.translate` output is not the translation but a stringified JSON reprensentation of the key/options.

This call:
```js
// This call:
i18n.translate('pokemon.info', {
    name: 'Pikachu',
    weight: 10,
    height: 20
})
```

Returns when mocked: (in stringified form)

```json
{
  "key": "pokemon.info",
  "options": {
    "name": "Pikachu",
    "weight": 10,
    "height": 20
  }
}
```

#### globals

You can use the provided `SnipsToolkit.mock.globals` global function to override or define global variables.

```js
SnipsToolkit.mock.globals(globals => {
    // Mocks the Date object in a crude way.
    const BackupedDate = global.Date
    const freezedTime = 1550835788763
    const mockedDate = function Date(arg: string | number | Date) {
        return new BackupedDate(arg || freezedTime)
    }
    mockedDate.now = () => freezedTime
    mockedDate.parse = BackupedDate.parse
    mockedDate.UTC = BackupedDate.UTC

    // Assign the mocked Date to the globals object
    globals.Date = mockedDate
})

```

### Session

To simulate dialogue session rounds, you can use the `Session` helper that will pass hermes messages between your test and action code.

```js
import { Test } from 'snips-toolkit'

/* ... */

// Initialize a session instance
const session = new Test.Session()
// Publish an intent message that is expected by the action code to start a session
await session.start({
    intentName: 'pokemon_details',
    input: 'Give me the details for Pokemon 1',
    slots: [
        // Function that creates a custom slot, omitted for the sake of brevity.
        createPokemonIdSlot('1')
    ]
})
// Expect the action code to publish a continue session message
// and reply with the following intent message (here we simulate a confirmation message)
const continuation = await session.continue({
    intentName: 'pokemon_confirm',
    input: 'Yes please'
})
// Expect the action to end the session and retrieve the end session message value
const endSessionMessage = await session.end()
// Extract the key/options of the TTS spoken by the end session message
const { key, options } = JSON.parse(endSessionMessage.text || '')
// Assert that the values are correct
expect(key).toBe('pokemon.info')
expect(options.name).toBe('bulbasaur')
expect(options.weight).toBe(69)
expect(options.height).toBe(7)
```
