import { Component, OnInit } from '@angular/core';
import {PostsService} from '../../../../services/posts.service';
import {AuthService} from '../../../../services/auth.service';
import {Post} from '../../../../model/post';
import {Comments} from '../../../../model/comments';
import {CommentsService} from '../../../../services/comments.service';
import {ReactsService} from '../../../../services/reacts.service';
import {ActivatedRoute} from '@angular/router';
import {AccountService} from '../../../../services/account.service';
import {Account} from '../../../../model/account';

const BACKEND_BASE_URL = 'http://localhost:9090';

const OLD_USER_IMAGE_MAP: { [accountId: number]: number } = {
  1: 1,
  21: 3,
  30: 11,
  31: 12,
  32: 13,
  33: 14,
  34: 15,
  22: 4,
  23: 10,
  24: 7,
  25: 8,
  26: 2,
  27: 9,
  28: 6,
  29: 5,


};

@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.component.html',
  styleUrls: ['./time-line.component.css']
})
export class TimeLineComponent implements OnInit {
  posts: Post[] = [];
  accountId: number;
  comments: Comments[] = [];
  newCommentText = '';
  messageAr = '';
  messageEn = '';
  currentUserProfilePicture = '';
  accountData: Account;
  loggedInUserId: number;

  constructor(private postsService: PostsService , private authService: AuthService , private commentsService:CommentsService,
              private reactsService: ReactsService, private route: ActivatedRoute
       ,      private accountService: AccountService) { }

  ngOnInit(): void {
    this.loggedInUserId = this.authService.getAccountId();
    this.currentUserProfilePicture = this.authService.getCurrentAccountProfilePic();
    this.route.paramMap.subscribe(params => {
      const emailFromUrl = params.get('email');


      if (emailFromUrl ) {

        this.accountService.getAccountByEmail(emailFromUrl).subscribe(acc => {
          this.accountData = acc;
          this.accountId = acc.id;
          this.loadFriendPosts(this.accountId);

        });
      }else {
        this.accountId = this.loggedInUserId;
        this.accountService.getAccountByEmail(this.authService.getEmail()).subscribe(acc => {
        this.accountData = acc;
        this.loadPosts();
      });



      }
    });

  }
  loadPosts(){
    this.postsService.getPostsByAccountId().subscribe(
      res => {
        this.posts = res;
        this.posts.forEach(post => {
          post.timeAgo = this.calculateTimeAgo(post.createdAt);
          post.comments = undefined;
          post.reactCounts = {
            LIKE: 0, LOVE: 0, HAHA: 0, WOW: 0, SAD: 0, ANGRY: 0
          };
          if(post.id){
            this.loadInitialReactCount(post);
          }

        });

      }
    );

  }
 loadFriendPosts(accountId:number): void {
    this.postsService.getFriendPosts(accountId).subscribe(
      res => {
        this.posts = res;
        this.posts.forEach( post => {
          post.timeAgo = this.calculateTimeAgo(post.createdAt);
          post.comments = undefined;
          post.reactCounts = { LIKE: 0, LOVE: 0, HAHA: 0, WOW: 0, SAD: 0, ANGRY: 0 };
          if(post.id) {
            this.loadInitialReactCount(post);
          }
        });

      },error => {
        this.messageAr = error.error.bundleMessage.ar;
        this.messageEn = error.error.bundleMessage.en;
      }
    );
 }
  loadInitialReactCount(post: Post) {
    this.reactsService.countReacts(post.id).subscribe(
      (countsMap:any) =>{
        if (countsMap){
          post.reactCounts = {...post.reactCounts , ...countsMap};
        }
      }
    );
  }
  resolveImageUrl(url: string | null | undefined, type: 'post' | 'user' | 'cover', accountId: number | null): string {

    const defaultPlaceholder = 'assets/images/default-avatar.png';


    if (!url || url.trim() === '') {
      if (type === 'user' && accountId) {

        const fileNumber = OLD_USER_IMAGE_MAP[accountId];
        if (fileNumber) {
          return `assets/images/users/user-${fileNumber}.jpg`;
        }
      }
      return defaultPlaceholder;
    }
    const isFullUrl = url.startsWith('http') || url.startsWith('/');

    if (isFullUrl) {
      return url;
    }
    if(type === 'post'){

      if (url.startsWith('post-images/')) {
        return 'assets/images/' + url;
      }
      return `${BACKEND_BASE_URL}/uploads/${url}`;
    }



    if (type === 'user') {
      return  'assets/images/' + url;

    }
    return 'assets/images/' + url;
  }

  loadComments(post: Post) {
    this.commentsService.getComments(post.id).subscribe(
      res => {

        post.comments = res;


      }, error => {
        this.messageAr = error.error.bundleMessages.ar;
        this.messageEn = error.error.bundleMessages.en || 'no comments on this post yet';
      }
    );
  }

  addComment(post: Post) {
    const comments = {
      postId: post.id,
      text: this.newCommentText
    };
    this.commentsService.addComment(comments).subscribe(
      res => {
        post.comments.push(res);
        this.newCommentText = '';
      }, error => {
        this.messageAr = error.error.bundleMessages.ar;
        this.messageEn = error.error.bundleMessages.en;
      }
    );

  }

  deleteComment(commentId: number, post: Post) {
    this.commentsService.deleteComment(commentId).subscribe(
      () => {
        if (post.comments) {
          post.comments = post.comments.filter(c => c.id !== commentId);
        }
        this.comments.filter(c => c.id !== commentId);
      }, error => {
        this.messageAr = error.error.bundleMessages.ar;
        this.messageEn = error.error.bundleMessages.en;
      }
    );
  }

  toggleReact(reactType: string, postId: number) {
    this.reactsService.toggleReacts(reactType, postId).subscribe(
      res => {

        const post = this.posts.find(p => p.id === postId);
        if (post) {
          this.loadInitialReactCount(post);
        }
      }, error => {
        this.messageAr = error.error.bundleMessages.ar;
        this.messageEn = error.error.bundleMessages.en;
      }
    );
  }

  loadReactsCount(postId: number ) {
    this.reactsService.countReacts(postId ).subscribe(
      res => {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.reactCounts = res;
        }
      }
    );
  }

  deletePost(postId: number , viewType:string) {
    this.postsService.deletePost(postId , 'timeline').subscribe(
      res => {
        this.posts = this.posts.filter(post => post.id !== postId);
      }
    );
  }

  calculateTimeAgo(createdDate: string): string {
    const now = new Date();
    const created = new Date(createdDate);


    if (isNaN(created.getTime())) {
      return 'Unknown time';
    }

    const diffMs = now.getTime() - created.getTime();
    const diffSecs = Math.floor(diffMs / 1000);

    if (diffSecs < 60) {
      return diffSecs <= 0 ? `Just now` : `${diffSecs} sec ago`;
    }

    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    }

    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) {
      return `${diffHrs} hr ago`;
    }

    const diffDays = Math.floor(diffHrs / 24);
    if (diffDays < 30) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }


    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    }

    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
  }


}
