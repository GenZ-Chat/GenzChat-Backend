import { WebSocketGateway, WebSocketServer,SubscribeMessage,MessageBody,ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'net';
@WebSocketGateway(8020,{ namespace: 'chat' , cors: true , transports: ['websocket','polling'] })
export class ChatGateway {
  // Gateway logic will go here

@SubscribeMessage('events')
handleEvent(@MessageBody() data: string,@ConnectedSocket() client: Socket,): string {
    console.log(data)
    client.emit('events', data);
  
  return data;
}

}