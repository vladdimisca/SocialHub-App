export interface Message {
    messageId: string,
    chatId: string,
    sender: string,
    receiver: string,
    message: string,
    timestamp: number,
    seen: boolean 
}