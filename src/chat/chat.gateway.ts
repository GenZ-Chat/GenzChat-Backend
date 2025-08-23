import { Inject } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer,SubscribeMessage,MessageBody,ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket,Server } from 'socket.io';
import { UserStatusService } from 'src/users/service/users.service.user_status_service';
import { ChatService } from './service/chat.service';
import { group } from 'console';


@WebSocketGateway({
  cors:{origin: 'http://localhost:3000', methods: ['GET', 'POST'], credentials: true},
  namespace:'chat', transports: ['websocket','polling'],})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {


  constructor(
    @Inject() private userStatusService: UserStatusService,
    @Inject() private chatService: ChatService
  ) {}

  @WebSocketServer()
  server: Server;
//   Gateway logic will go here

async handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
    const socketId = await this.userStatusService.getSocketId(client.handshake.query.userId);
    this.userStatusService.setUserStatus(client.handshake.query.userId, client.id);
    this.userStatusService.printUserStatusKeys();
    //fetch groups for this user
    if(client.handshake.query.userId) {
      const groupChats = await this.chatService.getGroupChatInfoByUserId(client.handshake.query.userId! as string);
      groupChats.forEach(group=>{
        client.join("group:" + group._id.toString());
      })
    }
}

handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    const userId = client.handshake.query.userId;
    this.userStatusService.deleteUserStatus(client.handshake.query.userId);
}
//   Call this method to disconnect all users

@SubscribeMessage('events') 
async handleEvent(@MessageBody() data: Map<string, any>,@ConnectedSocket() client: Socket,) {
    console.log(data)
    const receiver = data['receiver'];

    console.log(await this.userStatusService.getSocketId(receiver));
    this.server.to(await this.userStatusService.getSocketId(receiver) as string).emit('events', data['message']);
  return data;
}

@SubscribeMessage('sendGroupMessage')
async handleGroupMessage(@MessageBody() data: Map<string, any>,@ConnectedSocket() client: Socket,) {
  console.log('Sending group message:', data);
    this.server.to("group:" + data['groupId']).emit('recieveGroupMessage', data["message"]);
}

@SubscribeMessage('receiveGroupMessage')
async handleReceiveGroupMessage(@MessageBody() data: Map<string, any>, @ConnectedSocket() client: Socket) {
    console.log('Received group message:', data);
}
}