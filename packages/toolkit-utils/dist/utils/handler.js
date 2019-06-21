"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("./i18n");
const logger_1 = require("./logger");
const message_1 = require("./message");
function intentMessageGuard(msg) {
    return !!msg['intent'];
}
exports.intentMessageGuard = intentMessageGuard;
exports.handler = {
    /**
     * Wrap a dialogue handler to gracefully capture and log errors.
     */
    wrap: (handler, thresholds) => ((message, flow, ...args) => __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.debug('message: %O', message);
        try {
            if (thresholds && intentMessageGuard(message) && ((thresholds.intent && message.intent.confidenceScore < thresholds.intent) ||
                (thresholds.asr && message_1.message.getAsrConfidence(message) < thresholds.asr))) {
                throw new Error('intentNotRecognized');
            }
            // Run handler until completion
            const tts = yield handler(message, flow, ...args);
            // And make the TTS speak
            return tts;
        }
        catch (error) {
            // If an error occurs, end the flow gracefully
            flow.end();
            // And make the TTS output the proper error message
            logger_1.logger.error(error);
            return yield i18n_1.i18n.errorMessage(error);
        }
    }))
};
//# sourceMappingURL=handler.js.map