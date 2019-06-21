/* eslint no-console: off */

import { createServer, AddressInfo } from 'net'
import { spawn } from 'child_process'
import mqtt from 'mqtt'
import { standardRunner, sandboxedRunner } from 'snips-toolkit-runner'

function getFreePort(): Promise<number> {
    return new Promise((resolve, reject) => {
        const server = createServer()
        server.on('error', err => {
            reject(err)
        })
        server.on('listening', () => {
            const port: number = (server.address() as AddressInfo)['port']
            server.close()
            resolve(port)
        })
        server.listen()
    })
}

beforeAll(async () => {
    const mosquittoPort = await getFreePort()
    console.log('Launching mosquitto on port [' + mosquittoPort + ']')
    // To print full mosquitto logs, replace stdio: 'ignore' with stdio: 'inherit'
    const mosquitto = spawn('mosquitto', ['-p', '' + mosquittoPort, '-v'], { stdio: 'ignore' })
    console.log('Mosquitto ready!')
    global['SnipsToolkit'].setup.mosquitto = mosquitto
    global['SnipsToolkit'].setup.mosquittoPort = mosquittoPort
    const runner = global['sandboxedRunner'] ? sandboxedRunner : standardRunner
    global['SnipsToolkit'].setup.killHermes = await runner({
        hermesOptions: {
            address: 'localhost:' + mosquittoPort,
            logs: true
        },
        runnerOptions: {
            target: global['runnerTarget']
        }
    })
    // Sleep 2 seconds while the action is bootstrapping.
    await new Promise(resolve => setTimeout(resolve, 2000))
})

beforeEach(done => {
    const client = mqtt.connect(`mqtt://localhost:${global['SnipsToolkit'].setup.mosquittoPort}`)
    client.on('connect', function () {
        done()
    })
    client.on('error', function(err) {
        client.end(true)
        throw err
    })
    global['SnipsToolkit'].setup.mqttClient = client
})

afterEach(() => {
    global['SnipsToolkit'].setup.mqttClient.end(true)
})

afterAll(done => {
    const { mosquitto, killHermes } = global['SnipsToolkit'].setup
    setTimeout(() => {
        mosquitto.kill()
        console.log('Mosquitto killed.')
        if(killHermes) {
            killHermes()
            console.log('Hermes killed.')
        }
        done()
    }, 500)
})
