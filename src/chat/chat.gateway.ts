import { WebSocketGateway, WebSocketServer,SubscribeMessage,MessageBody,ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket,Server } from 'socket.io';
@WebSocketGateway({
  cors:{origin: 'http://localhost:3000', methods: ['GET', 'POST'], credentials: true},
  namespace:'chat', transports: ['websocket','polling'],})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  users = new Map<string, string>();
  @WebSocketServer()
  server: Server;
//   Gateway logic will go here
  private connectedUsers: String[] = [];

handleConnection(client: Socket, ...args: any[]) {
    console.log('Client connected:', client.id);
    this.connectedUsers.push(client.id);
    client.emit('users', this.connectedUsers);
    this.users.set(client.handshake.query.userId as string, client.id);
    console.log('Connected users:', this.users);
}

handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.connectedUsers = this.connectedUsers.filter(user => user !== client.id);
    client.emit('users', this.connectedUsers);
    this.users.delete(client.handshake.query.userId as string);
}
//   Call this method to disconnect all users

@SubscribeMessage('events')
handleEvent(@MessageBody() data: Map<string, any>,@ConnectedSocket() client: Socket,) {
    console.log(data)
    const receiver = data['receiver'];
    console.log(this.users.get(receiver))
    this.server.to(this.users.get(receiver) as string).emit('events', data['message']);
  return data;
}

}