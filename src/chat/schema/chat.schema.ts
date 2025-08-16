import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ChatGroup } from "./chat_group";

enum ChatType{
    DIRECT = 'direct',
    GROUP = 'group'
}

@Schema({ timestamps: true, collection: 'chats' })
export class Chat {
    @Prop({ required: true })
    type: ChatType;

    @Prop({ required: true, type: Types.ObjectId, ref: 'User' ,default:{}})
    users: Types.Map<Types.ObjectId>;

    createdAt: Date;
    updatedAt: Date;

    @Prop({ type: ChatGroup ,required:false})
    group: ChatGroup;
}

