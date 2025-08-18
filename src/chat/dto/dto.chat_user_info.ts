import { Expose, Transform } from "class-transformer";
import { Types } from "mongoose";
import { FriendStatus } from "src/users/dto/friends_dto";

export class ChatUserInfo {
    @Expose({ name: '_id' })
    @Transform(({ value }) => {
        return value?.toString();
    })
    id: string;

    @Expose()
    name: string;

    @Expose()
    email: string;

    @Expose()
    status: FriendStatus

    @Expose()
    avatarUrl?: string;
}

