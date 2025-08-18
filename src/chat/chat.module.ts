import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatController } from './ chat.controller';
import { ChatService } from './service/chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import {ChatSchema} from "./schema/chat.schema"
import { MessageSchema } from './schema/message.schema';

@Module({
  providers: [ChatGateway,ChatService],
  controllers: [ChatController],
  exports: [ChatService],
  imports:[MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema },{ name: 'Message', schema: MessageSchema }])]
})
export class ChatModule {}
