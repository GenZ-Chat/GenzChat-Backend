import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './ chat.controller';
import { ChatService } from './service/chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schema/chat.schema';
import { MessageSchema } from './schema/message.schema';
import { ChatMessageController } from './chat.message.controller';
import { ChatMessageService } from './service/message/chat.message.service';

@Module({
  providers: [ChatGateway, ChatService, ChatMessageService],
  controllers: [ChatController, ChatMessageController],
  exports: [ChatService, ChatMessageService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Chat', schema: ChatSchema },
      { name: 'Message', schema: MessageSchema },
      { name: 'Message', schema: MessageSchema },
    ]),
  ],
})
export class ChatModule {}
