import { WebSocketGateway, WebSocketServer,SubscribeMessage,MessageBody } from '@nestjs/websockets';

@WebSocketGateway(8020,{ namespace: 'chat' , cors: true , transports: ['websocket'] })
export class ChatGateway {
  // Gateway logic will go here

@SubscribeMessage('events')
handleEvent(@MessageBody() data: string): string {
    console.log(data)
  return data;
}

}