import { i18n } from './i18n'
import { logger } from './logger'
import { message as messageUtils } from './message'
import {
    IntentMessage,
    IntentNotRecognizedMessage,
    SessionStartedMessage,
    FlowContinuation,
    FlowActionReturn
} from 'hermes-javascript/types'

export type HandlerMessages = IntentMessage | IntentNotRecognizedMessage | SessionStartedMessage
export type Handler<MessageType extends HandlerMessages = IntentMessage> = (
    message: MessageType,
    flow: FlowContinuation,
    ...args: any[]
) => FlowActionReturn

export function intentMessageGuard(msg: HandlerMessages): msg is IntentMessage {
    return !!msg['intent']
}

export type ConfidenceThresholds = {
    intent?: number,
    asr?: number
}

export const handler = {
    /**
     * Wrap a dialogue handler to gracefully capture and log errors.
     */
    wrap: <MessageType extends HandlerMessages = IntentMessage>(handler: Handler<MessageType>, thresholds?: ConfidenceThresholds): Handler<MessageType> => (
        async (message, flow, ...args) => {
            logger.debug('message: %O', message)
            try {
                if(
                    thresholds && intentMessageGuard(message) && (
                        (thresholds.intent && message.intent.confidenceScore < thresholds.intent) ||
                        (thresholds.asr && messageUtils.getAsrConfidence(message) < thresholds.asr)
                    )
                ) {
                    throw new Error('intentNotRecognized')
                }
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
