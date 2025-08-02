import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

export interface CreateUserDto {
    name:string
  email: string;
  password: string;
}

export interface UpdateUserDto {
    name?:string;
  email?: string;
  password?: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash password before saving
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
    
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (updateUserDto.password) {
      const saltRounds = 12;
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }
    
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

  async getFriends(userId: string): Promise<User[]> {
    const user = await this.userModel
      .findById(userId)
      .populate('friends', 'name')
      .exec();
    
    if (!user) {
      throw new Error('User not found');
    }

    return user.friends as unknown as User[];
  }

  async validatePassword(email: string, password: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    if (!user) {
      return false;
    }
    
    return bcrypt.compare(password, user.password);
  }
}
