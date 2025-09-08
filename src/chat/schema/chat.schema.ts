import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ChatGroup } from './chat_group';

export enum ChatType {
  DIRECT = 'direct',
  GROUP = 'group',
}
export type ChatDocument = Chat & Document;

@Schema({ timestamps: true, collection: 'chats' })
export class Chat {
  @Prop({ required: true })
  type: ChatType;

  @Prop({
    required: true,
    type: [{ type: Types.ObjectId, ref: 'User' }],
    default: [],
  })
  users: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: ChatGroup, required: false })
  group: ChatGroup;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
