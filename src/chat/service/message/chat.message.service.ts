import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMessageDto } from 'src/chat/dto/dto.create_message_dto';
import { Chat } from 'src/chat/schema/chat.schema';
import { Message } from 'src/chat/schema/message.schema';
import {
  MessagesByChatDto,
  MessagesArrayDto,
} from 'src/chat/dto/dto.messages_response';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
  ) {}
  // Service methods will go here

  async createMessage(createMessageDto: CreateMessageDto): Promise<Message> {
    // Logic to create and save a message
    const message = new Message();
    message.sender = new Types.ObjectId(createMessageDto.senderId);
    message.receiver = new Types.ObjectId(createMessageDto.receiverId);
    message.chat = new Types.ObjectId(createMessageDto.chatId);
    message.content = createMessageDto.content;
    message.updatedAt = new Date();
    // await message.save();
    return this.messageModel.create(message);
  }

  async getMessagesByChatId(chatId: string): Promise<MessagesArrayDto> {
    // Returns an array of messages for a single chat, mapped to DTO
    const messages = await this.messageModel
      .find({ chat: new Types.ObjectId(chatId) })
      .sort({ createdAt: 1 })
      .exec();

    return messages.map((msg) => ({
      sender: msg.sender.toString(),
      receiver: msg.receiver.toString(),
      chat: msg.chat.toString(),
      content: msg.content,
      attachments: msg.attachments?.map((a) => a.toString()),
      createdAt: msg['createdAt'],
      updatedAt: msg.updatedAt,
    }));
  }

  async getAllMessagesByUserId(userId: string): Promise<MessagesByChatDto> {
    const chats = await this.chatModel.find({ users: userId }).exec();
    const chatIds = chats.map((chat) => chat._id);
    const messages = await this.messageModel
      .find({ chat: { $in: chatIds } })
      .sort({ createdAt: 1 })
      .exec();
    const result: MessagesByChatDto = {};
    chatIds.forEach((chatId) => {
      result[chatId.toString()] = [];
    });
    messages.forEach((msg) => {
      const chatId = msg.chat.toString();
      if (!result[chatId]) result[chatId] = [];
      result[chatId].push({
        sender: msg.sender.toString(),
        receiver: msg.receiver.toString(),
        chat: msg.chat.toString(),
        content: msg.content,
        attachments: msg.attachments?.map((a) => a.toString()),
        createdAt: msg['createdAt'],
        updatedAt: msg.updatedAt,
      });
    });
    return result;
  }
}
