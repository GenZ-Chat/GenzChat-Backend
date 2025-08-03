import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop({ required: true })
  name: string;


  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  friends: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add index for email for faster queries
UserSchema.index({ email: 1 });

// Transform the output to remove password field by default
UserSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete (ret as any).password;
    return ret;
  }
});
