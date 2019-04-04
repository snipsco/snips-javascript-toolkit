import { i18n } from './i18n'
import { logger } from './logger'
import { IntentMessage, FlowContinuation, FlowActionReturn } from 'hermes-javascript'

export type Handler = (
    message: IntentMessage,
    flow: FlowContinuation,
    ...args: any[]
) => FlowActionReturn

export const handler = {
    /**
     * Wrap a dialogue handler to gracefully capture and log errors.
     */
    wrap: (handler: Handler): Handler => (
        async (message, flow, ...args) => {
            logger.debug('message: %O', message)
            try {
                // Run handler until completion
                const tts = await handler(message, flow, ...args)
                // And make the TTS speak
                return tts
            } catch (error) {
                // If an error occurs, end the flow gracefully
                flow.end()
                // And make the TTS output the proper error message
                logger.error(error)
                return await i18n.errorMessage(error)
            }
        }
    )
}
