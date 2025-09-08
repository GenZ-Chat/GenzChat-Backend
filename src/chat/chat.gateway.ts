import { Inject } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { UserStatusService } from 'src/users/service/users.service.user_status_service';
import { ChatService } from './service/chat.service';
import { group } from 'console';
import { ChatMessageService } from './service/message/chat.message.service';
import { CreateMessageDto } from './dto/dto.create_message_dto';
import { GroupCreateMessageDto } from './dto/dto.group_create_message';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: 'chat',
  transports: ['websocket', 'polling'],
  port: 3000,
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject() private userStatusService: UserStatusService,
    @Inject() private chatService: ChatService,
    @Inject() private messageService: ChatMessageService,
  ) {}

  @WebSocketServer()
  server: Server;
  //   Gateway logic will go here

  async handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
    const socketId = await this.userStatusService.getSocketId(
      client.handshake.query.userId,
    );
    this.userStatusService.setUserStatus(
      client.handshake.query.userId,
      client.id,
    );
    this.userStatusService.printUserStatusKeys();
    //fetch groups for this user
    if (client.handshake.query.userId) {
      const groupChats = await this.chatService.getGroupChatInfoByUserId(
        client.handshake.query.userId as string,
      );
      groupChats.forEach((group) => {
        client.join('group:' + group._id.toString());
        console.log('joined group: ' + 'group:' + group._id.toString());
      });
    }
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    const userId = client.handshake.query.userId;
    this.userStatusService.deleteUserStatus(client.handshake.query.userId);
  }
  //   Call this method to disconnect all users

  @SubscribeMessage('events')
  async handleEvent(
    @MessageBody() data: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    // data is expected to be CreateMessageDto
    console.log('Received message DTO:', data);
    const receiver = data.receiverId;
    const savedMessage = await this.messageService.createMessage(data);
    // Optionally, map savedMessage to MessageDto if needed
    const messageDto = {
      sender: savedMessage.sender.toString(),
      receiver: savedMessage.receiver.toString(),
      chat: savedMessage.chat.toString(),
      content: savedMessage.content,
      attachments: savedMessage.attachments?.map((a: any) => a.toString()),
      createdAt: savedMessage['createdAt'],
      updatedAt: savedMessage.updatedAt,
    };
    const receiverSocketId = await this.userStatusService.getSocketId(receiver);
    console.log('Emitting to socket:', receiverSocketId);
    this.server.to(receiverSocketId as string).emit('events', messageDto);
    return messageDto;
  }

  @SubscribeMessage('sendGroupMessage')
  async handleGroupMessage(
    @MessageBody() data: GroupCreateMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Sending group message:', data);
    const message = {
      chatId: data.chatId,
      sender: data.senderId,
      content: data.content,
      attachments: data.attachments,
    };
    this.server.to('group:' + data.chatId).emit('recieveGroupMessage', message);
  }

  @SubscribeMessage('recieveGroupMessage')
  async handleReceiveGroupMessage(
    @MessageBody() data: Map<string, any>,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('Received group message:', data);
  }
}
