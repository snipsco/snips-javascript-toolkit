// eslint-disable-next-line
import { HermesOptions } from 'hermes-javascript/types'

export type RunnerOptions = {
    target?: string,
    cwd?: string
}

export type Runner = ({ hermesOptions, runnerOptions }: {
    hermesOptions?: HermesOptions;
    runnerOptions?: RunnerOptions;
}) => Promise<() => void>
