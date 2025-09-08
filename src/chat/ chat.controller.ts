import {
  Body,
  Controller,
  Get,
  Inject,
  Injectable,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ChatService } from './service/chat.service';
import { Chat } from './schema/chat.schema';

@Controller('api/chat')
export class ChatController {
  constructor(
    @Inject()
    private chatService: ChatService,
  ) {}

  @Post()
  async createChat(@Body() chatData: Partial<Chat>) {
    return await this.chatService.createChat(chatData);
  }

  @Get()
  async getChats(@Query('userId') userId: string) {
    return await this.chatService.getChats(userId);
  }
}
