import { Component, OnInit } from '@angular/core';
import {PostsService} from "../../../../services/posts.service";
import {AuthService} from '../../../../services/auth.service';
import {AccountService} from '../../../../services/account.service';
import {Account} from '../../../../model/account';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-cool-images',
  templateUrl: './cool-images.component.html',
  styleUrls: ['./cool-images.component.css']
})
export class CoolImagesComponent implements OnInit {
  allImages: string[] = [];
  allVideos: string[] = [];
  mediaList: string[] = [];
 userData:Account;
  mediaType: string;
  constructor(private postService:PostsService , private authService: AuthService, private accountService:AccountService
    ,         private route:ActivatedRoute) { }

  ngOnInit(): void {
   this.mediaList = [];
   this.route.params.subscribe(params => {

      this.mediaType = params['type'].toUpperCase();
      this.loadMedia();
    });

  }

  loadMedia(){
    this.mediaList = [];
    this.accountService.getAccountByEmail(this.authService.getEmail()).subscribe(
      (account: Account) => {
        this.userData = account;
        if(this.mediaType=== 'IMAGE') {
          this.mediaList.push('assets/images/' + account.profilePictureUrl);
          this.mediaList.push('assets/images/' + account.backGroundPictureUrl);
        }
        this.postService.getMedia().subscribe(
       result => {
         result.forEach(media => {
           const mediaUrl = media.url;
           if (!mediaUrl) { return; }
           if (this.mediaType=== 'IMAGE' &&this.isImage(mediaUrl)) {
             const fullPath =(mediaUrl.includes('covers/') || mediaUrl.includes('users/') || mediaUrl.includes('post-images/')) ? 'assets/images/' + mediaUrl : 'http://localhost:9090/uploads/' + mediaUrl;
             if (!this.mediaList.includes(fullPath)) {
               this.mediaList.push(fullPath);
             }

           } else if (this.mediaType=== 'VIDEO'&&this.isVideo(mediaUrl)) {
             const fullPath = 'http://localhost:9090/uploads/' + mediaUrl;

             if (!this.mediaList.includes(fullPath)) {
               this.mediaList.push(fullPath);
             }
           }

         });
       }
     );
   }
    );
  }
  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|gif)$/i.test(url);
  }
  isVideo(url: string): boolean {
    return /\.(mp4|webm|ogg)$/i.test(url);
  }
}
