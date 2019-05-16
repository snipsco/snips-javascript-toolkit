export function getMessageKey(message) {
    return JSON.parse(message.text).key
}

export function getMessageOptions(message) {
    return JSON.parse(message.text).options
}
