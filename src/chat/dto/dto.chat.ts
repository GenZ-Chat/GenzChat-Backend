import { ChatType } from '../schema/chat.schema';
import { ChatGroup } from '../schema/chat_group';
import { ChatUserInfo } from './dto.chat_user_info';
import { Expose, Type, Transform } from 'class-transformer';

export class ChatDto {
  @Expose({ name: '_id' })
  @Transform(({ value, obj }) => {
    return value.toString();
  })
  id: string;

  @Expose()
  type: ChatType;

  @Expose({ name: 'users' })
  @Type(() => ChatUserInfo)
  @Transform(({ value, obj }) => {
    console.log('Transforming users for chat type:', obj.type, 'users:', value);
    if (obj.type === ChatType.DIRECT) {
      return value[0];
    }
    return value;
  })
  users: ChatUserInfo[];

  @Expose()
  group?: ChatGroup;
}
