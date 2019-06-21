export function getMessageKey(message: string | {[key: string]: any}) {
    if(typeof message === 'string') {
        return JSON.parse(message).key
    } else {
        return JSON.parse(message.text).key
    }
}

export function getMessageOptions(message: string | {[key: string]: any}) {
    if(typeof message === 'string') {
        return JSON.parse(message).options
    }
    return JSON.parse(message.text).options
}
