import { Prop } from "@nestjs/mongoose";

export class ChatGroup {
    @Prop({ required: true })
    name: string;
    
    image: string;
    description: string;
}
