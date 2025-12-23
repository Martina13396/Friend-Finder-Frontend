import {Post} from './post';

export class Reacts {
   id?: number;
  status: 'LIKE' | 'LOVE' | 'HAHA' | 'WOW' | 'SAD' | 'ANGRY';

   accountId?: number;
   postId?: number;
}
