export interface Message {
    chatId: string | undefined,
    sender: string,
    receiver: string,
    message: string,
    timestamp: number
}