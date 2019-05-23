export function getMessageKey(message) {
    if(typeof message === 'string') {
        return JSON.parse(message).key
    }
    return JSON.parse(message.text).key
}

export function getMessageOptions(message) {
    if(typeof message === 'string') {
        return JSON.parse(message).options
    }
    return JSON.parse(message.text).options
}
