function geometricMean(dataSet) {
    return Math.pow(dataSet.reduce((accumulator, element) => accumulator * element, 1), 1 / dataSet.length);
}
export const message = {
    /**
     * Helper to filter slots given their name, and potentially a lower threshold for the confidence level.
     * You can also use the onlyMostConfident boolean to return only a single slot with the highest confidence.
     * If no slot match the criterias, then returns null.
     */
    getSlotsByName: (message, slotName, { threshold = 0, onlyMostConfident = undefined } = {}) => {
        if (onlyMostConfident) {
            return message.slots.reduce((acc, slot) => {
                if (slot.slotName === slotName && slot.confidenceScore > threshold) {
                    if (!acc || acc.confidenceScore < slot.confidenceScore)
                        return slot;
                }
                return acc;
            }, null);
        }
        return message.slots.filter(slot => slot.slotName === slotName && slot.confidenceScore > threshold);
    },
    /**
     * Returns the ASR confidence for a given message.
     * @param message A message object.
     */
    getAsrConfidence(message) {
        if (!message.asrTokens || message.asrTokens.length < 1 || message.asrTokens[0] === undefined)
            return 1;
        return geometricMean(message.asrTokens[0].map(token => token.confidence));
    },
};
//# sourceMappingURL=message.js.map