// DTO for Message (excludes sensitive fields)
export class MessageDto {
  sender: string; // user id
  receiver: string; // user id
  chat: string; // chat id
  content: string;
  attachments?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// DTO for Chat (excludes sensitive fields)
export class ChatDto {
  _id: string;
  type: string;
  users: string[]; // user ids
  group?: any; // can be refined if needed
  createdAt?: Date;
  updatedAt?: Date;
}

// Messages grouped by chat id
export class MessagesByChatDto {
  [chatId: string]: MessageDto[];
}

// Array of messages for a chat
export type MessagesArrayDto = MessageDto[];
