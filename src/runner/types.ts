// eslint-disable-next-line
import { HermesOptions } from 'hermes-javascript/types'

export type RunnerOptions = {
    target?: string,
    cwd?: string,
    id?: string,
    reusable?: boolean
}

export type Runner = ({ hermesOptions, runnerOptions }: {
    hermesOptions?: HermesOptions;
    runnerOptions?: RunnerOptions;
}) => Promise<() => void>
