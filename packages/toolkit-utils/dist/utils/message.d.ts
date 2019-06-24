import { IntentMessage, NluSlot, slotType } from 'hermes-javascript/types';
declare type GetSlotsByNameReturn<T, S extends slotType> = T extends true ? NluSlot<S> | null : T extends undefined ? NluSlot<S>[] : T extends false ? NluSlot<S>[] : NluSlot<S>[];
export declare const message: {
    /**
     * Helper to filter slots given their name, and potentially a lower threshold for the confidence level.
     * You can also use the onlyMostConfident boolean to return only a single slot with the highest confidence.
     * If no slot match the criterias, then returns null.
     */
    getSlotsByName: <S extends slotType = slotType, T extends boolean = false>(message: IntentMessage, slotName: string, { threshold, onlyMostConfident }?: {
        threshold?: number | undefined;
        onlyMostConfident?: T | undefined;
    }) => GetSlotsByNameReturn<T, S>;
    /**
     * Returns the ASR confidence for a given message.
     * @param message A message object.
     */
    getAsrConfidence(message: IntentMessage): number;
};
export {};
