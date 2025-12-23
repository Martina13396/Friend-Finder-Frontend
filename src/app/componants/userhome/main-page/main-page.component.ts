import { Component, OnInit } from '@angular/core';
import {PostsService} from '../../../../services/posts.service';
import {Post} from '../../../../model/post';
import {CommentsService} from '../../../../services/comments.service';
import {ReactsService} from '../../../../services/reacts.service';
import {Comments} from '../../../../model/comments';
import {AuthService} from '../../../../services/auth.service';
import {SearchService} from "../../../../services/search.service";

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
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  constructor(private postService: PostsService, private commentsService: CommentsService
    ,         private reactsService: ReactsService , private authService:AuthService,private searchService: SearchService) {
  }

  posts: Post[] = [];
  accountId: number;
  Comments: Comments[] = [];
  newCommentText = '';
  messageAr = '';
  messageEn = '';

  currentUserProfilePicture = '';
  comments:Comment[] = [];



  ngOnInit(): void {
 this.accountId = this.authService.getAccountId();
 this.currentUserProfilePicture = this.authService.getCurrentAccountProfilePic();
 this.searchService.currentResults.subscribe(result => {
   if(result){
     this.posts = result.posts;
     this.comments = result.comments;
     this.posts.forEach(post => {
      post.timeAgo = this.calculateTimeAgo(post.createdAt);
      this.loadInitialReactCount(post);
    })
   }else{
     this.comments = [];
     this.posts = [];
     this.loadPosts();

   }
 });


 this.postService.newPostSubject.subscribe(
      newPost => {
        if (newPost) {
          newPost.timeAgo = this.calculateTimeAgo(newPost.createdAt);
          newPost.comments = [];
          newPost.reactCounts = {
            LIKE: 0, LOVE: 0, HAHA: 0, WOW: 0, SAD: 0, ANGRY: 0
          };

          this.posts.unshift(newPost);

        }
      }, error => {
        this.messageAr = error.error.bundleMessages.ar;
        this.messageEn = error.error.bundleMessages.en;
      }
    );

  }
 loadPosts(){
   this.postService.getPostsForUserAndFriends().subscribe(
     res => {
       this.posts = res;
       this.posts.forEach(post => {
         post.timeAgo = this.calculateTimeAgo(post.createdAt);
         post.comments = undefined;
         post.reactCounts = {
           LIKE: 0, LOVE: 0, HAHA: 0, WOW: 0, SAD: 0, ANGRY: 0
         };
         if (post.id){
           this.loadInitialReactCount(post);
         }

       });

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
        this.Comments.filter(c => c.id !== commentId);
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
    this.postService.deletePost(postId , 'timeline').subscribe(
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
