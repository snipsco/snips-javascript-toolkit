import { IntentMessage, IntentNotRecognizedMessage, SessionStartedMessage, FlowContinuation, FlowActionReturn } from 'hermes-javascript/types';
export declare type HandlerMessages = IntentMessage | IntentNotRecognizedMessage | SessionStartedMessage;
export declare type Handler<MessageType extends HandlerMessages = IntentMessage> = (message: MessageType, flow: FlowContinuation, ...args: any[]) => FlowActionReturn;
export declare function intentMessageGuard(msg: HandlerMessages): msg is IntentMessage;
export declare type ConfidenceThresholds = {
    intent?: number;
    asr?: number;
};
export declare const handler: {
    /**
     * Wrap a dialogue handler to gracefully capture and log errors.
     */
    wrap: <MessageType extends HandlerMessages = IntentMessage>(handler: Handler<MessageType>, thresholds?: ConfidenceThresholds | undefined) => Handler<MessageType>;
};
