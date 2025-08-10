import { Inject } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer,SubscribeMessage,MessageBody,ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket,Server } from 'socket.io';
import { UserStatusService } from 'src/users/service/users.service.user_status_service';


@WebSocketGateway({
  cors:{origin: 'http://localhost:3000', methods: ['GET', 'POST'], credentials: true},
  namespace:'chat', transports: ['websocket','polling'],})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  constructor(
    @Inject() private userStatusService: UserStatusService
  ) {}

  @WebSocketServer()
  server: Server;
//   Gateway logic will go here

async handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
   this.userStatusService.setUserStatus(client.handshake.query.userId, client.id);
   this.userStatusService.printUserStatusKeys();
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

}