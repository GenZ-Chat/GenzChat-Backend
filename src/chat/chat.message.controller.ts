import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ChatMessageService } from './service/message/chat.message.service';
import { CreateMessageDto } from './dto/dto.create_message_dto';

@Controller('api/chat')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Post()
  async createMessage(@Body() createMessageDto: CreateMessageDto) {
    const message =
      await this.chatMessageService.createMessage(createMessageDto);
    return message;
  }

  @Get('/messages')
  async getAllMessagesByUserId(@Query('userId') userId: string) {
    const messages =
      await this.chatMessageService.getAllMessagesByUserId(userId);
    return messages;
  }

  @Get(':chatId/messages')
  async getMessagesByChatId(@Param('chatId') chatId: string) {
    const messages = await this.chatMessageService.getMessagesByChatId(chatId);
    return messages;
  }
}
