import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, collection: 'messages' })
export class Message {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  sender: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  receiver: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Chat' })
  chat: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [Types.ObjectId], ref: 'Media', default: [] })
  attachments: Types.Array<Types.ObjectId>;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

class TimeStamps {
  @Prop({ default: Date.now })
  sentAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}
