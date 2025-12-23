import {Account} from './account';

export class FriendRequest {
  id: number;
  sender: Account;
  receiver: Account;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
   createdAt?: string;

   accountEmail = '';
   timeAgo?: string;
}
