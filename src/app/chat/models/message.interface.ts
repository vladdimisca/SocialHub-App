export interface Message {
    messageId: string | undefined,
    chatId: string | undefined,
    sender: string,
    receiver: string,
    message: string,
    timestamp: number,
    seen: boolean 
}