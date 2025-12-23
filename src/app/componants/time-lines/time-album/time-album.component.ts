import { Component, OnInit } from '@angular/core';
import {PostsService} from "../../../../services/posts.service";
import {AuthService} from "../../../../services/auth.service";
import {Post} from "../../../../model/post";
import {AccountService} from "../../../../services/account.service";
import {ActivatedRoute} from "@angular/router";
import {Account} from "../../../../model/account";
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
  selector: 'app-time-album',
  templateUrl: './time-album.component.html',
  styleUrls: ['./time-album.component.css']
})
export class TimeAlbumComponent implements OnInit {
  accountId: number;
  post: Post;
  userData: Account;

  constructor(private postService: PostsService, private authService: AuthService
    ,         private accountService: AccountService , private route: ActivatedRoute) {
  }

  mediaList: any = [];

  ngOnInit(): void {
    const loggedInUserId = this.authService.getAccountId();
    const loggedEmail = this.authService.getEmail();
    this.route.paramMap.subscribe(params => {
      const emailFromUrl = params.get('email');
      if (!emailFromUrl || emailFromUrl === loggedEmail) {
        this.accountService.getAccountByEmail(loggedEmail).subscribe(account => {
          this.accountId = loggedInUserId;
          this.userData = account;
          this.getMedia();
        });
      }else {
        this.accountService.getAccountByEmail(emailFromUrl).subscribe(account => {
          this.accountId = account.id;
          this.userData = account;
          this.getFriendMedia(this.accountId);
        });
      }
    });

  }

  getMedia() {
    this.postService.getMedia().subscribe(
      res => this.mediaList = res,
    );
  }
  getFriendMedia(accountId: number) {
    this.postService.getFriendAlbum(accountId).subscribe(
      res => this.mediaList = res,
    );
  }

  resolveAlbumUrl(url: string | null | undefined, type: 'post' | 'user' | 'cover', accountId: number | null): string {
    const defaultPlaceholder = 'assets/images/default-avatar.png';


    if (!url || url.trim() === '' || url === 'null') {
      if (type === 'user' && accountId) {
        const fileNumber = OLD_USER_IMAGE_MAP[accountId];
        return fileNumber ? `assets/images/users/user-${fileNumber}.jpg` : defaultPlaceholder;
      }
      return defaultPlaceholder;
    }


    if (url.includes('post-images/') || url.includes('users/') || url.includes('covers/')) {
      return 'assets/images/' + url;
    }


    if (type === 'user') { return `assets/images/users/${url}`; }
    if (type === 'cover') { return `assets/images/covers/${url}`; }



    return `${BACKEND_BASE_URL}/uploads/${url}`;
  }
}
