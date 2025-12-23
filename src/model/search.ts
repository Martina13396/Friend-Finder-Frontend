import {Post} from './post';
import {Account} from "./account";

export interface Search {

  posts: Post[];
  comments: Comment[];
  accounts: Account[];
}
