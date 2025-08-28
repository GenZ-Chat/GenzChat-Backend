import { Prop, Schema } from "@nestjs/mongoose";

@Schema({ timestamps: true, collection: 'media' })
export class Media {

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    size: number;

}