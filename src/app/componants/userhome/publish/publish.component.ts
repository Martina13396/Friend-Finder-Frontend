import { Component, OnInit } from '@angular/core';
import {PostsService} from '../../../../services/posts.service';
import {Post} from '../../../../model/post';
import {Account} from "../../../../model/account";
import {AuthService} from "../../../../services/auth.service";
import {AccountService} from "../../../../services/account.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {

  newPost: Post = new Post();
  selectedFile: File = null;
  previewUrl: string | ArrayBuffer | null = null;
  messageAr = '';
  messageEn = '';

  currentAccount: Account ;
  constructor(private postService: PostsService , private authService: AuthService , private accountService: AccountService) {
  }

  ngOnInit(): void {
    const email = this.authService.getEmail();
    if (email) {
      this.accountService.getAccountByEmail(email).subscribe({
        next: (res) => {
          this.currentAccount = res;
        },
      } );
  }
}
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile && this.selectedFile.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = () => this.previewUrl = reader.result;
      reader.readAsDataURL(this.selectedFile);
    }else{
      this.previewUrl = null;
    }
  }

  publishPost(): void {
    if ((!this.newPost.content || this.newPost.content.trim() === '' ) && !this.selectedFile) {
      this.messageAr = 'ن فضلك أدخل نصًا أو أرفق صورة/فيديو.';
      this.messageEn = 'Please enter content or attach a photo/video.';
      setTimeout(() => {
        this.messageAr = '';
        this.messageEn = '';
      } , 3000);
      return;
    }
    const formData = new FormData();
    formData.append('content', this.newPost.content);
    if (this.selectedFile) {
     formData.append('file', this.selectedFile);
    }
    this.postService.createPost(formData).subscribe(
      res => {
        this.messageAr = 'تم اضافة المنشور بنجاح';
        this.messageEn = 'post was created successfully.';
        setTimeout(() => {
          this.messageAr = '';
          this.messageEn = '';
        }, 3000);

        this.newPost = new Post();
        this.selectedFile = null;
        this.previewUrl = null;
        this.postService.newPostSubject.next(res);
      }
  ,
    error => {
      this.messageAr = error.error.bundleMessage.ar;
      this.messageEn = error.error.bundleMessage.en;
      setTimeout(() => {
        this.messageAr = '';
        this.messageEn = '';
      }, 3000);
    }
  );
  }
}
