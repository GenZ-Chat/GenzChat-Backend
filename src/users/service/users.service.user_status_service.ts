import { Cache } from "cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { FriendStatus } from "../dto/friends_dto";


@Injectable()
export class UserStatusService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setUserStatus(userId: string | string[] | undefined, socketId: string) {
    if (Array.isArray(userId) || typeof userId === 'undefined') {
    throw new Error('User ID should not be an array or undefined');
    }
    await this.cacheManager.set(`userStatus:${userId}`, socketId);
    console.log(`User status set for ${userId}: ${socketId}`);
  }

  async getSocketId(userId: string | string[] | undefined) {
    if (Array.isArray(userId) || typeof userId === 'undefined') {
      throw new Error('User ID should not be an array or undefined');
    }
    return await this.cacheManager.get(`userStatus:${userId}`);
  }

   async getUserStatus(userId: string | string[] | undefined){
    const user =  await this.cacheManager.get(`userStatus:${userId}`);
    if(user){
        return FriendStatus.ONLINE;
    }
    return FriendStatus.OFFLINE;
  }

  
  async deleteUserStatus(userId: string|string[]|undefined) {
    if (Array.isArray(userId) || typeof userId === 'undefined') {
    throw new Error('User ID should not be an array or undefined');
    }
    await this.cacheManager.del(userId);
  }

}
