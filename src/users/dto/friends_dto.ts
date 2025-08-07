export enum FriendStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
}

export interface FriendDTO {
  id: string;
  name: string;
  googleUserId?: string;
  status: FriendStatus;
}
