import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { FriendDTO, FriendStatus } from './dto/friends_dto';
import * as bcrypt from 'bcryptjs';
import {UserType} from './schemas/user.schema';

export interface CreateUserDto {
  name:string
  email: string;
  auth0Id?: string;
  userType: UserType;
}

export interface UpdateUserDto {
  name?:string;
  email?: string;
  googleUserId?: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    
    const createdUser = new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email,
      auth0Id: createUserDto.auth0Id,
      userType: createUserDto.userType,
    });
    
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('friends', 'name').exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).populate('friends', 'name').exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByGoogleCredentialId(googleCredentialId: string): Promise<User | null> {
    return this.userModel.findOne({ googleCredentialId }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
 
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .populate('friends', 'name')
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async addFriend(userId: string, friendId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const friendObjectId = new Types.ObjectId(friendId);
    
    // Check if friend is already added
    if (user.friends.includes(friendObjectId)) {
      throw new Error('Friend already added');
    }

    user.friends.push(friendObjectId);
    return user.save();
  }

  async removeFriend(userId: string, friendId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const friendObjectId = new Types.ObjectId(friendId);
    user.friends = user.friends.filter(
      (friend) => !friend.equals(friendObjectId)
    );
    
    return user.save();
  }

  async getFriends(userId: string): Promise<FriendDTO[]> {

    var user =  await this.userModel.findById(userId).populate('friends', 'name');

    console.log(user)
    // const googleUser = await this.userModel.findOne({googleUserId:userId})
    if (!user) {
        if(!user){
            throw new Error('User not found');
        }
    }

    const k = user.friends as unknown as Array<{ _id: Types.ObjectId; name: string;googleUserId:string}>;

    const friends: FriendDTO[] = k.map((friend) => ({
        id: friend.googleUserId || friend._id.toString(),
        googleUserId: friend.googleUserId,
        name: friend.name,
        status: FriendStatus.OFFLINE,

    }));

    return friends;
  }


}
