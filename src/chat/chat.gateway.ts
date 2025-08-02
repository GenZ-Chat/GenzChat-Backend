import { WebSocketGateway, WebSocketServer,SubscribeMessage,MessageBody,ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket,Server } from 'net';
@WebSocketGateway(8020,{namespace:'chat', cors: true , transports: ['websocket','polling'] })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
//   Gateway logic will go here
  private connectedUsers: String[] = [];

handleConnection(client: any, ...args: any[]) {
    console.log('Client connected:', client.id);
    this.connectedUsers.push(client.id);
    client.emit('users', this.connectedUsers);
}

handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
    //change logic later
    this.connectedUsers = this.connectedUsers.filter(user => user !== client.id);
    client.emit('users', this.connectedUsers);
}
//   Call this method to disconnect all users

@SubscribeMessage('events')
handleEvent(@MessageBody() data: string,@ConnectedSocket() client: Socket,): string {
    console.log(data)
    client.emit('events', data);
  
  return data;
}

}