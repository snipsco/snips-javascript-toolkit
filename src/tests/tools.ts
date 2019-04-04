export function getMessageKey(message) {
    return JSON.parse(message.text).key
}
