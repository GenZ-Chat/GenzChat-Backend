export class CreateMessageDto {
    chatId: string;
    senderId: string;
    receiverId: string;
    content: string;
    attatchments?: ChatMessageAttachment[];
}

export enum AttatchmentType{
    IMAGE = 'image',
    VIDEO = 'video',
    FILE = 'file'
}

export class ChatMessageAttachment{
    url: string;
    type: AttatchmentType;
    filename: string;
    filesize: number; // in bytes
}