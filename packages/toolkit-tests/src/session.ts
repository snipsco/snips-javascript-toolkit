import { MqttClient } from 'mqtt'
import { ContinueSessionMessage, EndSessionMessage } from 'hermes-javascript/types'

let sessionId = 0

export default class Session {
    private mqtt: MqttClient
    private sessionId: string

    constructor() {
        this.mqtt = global['SnipsToolkit'].setup.mqttClient
        this.sessionId = ''+ sessionId++
    }

    reset() {
        this.sessionId = '' + sessionId++
    }

    subscribe (topic: string) {
        return new Promise((resolve, reject) => {
            this.mqtt.subscribe(topic, err => {
                err ? reject(err) : resolve()
            })
        })
    }

    unsubscribe (topic: string) {
        return new Promise((resolve, reject) => {
            this.mqtt.unsubscribe(topic, err => {
                err ? reject(err) : resolve()
            })
        })
    }

    async publishMessage ({ intentName, input, ...additionalFields }) {
        return new Promise(resolve => {
            this.mqtt.publish(`hermes/intent/${intentName}`, JSON.stringify({
                 sessionId: this.sessionId,
                 siteId: 'default',
                 intent: {
                     intentName,
                     confidenceScore: 1
                 },
                 asrTokens: [],
                 slots: [],
                 input,
                 ...additionalFields
             }), resolve)
        })
    }

    nextMessage(): Promise<[string, ContinueSessionMessage | EndSessionMessage]> {
        return new Promise(resolve =>
            this.mqtt.once('message', (topic, message) => {
                resolve([ topic, JSON.parse(message.toString()) ])
            })
        )
    }

    async start({
        intentName,
        input,
        ...additionalFields
    }) {
        if(!input || !intentName) {
            throw new Error('input and intentName fields are required')
        }
        // Subscribe to the continueSession/endSession callbacks
        await this.subscribe('hermes/dialogueManager/continueSession')
        await this.subscribe('hermes/dialogueManager/endSession')
        // Publish an intent message
        this.publishMessage({ intentName, input, ...additionalFields })
    }

    async continue({
        intentName,
        input,
        ...additionalFields
    }) : Promise<ContinueSessionMessage> {
        if(!input || !intentName) {
            throw new Error('input and intentName fields are required')
        }
        // Wait for the continue session message
        const [ topic, message ] = await this.nextMessage()
        // Asserts
        expect(topic).toBe('hermes/dialogueManager/continueSession')
        expect(message.sessionId).toBe(this.sessionId)
        // Publish an intent message
        this.publishMessage({ intentName, input, ...additionalFields })
        return message
    }

    async end() : Promise<EndSessionMessage> {
        // Wait for the end session message
        const [ topic, message ] = await this.nextMessage()
        // Asserts
        expect(topic).toBe('hermes/dialogueManager/endSession')
        expect(message.sessionId).toBe(this.sessionId)
        await this.unsubscribe('hermes/dialogueManager/continueSession')
        await this.unsubscribe('hermes/dialogueManager/endSession')
        return message
    }
}
