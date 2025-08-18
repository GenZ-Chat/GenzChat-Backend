import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Chat, ChatType } from "../schema/chat.schema";
import { Model, Types } from "mongoose";
import { plainToInstance } from "class-transformer";
import { ChatDto } from "../dto/dto.chat";
import { UserStatusService } from "src/users/service/users.service.user_status_service";

@Injectable()
export class ChatService{

    constructor(
        @Inject(UserStatusService) private userStatusService: UserStatusService,
        @InjectModel(Chat.name) private chatModel: Model<Chat>
    ) {}

    async createChat(chatData: Partial<Chat>) {
        const newChat = new this.chatModel(chatData);
        return await newChat.save();
    }

    async getChats(userId: string) {
        var chats =  await this.chatModel.find({ users: userId }).populate('users').exec();
        const filteredChats = chats.map(chat => {
            
            chat.users = chat.users.filter((user: any) => user.id.toString() !== userId);
            return chat;
        });

        const enrichedChats = await Promise.all(filteredChats.map(async chat=>{
            var chatObject = chat.toObject()
            const userWithStatus = await Promise.all(chatObject.users.map(async (user: any)=>{
                const userStatus = await this.userStatusService.getUserStatus(user._id.toString())
                return {
                    _id: user._id.toString(), // Ensure _id is preserved for DTO mapping
                    name: user.name,
                    email: user.email,
                    avatarUrl: user.avatarUrl,
                    status: userStatus
                }

            })
        )
            
            return {
                ...chatObject,
                _id: chatObject._id.toString(),
                users:userWithStatus
            }
        }))

        console.log(enrichedChats)

        const chatDTO = plainToInstance(ChatDto, enrichedChats, { excludeExtraneousValues: true });
        return chatDTO;
    }
}
