import {Reacts} from "./reacts";
import {Comments} from "./comments";

export class Post {
  id: number;
  content = '';
  mediaUrl = '';
  mediaType = '';
  accountProfilePicture = '';
  accountName = '';
 createdAt?: string;
  timeAgo?: string;
  deleted= false;
  comments?: Comments[];
  reacts?: Reacts;
  accountEmail?: string;

  reactCounts: { [key: string]: number } = {
    LIKE: 0,
    LOVE: 0,
    HAHA: 0,
    WOW: 0,
    SAD: 0,
    ANGRY: 0
  };
  accountId?: number;

}
